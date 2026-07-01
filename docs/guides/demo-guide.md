# Demo guide

Step-by-step walkthrough for the SemanticForge end-to-end demo scenario. **This guide is a skeleton** — steps will be verified once the application is implemented (Milestone 4).

## Prerequisites (future)

- Node.js 24
- `./scripts/dev.sh` running CAP + OpenUI5
- Browser viewport ≥ 768px

## Scenario: Sales model change review

Uses the bundled sample dataset: Sales, Products, Customers, Regions, Calendar.

### Steps

1. **Open published model** — Navigate to model list; open "Sales Analytics" (or seeded equivalent).
2. **Introduce breaking changes**
   - Remove the currency field from Revenue measure context.
   - Change one relationship to many-to-many (ambiguous).
   - Modify a calculated measure formula (e.g. Gross Margin).
3. **Save draft** — Confirm revision increments.
4. **Run validation** — Open validation panel; review deterministic issues (SEM-001, REL-001, MEASURE-*, COMPAT-* as applicable).
5. **Compare versions** — View semantic diff: draft vs published version 3.
6. **Analyze impact** — Review dependency tree/list; see affected consumers (e.g. Executive Dashboard).
7. **Explain issues** — Use configured assistant provider; verify trust panel (provider, schema valid, human approval).
8. **Fix issues** — Restore currency field, fix relationship cardinality, correct formula.
9. **Re-validate** — Confirm zero errors.
10. **Publish** — Add publication comment; create immutable version 4.
11. **Audit history** — Confirm MODEL_PUBLISHED, VALIDATION_EXECUTED, DRAFT_UPDATED events.

## Cypress coverage (future)

One Cypress spec covers this path without asserting implementation details (selectors on stable `data-testid` or accessible labels).

## Dev controls (future)

Optional panel for: reset demo data, simulate stale revision (409), toggle assistant provider (Deterministic vs Ollama).

## References

- [implementation-roadmap.md](./implementation-roadmap.md)
- [prompts/phase-10-end-to-end-demo.md](../prompts/phase-10-end-to-end-demo.md)
