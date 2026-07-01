# ADR-0005: Hybrid relational and snapshot persistence

Date: 2026-07-01  
Status: accepted

## Context

Semantic models are aggregates edited holistically in the UI. Version history requires immutable full snapshots for diff. Normalizing every entity, measure, and relationship into temporal relational tables would require many joins to reconstruct past versions and complicate the editor load path.

## Decision

Use **hybrid persistence**:

- **Relational tables** for workspaces, data sources, source entities/fields, model headers, validation runs, issues, dependencies, audit metadata, and searchable fields (name, status, revision, timestamps).
- **JSON documents** for complete draft content and immutable published version snapshots (`SemanticModelSnapshot`).

## Alternatives considered

- **Fully normalized model schema** — rejected; expensive version reconstruction and editor load.
- **Document-only store** — rejected; weak querying for lists, audit filters, and relational integrity for dependencies.

## Consequences

+ Editor loads one JSON document per draft or version.
+ Diff engine compares complete snapshots.
+ List views and concurrency use lightweight relational columns.
- JSON schema evolution must be handled carefully (version field in snapshot metadata).
- Database-level constraints on inner snapshot structure are limited.

## References

- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
