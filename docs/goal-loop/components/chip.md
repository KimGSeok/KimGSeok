# Chip contract

This first Chip is a filter toggle: one concise label, independently selected or
unselected, and controlled by `selected`/`onSelectedChange`. It is not a Tabs item,
exclusive SegmentedControl option, free-form tag editor, or removable input chip.
Removal and leading icons require separate contracts rather than optional action
axes on the filter primitive.

Web uses a toggle button with `aria-pressed`; Native uses a button with selected
accessibility state. Both use selection semantic tokens and a 44px target.
`selected` is required; async filter loading/error and result count remain product
state, and products disable the Chip while a conflicting request is pending.
`ChipGroup` owns the accessible group name, semantic gap, and wrapping and rejects
empty groups or non-Chip children; raw product flex rows are not supported. Web uses
a named group. Because React Native has no stable group role, Native renders an
accessible visible section heading followed by individually reachable Chips. Labels remain one line, truncate
at the available width, and keep the full accessible name.
Groups accept direct platform Chip children only; fragments, wrappers, and custom
renderers are rejected until a future collection/slot contract defines safe composition.

| Source | Adopt | Reject |
| --- | --- | --- |
| TDS | compact filter toggle and Toss palette baseline | copied assets/API |
| SEED | controlled selection and wrap-safe groups | Daangn styling |
| Montage | explicit selected/disabled semantics | Wanted styling |
| Loci | platform renderer split | raw style overrides |

Evidence: selected/unselected/disabled/pressed/focus/dark/long Korean, wrapping at
320px, Web axe and keyboard/touch, plus iOS/Android selected announcements.
