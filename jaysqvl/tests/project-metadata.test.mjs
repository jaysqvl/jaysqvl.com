import assert from 'node:assert/strict';
import test from 'node:test';
import { applyProjectMetadata, resolveProjectRefresh } from '../lib/project-metadata.ts';

function project(id, overrides = {}) {
  return {
    id: `jaysqvl/${id}`,
    title: id,
    description: `Current description for ${id}.`,
    languages: ['TypeScript'],
    github: `https://github.com/jaysqvl/${id}`,
    updatedAt: null,
    ...overrides,
  };
}

const catalogue = [
  project('spider', { title: 'Spider', type: 'Game', releases: 'https://github.com/jaysqvl/spider/releases' }),
  project('buntzen-pass-bot', { title: 'Buntzen Pass Bot', languages: ['Go'] }),
  project('scriberr', { title: 'Scriberr', type: 'Maintained fork', github: 'https://github.com/jaysqvl/Scriberr' }),
];

test('a legacy snapshot supplies metadata without restoring obsolete selection, copy, links, or order', () => {
  const oldSnapshot = {
    savedAt: 1750000000000,
    projects: [
      project('scriberr', {
        title: 'Old title',
        description: 'Old GitHub About text.',
        type: 'Old type',
        demo: 'https://old-demo.example',
        releases: 'https://github.com/jaysqvl/scriberr/releases',
        languages: ['Go', 'TypeScript', 'Python'],
        updatedAt: '2026-09-05T20:28:51Z',
      }),
      project('pomodoro-timer', { updatedAt: '2026-09-10T00:00:00Z' }),
      project('buntzen-pass-bot', {
        description: 'Old description.',
        languages: ['Go', 'Python'],
        updatedAt: '2026-09-09T00:00:00Z',
      }),
    ],
  };

  const actual = applyProjectMetadata(catalogue, oldSnapshot.projects, { includeMissing: true });

  assert.deepEqual(actual, [
    catalogue[0],
    { ...catalogue[1], languages: ['Go', 'Python'], updatedAt: '2026-09-09T00:00:00Z' },
    { ...catalogue[2], languages: ['Go', 'TypeScript', 'Python'], updatedAt: '2026-09-05T20:28:51Z' },
  ]);
});

test('successful public results use catalogue order and omit absent repositories', () => {
  const response = {
    source: 'github',
    projects: [
      project('scriberr', { updatedAt: '2026-09-10T00:00:00Z' }),
      project('unselected', { updatedAt: '2026-09-11T00:00:00Z' }),
      project('spider', { updatedAt: '2026-01-01T00:00:00Z' }),
    ],
  };
  const saved = [project('buntzen-pass-bot')];

  const actual = resolveProjectRefresh(catalogue, response, saved);

  assert.deepEqual(actual.projects.map(({ id }) => id), ['jaysqvl/spider', 'jaysqvl/scriberr']);
  assert.equal(actual.projects[0].updatedAt, '2026-01-01T00:00:00Z');
  assert.equal(actual.projects[0].releases, 'https://github.com/jaysqvl/spider/releases');
  assert.equal(actual.projects[1].updatedAt, '2026-09-10T00:00:00Z');
  assert.deepEqual(actual.snapshot, actual.projects);
});

test('an empty successful public response remains empty and is saved as a successful snapshot', () => {
  const actual = resolveProjectRefresh(catalogue, { source: 'github', projects: [] }, catalogue);

  assert.deepEqual(actual.projects, []);
  assert.deepEqual(actual.snapshot, []);
});

test('a fallback response retains saved metadata without authorizing a snapshot renewal', () => {
  const saved = [project('scriberr', {
    languages: ['Go', 'Python'],
    updatedAt: '2026-09-05T20:28:51Z',
  })];

  const actual = resolveProjectRefresh(catalogue, { source: 'fallback', projects: catalogue }, saved);

  assert.deepEqual(actual.projects, [
    catalogue[0],
    catalogue[1],
    { ...catalogue[2], languages: ['Go', 'Python'], updatedAt: '2026-09-05T20:28:51Z' },
  ]);
  assert.equal(actual.snapshot, null);
});

test('an outage without a saved snapshot retains the complete current catalogue', () => {
  const actual = resolveProjectRefresh(catalogue, { source: 'fallback', projects: [] }, null);

  assert.deepEqual(actual.projects, catalogue);
  assert.equal(actual.snapshot, null);
});

test('successful null dates and empty language lists replace stale values', () => {
  const old = project('spider', { languages: ['JavaScript'], updatedAt: '2026-01-01T00:00:00Z' });
  const current = project('spider', { languages: [], updatedAt: null });

  const actual = resolveProjectRefresh([old], { source: 'github', projects: [current] }, [old]);

  assert.deepEqual(actual.projects, [{ ...old, languages: [], updatedAt: null }]);
});

test('projection does not mutate its inputs or share cached language arrays', () => {
  const selected = Object.freeze([Object.freeze(project('spider', {
    languages: Object.freeze(['TypeScript']),
  }))]);
  const cached = Object.freeze([Object.freeze(project('spider', {
    languages: Object.freeze(['TypeScript', 'CSS']),
  }))]);

  const actual = applyProjectMetadata(selected, cached);
  actual[0].languages.push('HTML');

  assert.deepEqual(selected[0].languages, ['TypeScript']);
  assert.deepEqual(cached[0].languages, ['TypeScript', 'CSS']);
});
