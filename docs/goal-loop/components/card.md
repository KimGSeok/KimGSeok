# Card contract

Card groups related content into one bounded surface. It is not a generic clickable
container, a page canvas, a navigation link, or a substitute for a Dialog. Actions
remain explicit child Button, IconButton, or Link controls.

`outlined` is the default grouped surface with elevation 0. `raised` is a temporary
priority group with elevation 1. Both use semantic background, border, radius, and
foreground tokens; callers cannot inject direct visual overrides. An optional
`accessibilityLabel` gives the Web section a concise name. On Native it is intentionally
unsupported: a visible `NativeHeading` names the group while the Card wrapper stays
non-accessible so child heading, text, and controls retain their natural reading order.

| Source | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | clear grouped hierarchy and restrained elevation | assets, API, styling and source |
| SEED | semantic surface token indirection across platforms | component API and brand values |
| Montage | elevation as documented information hierarchy | names, styling and source |
| Loci | separate Web/Native renderer boundary | raw colours, permissive style overrides, clickable-card shortcuts |

Web uses a labelled `section` only when a label is supplied. Native Card stays outside
the accessibility tree and its visible heading owns the name; this avoids hiding
meaningful descendant controls behind a container summary. Large content is owned by
normal document/ScrollView flow; Card never clips its children. Evidence requires
outlined/raised, labelled/unlabelled, dark semantic tokens, long Korean content, and
iOS/Android large-text screen-reader capture.
