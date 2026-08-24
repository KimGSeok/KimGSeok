# P2 Toast and Callout Contract

## Roles and boundaries

- Toast reports a recent, non-blocking result. It is controlled through `open`
  and `onOpenChange`, pauses dismissal on Web hover/focus, and supports at most
  one concise recovery action. Negative results use assertive announcement;
  other tones are polite. Negative or actionable Toasts are persistent.
- Callout is persistent contextual guidance inside layout. Announcement is
  opt-in; persistent negative guidance does not interrupt on initial render.
- Neither surface replaces Dialog confirmation or durable page-level error UI.

## Reference translation

| Reference | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | short result language, bottom safe-area placement, one clear action | exact appearance, assets, source and proprietary motion |
| SEED | semantic status recipes and controlled open state | package API and brand values |
| Wanted Montage | persistent Callout vs transient Toast distinction | copied naming and styling |
| Loci | separate Web/Native render boundaries; no reusable Toast analogue found | app-local notification code as a system contract |

## Usage rules

- Success: describe the completed result, e.g. `저장했어요`.
- Failure with immediate recovery: state the failure and offer one `다시 시도`.
- Destructive or multi-step decisions use Dialog, never Toast.
- Essential information must also exist in durable UI; a timed Toast is not the
  sole source of form errors, payment state, or legal information.
- `durationMs=null` is persistent. Invalid durations fall back to four seconds;
  finite timed values are clamped to at least one second. Actionable and
  negative Toasts remain persistent even if a duration is supplied.
- Action is one object containing `label`, async-capable `onAction`, and
  `onError`. Duplicate activation is locked, success dismisses, and failure
  keeps the Toast visible while handing the error to the caller.
- Native Toast must be mounted in a root `NativeToastHost`; the host reads the
  app `SafeAreaProvider` inset itself. Mounting it in scroll content is unsupported
  because React Native cannot reliably infer that ancestor relationship at runtime.
- Web `ToastViewport` and Native `NativeToastHost` each accept exactly one
  current Toast. Products replace or queue in application state; mounting
  independent overlapping Toast surfaces is not a supported API.
- Persistent Toasts include an `알림 닫기` control. It only closes the message
  and never invokes the recovery action.
- Toast tone is reinforced with a semantic status accent in addition to its
  polite/assertive announcement behavior.
