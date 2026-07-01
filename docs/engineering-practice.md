# Engineering practice

How we implement and review changes on SemanticForge.

## Implementation order

1. Domain types and invariants (`packages/domain`, `packages/contracts`)
2. Validation / diff / impact logic in pure TS packages with Mocha tests
3. CDS schema and CAP handlers (`db/`, `srv/`)
4. OData actions wired to domain functions
5. OpenUI5 routes, models, views, and thin controllers
6. Tests at the layer that changed

Prefer extending existing files over parallel implementations.

## Before proposing changes

State explicitly:

- What exists today in the relevant area
- What will be reused vs added
- Which files will change

Do not add a new service, handler, or controller if an equivalent already covers the use case.

## Review standards

Changes that typically require revision:

- Domain rules duplicated in CAP handlers or UI5 controllers
- `fetch()` for persisted state instead of OData V4 model binding
- Missing loading, empty, or error states on new data-bound UI
- OData or schema changes without tests or ADR when architectural
- Non-English user-facing strings
- Raw SQL accepted from the client (preview must use controlled AST only)

## Manual verification

After substantive UI or workflow changes:

```bash
npm run test:domain
cds build && npm run test:integration
cd app/semantic-forge-ui5 && npm run lint && npm run test
```

Smoke the analyst path in the browser when applicable.

## Tests expected by change type

| Change | Minimum |
|--------|---------|
| Domain invariant / validation rule | Mocha + Chai unit test |
| CAP action or handler | @cap-js/cds-test integration test |
| UI5 formatter or helper | QUnit unit test |
| Navigation / binding / panel flow | OPA5 integration test |
| Critical publish workflow | Cypress E2E |

## Security and data

- Demo uses fictional identities and sample sales data only.
- No API keys in the repo; Ollama is optional and local-only.
- Do not log full model snapshots in production code paths.
- Preview queries: parameterized compilation only; never execute client-supplied SQL.

## Documentation

Update living docs (`architecture/ARCHITECTURE.md`, `ui5-standards.md`, `domain/DOMAIN-MODEL.md`) only when behavior or boundaries change. Task-specific UX belongs in the issue or PR description, not in AGENTS.md.

## Language

All code, comments, tests, and UI strings are English. No i18n infrastructure.
