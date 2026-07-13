# SemanticForge

OpenUI5 + SAP CAP demo for editing, validating, and publishing analytical semantic models.

Sample data only (bundled sales dataset). Not a production system.

## Status

**Phase 1 vertical slice** is working:

- List semantic models (OData V4)
- Open a model, edit the name, save with optimistic revision
- Run deterministic validation (MODEL-001)
- Publish an immutable version
- View version history and audit events

Roadmap for later phases: [docs/guides/implementation-roadmap.md](./docs/guides/implementation-roadmap.md).

## Stack

| Layer | Choice |
|-------|--------|
| Frontend | OpenUI5, TypeScript, XML Views, OData V4 |
| Backend | SAP CAP for Node.js, TypeScript, CDS |
| Database | SQLite (dev); PostgreSQL optional |
| Domain | Pure TypeScript packages (`packages/*`) |

Node.js **22+** (24 recommended). CAP **^9.9**, UI5 CLI **^4.0**.

## Run locally

```bash
npm install
npm run dev
```

When the server is up, open:

**http://localhost:4004/semantic-forge-ui5/dist/index.html**

Use `dist`, not `webapp` — the built app includes OpenUI5 and compiled TypeScript.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run build:packages` | Compile pure TypeScript domain packages |
| `npm run test:domain` | Domain and validation-engine tests |
| `npm run test:integration` | CAP integration tests |
| `npm test` | Full test suite |
| `npm run watch` | CAP only on port 4004 |
| `./scripts/dev.sh` | CAP + UI5 in parallel |

Seed data: **Sales Analytics** (valid, published v1) and **Incomplete Draft** (MODEL-001 demo).

## Language

English-only — documentation, UI, code, comments, tests, and API messages.

## Documentation

| Document | Topic |
|----------|--------|
| [docs/README.md](./docs/README.md) | Documentation index |
| [docs/architecture/ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) | System layers and contracts |
| [docs/domain/DOMAIN-MODEL.md](./docs/domain/DOMAIN-MODEL.md) | Domain entities and invariants |
| [docs/decisions/](./docs/decisions/) | Architecture Decision Records |
| [docs/guides/implementation-roadmap.md](./docs/guides/implementation-roadmap.md) | Phases and milestones |
| [AGENTS.md](./AGENTS.md) | Agent and contributor entry point |

## License

MIT — see [LICENSE](./LICENSE).
