# P2 Spinner and Progress Contract

## Purpose and API

- `Spinner` communicates an indeterminate short wait. It has `sm`, `md`, `lg`
  sizes and a Korean default accessible label; callers may replace the label.
- `Progress` communicates determinate `0..1` progress or an indeterminate wait
  when value is omitted. Values are clamped and exposed as `0..100` semantics.
- Neither component accepts arbitrary colour, style, or class overrides.

## Reference translation

| Reference | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | quiet primary-colour progress and concise loading language | copied source, assets, exact geometry |
| SEED | explicit size and semantic state recipes | package API and brand values |
| Wanted Montage | determinate/indeterminate separation and accessibility naming | copied naming and implementation |
| Loci | no reusable Spinner/Progress analogue exists; retain its separate Web/Native package boundary only | inventing a local visual precedent or raw platform colours |

## Platform and motion

- Web uses dedicated semantic feedback tokens and honors `prefers-reduced-motion`.
- Native uses `ActivityIndicator` for platform motion. Determinate progress is a
  token-driven bar. When reduced motion is enabled, a static non-completion
  treatment replaces animation. Runtime screen-reader evidence remains a
  required Expo gate before release.

## Product usage decision

| Situation | Use | Exit rule |
| --- | --- | --- |
| total work is known | determinate Progress with a contextual Korean label | replace with the product success result at completion |
| short wait with unknown total | Spinner or indeterminate Progress | replace as soon as content or result is ready |
| wait becomes long or recoverable | contextual status plus cancel/retry/error action | never leave a perpetual spinner as the only feedback |

Non-finite values become indeterminate; finite values are clamped to `0..1`.
