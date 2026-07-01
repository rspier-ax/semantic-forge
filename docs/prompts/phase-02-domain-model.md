# Phase 2 — Domain model

Implement the initial domain model without importing SAP CAP or OpenUI5 into the domain package.

## Create

- `SemanticModel`
- `ModelDraft`
- `ModelVersion`
- `ValidationIssue`
- `PublicationResult`

Location: `packages/domain` and shared types in `packages/contracts`.

## Enforce invariants

- Revisions must increase on each save.
- Published versions are immutable.
- Publication requires submitted revision to match current revision.
- Validation errors block publication.

## Tests

Add **Mocha + Chai** unit tests for every invariant.

## Rules

- No `@sap/cds` or UI5 imports in `packages/domain`.
- CAP handlers will call these functions later — do not duplicate logic in srv.

## References

- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
- [decisions/0004-pure-typescript-domain-packages.md](../decisions/0004-pure-typescript-domain-packages.md)
- [decisions/0006-optimistic-concurrency.md](../decisions/0006-optimistic-concurrency.md)
- [decisions/0007-immutable-published-versions.md](../decisions/0007-immutable-published-versions.md)
