# ADR-0007: Immutable published versions

Date: 2026-07-01  
Status: accepted

## Context

Published analytical models are consumed by dashboards and APIs that depend on stable definitions. Mutating a published version would break auditability and consumer trust.

## Decision

**Published versions are immutable.** Publication creates a new `ModelVersion` row with `versionNumber`, full `snapshot`, `checksum`, `publicationComment`, `publishedBy`, and `publishedAt`. Never UPDATE or DELETE published version content. **Rollback** creates a new draft copied from a historical snapshot — it does not alter published history.

## Alternatives considered

- **Mutable published versions with history table** — rejected; harder for consumers to pin to a version; complicates diff narrative.
- **Delete and republish same version number** — rejected; breaks audit and consumer references.

## Consequences

+ Strong audit story and compatibility checks against known snapshots.
+ Consumers can reference `versionNumber` safely.
- Storage grows with each publication (acceptable for demo; archive policy for production).
- Fixing a published mistake requires a new version, not an edit.

## References

- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
- [decisions/0005-hybrid-persistence.md](./0005-hybrid-persistence.md)
