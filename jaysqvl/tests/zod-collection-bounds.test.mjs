import assert from 'node:assert/strict';
import test from 'node:test';
import { z } from 'zod';

// Zod is a development-only dependency of the React Hooks ESLint plugin.
// Exercise the upstream security fix without introducing an application parser.
const cases = [
  {
    name: 'array maximum',
    schema: () => z.array(z.number()).max(2),
    oversized: () => Array(1000).fill('invalid'),
    valid: () => [1, 2],
  },
  {
    name: 'array exact length',
    schema: () => z.array(z.number()).length(2),
    oversized: () => Array(1000).fill('invalid'),
    valid: () => [1, 2],
  },
  ...['max', 'size'].flatMap((bound) => [
    {
      name: `set ${bound}`,
      schema: () => z.set(z.number())[bound](2),
      oversized: () => new Set(Array.from({ length: 1000 }, (_, i) => `invalid-${i}`)),
      valid: () => new Set([1, 2]),
    },
    {
      name: `map ${bound}`,
      schema: () => z.map(z.string(), z.number())[bound](2),
      oversized: () => new Map(Array.from({ length: 1000 }, (_, i) => [i, 'invalid'])),
      valid: () => new Map([['one', 1], ['two', 2]]),
    },
  ]),
];

for (const jitless of [false, true]) {
  for (const item of cases) {
    test(`${item.name} rejects oversize before collecting element errors (jitless=${jitless})`, () => {
      const schema = z.object({ items: item.schema() });
      const result = schema.safeParse({ items: item.oversized() }, { jitless });
      assert.equal(result.success, false);
      assert.equal(result.error.issues.length, 1);
      assert.equal(result.error.issues[0].code, 'too_big');
      assert.deepEqual(result.error.issues[0].path, ['items']);
    });

    test(`${item.name} preserves valid bounded values (jitless=${jitless})`, () => {
      const schema = z.object({ items: item.schema() });
      const value = { items: item.valid() };
      assert.deepEqual(schema.parse(value, { jitless }), value);
    });
  }

  test(`a preceding value rewrite still runs before its size check (jitless=${jitless})`, () => {
    const schema = z.object({
      items: z.array(z.number()).overwrite((values) => values.slice(0, 2)).max(2),
    });
    assert.deepEqual(schema.parse({ items: [1, 2, 3] }, { jitless }), { items: [1, 2] });
  });
}
