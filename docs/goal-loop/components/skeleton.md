# Skeleton contract

Skeleton represents loading layout only. It is decorative and must always be
created through the required `SkeletonRegion`/`NativeSkeletonRegion` labelled busy region; raw pieces are internal and are not exported. It never announces on its own,
contains text, or substitutes for a progress percentage. The constrained API
supports `text`, `block`, and `circle` shapes with reviewed sizes only; `full`
is valid for text/block, not an ambiguous full-width circle.

| Source | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | calm loading hierarchy and reduced visual noise | assets, styles, API and source |
| SEED | semantic surface-token and platform output separation | component API, code and brand values |
| Montage | documented loading anatomy and motion policy | names, assets, styling and source |
| Loci analogue | renderer split | raw style slots and direct colour overrides |

Web uses a semantic raised surface pulse, disabled by `prefers-reduced-motion`.
Native pulses with the platform animation driver and stops it when the platform
reduced-motion preference is enabled. The product owns a labelled `busy` region and must replace the entire
skeleton region when content or an error is available.

Evidence requires text/block/circle and size states, dark mode, 320px full-width
containment, reduced motion, no independent accessibility role, plus iOS/Android
large-text and screen-reader busy-region capture.
