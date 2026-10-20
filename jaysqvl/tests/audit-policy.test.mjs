import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { evaluateAudit } from '../scripts/audit-dependencies.mjs';

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const acceptance = readJson('../security/dependency-risk-acceptance.json');
const lockfile = readJson('../package-lock.json');
const lintConfigSha256 = createHash('sha256')
  .update(readFileSync(new URL('../eslint.config.mjs', import.meta.url))).digest('hex');

// The report's propagation contract is independent of the acceptance file.
const names = ['eslint-config-next', '@next/eslint-plugin-next', 'fast-glob', 'micromatch', 'braces'];
function fixture() {
  return {
    options: { acceptance: structuredClone(acceptance), lockfile: structuredClone(lockfile),
      lintConfigSha256, now: new Date('2026-10-21T00:00:00Z') },
    status: 1,
    report: {
      auditReportVersion: 2,
      vulnerabilities: Object.fromEntries(names.map((name, index) => [name, {
        name, severity: 'high', isDirect: index === 0,
        nodes: [`node_modules/${name}`], effects: index === 0 ? [] : [names[index - 1]],
        via: index < 4 ? [names[index + 1]] : [{ name: 'braces', dependency: 'braces',
          url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm',
          severity: 'high', range: '<=3.0.3' }],
      }])),
      metadata: { vulnerabilities: { info: 0, low: 0, moderate: 0, high: 5, critical: 0, total: 5 } },
    },
  };
}
const evaluate = (input) => evaluateAudit({
  status: input.status, stdout: input.output ?? JSON.stringify(input.report),
  error: input.error, signal: input.signal,
}, input.options);

test('the exact reviewed development chain is accepted and explicitly identified', () => {
  const input = fixture();
  assert.deepEqual(evaluate(input), { accepted: true, advisory: 'GHSA-vfj7-8cjw-p6xm',
    expiresAt: '2026-11-19T12:49:28Z', packageCount: 5 });
  assert.equal(input.report.vulnerabilities.braces.via[0].url,
    'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm');
});

test('a genuinely clean report passes without using an expired exception', () => {
  const input = fixture();
  input.status = 0;
  input.report.vulnerabilities = {};
  input.report.metadata.vulnerabilities.high = 0;
  input.report.metadata.vulnerabilities.total = 0;
  input.options.now = new Date('2027-01-01T00:00:00Z');
  assert.deepEqual(evaluate(input), { accepted: false });
});

test('acceptance is valid until, but not at, its expiry', () => {
  const input = fixture();
  input.options.now = new Date(Date.parse(acceptance.expiresAt) - 1);
  assert.equal(evaluate(input).accepted, true);
  input.options.now = new Date(acceptance.expiresAt);
  assert.throws(() => evaluate(input), /not active/);
});

const invalidCases = [
  ['a different advisory on braces', (f) => { f.report.vulnerabilities.braces.via[0].url = 'https://github.com/advisories/GHSA-other'; }],
  ['an additional advisory on braces', (f) => { f.report.vulnerabilities.braces.via.push({ url: 'https://github.com/advisories/GHSA-other' }); }],
  ['an unrelated vulnerable package', (f) => {
    f.report.vulnerabilities.next = { ...f.report.vulnerabilities.braces, name: 'next' };
    f.report.metadata.vulnerabilities.high++;
    f.report.metadata.vulnerabilities.total++;
  }],
  ['an advisory mixed into a propagated parent', (f) => { f.report.vulnerabilities['fast-glob'].via.push({ url: 'https://github.com/advisories/GHSA-other' }); }],
  ['a changed propagation edge', (f) => { f.report.vulnerabilities.micromatch.via = ['fast-glob']; }],
  ['a changed affected consumer', (f) => { f.report.vulnerabilities.braces.effects.push('next'); }],
  ['a production copy of the accepted dependency', (f) => { delete f.options.lockfile.packages['node_modules/braces'].dev; }],
  ['a changed version', (f) => { f.options.lockfile.packages['node_modules/braces'].version = '3.0.2'; }],
  ['a changed registry', (f) => { f.options.lockfile.packages['node_modules/braces'].resolved = 'https://example.invalid/braces.tgz'; }],
  ['a changed package integrity', (f) => { f.options.lockfile.packages['node_modules/braces'].integrity = 'sha512-other'; }],
  ['a second nested package copy', (f) => { f.options.lockfile.packages['node_modules/next/node_modules/braces'] = f.options.lockfile.packages['node_modules/braces']; }],
  ['a changed audited path', (f) => { f.report.vulnerabilities.braces.nodes = ['node_modules/next/node_modules/braces']; }],
  ['a changed lockfile dependency edge', (f) => { f.options.lockfile.packages['node_modules/fast-glob'].dependencies.micromatch = '*'; }],
  ['a changed direct development pin', (f) => { f.options.lockfile.packages[''].devDependencies['eslint-config-next'] = '*'; }],
  ['a changed lint configuration', (f) => { f.options.lintConfigSha256 = 'different'; }],
  ['an increased advisory severity', (f) => { f.report.vulnerabilities.braces.via[0].severity = 'critical'; }],
  ['changed advisory version coverage', (f) => { f.report.vulnerabilities.braces.via[0].range = '<=4.0.0'; }],
  ['expired acceptance', (f) => { f.options.now = new Date('2026-11-20T00:00:00Z'); }],
  ['not-yet-active acceptance', (f) => { f.options.now = new Date('2026-10-19T00:00:00Z'); }],
  ['an invalid clock', (f) => { f.options.now = new Date('invalid'); }],
  ['an unbounded acceptance lifetime', (f) => { f.options.acceptance.expiresAt = '2027-11-19T12:49:28Z'; }],
  ['an npm transport error', (f) => { f.error = new Error('offline'); }],
  ['a killed npm client', (f) => { f.signal = 'SIGTERM'; f.status = null; }],
  ['an unexpected npm exit status', (f) => { f.status = 2; }],
  ['a zero exit status with findings', (f) => { f.status = 0; }],
  ['malformed JSON', (f) => { f.output = '{'; }],
  ['an empty JSON response', (f) => { f.output = '{}'; }],
  ['an npm error response', (f) => { f.report.error = { code: 'ENOAUDIT' }; }],
  ['an unsupported report format', (f) => { f.report.auditReportVersion = 3; }],
  ['missing severity counts', (f) => { delete f.report.metadata.vulnerabilities; }],
  ['incomplete findings', (f) => { delete f.report.vulnerabilities.braces; }],
  ['inconsistent severity counts', (f) => { f.report.metadata.vulnerabilities.high = 0; }],
];
for (const [name, mutate] of invalidCases) {
  test(`audit policy rejects ${name}`, () => {
    const input = fixture();
    mutate(input);
    assert.throws(() => evaluate(input));
  });
}
