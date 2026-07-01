import type { ValidationContext } from '../validation-context.js';
import type { ValidationRule } from '../validation-rule.js';
import { createIssueId } from '../ids.js';

export const model001NoFactEntity: ValidationRule = {
  id: 'MODEL-001',
  category: 'STRUCTURE',
  defaultSeverity: 'error',

  supports(_context: ValidationContext): boolean {
    return true;
  },

  evaluate(context: ValidationContext) {
    const hasFact = context.snapshot.entities.some(
      (entity: { role: string }) => entity.role === 'fact',
    );

    if (hasFact) {
      return [];
    }

    return [
      {
        id: createIssueId(),
        ruleId: 'MODEL-001',
        category: 'STRUCTURE',
        severity: 'error',
        location: 'model.entities',
        message: 'Model has no fact entity',
        risk: 'Measures and aggregations require at least one fact entity.',
        suggestedFix: 'Add an entity and set its role to fact.',
        breaking: true,
      },
    ];
  },
};
