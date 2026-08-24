# P2 Tooltip Contract

- Web Tooltip provides short supplementary text on keyboard focus or mouse/pen
  hover after a delay. Escape dismisses it. It never appears for touch pointer
  hover emulation and must not contain interactive content.
- Web uses a trigger render function so both design-system controls and native DOM
  controls must explicitly forward the supplied ref, ARIA, and events. Placement prefers
  above, flips below, clamps to an 8px viewport margin, and recomputes on resize
  and scroll. Inside a modal, Escape closes Tooltip only.
- Native does not imitate hover UI. Its render function supplies the composed
  `accessibilityHint` to the trigger, appending Tooltip content to `existingHint`
  without duplicating identical text. Information needed by every user
  must be visible through a labelled help action, Callout, or page copy.
- Tooltip is never the sole label, error, legal text, or action instruction.

| Reference | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | concise supplementary language and restrained surface | exact appearance/source |
| SEED | focus/hover parity and non-interactive content | package API and brand values |
| Wanted Montage | trigger-description association and placement limits | copied styling |
| Loci | no reusable Tooltip analogue; retain separate platform boundary | desktop hover behavior forced onto Native |
