import test from 'node:test';
import assert from 'node:assert/strict';

import type { DecisionModel, SwotItem } from '../types/decision';
import { computeOptionScores, normalizeToFiveScale } from './scoring';

test('normalizeToFiveScale clamps values outside the 1-5 range', () => {
  assert.equal(normalizeToFiveScale(0), 1);
  assert.equal(normalizeToFiveScale(6), 5);
  assert.equal(normalizeToFiveScale(8), 5);
  assert.equal(normalizeToFiveScale(3.6), 4);
  assert.equal(normalizeToFiveScale(2.2), 2);
});

test('adding a positive factor changes the option outcome even when existing evidence is all positive', () => {
  const decision: DecisionModel = {
    id: 'decision',
    title: 'Decision',
    category: 'Test',
    createdAt: '2026-01-01',
    summary: '',
    options: [
      { id: 'a', name: 'Option A', tagline: '', description: '' },
      { id: 'b', name: 'Option B', tagline: '', description: '' },
    ],
    prosCons: [
      {
        id: 'pc-a',
        optionId: 'a',
        type: 'pro',
        title: 'Existing benefit',
        impactNote: '',
        weight: 3,
        domain: 'Test',
      },
    ],
    criteria: [],
    swot: [],
    blindSpots: [],
  };
  const before = computeOptionScores(decision).find((score) => score.option.id === 'a');
  decision.prosCons.push({
    id: 'pc-a-added',
    optionId: 'a',
    type: 'pro',
    title: 'New benefit',
    impactNote: '',
    weight: 3,
    domain: 'Test',
  });
  const after = computeOptionScores(decision).find((score) => score.option.id === 'a');

  assert.ok(before && after);
  assert.ok(after.compositeScore > before.compositeScore);
});

test('adding a Devil’s Advocate SWOT factor changes the option outcome', () => {
  const decision: DecisionModel = {
    id: 'decision',
    title: 'Decision',
    category: 'Test',
    createdAt: '2026-01-01',
    summary: '',
    options: [
      { id: 'a', name: 'Option A', tagline: '', description: '' },
      { id: 'b', name: 'Option B', tagline: '', description: '' },
    ],
    prosCons: [],
    criteria: [],
    swot: [
      {
        id: 'swot-a',
        optionId: 'a',
        quadrant: 'strength',
        title: 'Existing strength',
        detail: '',
        weight: 3,
        mitigationOrLeverage: '',
      },
    ],
    blindSpots: [],
  };
  const before = computeOptionScores(decision).find((score) => score.option.id === 'a');
  const addedFactor: Omit<SwotItem, 'id'> = {
    optionId: 'a',
    quadrant: 'opportunity',
    title: 'New opportunity',
    detail: '',
    weight: 4,
    mitigationOrLeverage: '',
  };
  decision.swot.push({ ...addedFactor, id: 'swot-a-added' });
  const after = computeOptionScores(decision).find((score) => score.option.id === 'a');

  assert.ok(before && after);
  assert.ok(after.swotScore > before.swotScore);
  assert.ok(after.compositeScore > before.compositeScore);
});
