# Phase 10 — End-to-end demo and quality

Build the complete demo scenario and harden quality gates.

## Demo scenario

Using bundled sales dataset:

1. Open a valid published model
2. Remove currency field from Revenue context
3. Change one relationship to many-to-many
4. Modify a calculated measure
5. Run validation — show deterministic issues
6. Show semantic version diff
7. Show affected downstream consumers
8. Explain issues via configured assistant provider
9. Fix problems
10. Publish new immutable version
11. Display audit history

See [demo-guide.md](../guides/demo-guide.md).

## Cypress

One critical-path spec covering the workflow above. Avoid testing implementation details; use stable selectors.

## Additional quality

- QUnit / OPA5 coverage for UI5 layers touched
- Mocha coverage for domain packages
- CI workflow: cds build, domain tests, UI5 lint/build, Cypress
- Accessibility pass on main workbench views
- Performance sanity: validation completes in reasonable time on sample model

## Documentation

Update README with Run locally section and CI badge when CI lands.

## References

- [guides/demo-guide.md](../guides/demo-guide.md)
- [engineering-practice.md](../engineering-practice.md)
- [ui5-standards.md](../ui5-standards.md)
