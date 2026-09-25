import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadEnv } from './load-env.mjs';

test('loadEnv fills unset keys and leaves existing values', () => {
  const file = join(mkdtempSync(join(tmpdir(), 'road-zero-env-')), '.env');
  writeFileSync(file, [
    '# comment',
    'CLOUDINARY_CLOUD_NAME=from-file',
    'CLOUDINARY_API_KEY="quoted-key"',
    'export CLOUDINARY_API_SECRET=from-file-secret',
    'ALREADY_SET=from-file',
    '',
  ].join('\n'));
  process.env.ALREADY_SET = 'from-shell';
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;
  loadEnv(file);
  assert.equal(process.env.CLOUDINARY_CLOUD_NAME, 'from-file');
  assert.equal(process.env.CLOUDINARY_API_KEY, 'quoted-key');
  assert.equal(process.env.CLOUDINARY_API_SECRET, 'from-file-secret');
  assert.equal(process.env.ALREADY_SET, 'from-shell');
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;
  delete process.env.ALREADY_SET;
});
