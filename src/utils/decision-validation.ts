import type {
  ComparisonCriterion,
  DecisionModel,
  DecisionOption,
  ProConItem,
  SwotItem,
  SwotQuadrant,
} from '../types/decision';
import { normalizeToFiveScale } from './scoring';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function toStringValue(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) return value.trim();
  return fallback;
}

function sanitizeWeight(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return normalizeToFiveScale(parsed);
}

function sanitizeOption(option: unknown, fallback: DecisionOption): DecisionOption {
  if (!isRecord(option)) return fallback;

  return {
    id: toStringValue(option.id, fallback.id),
    name: toStringValue(option.name, fallback.name),
    tagline: toStringValue(option.tagline, fallback.tagline),
    description: toStringValue(option.description, fallback.description),
  };
}

function sanitizeProsCon(item: unknown, optionId: string): ProConItem {
  const base: Omit<ProConItem, 'id'> = {
    optionId,
    type: 'pro',
    title: 'Untitled factor',
    impactNote: 'No impact note provided.',
    weight: 3,
    domain: 'General',
  };

  if (!isRecord(item)) {
    return { ...base, id: `pc-${Math.random().toString(36).slice(2, 9)}` };
  }

  const type = item.type === 'con' ? 'con' : 'pro';

  return {
    id: toStringValue(item.id, `pc-${Math.random().toString(36).slice(2, 9)}`),
    optionId: toStringValue(item.optionId, optionId),
    type,
    title: toStringValue(item.title, base.title),
    impactNote: toStringValue(item.impactNote, base.impactNote),
    weight: sanitizeWeight(item.weight, base.weight),
    domain: toStringValue(item.domain, base.domain),
  };
}

function sanitizeCriterion(item: unknown, optionIds: Set<string>): ComparisonCriterion {
  const fallback: ComparisonCriterion = {
    id: 'crit-fallback',
    name: 'Untitled criterion',
    description: 'No description provided.',
    weight: 3,
    scores: [],
  };

  if (!isRecord(item)) return fallback;

  const rawScores = Array.isArray(item.scores) ? item.scores : [];
  const scores = rawScores
    .filter(isRecord)
    .map((scoreItem) => {
      const optionId = toStringValue(scoreItem.optionId, optionIds.values().next().value ?? 'opt-1');
      return {
        optionId,
        score: sanitizeWeight(scoreItem.score, 3),
        rationale: toStringValue(scoreItem.rationale, 'No rationale provided.'),
      };
    })
    .filter((score) => optionIds.has(score.optionId));

  return {
    id: toStringValue(item.id, fallback.id),
    name: toStringValue(item.name, fallback.name),
    description: toStringValue(item.description, fallback.description),
    weight: sanitizeWeight(item.weight, fallback.weight),
    scores,
  };
}

function sanitizeSwotItem(item: unknown, optionId: string): SwotItem {
  const fallback: SwotItem = {
    id: `sw-${Math.random().toString(36).slice(2, 9)}`,
    optionId,
    quadrant: 'strength',
    title: 'Untitled SWOT factor',
    detail: 'No detail provided.',
    weight: 3,
    mitigationOrLeverage: 'Monitor the factor.',
  };

  if (!isRecord(item)) return fallback;

  const quadrant = item.quadrant === 'weakness' || item.quadrant === 'opportunity' || item.quadrant === 'threat'
    ? item.quadrant
    : 'strength';

  return {
    id: toStringValue(item.id, fallback.id),
    optionId: toStringValue(item.optionId, optionId),
    quadrant: quadrant as SwotQuadrant,
    title: toStringValue(item.title, fallback.title),
    detail: toStringValue(item.detail, fallback.detail),
    weight: sanitizeWeight(item.weight, fallback.weight),
    mitigationOrLeverage: toStringValue(item.mitigationOrLeverage, fallback.mitigationOrLeverage),
  };
}

export function sanitizeDecisionModel(value: unknown, fallback: DecisionModel): DecisionModel {
  if (!isRecord(value)) {
    return fallback;
  }

  const safeOptions = Array.isArray(value.options)
    ? value.options.filter(isRecord).map((option, index) =>
        sanitizeOption(option, fallback.options[index] ?? fallback.options[0] ?? {
          id: `opt-${index + 1}`,
          name: `Option ${index + 1}`,
          tagline: 'Alternative path',
          description: 'Decision path',
        })
      )
    : fallback.options;

  const optionIds = new Set(safeOptions.map((option) => option.id));
  const safeProsCons = Array.isArray(value.prosCons)
    ? value.prosCons.filter(isRecord).map((item) => sanitizeProsCon(item, safeOptions[0]?.id ?? 'opt-1'))
    : fallback.prosCons;

  const safeCriteria = Array.isArray(value.criteria)
    ? value.criteria.filter(isRecord).map((item) => sanitizeCriterion(item, optionIds))
    : fallback.criteria;

  const safeSwot = Array.isArray(value.swot)
    ? value.swot.filter(isRecord).map((item) => sanitizeSwotItem(item, safeOptions[0]?.id ?? 'opt-1'))
    : fallback.swot;

  const normalizedOptions = safeOptions.length >= 2 ? safeOptions : fallback.options;
  if (normalizedOptions.length < 2) return fallback;

  const normalizedProsCons = safeProsCons
    .map((item) => sanitizeProsCon(item, normalizedOptions[0]?.id ?? 'opt-1'))
    .filter((item) => normalizedOptions.some((option) => option.id === item.optionId));

  const normalizedCriteria = safeCriteria.map((criterion) => sanitizeCriterion(criterion, new Set(normalizedOptions.map((option) => option.id))));
  const normalizedSwot = safeSwot
    .map((item) => sanitizeSwotItem(item, normalizedOptions[0]?.id ?? 'opt-1'))
    .filter((item) => normalizedOptions.some((option) => option.id === item.optionId));

  const sanitizedScenarios: DecisionModel['scenarios'] = Array.isArray(value.scenarios)
    ? value.scenarios
        .filter(isRecord)
        .map((item) => {
          if (!isRecord(item) || !item.optionId || typeof item.optionId !== 'string') return null;
          if (!normalizedOptions.some((option) => option.id === item.optionId)) return null;
          return item as unknown as NonNullable<DecisionModel['scenarios']>[number];
        })
        .filter((item): item is NonNullable<DecisionModel['scenarios']>[number] => item !== null)
    : fallback.scenarios ?? undefined;

  const blindSpots = Array.isArray(value.blindSpots)
    ? value.blindSpots.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0).slice(0, 3)
    : fallback.blindSpots;

  return {
    id: toStringValue(value.id, fallback.id),
    title: toStringValue(value.title, fallback.title),
    category: toStringValue(value.category, fallback.category),
    createdAt: toStringValue(value.createdAt, fallback.createdAt),
    summary: toStringValue(value.summary, fallback.summary),
    options: normalizedOptions,
    prosCons: normalizedProsCons,
    criteria: normalizedCriteria,
    swot: normalizedSwot,
    scenarios: sanitizedScenarios,
    blindSpots,
  };
}
