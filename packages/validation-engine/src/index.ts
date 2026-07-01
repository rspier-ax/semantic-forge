import type { SemanticModelSnapshot } from '@semantic-forge/contracts';
import type { ValidationContext } from './validation-context.js';
import { createRunId } from './ids.js';
import { model001NoFactEntity } from './rules/model-001-no-fact-entity.js';

export type { ValidationContext } from './validation-context.js';
export type { ValidationRule } from './validation-rule.js';
export { model001NoFactEntity } from './rules/model-001-no-fact-entity.js';

const defaultRules = [model001NoFactEntity];

export function runValidation(
  snapshot: SemanticModelSnapshot,
  rules = defaultRules,
): { issues: import('@semantic-forge/contracts').ValidationIssue[]; rulesExecuted: number } {
  const context: ValidationContext = { snapshot };
  const issues: import('@semantic-forge/contracts').ValidationIssue[] = [];
  let rulesExecuted = 0;

  for (const rule of rules) {
    if (!rule.supports(context)) {
      continue;
    }
    rulesExecuted += 1;
    issues.push(...rule.evaluate(context));
  }

  return { issues, rulesExecuted };
}

export { createRunId, createIssueId } from './ids.js';
