# ADR-0006: Optimistic concurrency

Date: 2026-07-01  
Status: accepted

## Context

Multiple users may edit the same model draft. Last-write-wins silently loses changes. SemanticForge needs predictable conflict detection aligned with collaborative editing expectations.

## Decision

Each draft carries a monotonic **revision** integer incremented on every successful save. Clients send the revision they loaded. If the server revision is ahead, respond with **409 Conflict** and a domain-specific error body. The UI displays: "The model was updated by another user. Reload the latest version or compare your local changes."

HTTP **ETags** may additionally protect PATCH requests; revision remains visible in the UI and audit history as the primary domain concept.

## Alternatives considered

- **Pessimistic locking** — rejected; poor UX for a demo workbench; operational complexity.
- **Last-write-wins** — rejected; silent data loss.
- **CRDT / real-time co-editing** — rejected; out of scope for v1.

## Consequences

+ Clear conflict UX and audit trail of revision numbers.
+ Publish action also validates revision matches current draft.
- Clients must handle 409 and merge or discard local changes.
- Offline editing not supported without additional sync design.

## References

- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
