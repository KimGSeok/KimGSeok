# SegmentedControl contract

SegmentedControl switches one compact, immediate display or setting among two to
four peer options. It is controlled, requires one enabled selected value, and is
not page navigation, content Tabs, or multi-select Chips. Labels stay short and
icon-only segments are not supported until a separate accessible icon contract exists.

Web uses a named radiogroup with Arrow Left/Right selection and roving focus.
Native exposes the same radio selected/disabled state with 44px targets and uses
the platform accessibility focus treatment. Both use semantic surface, foreground,
radius and elevation tokens; Web additionally renders the foundation focus ring.

| Source | Adopt | Reject |
| --- | --- | --- |
| TDS | compact immediate choice and Toss palette baseline | copied assets/API |
| SEED | controlled single selection and mobile targets | Daangn styling |
| Montage | documented radio semantics and disabled state | Wanted styling |
| Loci | separate Web/Native renderers | raw style escape hatches |

Evidence requires light/dark, two/four/disabled/long-label states, Web keyboard and
axe checks, plus clean iOS/Android selected-state and large-text captures.
