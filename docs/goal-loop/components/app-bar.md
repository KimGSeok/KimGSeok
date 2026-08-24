# AppBar contract

AppBar identifies the current screen and exposes only screen-level navigation or
utility actions. `title` is required, `subtitle` is optional, one leading action is
allowed, and at most two trailing actions are allowed. Actions use the controlled
Icon registry and IconButton behaviour; blank labels, blank copy, raw icons, arbitrary
children, and more than two trailing actions are rejected. Tabs, search, contextual
selection mode, scrolling collapse, routing, and result messages remain separate patterns.

Web renders a semantic header with one h1 and keeps the centered one-line title stable
between equal flexible side regions. Native renders a header, consumes SafeAreaProvider
top inset internally, and truncates title/subtitle while keeping icon actions at least
44px. The application must mount `SafeAreaProvider`; AppBar consumes its ambient inset.
Products mount one AppBar at the screen root, never inside scrolling content, and own
the page-level rule that this screen heading is the page's only h1. Async actions expose
caller-controlled `loading`; required `onActionError` guarantees rejection is handed to
the product for visible Toast, Callout, or inline feedback.

| Source | Adopt | Reject |
| --- | --- | --- |
| TDS | concise screen title and Toss palette baseline | copied API/assets/navigation rules |
| SEED | explicit leading/trailing action slots | Daangn styling |
| Montage | strong current-screen hierarchy | Wanted styling |
| Loci | platform renderer split and touch-safe actions | broad raw style/child overrides |

Evidence: no/one/two actions, disabled action, subtitle, long Korean at 320px, dark,
keyboard/touch activation, one h1, and iOS/Android safe-area plus large-text captures.
