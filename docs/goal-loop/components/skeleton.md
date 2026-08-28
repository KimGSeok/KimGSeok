# Skeleton contract

Skeleton represents loading layout only. Individual placeholders are decorative
and must always be created through the required
`SkeletonRegion`/`NativeSkeletonRegion` labelled busy region; raw pieces are
internal and are not exported. A region announces the loading target once, but
its pieces contain no text and never substitute for a progress percentage.

Prefer a semantic `recipe` that resembles the final content structure:
`text-block`, `list-item`, `avatar-row`, `card`, `table-row`, or `form`. Use
`count` only for repeated recipes and keep it between 1 and 8. The lower-level
`items` API remains for migration and exceptional layouts; `items` and `recipe`
are mutually exclusive. Shapes remain constrained to `text`, `block`, and
`circle`; `full` is valid for text/block, not an ambiguous full-width circle.

| Source | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | calm loading hierarchy and reduced visual noise | assets, styles, API and source |
| SEED | semantic surface-token and platform output separation | component API, code and brand values |
| Montage | documented loading anatomy and motion policy | names, assets, styling and source |
| Loci analogue | renderer split | raw style slots and direct colour overrides |

Web and Native use the shared `motion.skeletonPulse` recipe: a calm 1.6 second
opacity pulse. Web disables it with `prefers-reduced-motion`; Native stops it
when the platform reduced-motion preference is enabled. The product owns a
labelled `busy` region and must replace the entire skeleton region when content
or an error is available.

Do not show a Skeleton for a fast response by default. Product loading states
should use `useStableLoading`: a 200ms appearance delay prevents flashes, and a
400ms minimum visible duration prevents a placeholder that immediately blinks
away. Existing layout stays mounted for background refreshes when stale content
is still usable.

Evidence requires every recipe, legacy text/block/circle and size states, dark
mode, 320px full-width containment, reduced motion, no independent placeholder
accessibility role, plus iOS/Android large-text and screen-reader busy-region
capture.
