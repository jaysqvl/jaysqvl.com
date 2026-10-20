import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const severities = ['info', 'low', 'moderate', 'high', 'critical'];
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

// This is deliberately one reviewed exception, not a package-name allowlist.
// npm's parent entries are accepted only when every edge leads to this GHSA.
export function evaluateAudit(result, { acceptance, lockfile, lintConfigSha256, now = new Date() }) {
  assert(!result.error && !result.signal && [0, 1].includes(result.status),
    'npm audit did not complete successfully');
  const report = JSON.parse(result.stdout);
  assert(object(report) && !report.error && report.auditReportVersion === 2 &&
    object(report.vulnerabilities) && object(report.metadata?.vulnerabilities),
  'Missing or unsupported npm audit report');
  const entries = Object.entries(report.vulnerabilities);
  const counts = report.metadata.vulnerabilities;
  for (const severity of severities) {
    assert(Number.isSafeInteger(counts[severity]) && counts[severity] >= 0 &&
      counts[severity] === entries.filter(([, item]) => item?.severity === severity).length,
    'Audit severity counts do not match findings');
  }
  assert(counts.total === entries.length &&
    severities.reduce((sum, severity) => sum + counts[severity], 0) === counts.total,
  'Audit findings are incomplete');
  assert.equal(result.status, entries.length === 0 ? 0 : 1, 'Audit exit status contradicts report');

  assert(acceptance.schemaVersion === 1 && acceptance.advisory === 'GHSA-vfj7-8cjw-p6xm' &&
    acceptance.acceptedBy === 'jaysqvl', 'Unreviewed risk acceptance');
  const start = Date.parse(acceptance.acceptedAt);
  const end = Date.parse(acceptance.expiresAt);
  assert(Number.isFinite(start) && Number.isFinite(end) && end > start &&
    end - start <= 30 * 24 * 60 * 60 * 1000, 'Acceptance must have a bounded 30-day lifetime');
  // A genuinely clean audit does not need an exception, even after its expiry.
  if (entries.length === 0) return { accepted: false };
  assert(Number.isFinite(now.getTime()) && now.getTime() >= start && now.getTime() < end,
    `Risk acceptance is not active; expires ${acceptance.expiresAt}`);
  assert.equal(lintConfigSha256, acceptance.eslintConfigSha256,
    'ESLint configuration changed; re-review the exposure assumptions');
  assert.equal(lockfile.lockfileVersion, 3, 'Unsupported lockfile');
  const chain = acceptance.chain;
  assert(Array.isArray(chain) && chain.length === 5 &&
    chain[0].name === 'eslint-config-next' && chain[4].name === 'braces',
  'Unreviewed dependency chain');
  assert.deepEqual(entries.map(([name]) => name).sort(), chain.map(({ name }) => name).sort(),
    'Unexpected advisory or dependency outside the accepted chain');
  assert.equal(lockfile.packages[''].devDependencies?.[chain[0].name], chain[0].version,
    'Accepted chain must remain a pinned development dependency');

  for (const [index, expected] of chain.entries()) {
    const path = `node_modules/${expected.name}`;
    const copies = Object.keys(lockfile.packages).filter((key) =>
      key === path || key.endsWith(`/${path}`));
    assert.deepEqual(copies, [path], `Unreviewed copy of ${expected.name}`);
    const locked = lockfile.packages[path];
    assert.equal(locked.dev, true, `${expected.name} is not development-only`);
    for (const field of ['version', 'resolved', 'integrity']) {
      assert.equal(locked[field], expected[field], `${expected.name}: unreviewed ${field}`);
    }
    const finding = report.vulnerabilities[expected.name];
    assert.equal(finding.name, expected.name, 'Audit identity mismatch');
    assert.equal(finding.severity, 'high', 'Advisory severity changed');
    assert.equal(finding.isDirect, index === 0, 'Dependency scope changed');
    assert.deepEqual(finding.nodes, [path], 'Audit path changed');
    assert.deepEqual(finding.effects, index === 0 ? [] : [chain[index - 1].name],
      'Advisory propagation changed');
    if (index < chain.length - 1) {
      const child = chain[index + 1].name;
      assert.deepEqual(finding.via, [child], 'Additional or changed advisory');
      assert.equal(locked.dependencies?.[child], expected.nextRange, 'Lockfile edge changed');
    } else {
      assert(Array.isArray(finding.via) && finding.via.length === 1, 'Additional braces advisory');
      const advisory = finding.via[0];
      assert(object(advisory) && advisory.name === 'braces' && advisory.dependency === 'braces' &&
        advisory.url === `https://github.com/advisories/${acceptance.advisory}` &&
        advisory.severity === 'high' && advisory.range === '<=3.0.3',
      'Unreviewed braces advisory');
    }
  }
  return { accepted: true, advisory: acceptance.advisory, expiresAt: acceptance.expiresAt,
    packageCount: entries.length };
}

function main() {
  assert(process.env.npm_execpath, 'Run through npm run audit:dependencies');
  const result = spawnSync(process.execPath,
    [process.env.npm_execpath, 'audit', '--json', '--audit-level=low'],
    { encoding: 'utf8', timeout: 120_000, maxBuffer: 16 * 1024 * 1024 });
  // Never hide the finding, including when policy evaluation fails.
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  const acceptance = JSON.parse(readFileSync(new URL('../security/dependency-risk-acceptance.json', import.meta.url)));
  const lockfile = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url)));
  const lintConfigSha256 = createHash('sha256')
    .update(readFileSync(new URL('../eslint.config.mjs', import.meta.url))).digest('hex');
  const outcome = evaluateAudit(result, { acceptance, lockfile, lintConfigSha256 });
  console.log(outcome.accepted
    ? `TEMPORARY ACCEPTED RISK (NOT FIXED): ${outcome.advisory}; ${outcome.packageCount} development-only entries; expires ${outcome.expiresAt}`
    : 'No vulnerabilities reported. Risk exception unused; remove it once upstream remediation is confirmed.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`Dependency audit blocked: ${error.message}`);
    process.exitCode = 1;
  }
}
