# Implementation prompts

Cursor prompts for each SemanticForge implementation phase. Use in **plan mode** before coding a phase.

## How to use

1. Read [AGENTS.md](../../AGENTS.md) and [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md).
2. Open the prompt for the target phase.
3. Ask Cursor to create an **implementation plan** from the prompt — do not skip planning for large phases.
4. Implement in small commits per [WORKFLOW.md](../WORKFLOW.md).
5. Run tests listed in [engineering-practice.md](../engineering-practice.md).

## Prompt index

| Phase | File | Milestone |
|-------|------|-----------|
| 1 | [phase-01-vertical-slice.md](./phase-01-vertical-slice.md) | M1 |
| 2 | [phase-02-domain-model.md](./phase-02-domain-model.md) | M2 |
| 3 | [phase-03-cap-persistence.md](./phase-03-cap-persistence.md) | M2 |
| 4 | [phase-04-openui5-shell.md](./phase-04-openui5-shell.md) | M2 |
| 5 | [phase-05-validation-engine.md](./phase-05-validation-engine.md) | M2 |
| 6 | [phase-06-version-diff.md](./phase-06-version-diff.md) | M2 |
| 7 | [phase-07-impact-graph.md](./phase-07-impact-graph.md) | M3 |
| 8 | [phase-08-safe-preview.md](./phase-08-safe-preview.md) | M3 |
| 9 | [phase-09-assistant-boundary.md](./phase-09-assistant-boundary.md) | M4 |
| 10 | [phase-10-end-to-end-demo.md](./phase-10-end-to-end-demo.md) | M5 |

## Language

All generated code, comments, UI strings, and documentation must be **English-only**.
