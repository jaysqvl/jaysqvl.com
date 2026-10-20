import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { ESLint } from 'eslint';

const require = createRequire(import.meta.url);

test('TypeScript 7 CLI coexists with the supported TypeScript 6 tooling API', () => {
  assert.match(require('@typescript/native/package.json').version, /^7\./);
  assert.match(require('typescript').version, /^6\./);
  assert.equal(require('typescript'), require('@typescript/old'));
});

test('ESLint compatibility keeps React, accessibility, and Next rules active', async () => {
  const eslint = new ESLint();
  const [invalid] = await eslint.lintText(
    'export default () => <img src="/profile.jpg" />;',
    { filePath: 'components/LintCompatibilityProbe.tsx' },
  );
  assert.equal(invalid.fatalErrorCount, 0);
  const rules = new Set(invalid.messages.map(({ ruleId }) => ruleId));
  assert.ok(rules.has('react/display-name'), 'React rule must still run');
  assert.ok(rules.has('jsx-a11y/alt-text'), 'Accessibility rule must still run');
  assert.ok(rules.has('@next/next/no-img-element'), 'Next rule must still run');

  const [valid] = await eslint.lintText(
    'export default function Valid() { return <button type="button">Ready</button>; }',
    { filePath: 'components/LintCompatibilityProbe.tsx' },
  );
  assert.equal(valid.errorCount, 0);
  assert.equal(valid.warningCount, 0);
});

test('Next ESLint handles JavaScript globals without losing undefined-name checks', async () => {
  const eslint = new ESLint({
    overrideConfig: [{
      languageOptions: { globals: { configured: 'readonly' } },
      rules: { 'no-undef': 'error' },
    }],
  });
  const [result] = await eslint.lintText(
    '/* global injected */\nexport const value = window + injected + configured + missing;',
    { filePath: 'lib/LintGlobalsProbe.mjs' },
  );
  assert.equal(result.fatalErrorCount, 0);
  const undefinedNames = result.messages.filter(({ ruleId }) => ruleId === 'no-undef');
  assert.equal(undefinedNames.length, 1);
  assert.match(undefinedNames[0].message, /'missing'/);
});

test('Next ESLint resolves TypeScript aliases while still rejecting missing imports', async () => {
  const eslint = new ESLint({
    overrideConfig: [{ rules: { 'import/no-unresolved': 'error' } }],
  });
  const [result] = await eslint.lintText(
    "import { cn } from '@/lib/utils';\nimport missing from './does-not-exist';\nexport { cn, missing };",
    { filePath: 'components/LintImportsProbe.tsx' },
  );
  assert.equal(result.fatalErrorCount, 0);
  const unresolved = result.messages.filter(({ ruleId }) => ruleId === 'import/no-unresolved');
  assert.equal(unresolved.length, 1);
  assert.match(unresolved[0].message, /does-not-exist/);
});
