# Phase 1 — Vertical slice

Read the project architecture documents and create an implementation plan for the first vertical slice.

## Goal

The vertical slice must support:

- Listing semantic models
- Opening a model
- Editing its name
- Saving with optimistic revision control
- Executing one deterministic validation rule
- Publishing an immutable version

## Stack

- OpenUI5 with TypeScript and XML Views
- SAP CAP for Node.js
- CDS and OData V4
- SQLite for local development
- Pure TypeScript domain packages

## Out of scope

- AI assistant
- Graph visualization
- Arbitrary database connections
- Queues or microservices
- Authentication beyond CAP mock users

## Before changing code, identify

- Files to create
- Domain boundaries
- OData entities and actions
- State ownership (ODataModel vs Editor JSONModel vs UI JSONModel)
- Tests required (Mocha, @cap-js/cds-test, QUnit/OPA5 as applicable)

## Acceptance criteria

1. `scripts/dev.sh` starts CAP and UI5; model list loads seeded data.
2. User opens a model, changes name, saves — revision increments.
3. Stale save returns 409; UI shows reload guidance.
4. `validateModel` returns MODEL-001 when no fact entity exists.
5. Publish blocked on errors; succeeds when clean; new ModelVersion row.
6. Version history visible on editor.
7. Audit events: DRAFT_UPDATED, VALIDATION_EXECUTED, MODEL_PUBLISHED.

## References

- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
- [decisions/](../decisions/)
