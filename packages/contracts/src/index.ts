export type EntityRole = 'fact' | 'dimension' | 'staging';

export interface ModelEntity {
  id: string;
  name: string;
  role: EntityRole;
}

export interface SemanticModelSnapshot {
  entities: ModelEntity[];
  dimensions: unknown[];
  measures: unknown[];
  calculatedMeasures: unknown[];
  relationships: unknown[];
  hierarchies: unknown[];
  metadata: ModelMetadata;
}

export interface ModelMetadata {
  name: string;
  description?: string;
}

export type ValidationCategory =
  | 'STRUCTURE'
  | 'SEMANTICS'
  | 'RELATIONSHIP'
  | 'MEASURE'
  | 'COMPATIBILITY'
  | 'GOVERNANCE'
  | 'SECURITY';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  id: string;
  ruleId: string;
  category: ValidationCategory;
  severity: ValidationSeverity;
  location: string;
  message: string;
  risk: string;
  suggestedFix: string;
  breaking: boolean;
}

export interface ValidationResult {
  runId: string;
  issues: ValidationIssue[];
  rulesExecuted: number;
}

export interface PublicationResult {
  versionNumber: number;
  checksum: string;
}

export interface EditorState {
  modelId: string;
  revision: number;
  draft: SemanticModelSnapshot;
  originalDraft: SemanticModelSnapshot;
  dirty: boolean;
  saving: boolean;
  validating: boolean;
  publishing: boolean;
  validationIssues: ValidationIssue[];
}

export interface UIState {
  activePanel: 'model' | 'validation' | 'versions' | 'audit';
  sidePanelOpen: boolean;
  busy: boolean;
  searchQuery: string;
}

export function emptySnapshot(name = ''): SemanticModelSnapshot {
  return {
    entities: [],
    dimensions: [],
    measures: [],
    calculatedMeasures: [],
    relationships: [],
    hierarchies: [],
    metadata: { name },
  };
}
