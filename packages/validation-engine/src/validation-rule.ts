import type { ValidationIssue } from '@semantic-forge/contracts';
import type { ValidationContext } from './validation-context.js';

export interface ValidationRule {
  readonly id: string;
  readonly category: ValidationIssue['category'];
  readonly defaultSeverity: ValidationIssue['severity'];
  supports(context: ValidationContext): boolean;
  evaluate(context: ValidationContext): ValidationIssue[];
}
