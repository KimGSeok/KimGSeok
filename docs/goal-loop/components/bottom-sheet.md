# P2 BottomSheet Contract

- BottomSheet presents a compact mobile-first choice or supporting task without
  leaving context. It is a modal surface with required title and controlled
  open state. Escape/Android Back closes and focus is contained on Web.
- Backdrop dismissal is allowed for reversible selection and disabled for
  destructive or mandatory work. The visual handle is decorative; swipe-to-
  dismiss is intentionally not promised until an accessible gesture adapter is
  implemented and verified.
- Web consumes CSS safe-area inset. Native requires `SafeAreaProvider` at the app
  root, reads insets internally, avoids the keyboard, and disables slide motion
  when the OS reduced-motion setting is active.

| Reference | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | mobile bottom placement, concise title, generous action targets | copied appearance/source and gesture assumptions |
| SEED | controlled overlay lifecycle and modal semantics | package API and brand values |
| Wanted Montage | anatomy and dismissal documentation | copied styling |
| Loci | separate platform renderer boundary | unbounded raw styles |
