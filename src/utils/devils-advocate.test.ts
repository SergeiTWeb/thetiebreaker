import assert from 'node:assert/strict';
import test from 'node:test';
import { isUsefulDevilsAdvocateResponse } from './devils-advocate';

const usefulResponse = {
  counterThesis:
    'Staying in the current role could be the stronger choice if the planned promotion is confirmed within the next review cycle. That would preserve established relationships while addressing the main growth concern without the uncertainty of an external move.',
  reversalTrigger:
    'Reconsider the external move if the current manager confirms a written promotion plan with specific responsibilities and a review date within six months.',
  suggestedProsCons: [
    {
      optionId: 'stay',
      type: 'pro',
      title: 'Near-term progression',
      impactNote: 'A confirmed promotion could provide broader responsibilities without restarting organizational relationships.',
      weight: 4,
      domain: 'Career growth',
    },
    {
      optionId: 'move',
      type: 'con',
      title: 'Unverified role scope',
      impactNote: 'The new role may offer less autonomy than the title suggests unless decision rights are confirmed.',
      weight: 3,
      domain: 'Role fit',
    },
  ],
  suggestedSwot: [
    {
      optionId: 'stay',
      quadrant: 'opportunity',
      title: 'Internal role expansion',
      detail: 'A specific cross-team assignment could test readiness for the desired next-level work.',
      weight: 4,
      mitigationOrLeverage: 'Ask for the assignment scope and success measures before deciding.',
    },
    {
      optionId: 'move',
      quadrant: 'threat',
      title: 'Expectation mismatch',
      detail: 'The advertised growth path could depend on team changes that are not yet confirmed.',
      weight: 3,
      mitigationOrLeverage: 'Validate the first-year responsibilities with the hiring manager.',
    },
  ],
};

test('accepts a specific Devil’s Advocate response with valid option references', () => {
  assert.equal(
    isUsefulDevilsAdvocateResponse(usefulResponse, ['move', 'stay'], 'stay'),
    true
  );
});

test('rejects generic fallback text and empty counter-factors', () => {
  assert.equal(
    isUsefulDevilsAdvocateResponse(
      {
        counterThesis: 'Test the key assumptions: delays and added costs could change the current lead.',
        reversalTrigger: 'Revisit the decision if costs exceed the estimate by more than 20%.',
        suggestedProsCons: [],
        suggestedSwot: [],
      },
      ['move', 'stay'],
      'stay'
    ),
    false
  );
});

test('rejects suggestions that do not challenge the runner-up option', () => {
  const response = {
    ...usefulResponse,
    suggestedProsCons: usefulResponse.suggestedProsCons.map((item) => ({
      ...item,
      optionId: 'move',
    })),
    suggestedSwot: usefulResponse.suggestedSwot.map((item) => ({
      ...item,
      optionId: 'move',
    })),
  };
  assert.equal(isUsefulDevilsAdvocateResponse(response, ['move', 'stay'], 'stay'), false);
});
