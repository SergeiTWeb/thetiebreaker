import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeToFiveScale } from './scoring';

test('normalizeToFiveScale clamps values outside the 1-5 range', () => {
  assert.equal(normalizeToFiveScale(0), 1);
  assert.equal(normalizeToFiveScale(6), 5);
  assert.equal(normalizeToFiveScale(8), 5);
  assert.equal(normalizeToFiveScale(3.6), 4);
  assert.equal(normalizeToFiveScale(2.2), 2);
});
