# Motion and interaction contract

Motion explains hierarchy, continuity, state change, and task progress. It must
not decorate a static surface or delay a user's next action. Components consume
recipes from `@kimgseok/design-motion`; products do not invent local durations,
easings, or travel distances.

| Recipe | Duration | Intended use |
| --- | ---: | --- |
| `press` | 120ms | direct press feedback |
| `stateChange` | 180ms | color, progress, and selection changes |
| `enter` | 200ms | lightweight content entrance |
| `exit` | 140ms | prompt removal without blocking the next action |
| `overlay` | 240ms | Dialog and BottomSheet continuity |
| `progressLoop` | 1200ms | indeterminate progress |
| `skeletonPulse` | 1600ms | calm placeholder pulse |

`useReducedMotion` is default-reduced until the platform preference is known.
Reduced motion resolves movement and duration to zero while preserving content,
focus, busy, and completion semantics. Web overlays use `useMotionPresence` so
their exit completes before focus restoration and removal; Native overlays and
date pickers select a non-animated modal path.

Every interactive control must define rest, hover where supported, pressed,
focus-visible, disabled, and loading behavior. Cancellation (`pointercancel`,
pointer leave, interrupted touch) must restore the rest state. Loading retains
the original label and control dimensions, exposes busy semantics, and prevents
duplicate actions.

Static evidence covers recipe values, reduced-motion branches, presence cleanup,
and component imports. Rendered Web and iOS/Android evidence remains a separate
gate for timing, focus restoration, interruption, and assistive technology.
