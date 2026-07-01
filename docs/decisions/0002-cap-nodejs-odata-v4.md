# ADR-0002: CAP Node.js and OData V4

Date: 2026-07-01  
Status: accepted

## Context

The frontend needs a backend that exposes OData V4 with actions, batch, and two-way binding support. The role requires Node.js backend experience and data modelling. SAP CAP provides CDS for schema definition, associations, and service generation with natural OpenUI5 integration.

## Decision

Use **SAP Cloud Application Programming Model (CAP) for Node.js** with **TypeScript** handlers, **CDS** persistence model, and **OData V4** service exposure. Local development uses SQLite via @cap-js/sqlite; PostgreSQL is optional for production-like environments.

## Alternatives considered

- **Express/Fastify + manual OData** — rejected; high effort to implement OData V4 correctly.
- **GraphQL API** — rejected; OpenUI5 OData V4 model is the intended integration path.
- **Java CAP** — rejected; role and author stack align with Node.js.

## Consequences

+ Native OData V4 actions for validateModel, publishModel, etc.
+ CDS documents data model for portfolio and interviews.
+ Runs locally without SAP BTP using SQLite and mock users.
- CAP learning curve and code generation conventions.
- Ties demo backend to SAP ecosystem patterns (acceptable for target role).

## References

- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
