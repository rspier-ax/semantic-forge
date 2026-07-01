# ARCHITECTURE.md — SemanticForge

## Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Language | TypeScript strict | Full-stack typing; role-aligned TS/JS proficiency |
| Runtime | Node.js 24 | CAP 10 minimum; LTS alignment |
| Backend | SAP CAP ^10 for Node.js | CDS modelling, OData V4, actions, local SQLite dev |
| Data | CDS + SQLite (dev) / PostgreSQL (optional) | Relational metadata + JSON snapshots |
| Frontend | OpenUI5 + UI5 CLI ^4.0 | UI5 MVC, XML Views, OData V4 model binding |
| UI5 types | @openui5/types | Official types; not deprecated @types/openui5 |
| OData | V4 | Two-way binding, actions, batch, server-side filter |
| Domain tests | Mocha + Chai | Pure TS packages without framework deps |
| CAP tests | @cap-js/cds-test | Service and action integration |
| UI5 tests | QUnit + OPA5 | Official UI5 unit and integration stack |
| E2E | Cypress | Critical workflow coverage (not Playwright) |
| Optional AI | Ollama + Zod + deterministic fallback | Local-only; trust vs verify (ADR-0009) |

**Excluded:** Playwright, TestCafé, Angular as primary frontend.

## Language

English-only across documentation, UI, code, comments, tests, and API messages. No i18n.

## Problem

Analytical semantic model changes can produce incorrect metrics, ambiguous relationships, and consumer breaks. SemanticForge validates, compares, and governs publication **before** models reach dashboards and APIs.

## Deployment shape

Modular monolith — single deploy unit with explicit module boundaries in code. Validation and preview can be extracted later if scale or isolation requirements emerge (ADR-0003).

```
┌─────────────────────────────────────────────┐
│              OpenUI5 App                     │
│  ODataModel | Editor JSONModel | UI Model   │
└──────────────────────┬──────────────────────┘
                       │ OData V4
┌──────────────────────▼──────────────────────┐
│            CAP Node.js API                   │
│  Catalog | Modeling | Validation | Versioning│
│  Diff | Impact | Preview | Audit | Assistant │
└──────────────────────┬──────────────────────┘
                       │
┌──────────────────────▼──────────────────────┐
│         SQLite / PostgreSQL                  │
│  Metadata | Drafts | Versions | Audit        │
└─────────────────────────────────────────────┘
```

## Repository layout

```
semantic-forge/
├── app/semantic-forge-ui5/     OpenUI5 application
├── db/                         CDS schema and CSV seed data
├── srv/                        CAP services and TypeScript handlers
├── packages/                   Pure TypeScript domain packages
│   ├── domain/
│   ├── validation-engine/
│   ├── diff-engine/
│   ├── impact-graph/
│   ├── query-compiler/
│   ├── assistant/
│   ├── contracts/
│   └── test-fixtures/
├── test/integration/           @cap-js/cds-test
├── test/e2e/                   Cypress
├── docs/
├── scripts/dev.sh
├── AGENTS.md
└── README.md
```

**Boundary:** `packages/*` must not import `@sap/cds` or OpenUI5.

## Backend modules

| Module | Responsibility |
|--------|----------------|
| Catalog | Import schemas; list source entities and fields; sample data source |
| Modeling | Create models; save drafts; revision control; basic invariants |
| Validation | Deterministic rule engine (source of truth — ADR-0008) |
| Versioning | Snapshots, checksums, publish, history, rollback-to-draft |
| Diff | Semantic comparison: draft vs published; version vs version |
| Impact | Dependency graph traversal; affected consumers |
| Preview | Safe query AST → parameterized SQL; row limit; timeout |
| Audit | Append-only business events (not application logs) |
| Assistant | Explain and suggest only; never validate or publish (ADR-0009) |

## OData service contract (conceptual)

```cds
service ModelService {
  entity Models as projection on db.SemanticModels;
  entity Versions as projection on db.ModelVersions;
  entity ValidationRuns as projection on db.ValidationRuns;
  entity AuditEvents as projection on db.AuditEvents;

  action validateModel(modelId: UUID, revision: Integer) returns ValidationResult;
  action publishModel(modelId: UUID, revision: Integer, comment: String) returns PublicationResult;
  action compareVersions(modelId: UUID, fromVersion: Integer, toVersion: Integer) returns many ModelChange;
  action analyzeImpact(modelId: UUID, revision: Integer) returns ImpactResult;
  action generatePreview(modelId: UUID, query: PreviewQuery) returns PreviewResult;
  action restoreVersion(modelId: UUID, versionNumber: Integer) returns DraftResult;
  action explainValidationIssues(runId: UUID) returns AssistantExplanation;
}
```

CRUD for stable entities stays on OData entities. Business operations use **actions** to make validation and publication explicit non-CRUD operations.

## Frontend state ownership

| Model | Owns |
|-------|------|
| ODataModel | Models, Versions, ValidationRuns, AuditEvents, DataSources |
| Editor JSONModel | `EditorState`: modelId, revision, draft snapshot, originalDraft, dirty, saving, validating, publishing, validationIssues |
| UI JSONModel | `UIState`: activePanel, sidePanelOpen, busy, searchQuery, expandedNodeIds |
| ResourceModel / i18n | English labels only |

Backend is the source of truth for persisted data. The editor holds a working copy until save.

## Persistence strategy (ADR-0005)

**Relational tables:** workspaces, data sources, source entities/fields, users, validation runs, issues, dependencies, audit metadata (name, status, revision, timestamps for query).

**JSON documents:** full draft content; immutable published version snapshots.

```typescript
interface SemanticModelSnapshot {
  entities: ModelEntity[];
  dimensions: Dimension[];
  measures: Measure[];
  relationships: Relationship[];
  hierarchies: Hierarchy[];
  metadata: ModelMetadata;
}
```

Rationale: the model is an aggregate loaded whole by the editor; snapshots are immutable; diff works on complete versions.

## Optimistic concurrency (ADR-0006)

Each draft has `revision` incremented on every save. Client sends expected revision; server returns **409 Conflict** if stale. UI shows: "The model was updated by another user. Reload the latest version or compare your local changes." ETags may protect HTTP requests; revision remains explicit in domain and UI.

## Immutable versions (ADR-0007)

Publication creates `versionNumber`, `snapshot`, `checksum`, `publicationComment`, `publishedBy`, `publishedAt`. Published rows are never updated. Rollback creates a **new draft** from a historical snapshot.

## Validation engine

Extensible rules implementing:

```typescript
interface ValidationRule {
  readonly id: string;
  readonly category: ValidationCategory;
  readonly defaultSeverity: ValidationSeverity;
  supports(context: ValidationContext): boolean;
  evaluate(context: ValidationContext): ValidationIssue[];
}
```

Categories: STRUCTURE, SEMANTICS, RELATIONSHIP, MEASURE, COMPATIBILITY, GOVERNANCE, SECURITY.

Publication is blocked when any issue has severity **error**. Warnings may be acknowledged in the publication dialog.

## Diff and impact

Diff returns domain `ModelChange` types (field added/removed, type changed, measure formula changed, cardinality changed, etc.) — not generic JSON patch.

Impact uses a directed dependency graph (BFS/DFS over dependents). See `packages/impact-graph`.

## Preview security (ADR-0010)

Client sends structured `PreviewQuery` (dimensions, measures, filters, limit). Server validates fields against the model, builds internal AST, compiles parameterized SQL, enforces max 100 rows and timeout. No raw SQL from client. Demo uses bundled sales sample only.

## Observability

Structured JSON logs (no paid APM required):

```json
{
  "requestId": "req-123",
  "operation": "validateModel",
  "modelId": "model-42",
  "revision": 18,
  "rulesExecuted": 24,
  "issuesFound": 3,
  "durationMs": 87,
  "outcome": "completed"
}
```

Conceptual metrics: `validation_duration_ms`, `validation_issues_total`, `publication_rejected_total`, `publication_completed_total`, `preview_query_duration_ms`, `assistant_output_invalid_total`.

## Authentication

Local development: CAP mock users. Production path: XSUAA or corporate IdP — out of scope for initial vertical slice.

## Out of scope (initial vertical slice)

- AI assistant (Phase 9)
- Graph canvas visualization (tree/list first)
- Arbitrary database connections
- Microservices or message queues
- Real authentication beyond CAP mock users

## References

- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
- [decisions/](../decisions/)
- [ui5-standards.md](../ui5-standards.md)
- [engineering-practice.md](../engineering-practice.md)
