# Domain model

SemanticForge models analytical semantics before publication. This document describes persisted entities, in-document structures, invariants, and validation rule identifiers.

## Persisted entities

| Entity | Purpose |
|--------|---------|
| Workspace | Tenant or project boundary for models and data sources |
| DataSource | Imported schema or JSON source; technical metadata |
| SourceEntity | Table or entity from a data source |
| SourceField | Column or field from a source entity |
| SemanticModel | Model header: name, status, current revision, published version pointer |
| ModelDraft | Active draft: modelId, revision, content (JSON), updatedBy, updatedAt |
| ModelVersion | Immutable published snapshot: versionNumber, snapshot, checksum, comment |
| ValidationRun | Execution record: modelId, revision, rulesExecuted, timestamp |
| ValidationIssue | Structured finding: ruleId, severity, location, message |
| ModelDependency | Edge in consumer graph |
| Consumer | Downstream dashboard, API, or report |
| Publication | Publish event linking model, version, actor |
| AuditEvent | Append-only business audit (MODEL_CREATED, DRAFT_UPDATED, etc.) |

## In-model structures (inside snapshot JSON)

| Type | Purpose |
|------|---------|
| ModelEntity | Fact or staging entity in the semantic model |
| Dimension | Analytical dimension with attributes |
| Attribute | Field on an entity or dimension |
| Measure | Aggregation measure (SUM, AVG, etc.) |
| CalculatedMeasure | Formula referencing other measures |
| Relationship | Join between entities with cardinality |
| Hierarchy | Drill path on a dimension |
| Filter | Named filter definition |

## SemanticModelSnapshot

Full aggregate loaded by the editor and stored as draft content or version snapshot:

```typescript
interface SemanticModelSnapshot {
  entities: ModelEntity[];
  dimensions: Dimension[];
  measures: Measure[];
  calculatedMeasures: CalculatedMeasure[];
  relationships: Relationship[];
  hierarchies: Hierarchy[];
  metadata: ModelMetadata;
}
```

Searchable columns (name, status, revision, publishedAt) remain in relational tables for list views and concurrency control.

## Draft invariants

- Each semantic model has **one active draft**.
- Every save **increments revision**.
- Client must send the revision it loaded; stale revision → **409 Conflict**.
- Draft content is a complete `SemanticModelSnapshot`.

## Version invariants

- Publication requires submitted revision **matches** current draft revision.
- Publication requires **zero validation errors** (warnings may be shown but do not block unless policy changes).
- Published versions are **immutable** — never UPDATE on `ModelVersion`.
- Each publication assigns monotonically increasing `versionNumber` and a content **checksum**.
- Restore from version creates a **new draft**; it does not mutate history.

## ValidationIssue shape

```typescript
interface ValidationIssue {
  id: string;
  ruleId: string;
  category: ValidationCategory;
  severity: 'error' | 'warning' | 'info';
  location: IssueLocation;
  message: string;
  risk: string;
  suggestedFix: string;
  breaking: boolean;
}
```

## Validation categories

| Category | Examples |
|----------|----------|
| STRUCTURE | Missing fact, missing dimension, duplicate names, missing keys |
| SEMANTICS | Monetary without currency, quantity without unit, time without calendar |
| RELATIONSHIP | Ambiguous M:N, missing field ref, circular paths, incompatible keys |
| MEASURE | SUM on non-numeric, self-reference in formula, division by zero risk |
| COMPATIBILITY | Removed published field, type change, formula change, cardinality change |
| GOVERNANCE | Naming policy, required descriptions |
| SECURITY | Unauthorized field exposure in preview |

## Initial rule catalog

### Structure

| ID | Rule |
|----|------|
| MODEL-001 | Model has no fact entity |
| MODEL-002 | Model has no dimension |
| MODEL-003 | Duplicate semantic name |
| MODEL-004 | Entity has no key |

### Relationships

| ID | Rule |
|----|------|
| REL-001 | Ambiguous many-to-many relationship |
| REL-002 | Relationship references a missing field |
| REL-003 | Circular relationship path |
| REL-004 | Incompatible key types |
| REL-005 | Nullable key may produce unmatched records |

### Measures

| ID | Rule |
|----|------|
| MEASURE-001 | SUM used with a non-numeric field |
| MEASURE-002 | AVERAGE used with an incompatible field |
| MEASURE-003 | Calculated measure references itself |
| MEASURE-004 | Calculated measure references a missing measure |
| MEASURE-005 | Division may produce a zero-division result |

### Semantics

| ID | Rule |
|----|------|
| SEM-001 | Monetary measure has no currency field |
| SEM-002 | Quantity has no unit field |
| SEM-003 | Time dimension has no calendar semantics |
| SEM-004 | Aggregation behavior is missing |

### Compatibility

| ID | Rule |
|----|------|
| COMPAT-001 | Published field was removed |
| COMPAT-002 | Published field changed type |
| COMPAT-003 | Measure formula changed |
| COMPAT-004 | Relationship cardinality changed |
| COMPAT-005 | Consumer dependency is no longer valid |

Phase 1 implements a subset (e.g. MODEL-001). Full catalog rolls out in Phase 5.

## ModelChange types (diff engine)

Semantic diff returns typed changes — not JSON patch:

```typescript
type ModelChange =
  | FieldAdded
  | FieldRemoved
  | FieldTypeChanged
  | MeasureFormulaChanged
  | RelationshipCardinalityChanged
  | SemanticTypeChanged
  | DimensionRemoved;
```

Each change includes: type, affected entity, before, after, breaking flag, explanation.

## Audit events

| Event | When |
|-------|------|
| MODEL_CREATED | New semantic model |
| DRAFT_UPDATED | Draft saved |
| VALIDATION_EXECUTED | validateModel action completed |
| PUBLICATION_REJECTED | Publish blocked (errors or stale revision) |
| MODEL_PUBLISHED | Immutable version created |
| VERSION_RESTORED | Draft created from historical version |

Audit log is append-only and distinct from application request logs.

## Dependency graph nodes and edges

**Nodes:** SourceField, Dimension, Measure, CalculatedMeasure, SemanticModel, Consumer

**Edges:** DEPENDS_ON, CONSUMES, REFERENCES, DERIVES_FROM

Impact analysis: given changed node IDs, traverse downstream dependents (BFS with indexed queue).

## Sample dataset (demo)

Bundled sales star schema: Sales, Products, Customers, Regions, Calendar. No arbitrary external connections in the public demo.

## References

- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
- [decisions/0005-hybrid-persistence.md](../decisions/0005-hybrid-persistence.md)
- [decisions/0006-optimistic-concurrency.md](../decisions/0006-optimistic-concurrency.md)
- [decisions/0007-immutable-published-versions.md](../decisions/0007-immutable-published-versions.md)
- [decisions/0008-deterministic-validation-source-of-truth.md](../decisions/0008-deterministic-validation-source-of-truth.md)
