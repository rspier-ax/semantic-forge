# ADR-0004: Pure TypeScript domain packages

Date: 2026-07-01  
Status: accepted

## Context

Validation, diff, impact analysis, and query compilation are core technical differentiators. Embedding this logic in CAP handlers or UI5 controllers couples domain rules to infrastructure and makes fast unit testing harder.

## Decision

Implement domain logic in **`packages/`** as pure TypeScript with **no imports from @sap/cds or OpenUI5**:

- `domain`, `validation-engine`, `diff-engine`, `impact-graph`, `query-compiler`, `assistant`, `contracts`, `test-fixtures`

CAP handlers orchestrate persistence and call these packages. UI5 never imports them directly.

## Alternatives considered

- **All logic in CAP handlers** — rejected; hard to test; blurs layers.
- **Shared npm package published externally** — rejected for demo scope; monorepo packages suffice.

## Consequences

+ Fast Mocha tests without CAP or UI5 bootstrapping.
+ Reusable by CLI, worker, or alternate API later.
+ Clear separation for code review and interviews.
- Requires explicit DTO mapping between CDS entities and domain types.
- Some duplication of type shapes unless `contracts` package is kept strict.

## References

- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
- [engineering-practice.md](../engineering-practice.md)
