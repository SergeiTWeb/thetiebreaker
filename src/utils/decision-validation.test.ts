import test from 'node:test';
import assert from 'node:assert/strict';

import { sanitizeDecisionModel } from './decision-validation';

test('sanitizeDecisionModel repairs malformed model payloads into a valid decision model', () => {
  const result = sanitizeDecisionModel(
    {
      title: 'Sample',
      category: 'Work',
      summary: 'Overview',
      analysisNotice: 'Generic scores are shown.',
      options: [
        { id: 'opt-1', name: 'A', tagline: 'T1', description: 'D1' },
        { id: 'opt-2', name: 'B', tagline: 'T2', description: 'D2' },
      ],
      prosCons: [
        { optionId: 'opt-1', type: 'pro', title: 'Strong', impactNote: 'Impact', weight: 6, domain: 'Risk' },
      ],
      criteria: [
        {
          id: 'crit-1',
          name: 'Speed',
          description: 'How fast',
          weight: 4,
          scores: [
            { optionId: 'opt-1', score: 8, rationale: 'Fast' },
            { optionId: 'opt-2', score: 0, rationale: 'Slow' },
          ],
        },
      ],
      swot: [
        {
          optionId: 'opt-1',
          quadrant: 'strength',
          title: 'Can do',
          detail: 'It works',
          weight: 5,
          mitigationOrLeverage: 'Use it',
        },
      ],
      blindSpots: ['Question 1'],
    },
    {
      id: 'fallback-id',
      title: 'Fallback',
      category: 'Fallback',
      createdAt: 'now',
      summary: 'Fallback summary',
      options: [
        { id: 'opt-1', name: 'A', tagline: 'T1', description: 'D1' },
        { id: 'opt-2', name: 'B', tagline: 'T2', description: 'D2' },
      ],
      prosCons: [],
      criteria: [],
      swot: [],
      blindSpots: [],
    }
  );

  assert.equal(result.title, 'Sample');
  assert.equal(result.options.length, 2);
  assert.equal(result.prosCons[0].weight, 5);
  assert.equal(result.criteria[0].scores[0].score, 5);
  assert.equal(result.criteria[0].scores[1].score, 1);
  assert.equal(result.swot[0].quadrant, 'strength');
  assert.deepEqual(result.blindSpots, ['Question 1']);
  assert.equal(result.analysisNotice, 'Generic scores are shown.');
});
