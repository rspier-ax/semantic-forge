# OpenUI5 standards

## Layout and viewport

- **Minimum viewport:** 768px for the workbench layout.
- **Shell:** model list, three-pane editor (tree | detail | properties), side panels for validation, versions, and impact.
- **English UI copy only** — all labels, messages, and dialogs in English. No i18n files beyond a single default bundle if needed.

## Component ownership

- **`view/`** — XML views and fragments; declarative layout only.
- **`controller/`** — thin controllers; route params and view event wiring.
- **`service/`** — `EditorService`, OData coordination, commands; no domain validation rules.
- **`formatter/`** — display formatting; unit-test with QUnit.
- **`model/`** — model factories and helpers for ODataModel / JSONModel setup.

Keep controllers under ~150 lines. Split when a file owns more than one concern.

## State management

| State type | Where |
|------------|-------|
| Persisted entities | OData V4 model (`Models`, `Versions`, `ValidationRuns`, `AuditEvents`) |
| Draft under edit | Editor JSONModel (`EditorState`) |
| Transient UI | UI JSONModel (`UIState`: active panel, busy, search, expanded nodes) |
| Static labels | `i18n/` bundle (English only, single locale) |

Do not put domain validation or impact analysis in controllers. Do not use `fetch()` for CRUD that ODataModel supports.

## Controller flow

```
View event
    ↓
Controller
    ↓
EditorService / command
    ↓
Domain function or OData action
    ↓
Update model
```

## Accessibility

- Semantic HTML where UI5 controls allow: proper `aria` labels on tables, trees, and dialogs.
- Visible `:focus-visible` outlines on interactive controls.
- `aria-live="polite"` on validation results and publish status updates.
- Error messages associated with the affected field or section.

## Loading, empty, error

Every data-bound section must handle:

- **Loading** — busy indicator or skeleton with accessible label.
- **Empty** — contextual message (e.g. "No models yet" with create action).
- **Error** — message + retry when recoverable; show revision conflict (409) with reload guidance.

## Testing

| Change | Minimum |
|--------|---------|
| Formatter / model helper | QUnit |
| Controller logic (non-domain) | QUnit |
| Navigation, binding, panel switch | OPA5 |
| Critical workflow (create → validate → publish) | Cypress |

Run UI5 unit tests before PR. OPA5 for flows that touch routing and OData binding.

## PR checklist

- [ ] No domain rules in controllers
- [ ] ODataModel for persisted state; Editor JSONModel for draft
- [ ] Loading / empty / error states
- [ ] English-only UI strings
- [ ] Tests for changed behavior at the appropriate layer
- [ ] ADR if architectural boundary shifts

## References

- [architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md) — state ownership
- [engineering-practice.md](./engineering-practice.md) — implementation order
- [decisions/0001-openui5-instead-of-angular.md](./decisions/0001-openui5-instead-of-angular.md)
