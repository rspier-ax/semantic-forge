# ADR-0008: Deterministic validation as source of truth

Date: 2026-07-01  
Status: accepted

## Context

An optional AI assistant may explain validation issues, but non-deterministic suggestions must not override governed publish rules. Publication affects downstream metrics and consumers.

## Decision

The **validation-engine** package is the **sole authority** for whether a model has errors or warnings. Rules are deterministic, versioned, and identified by stable IDs (MODEL-001, REL-001, etc.). **Publication is blocked** when any issue has severity **error**. The assistant may explain issues but cannot create, remove, or reclassify them, mark a model valid, or publish.

## Alternatives considered

- **AI-driven validation** — rejected; non-deterministic; unsuitable for governance.
- **Warnings block publish** — rejected for v1; warnings shown in dialog but errors only block.

## Consequences

+ Testable rules with Mocha; reproducible CI outcomes.
+ Clear trust boundary for AI features (ADR-0009).
- Every new governance rule requires explicit implementation in validation-engine.
- Rule catalog maintenance is ongoing product work.

## References

- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
- [decisions/0009-optional-local-ai-provider.md](./0009-optional-local-ai-provider.md)
