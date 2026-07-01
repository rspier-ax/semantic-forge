# Phase 9 — Assistant boundary

Implement `packages/assistant` with three providers.

## Providers

1. **DeterministicAssistantProvider** — default; template explanations from rule metadata
2. **OllamaAssistantProvider** — optional local; structured JSON + Zod validation
3. **StubAssistantProvider** — predictable output for tests

## Assistant may

- Explain validation issues
- Suggest descriptions and formula drafts
- Summarize changes
- Draft review comments

## Assistant may not

- Create or change validation issues
- Change severity
- Mark model as valid
- Publish
- Execute queries
- Auto-create relationships without confirmation

## Validation

```typescript
const assistantOutputSchema = z.object({
  summary: z.string(),
  explanations: z.array(z.object({
    issueId: z.string(),
    explanation: z.string(),
    suggestedFix: z.string(),
    confidence: z.number().min(0).max(1),
  })),
});
```

Fallback to DeterministicAssistantProvider when Ollama unavailable or output invalid.

## Persist

Provider, model name, prompt version, schema validation result, duration — **not** full prompt by default.

## UI trust panel

Show: provider, prompt version, schema valid, issue IDs valid, deterministic rules unchanged, human approval required.

## References

- [decisions/0009-optional-local-ai-provider.md](../decisions/0009-optional-local-ai-provider.md)
- [decisions/0008-deterministic-validation-source-of-truth.md](../decisions/0008-deterministic-validation-source-of-truth.md)
