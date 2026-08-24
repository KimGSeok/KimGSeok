# ListItem contract

ListItem presents one concise record within an application-owned list. It may be static,
or it may be one explicit row action. It is not a generic card, a multi-action toolbar,
or a raw leading/trailing slot. The system accepts reviewed named `leadingIcon` values and
one fixed `chevron` affordance only; product-specific controls belong inside a dedicated
detail view or an explicit Button.

The `action` object is all-or-nothing: it requires `onAction` and `onActionError`, and
creates the only interactive row. An asynchronous action receives an internal one-shot
pending lock: both renderers expose busy/disabled state and `처리 중` until it settles.
The optional controlled `loading` prop uses the same inactive recipe; the product owns its
completion and any durable success or failure message. A static row is a non-focusable `div`/`View`; disabled
interactive rows retain their information but cannot activate. Title is required;
description and metadata are optional single-line secondary information.

| Source | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | clear one-row information hierarchy and restrained navigation affordance | assets, API, styling and source |
| SEED | semantic state recipe and Web/Native contract split | arbitrary slot API and brand values |
| Montage | documented anatomy, truncation, disabled and platform states | names, styling and source |
| Loci ListRow | title/subtitle/detail hierarchy and renderer split | raw ReactNode leading/trailing slots, direct colours and style overrides |

Web interactive rows use native buttons with keyboard focus, disabled state, pressed
feedback and an optional explicit accessible name. Without that override, the action
name combines title, description, and metadata in visual order; static rows preserve
normal child reading order. Native uses one Pressable only for an action row and exposes
its disabled state. Long Korean title, description, and metadata truncate visually while
the action name retains their full content. Evidence requires static/action/disabled, icon/chevron, dark, 320px
long text, one activation, and iOS/Android screen-reader/large-text capture.
