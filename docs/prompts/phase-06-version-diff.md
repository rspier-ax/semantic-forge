# Phase 6 — Version diff

Implement semantic diff engine in `packages/diff-engine` between two `SemanticModelSnapshot` instances.

## Output

Return domain `ModelChange` types — **not** generic JSON patch:

- FieldAdded / FieldRemoved / FieldTypeChanged
- MeasureFormulaChanged
- RelationshipCardinalityChanged
- SemanticTypeChanged
- DimensionRemoved

Each change includes: type, affected entity, before, after, **breaking** flag, deterministic **explanation**.

## Exposure

- CAP action `compareVersions(modelId, fromVersion, toVersion)` or compare draft vs published.
- UI: version comparison panel (list of changes with badges for breaking).

## Tests

- Mocha fixtures for representative diffs.
- Edge cases: identical snapshots, empty model, first publication.

## References

- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
