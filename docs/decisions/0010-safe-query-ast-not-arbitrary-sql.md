# ADR-0010: Safe query AST instead of arbitrary SQL

Date: 2026-07-01  
Status: accepted

## Context

Preview feature lets users see sample query results against a semantic model. Accepting raw SQL from the client enables injection, unauthorized field access, and unbounded scans.

## Decision

Preview accepts only a structured **`PreviewQuery`**: dimensions, measures, filters, limit. The server validates every field against the model, builds an internal **query AST**, compiles **parameterized SQL**, enforces **max 100 rows** and **timeout**, and executes only against **bundled authorized datasets** (sales sample). Reject unsupported operations and never concatenate user input into SQL strings.

## Alternatives considered

- **Client-supplied SQL with sanitization** — rejected; sanitization is error-prone; wrong abstraction.
- **OData $query passthrough** — rejected; insufficient control for demo security story.
- **No preview** — rejected; key portfolio feature for analytical modelling.

## Consequences

+ Clear security narrative for interviews.
+ Query compiler package is testable with Mocha fixtures.
- Not a general-purpose SQL editor; advanced analytics out of scope.
- Each new filter operator requires explicit compiler support.

## References

- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
