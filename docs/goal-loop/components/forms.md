# P1 Form Contract

## Roles

- TextField and TextArea own label, help/error association, required and
  disabled states. Error text replaces help text and is never colour-only.
- Checkbox represents independent boolean consent; Switch represents an
  immediately applied setting; RadioGroup represents one choice in a visible
  set; Select defers a compact choice list to the platform picker/sheet.
- Web Select uses the native element. Native `Select` owns the labelled trigger
  and a controlled lifecycle; the product supplies only the platform sheet view.

## Reference translation

| Reference | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | concise labels, immediate validation feedback, touch-first controls | assets, exact component appearance and source |
| SEED | field parts and semantic state tokens | package API and brand values |
| Wanted Montage | anatomy, help/error, disabled and platform-difference documentation | copied naming and styling |
| Loci | no reusable form primitive exists to adopt | app-local raw inputs as a system contract |

| Control | Adopted decision | Platform boundary |
| --- | --- | --- |
| TextField / TextArea | TDS-style concise visible label and fast recovery; SEED semantic field states | Native announces a new error once and exposes invalid semantics |
| Checkbox / Radio | Montage anatomy plus shared selected, unselected and disabled tokens | Web keeps browser-native input behaviour; exact unselected track painting is browser-owned |
| Switch | immediate setting semantics and semantic track/thumb aliases | Native uses platform Switch mechanics; Web uses a native checkbox with switch role |
| Select | native Web select and compact choice disclosure | Native owns controlled open/select/cancel lifecycle while product supplies the platform sheet view |

## Non-negotiable rules

- Labels are always visible; placeholder is never the only label.
- Web errors use `aria-invalid` and `aria-describedby`; Native errors are
  announced once through `AccessibilityInfo` and use semantic status colour.
- Controls keep a minimum 44px target and do not accept arbitrary style/class
  overrides.
- Selection components are controlled. Product validation and persistence
  remain caller-owned.
- Browser-native Checkbox, Radio, Switch, and Select intentionally retain user
  agent geometry. `accent-color` maps the selected semantic colour; unselected
  track details may differ by browser and are verified for state semantics and
  contrast rather than pixel parity.

## Validation lifecycle

- Client validation becomes visible after blur (`touched`) or an invalid submit
  attempt. It does not announce errors while the user is entering an untouched
  field.
- A client error clears as soon as the corrected value validates. A server
  error remains until the next submission attempt or an explicit caller reset.
- On invalid submit, the product focuses the first invalid control and the
  field announces the associated error. The system renders and associates the
  message; the product owns validation rules and submission state.
- Native Select is a headless lifecycle boundary: `options`, `value`, `open`,
  `onValueChange`, and `onOpenChange` are controlled API. `renderSheet` receives
  `onSelect` and `onCancel`; both close through the system-owned adapter and a
  selection commits the next value before closing.
- Native field and Select focus use `border.focus`; focus wins the border while
  the visible error message and announcement preserve invalid-state context.
