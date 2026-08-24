# Table contract

Table is a Web-only, read-only comparison surface for compact structured data.
It requires a caption, one to eight unique columns, and one or more rows whose cells exactly
match the column ids. It is not a spreadsheet, an editable grid, a sortable
data explorer, or a mobile card transformation. Product interactions belong in
a dedicated pattern after this primitive is stable.

| Source | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | restrained data hierarchy and focused table use | assets, APIs, styling and source |
| SEED | semantic tokens and explicit component boundaries | code, API and brand values |
| Montage | documented table anatomy and responsive behaviour | names, styling, assets and source |
| Loci analogue | platform-specific composition boundary | raw cell/style/action slots |

Web uses native `table`, `caption`, scoped headers and a named focusable region.
At a narrow viewport the region scrolls horizontally without changing source
order or table semantics. There is intentionally no Native renderer: products
use list/card views for small-screen structured data, rather than pretending a
desktop grid has parity.

An empty data result is not a Table: it is rejected at runtime and the product
must use EmptyState. Evidence requires header/caption associations, unique data contract, empty and
invalid data policy, horizontal mobile scroll and keyboard focus, dark tokens,
and no Native export claim.
