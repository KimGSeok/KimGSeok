# Breadcrumb contract

Breadcrumb is a Web-only location trail for a finite two-to-five-level hierarchy.
Every ancestor is a real link, the final item is a non-interactive current-page status,
and all labels are non-blank and unique. It does not model browser history, tabs, a
mobile back stack, overflow menus, or arbitrary separators. Products own routing and
must provide canonical root-relative hrefs. Protocol-relative, absolute, script, data,
backslash, whitespace, and control-character URLs are rejected at runtime.

Web uses a named navigation landmark, ordered list, decorative registered chevrons,
44px ancestor link targets, token focus rings, and `aria-current="page"`. At 320px the
trail wraps in source order and long individual labels truncate without document
overflow; their full text remains the accessible name. Native intentionally has no
Breadcrumb: AppBar title and leading back action translate the task to platform norms.

| Source | Adopt | Reject |
| --- | --- | --- |
| TDS | concise hierarchy and Toss palette baseline | copied assets/API and mobile breadcrumb |
| SEED | semantic ancestor links and current location | Daangn visual styling |
| Montage | readable hierarchy separation | Wanted visual styling |
| Loci | Web-only platform specialization | raw separators and style overrides |

Evidence: two/five levels, current/ancestor semantics, long Korean at 320px, wrap,
focus, dark semantic colours, link activation, and axe. Native non-implementation is
an intentional platform contract rather than missing parity.
