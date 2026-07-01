# Phase 4 — OpenUI5 shell

Implement the OpenUI5 application shell using TypeScript, XML Views, manifest-based configuration, routing, and OData V4 model.

## Create

- Model list route
- Model editor route
- Validation panel (fragment)
- Publication dialog (fragment)

## Models

- **ODataModel** — persisted server state
- **Editor JSONModel** — editable draft (`EditorState`)
- **UI JSONModel** — transient presentation state
- **ResourceModel / i18n** — English labels only

## Controllers

- Thin controllers: coordinate interactions only.
- Domain validation rules live in `packages/validation-engine`, not controllers.
- Use `EditorService` for save, validate, publish commands.

## Tests

- QUnit for formatters/helpers if added.
- OPA5 for open model → navigate panels (when wired).

## References

- [ui5-standards.md](../ui5-standards.md)
- [decisions/0001-openui5-instead-of-angular.md](../decisions/0001-openui5-instead-of-angular.md)
