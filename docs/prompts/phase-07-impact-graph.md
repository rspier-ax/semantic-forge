# Phase 7 — Impact graph

Implement dependency graph in `packages/impact-graph` as pure TypeScript.

## Capabilities

- Add nodes and directed dependency edges
- `getDependents(nodeId)` — direct dependents
- `findAffectedNodes(changedNodeIds)` — all downstream via BFS (indexed queue, not repeated `shift()`)
- Cycle detection
- Deterministic ordering of results

## Node types

SourceField, Dimension, Measure, CalculatedMeasure, SemanticModel, Consumer

## Edge types

DEPENDS_ON, CONSUMES, REFERENCES, DERIVES_FROM

## Exposure

- CAP action `analyzeImpact(modelId, revision)`
- UI: hierarchical tree or list with severity badges (no canvas required in v1)

## Tests

Mocha tests for: cycles, disconnected nodes, multiple roots, duplicate edges, single change propagation.

## References

- [domain/DOMAIN-MODEL.md](../domain/DOMAIN-MODEL.md)
- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
