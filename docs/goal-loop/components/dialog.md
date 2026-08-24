# P2 Dialog Contract

- Dialog interrupts the current task only for a decision or focused subtask.
  `open` is controlled; Escape/Android Back closes; Web traps focus, locks body
  scroll, and restores the trigger. `returnFocusRef` is required when the
  opening action temporarily disables its trigger. Backdrop dismissal is opt-in and is disabled
  for destructive or irreversible decisions. `intent="destructive"` forces
  backdrop dismissal off even if a caller supplies `closeOnBackdrop`.
- Title is required. Description is associated when present. Product actions are
  composed as children using design-system Button components.

| Reference | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | concise decision copy, strong primary action, conservative dismissal | exact appearance, assets, source |
| SEED | controlled overlay and explicit modal semantics | package API and brand values |
| Wanted Montage | title/body/action anatomy and destructive-action separation | copied component styling |
| Loci | separate Web/Native renderers | broad style escape hatches and raw colours |

Native uses the platform Modal, safe-area insets, scrollable content and a fixed
footer boundary plus Android `onRequestClose`. Clean iOS/Android focus and
screen-reader runtime evidence remains required before release.
