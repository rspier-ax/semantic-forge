# Phase 3 — CAP persistence and service

Implement CAP CDS persistence and OData service for the domain model from Phase 2.

## Expose

- Entity `Models`
- Entity `ModelVersions`
- Entity `ValidationRuns`
- Action `validateModel`
- Action `publishModel`

## Handlers

- Coordinate persistence and transactions.
- Call domain package functions for business rules.
- **Do not duplicate** domain rules in handlers.

## Concurrency

- Optimistic revision check on draft update.
- Return domain-specific **409 Conflict** when revision is stale.

## Tests

- `@cap-js/cds-test` for validate and publish actions.
- Cover success and 409 conflict paths.

## References

- [decisions/0002-cap-nodejs-odata-v4.md](../decisions/0002-cap-nodejs-odata-v4.md)
- [decisions/0005-hybrid-persistence.md](../decisions/0005-hybrid-persistence.md)
- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
