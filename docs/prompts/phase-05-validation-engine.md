# Phase 5 — Validation engine

Implement an extensible deterministic validation engine in `packages/validation-engine`.

## Rule interface

Each rule must:

- Have a stable ID (e.g. MODEL-001)
- Declare a category and default severity
- Implement `supports(context)` and `evaluate(context)`
- Return zero or more structured `ValidationIssue` objects

## Initial rules

Implement at minimum:

| ID | Rule |
|----|------|
| MODEL-001 | Model has no fact entity |
| MODEL-004 | Entity has no key |
| MEASURE-001 | SUM used with a non-numeric field |
| SEM-001 | Monetary measure has no currency field |
| REL-002 | Relationship references a missing field |
| REL-001 | Ambiguous many-to-many relationship |

## Tests

- Mocha unit test per rule (pass and fail cases).
- One CAP integration test invoking `validateModel` with a model that triggers multiple rules.

## Authority

Validation engine is source of truth (ADR-0008). Assistant cannot override results.

## References

- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
- [decisions/0008-deterministic-validation-source-of-truth.md](../decisions/0008-deterministic-validation-source-of-truth.md)
