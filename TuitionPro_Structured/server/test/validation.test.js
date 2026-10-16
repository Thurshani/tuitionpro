import test from 'node:test';
import assert from 'node:assert/strict';
import { date, month, id, email } from '../utils/validation.js';
test('Reject impossible session dates rather than saving them under another day', () => {
  assert.equal(date('2026-02-30'), false);
  assert.equal(date('2026-10-14'), true);
  assert.equal(date('2026-10-14T00:00:00'), false);
});
test('Payment month cannot contain SQL fragments or invalid months', () => {
  for (const x of ['2026-00', '2026-13', "2026-10' OR 1=1", '']) assert.equal(month(x), false);
  assert.equal(month('2026-10'), true);
});
test('Identifiers and login email validation reject malformed inputs', () => {
  for (const x of [0, -1, 1.5, 'abc']) assert.equal(id(x), false);
  assert.equal(id(42), true);
  assert.equal(email('not-an-email'), false);
  assert.equal(email('student@tuitionpro.local'), true);
});
