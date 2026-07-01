# ADR-0003: Modular monolith instead of microservices

Date: 2026-07-01  
Status: accepted

## Context

SemanticForge has multiple bounded areas (validation, diff, impact, preview, audit) that could become separate services. Domain boundaries are still evolving; premature distribution adds operational cost without demonstrated scale requirements.

## Decision

Deploy as a **modular monolith**: one CAP application with explicit module boundaries in code (Catalog, Modeling, Validation, Versioning, Diff, Impact, Preview, Audit, Assistant). Validation and Preview expose clear interfaces so they can be extracted later if independent scaling, async execution, or failure isolation is required.

## Alternatives considered

- **Microservices from day one** — rejected; no proven need; slows initial delivery.
- **Single flat srv folder without modules** — rejected; hides boundaries and makes future extraction harder.

## Consequences

+ Simple local dev and deployment story.
+ Clear interview narrative: "boundaries exist; distribution deferred until requirements justify it."
+ Shared database transactions for publish + audit remain straightforward.
- All modules share process and database connection limits until split.

## References

- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
