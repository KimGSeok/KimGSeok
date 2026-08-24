# Tabs contract

## Role and API

Tabs switches between peer content regions in the same page. It is controlled with
`value`, `items`, and `onValueChange`; disabled items cannot be selected. It is not
page navigation, a filter chip group, or a segmented setting.

The contract rejects empty items, duplicate values, all-disabled sets, and a
controlled value that does not reference an enabled item. It never renders a
visual fallback that disagrees with parent state. Automatic activation is for
instant local content; expensive or remote panels need a separate manual mode.
Web panels are not extra tab stops by default. Set an item's
`panelFocusable=true` only for text-only content that needs a direct keyboard
reading target; interactive content keeps its natural child focus order.

Web uses `tablist`/`tab`/`tabpanel`, automatic activation, roving `tabIndex`, and
Arrow Left/Right/Home/End. Native exposes selected/disabled tab state, horizontal
scrolling, and at least a 44px target. Both platforms keep content mounted one panel
at a time while Web retains stable hidden panel relationship nodes. Native does not
group arbitrary panel children into one accessibility element; products provide a
first heading when panel context is needed so nested controls remain reachable.
Both require a concise group label and keep externally selected overflow tabs visible.

## Reference translation

| Source | Adopt | Reject |
| --- | --- | --- |
| TDS | Toss palette baseline, clear selected underline, concise labels | source code, assets, and app-specific spacing |
| SEED | semantic selected state and mobile-first horizontal overflow | Daangn brand assets and component API |
| Montage | explicit disabled/selection state and Web documentation discipline | Wanted brand styling and source code |
| Loci analogue | separate Web/Native renderer and minimum touch target | broad style overrides and direct brand colours |

The common contract comes from role and state, not pixel cloning. Web keyboard
behavior follows the ARIA Tabs pattern; Native translates the same selection model
to platform accessibility state.

## Evidence gate

- Storybook: default, disabled, overflow, dark, keyboard wrap and panel association.
- Expo: light/dark, horizontal overflow, selected and disabled announcement.
- Release remains pending until clean iOS and Android runtime evidence is retained.
