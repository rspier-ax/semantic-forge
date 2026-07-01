# Implementation roadmap

Phases and milestones for SemanticForge. Each phase should land as **2–5 focused commits**, not one monolithic PR. Use the matching prompt in [`docs/prompts/`](../prompts/) when planning implementation with Cursor.

## Milestones

| Milestone | Goal | Phases |
|-----------|------|--------|
| **M1** | First functional demo | Phase 1 |
| **M2** | Real technical depth | Phases 2–6 |
| **M3** | Differentiation | Phases 7–8 |
| **M4** | AI boundary | Phase 9 |
| **M5** | Quality and polish | Phase 10 |

---

## Phase 1 — Architecture skeleton / vertical slice

**Done when:**

- OpenUI5 lists semantic models
- CAP serves OData V4
- Draft editable (name at minimum)
- Optimistic revision on save
- One deterministic validation rule (e.g. MODEL-001)
- Publish immutable version
- Version history visible

**Prompt:** [phase-01-vertical-slice.md](../prompts/phase-01-vertical-slice.md)

---

## Phase 2 — Domain model

Pure TypeScript packages: SemanticModel, ModelDraft, ModelVersion, ValidationIssue, PublicationResult. Invariants with Mocha tests (revision, immutability, publish guards).

**Prompt:** [phase-02-domain-model.md](../prompts/phase-02-domain-model.md)

---

## Phase 3 — CAP persistence and service

CDS schema, ModelService, validateModel and publishModel actions, optimistic 409, handlers call domain — no duplicated rules.

**Prompt:** [phase-03-cap-persistence.md](../prompts/phase-03-cap-persistence.md)

---

## Phase 4 — OpenUI5 shell

Routes, three-model state, validation panel, publication dialog, thin controllers.

**Prompt:** [phase-04-openui5-shell.md](../prompts/phase-04-openui5-shell.md)

---

## Phase 5 — Validation engine

Extensible rules; initial set: no fact entity, no key, SUM on non-numeric, monetary without currency, missing relationship field, ambiguous M:N.

**Prompt:** [phase-05-validation-engine.md](../prompts/phase-05-validation-engine.md)

---

## Phase 6 — Version diff

Semantic diff between snapshots; ModelChange types with breaking flag and explanation.

**Prompt:** [phase-06-version-diff.md](../prompts/phase-06-version-diff.md)

---

## Phase 7 — Impact graph

Pure TS dependency graph; BFS downstream traversal; cycle detection; Mocha tests.

**Prompt:** [phase-07-impact-graph.md](../prompts/phase-07-impact-graph.md)

---

## Phase 8 — Safe preview

PreviewQuery → AST → parameterized SQL; 100 row limit; sample sales dataset only.

**Prompt:** [phase-08-safe-preview.md](../prompts/phase-08-safe-preview.md)

---

## Phase 9 — Assistant boundary

Deterministic, Ollama, Stub providers; Zod validation; fallback; trust panel; no publish authority.

**Prompt:** [phase-09-assistant-boundary.md](../prompts/phase-09-assistant-boundary.md)

---

## Phase 10 — End-to-end demo and quality

Full demo scenario; Cypress critical path; QUnit/OPA5 coverage; CI; accessibility pass.

**Prompt:** [phase-10-end-to-end-demo.md](../prompts/phase-10-end-to-end-demo.md)

---

## Suggested commit rhythm (per phase)

```
chore: scaffold / config
feat(domain): ...
feat(cap): ...
feat(ui5): ...
test: ...
docs: update only if boundaries changed
```

Branch format: `rspier/<type>/<short-description>` — see [WORKFLOW.md](../WORKFLOW.md).

## References

- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
- [decisions/](../decisions/)
