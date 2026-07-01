# Phase 8 — Safe preview

Implement safe analytical preview in `packages/query-compiler` and CAP Preview module.

## Client request

```typescript
interface PreviewQuery {
  dimensions: string[];
  measures: string[];
  filters: PreviewFilter[];
  limit: number;
}
```

## Server flow

1. Validate every field against the model
2. Build internal query AST
3. Compile parameterized SQL only
4. Enforce max **100 rows** and **timeout**
5. Execute against **bundled sales sample** only
6. Return rows + SQL explanation (for display, not execution by client)

## Reject

- Raw SQL strings from client
- Unsupported filter operators
- Fields not in model
- Arbitrary database connections

## Tests

- Mocha: compiler output, injection attempts rejected, limit enforced
- Integration: sample query returns expected row count

## References

- [decisions/0010-safe-query-ast-not-arbitrary-sql.md](../decisions/0010-safe-query-ast-not-arbitrary-sql.md)
- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
