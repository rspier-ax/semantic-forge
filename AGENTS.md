# SemanticForge

Read **`docs/README.md`** for architecture, standards, and ADRs.

## Product

Demo workbench for creating, validating, versioning, and publishing analytical semantic models. Bundled sales sample dataset only — no arbitrary database connections.

Planned workflow: create workspace → import schema → model facts/dimensions/measures → save draft → validate → compare with published version → analyze impact → publish immutable version → review audit history.

## Language policy

**English-only everywhere** — documentation, UI labels, code, comments, tests, commit messages, API payloads. No i18n, no translation files, no locale switching.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | OpenUI5, TypeScript strict, XML Views, OData V4 model, JSONModel |
| Backend | SAP CAP for Node.js, TypeScript, CDS, OData V4 |
| Database | CDS; SQLite (dev); PostgreSQL optional |
| Domain | Pure TypeScript packages (Mocha + Chai) |
| UI5 tests | QUnit + OPA5 |
| CAP tests | @cap-js/cds-test |
| E2E | Cypress |

Node.js **22+** (24 recommended). CAP **^9.9**. UI5 CLI **^4.0** (stable). Types: **@openui5/types**.

## Planned structure

```
app/semantic-forge-ui5/webapp/   controllers, views, fragments, services
db/                              CDS schema and seed data
srv/                             CAP services and handlers
packages/                        Pure TS domain (no CAP/UI5 imports)
  domain/ validation-engine/ diff-engine/ impact-graph/
  query-compiler/ assistant/ contracts/ test-fixtures/
test/integration/                @cap-js/cds-test
test/e2e/                        Cypress
docs/                            Architecture, ADRs, guides, prompts
```

## Domain boundaries

**`packages/*`** — pure TypeScript. Must not import `@sap/cds`, OpenUI5, or UI5 types. Domain rules and validation logic live here.

**CAP handlers (`srv/`)** — persistence, transactions, OData exposure, orchestration. Call domain packages; do not duplicate domain rules.

**OpenUI5 controllers** — thin. View events → controller → `EditorService` / command → OData action or model update. No cardinality, compatibility, or impact logic in controllers.

**State ownership:**
- **ODataModel** — persisted server state (Models, Versions, ValidationRuns, AuditEvents).
- **Editor JSONModel** — draft under edit (`EditorState`: revision, snapshot, dirty flag).
- **UI JSONModel** — transient presentation (active panel, busy, search, expanded nodes).

Do not merge persisted and dirty draft state into a single model.

**Assistant (`packages/assistant`)** — explains and suggests only. Cannot validate, change severity, mark valid, publish, or execute SQL. See ADR-0009.

## Quality expectations

- Loading, empty, and error states on every data-bound UI section.
- Published versions are immutable; audit log is append-only in the UI.
- Contract or domain invariant changes need tests at the appropriate layer.
- Architectural shifts need a new ADR in `docs/decisions/` (never edit published ADRs).
- Read existing code before adding services, handlers, or controllers.

## Validation

```bash
npm install
npm run build:packages
npx cds deploy --to sqlite

npm run test:domain
npm run test:integration
npm test
npx cds build
npm run build --workspace=@semantic-forge/ui5

./scripts/dev.sh
```

E2E (Cypress) is planned for Phase 10.

## Further reading

| Document | Topic |
|----------|--------|
| [docs/architecture/ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) | Layers, OData, modules, observability |
| [docs/domain/DOMAIN-MODEL.md](./docs/domain/DOMAIN-MODEL.md) | Entities, snapshots, invariants |
| [docs/ui5-standards.md](./docs/ui5-standards.md) | Controllers, models, testing, PR checklist |
| [docs/engineering-practice.md](./docs/engineering-practice.md) | Implementation order and review bar |
| [docs/WORKFLOW.md](./docs/WORKFLOW.md) | Branches and PRs |
| [docs/guides/implementation-roadmap.md](./docs/guides/implementation-roadmap.md) | Phases 1–10 and milestones |
| [docs/prompts/](./docs/prompts/) | Cursor implementation prompts per phase |
| [docs/decisions/](./docs/decisions/) | ADRs |
