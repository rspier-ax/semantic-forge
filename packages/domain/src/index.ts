import type { SemanticModelSnapshot, ValidationIssue } from '@semantic-forge/contracts';

export class StaleRevisionError extends Error {
  readonly code = 'STALE_REVISION';

  constructor(
    readonly expectedRevision: number,
    readonly actualRevision: number,
  ) {
    super(
      `Stale revision: expected ${expectedRevision}, current is ${actualRevision}`,
    );
    this.name = 'StaleRevisionError';
  }
}

export class PublicationBlockedError extends Error {
  readonly code = 'PUBLICATION_BLOCKED';

  constructor(readonly issues: ValidationIssue[]) {
    super('Publication blocked due to validation errors');
    this.name = 'PublicationBlockedError';
  }
}

export interface DraftRecord {
  revision: number;
  content: SemanticModelSnapshot;
}

export function assertRevisionMatch(
  expectedRevision: number,
  currentRevision: number,
): void {
  if (expectedRevision !== currentRevision) {
    throw new StaleRevisionError(expectedRevision, currentRevision);
  }
}

export function saveDraft(
  current: DraftRecord,
  expectedRevision: number,
  nextContent: SemanticModelSnapshot,
): DraftRecord {
  assertRevisionMatch(expectedRevision, current.revision);
  return {
    revision: current.revision + 1,
    content: nextContent,
  };
}

export function canPublish(
  draftRevision: number,
  submittedRevision: number,
  issues: ValidationIssue[],
): void {
  assertRevisionMatch(submittedRevision, draftRevision);
  const errors = issues.filter((issue) => issue.severity === 'error');
  if (errors.length > 0) {
    throw new PublicationBlockedError(errors);
  }
}

export function hasValidationErrors(issues: ValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === 'error');
}
