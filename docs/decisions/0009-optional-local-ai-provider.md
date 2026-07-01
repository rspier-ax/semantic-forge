# ADR-0009: Optional local AI provider

Date: 2026-07-01  
Status: accepted

## Context

The target role values AI coding assistants and the ability to write prompts, validate structured output, and know when to trust vs verify. SemanticForge must run fully without paid AI APIs. An optional local assistant can demonstrate these skills without compromising validation authority (ADR-0008).

## Decision

Implement **`packages/assistant`** with three providers:

1. **DeterministicAssistantProvider** (default in public demo) — template-based explanations from rule metadata; presented as "Rule-based explanation", not AI.
2. **OllamaAssistantProvider** (optional local) — structured prompt → JSON → **Zod** validation → cross-check against deterministic rules → human review required.
3. **StubAssistantProvider** — predictable responses for tests.

The assistant may: explain issues, suggest descriptions, propose formula drafts, summarize changes, draft review comments.

The assistant may **not**: change severity, mark valid, publish, execute SQL, or auto-create relationships without user confirmation.

Persist execution metadata: provider, model name, prompt version, schema validation result, duration. Do **not** persist full prompts by default.

UI shows trust panel: provider, prompt version, schema valid, referenced issue IDs valid, deterministic rules unchanged, human approval required.

## Alternatives considered

- **OpenAI / paid API** — rejected for public demo cost and key management.
- **No assistant at all** — rejected; misses portfolio signal for prompt engineering.
- **AI overrides validation** — rejected; violates ADR-0008.

## Consequences

+ Demonstrates prompt design, Zod, fallback, and trust UX.
+ App works completely without Ollama installed.
- Local Ollama setup is optional friction for evaluators.
- Output quality varies by local model; deterministic fallback required.

## References

- [decisions/0008-deterministic-validation-source-of-truth.md](./0008-deterministic-validation-source-of-truth.md)
- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
