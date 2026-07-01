# ADR-0001: OpenUI5 instead of Angular

Date: 2026-07-01  
Status: accepted

## Context

SemanticForge targets a role requiring UI5 frontend experience. Angular is familiar from prior portfolio work but does not demonstrate OpenUI5 MVC, XML Views, OData V4 model binding, controllers, and lifecycle patterns used in SAP product teams.

Using only UI5 Web Components inside Angular would show SAP visual elements without the full UI5 framework integration the role expects.

## Decision

Build the primary frontend with **OpenUI5**, **TypeScript**, and **XML Views**, using **OData V4 model** binding against CAP services. Angular may appear later only as a small separate consumer app to prove a published model can be consumed elsewhere — not as the main workbench.

## Alternatives considered

- **Angular as primary frontend** — rejected; does not close the UI5 learning gap for this portfolio piece.
- **UI5 Web Components inside Angular** — rejected; skips MVC, models, bindings, routing, and controllers.
- **React or Vue** — rejected; role explicitly accepts similar controller-based frameworks but UI5 is the target stack.

## Consequences

+ Demonstrates UI5, OData V4, and SAP-aligned architecture for interviews.
+ Requires UI5 tooling (@ui5/cli) and QUnit/OPA5 test stack.
- Steeper local dev setup than a SPA framework the author already knows.
- Smaller hiring pool documentation compared to Angular — mitigated by official UI5 docs.

## References

- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
- [ui5-standards.md](../ui5-standards.md)
