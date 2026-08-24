# EmptyState contract

EmptyState explains one absent or unavailable content region and may offer one
product-owned recovery action. It is not a page shell, an alert, a marketing
illustration container, or a multi-action decision surface. `title` and
`description` are required; `icon` is a reviewed decorative registry name only;
the optional action is all-or-nothing (`label`, `onAction`, `onActionError`).

| Source | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | clear absence hierarchy and one next step | assets, illustrations, API, styling and source |
| SEED | semantic token and platform-renderer separation | component API, code and brand values |
| Montage | anatomy and empty/error state documentation | names, assets, styling and source |
| Loci analogue | Web/Native renderer split and bounded content composition | raw illustration/slot/style escape hatches |

Web renders a labelled `section` with a visible `h2`; Native deliberately keeps
the container non-accessible so the heading, body, then optional Button retain
their natural screen-reader order. The icon is decorative. The optional action
reuses the shared Button contract, including its one-shot async lock and
product-owned error result. It must not be used as a replacement for an alert
or Toast.

Evidence requires no-action/action, icon/no-icon, dark theme, 320px Korean
wrapping without horizontal overflow, action focus/activation/error, and
iOS/Android large-text plus VoiceOver/TalkBack reading-order capture.
