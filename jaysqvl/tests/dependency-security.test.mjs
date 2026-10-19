import assert from 'node:assert/strict';
import test from 'node:test';
import { SourceMapConsumer, SourceMapGenerator } from 'source-map-js';

const basicMap = () => ({
  version: 3,
  sources: ['input.js'],
  sourcesContent: ['const value = 1;'],
  names: [],
  mappings: 'AAAA',
});

function indexedMap(line, column = 0, map = basicMap()) {
  return { version: 3, sections: [{ offset: { line, column }, map }] };
}

test('indexed source maps reject non-integer and non-numeric section offsets', () => {
  // GHSA-68fv-2mgg-jv7q: unsafe offsets amplify work when maps are flattened.
  const invalid = [-1, 0.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1,
    '1', null, undefined, {}];
  for (const value of invalid) {
    for (const field of ['line', 'column']) {
      const map = indexedMap(0);
      map.sections[0].offset[field] = value;
      assert.throws(() => new SourceMapConsumer(map), /non-negative integers/,
        `${field}=${String(value)}`);
    }
  }
});

test('indexed source maps reject excessive direct and cumulative line offsets', () => {
  assert.throws(() => new SourceMapConsumer(indexedMap(10_000_001)), /must not exceed/);
  const inner = indexedMap(5_000_000);
  const atLimit = indexedMap(5_000_000, 0, inner);
  const valid = new SourceMapConsumer(atLimit);
  const generatedLines = [];
  valid.eachMapping((mapping) => generatedLines.push(mapping.generatedLine));
  assert.deepEqual(generatedLines, [10_000_001]);
  assert.throws(() => new SourceMapConsumer(indexedMap(1, 0, atLimit)),
    /including offsets of nested sections/);
});

test('nested source lookup reads the underlying sources only once', () => {
  let map = basicMap();
  for (let depth = 0; depth < 12; depth++) map = indexedMap(0, 0, map);
  const consumer = new SourceMapConsumer(map);
  let inner = consumer;
  for (let depth = 0; depth < 12; depth++) inner = inner._sections[0].consumer;
  const sources = inner.sources;
  let reads = 0;
  Object.defineProperty(inner, 'sources', { get() { reads++; return sources; } });
  assert.deepEqual(consumer.sources, ['input.js']);
  assert.equal(reads, 1);
});

test('ordinary nested source maps still flatten and round-trip correctly', () => {
  const consumer = new SourceMapConsumer(indexedMap(2, 0, indexedMap(3)));
  const generator = new SourceMapGenerator();
  consumer.eachMapping((mapping) => generator.addMapping({
    generated: { line: mapping.generatedLine, column: mapping.generatedColumn },
    original: { line: mapping.originalLine, column: mapping.originalColumn },
    source: mapping.source,
  }));
  for (const source of consumer.sources) {
    generator.setSourceContent(source, consumer.sourceContentFor(source));
  }
  const restored = new SourceMapConsumer(generator.toJSON());
  assert.deepEqual(restored.originalPositionFor({ line: 6, column: 0 }), {
    source: 'input.js', line: 1, column: 0, name: null,
  });
  assert.equal(restored.sourceContentFor('input.js'), 'const value = 1;');
});
