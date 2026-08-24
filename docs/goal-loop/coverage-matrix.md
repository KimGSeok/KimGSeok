# Foundation, Core, and Extended Coverage

This matrix is the release index for the approved static scope. `T/S/M` means
public catalogue presence in Toss TDS, Daangn SEED, and Wanted Montage. It
records catalogue presence only: public Toss guidance remains the sole
component-behaviour authority. `None` is an explicit public-Toss gap; SEED or
Montage behaviour is not substituted.

All shared rows have Web Storybook evidence and a React Native Expo specimen.
`Table` is intentionally Web-only. Device and screen-reader runtime evidence is
the user-owned deferred release follow-up recorded in `done-when.md`.

| # | Family | Class | T/S/M | Toss translation or approved gap | Static evidence |
| ---: | --- | --- | --- | --- | --- |
| 1 | Typography | Foundation | foundation/foundation/foundation | finite semantic roles and responsive hierarchy | `p0-primitives.md`; tokens; Storybook/Expo |
| 2 | Colour and themes | Foundation | foundation/foundation/foundation | public palette behind semantic light/dark tokens | `p0-primitives.md`; tokens; Storybook/Expo |
| 3 | Spacing/radius/elevation/motion/focus/touch | Foundation | foundation/foundation/foundation | semantic foundations, reduced motion, 44px targets | `p0-primitives.md`; tokens; Storybook/Expo |
| 4 | Button | Core | yes/yes/yes | action hierarchy, loading/disabled, guarded async action | `button.md`; button package; Storybook/Expo |
| 5 | IconButton | Extended | yes/yes/yes | icon-only action with mandatory accessible name | `p0-primitives.md`; primitives; Storybook/Expo |
| 6 | Text / Heading | Foundation | foundation/foundation/foundation | finite roles rather than arbitrary font values | `p0-primitives.md`; primitives; Storybook/Expo |
| 7 | Icon | Foundation | foundation/foundation/foundation | original finite registry; no copied assets | `p0-primitives.md`; icons; Storybook/Expo |
| 8 | TextField | Core | yes/yes/yes | visible label and associated help/error state | `forms.md`; forms; Storybook/Expo |
| 9 | TextArea | Core | yes/yes/yes | multiline field under the same field contract | `forms.md`; forms; Storybook/Expo |
| 10 | Checkbox | Core | yes/yes/yes | independent boolean choice and disabled state | `forms.md`; forms; Storybook/Expo |
| 11 | Radio / RadioGroup | Extended | yes/yes/yes | one choice in a visible labelled set | `forms.md`; forms; Storybook/Expo |
| 12 | Switch | Core | yes/yes/yes | immediate setting semantics | `forms.md`; forms; Storybook/Expo |
| 13 | Slider | Core | yes/yes/yes | bounded step value, labels, keyboard/a11y adjustment | `slider.md`; forms; Storybook/Expo |
| 14 | Select / native picker contract | Extended | yes/yes/yes | compact choice; product injects native sheet view | `forms.md`; forms; Storybook/Expo |
| 15 | FormField / Label / HelpText / ErrorMessage | Extended | yes/yes/yes | field-owned anatomy prevents detached or placeholder-only labels | `forms.md`; TextField/TextArea/Select/DateTime; Storybook/Expo |
| 16 | Spinner / Progress | Extended | yes/yes/yes | quiet named progress, determinate/indeterminate states | `spinner-progress.md`; feedback; Storybook/Expo |
| 17 | Toast | Extended | yes/yes/yes | concise transient result and safe-area viewport | `toast-callout.md`; feedback; Storybook/Expo |
| 18 | Callout / Alert | Extended | yes/yes/yes | persistent semantic status with opt-in announcement | `toast-callout.md`; feedback; Storybook/Expo |
| 19 | Dialog | Extended | yes/yes/yes | concise modal decision and conservative dismissal | `dialog.md`; overlays; Storybook/Expo |
| 20 | BottomSheet | Core | yes/yes/yes | mobile bottom placement and controlled modal lifecycle | `bottom-sheet.md`; overlays; Storybook/Expo |
| 21 | Tooltip | Extended | yes/yes/yes | supplementary non-interactive description | `tooltip.md`; overlays; Storybook/Expo |
| 22 | Menu | Core | yes/yes/yes | action/check items, trigger lifecycle, placement and keyboard model | `menu.md`; overlays; Storybook/Expo |
| 23 | Tabs | Core | yes/yes/yes | selected content navigation with disabled state | `tabs.md`; navigation; Storybook/Expo |
| 24 | SegmentedControl | Core | yes/yes/yes | compact immediate single selection | `segmented-control.md`; navigation; Storybook/Expo |
| 25 | Chip | Extended | yes/yes/yes | compact controlled filter toggle | `chip.md`; navigation; Storybook/Expo |
| 27 | NavigationBar / AppBar | Extended | yes/yes/yes | concise title with bounded leading/trailing actions | `app-bar.md`; navigation; Storybook/Expo |
| 29 | Badge | Core | yes/yes/yes | compact semantic metadata/status | `badge.md`; primitives; Storybook/Expo |
| 30 | Avatar | Extended | yes/yes/yes | deterministic fallback and explicit decorative/labelled semantics | `avatar.md`; primitives; Storybook/Expo |
| 31 | Divider | Extended | yes/yes/yes | semantic or decorative separation | `p0-primitives.md`; primitives; Storybook/Expo |
| 33 | ListItem | Extended | yes/yes/yes | one-row hierarchy with guarded optional action | `list-item.md`; primitives; Storybook/Expo |
| 34 | EmptyState | Extended | yes/yes/yes | clear absence hierarchy and one next action | `empty-state.md`; primitives; Storybook/Expo |
| 35 | Skeleton | Core | yes/yes/yes | calm named loading region with reduced motion | `skeleton.md`; primitives; Storybook/Expo |
| 36 | Table | Extended | none/yes/yes | approved Web product need; semantic responsive table, no borrowed fallback | `table.md`; primitives; Storybook/browser |
| 37 | SearchField | Extended | yes/yes/yes | concise search execution, clear and guarded async states | `search-field.md`; forms; Storybook/Expo |
| 38 | FilterBar | Extended | none/yes/yes | approved product pattern using Toss action/selection language | `filter-bar.md`; navigation; Storybook/Expo |
| 39 | ActionArea / BottomCTA | Extended | yes/no/yes | Toss single/double primary hierarchy | `action-area.md`; button; Storybook/Expo |
| 40 | Confirmation flow | Extended | yes/yes/yes | ConfirmDialog plus guarded async confirm/error lifecycle | `confirmation.md`; overlays; Storybook/Expo |
| 41 | Date and time inputs | Extended | none/yes/yes | approved platform-native/app-injected picker boundary | `date-time-field.md`; forms; Storybook/Expo |
| 42 | Calendar | Primitive | none/yes/yes | no public Toss standalone analogue; original APG keyboard/grid contract | date-picker package; Storybook/browser |
| 43 | DatePicker | Composite | none/yes/yes | Toss TextField trigger boundary only; Calendar + Dialog / app-injected native picker | date-picker package; Design Docs; Storybook/Expo |
| 44 | DateRangePicker | Composite | none/yes/yes | no public Toss standalone analogue; controlled start/end range and platform picker boundary | date-picker package; Storybook/Expo |

Optional Pagination, Breadcrumb, Card, and File upload do not gate this goal.
The first three are implemented as additional evidence; File upload is not in
the approved scope.

## Verification coverage

- Package contract tests cover runtime invariants and source/platform boundary
  markers; these are supplementary, not the sole evidence.
- The catalogue test compares every public Web component function export with
  exactly one registry row and verifies known T/S/M exceptions and package
  ownership.
- Storybook browser checks render and exercise semantics, keyboard, focus,
  pending/error/disabled states, responsive containment, axe, and async races.
- `pnpm check` builds every workspace package and Storybook, runs all contract
  tests and type checks, runs the browser story suite, and runs the Web visual
  specimen suite.
- Expo typecheck and the native specimen prove the shared RN surface is wired;
  device and screen-reader runtime execution is explicitly deferred by the
  user.
