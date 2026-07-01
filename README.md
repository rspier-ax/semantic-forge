# SemanticForge

Semantic model workbench for designing, validating, versioning, and publishing analytical models before they reach production consumers.

> **Demonstration project.** Sample data sources, model names, and consumer references are fictional. This is not a production system and is not affiliated with SAP Datasphere or any analytics vendor.

## Problem we solve

Changes to analytical semantic models can produce incorrect metrics, ambiguous relationships, and breaks in downstream dashboards and APIs. SemanticForge identifies those problems **before** publication — through deterministic validation, version comparison, impact analysis, and governed publish workflows.

## Key capabilities (planned)

- **Model editor** — classify entities as fact or dimension; define fields, semantic types, measures, relationships, and calculated measures.
- **Deterministic validation** — extensible rule engine with structured issues (structure, semantics, relationships, measures, compatibility, governance).
- **Versioning** — draft with optimistic concurrency; immutable published versions with checksums and audit trail.
- **Diff and impact** — semantic comparison between draft and published versions; dependency graph for affected consumers.
- **Safe preview** — parameterized query compilation against authorized sample datasets (no arbitrary SQL).
- **Optional assistant** — rule-based explanations by default; local Ollama with Zod-validated structured output when configured.

## Architecture

```
OpenUI5 App (TypeScript, XML Views)
    ODataModel + Editor JSONModel + UI JSONModel
    ↓ OData V4
SAP CAP for Node.js (TypeScript, CDS)
    Catalog | Modeling | Validation | Versioning | Diff | Impact | Preview | Audit | Assistant
    ↓
SQLite (dev) / PostgreSQL (optional)
    Relational metadata + JSON model snapshots
```

Pure TypeScript domain packages (`packages/domain`, `validation-engine`, etc.) stay independent of CAP and UI5.

See [docs/README.md](./docs/README.md) for architecture notes, ADRs, and the implementation roadmap.

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | OpenUI5, TypeScript strict, XML Views, OData V4 model |
| Backend | SAP CAP for Node.js, TypeScript, CDS, OData V4 |
| Database | CDS schema; SQLite (dev); PostgreSQL optional |
| Domain tests | Mocha + Chai |
| UI5 tests | QUnit + OPA5 |
| CAP tests | @cap-js/cds-test |
| E2E | Cypress |

Runtime target: **Node.js 24**. CAP **^10**, UI5 CLI **^4.0** (stable).

## Language

The entire project is **English-only** — documentation, UI, code, comments, tests, and API messages. No i18n.

## Documentation

| Document | Topic |
|----------|--------|
| [docs/README.md](./docs/README.md) | Documentation index |
| [docs/architecture/ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) | System layers and contracts |
| [docs/domain/DOMAIN-MODEL.md](./docs/domain/DOMAIN-MODEL.md) | Domain entities and invariants |
| [docs/decisions/](./docs/decisions/) | Architecture Decision Records |
| [docs/guides/implementation-roadmap.md](./docs/guides/implementation-roadmap.md) | Phases and milestones |
| [AGENTS.md](./AGENTS.md) | Agent and contributor entry point |

Implementation has not started yet. Run instructions will be added when the first vertical slice lands.

## License

MIT — see [LICENSE](./LICENSE).
