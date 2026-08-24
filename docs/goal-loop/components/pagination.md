# Pagination contract

Pagination changes the visible page of a known finite result set. It is controlled
through `page`, `totalPages`, and `onPageChange`; the accessible group label and all
numeric values are validated before render. Cursor pagination, infinite scroll, data
fetching, URL synchronization, pending state, and error recovery remain product concerns.

Web exposes previous/next controls, the first and last page, the current neighbourhood,
and non-interactive ellipses. The current page is a non-interactive `aria-current="page"`
status rather than a button with no action. Native deliberately uses previous/status/next instead of compressing many
number targets onto a phone. The visible heading names the control, and the page status
is a polite live region. Both platforms use semantic surface/action/focus tokens and
44px minimum targets; boundary and globally disabled actions are non-interactive.
Web may wrap controls in source order at narrow widths and must never create document
horizontal overflow. Native places status above an equal-width action row so Dynamic
Type does not compete with three controls in one line. Products use `disabled` as the
request-pending interaction lock and announce loading/results outside Pagination.

| Source | Adopt | Reject |
| --- | --- | --- |
| TDS | compact navigation and Toss palette baseline | copied component API/assets |
| SEED | controlled state and explicit boundary controls | Daangn visual styling |
| Montage | clear current-page hierarchy | Wanted visual styling |
| Loci | separate Web/Native renderers | raw colour/style overrides |

Evidence: first/middle/last, small and large totals, ellipses, disabled, focus, dark,
Web axe/keyboard/click, and iOS/Android previous-next announcement and large-text layout.
