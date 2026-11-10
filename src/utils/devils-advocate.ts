import type { DevilsAdvocateResponse } from '../types/decision';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function hasText(value: unknown, minLength: number): value is string {
  return typeof value === 'string' && value.trim().length >= minLength;
}

function isWeight(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 5;
}

export function isUsefulDevilsAdvocateResponse(
  value: unknown,
  optionIds: readonly string[],
  runnerUpOptionId: string
): value is DevilsAdvocateResponse {
  if (!isRecord(value)) return false;
  if (!hasText(value.counterThesis, 60) || !hasText(value.reversalTrigger, 35)) return false;
  if (!Array.isArray(value.suggestedProsCons) || value.suggestedProsCons.length < 2) return false;
  if (!Array.isArray(value.suggestedSwot) || value.suggestedSwot.length < 2) return false;

  const knownOptionIds = new Set(optionIds);
  const prosConsAreUseful = value.suggestedProsCons.every(
    (item) =>
      isRecord(item) &&
      knownOptionIds.has(String(item.optionId)) &&
      (item.type === 'pro' || item.type === 'con') &&
      hasText(item.title, 6) &&
      hasText(item.impactNote, 20) &&
      hasText(item.domain, 2) &&
      isWeight(item.weight)
  );
  const swotItemsAreUseful = value.suggestedSwot.every(
    (item) =>
      isRecord(item) &&
      knownOptionIds.has(String(item.optionId)) &&
      ['strength', 'weakness', 'opportunity', 'threat'].includes(String(item.quadrant)) &&
      hasText(item.title, 6) &&
      hasText(item.detail, 20) &&
      hasText(item.mitigationOrLeverage, 10) &&
      isWeight(item.weight)
  );
  const challengesRunnerUp = [...value.suggestedProsCons, ...value.suggestedSwot].some(
    (item) => isRecord(item) && item.optionId === runnerUpOptionId
  );

  return prosConsAreUseful && swotItemsAreUseful && challengesRunnerUp;
}
