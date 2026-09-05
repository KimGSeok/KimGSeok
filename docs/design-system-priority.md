# Design System Implementation Priority

The typed catalogue owns component identity and classification. This document
owns only the order in which those catalogue rows are improved. Do not maintain
a second component-name inventory here.

## Independent axes

- **Selection class** explains why an entry belongs in the system:
  `Foundation`, `Core`, `Extended`, or `Optional`.
- **Layer** explains how it is implemented:
  `Foundation`, `Primitive`, `Composite`, or `Pattern`.
- **Maturity** explains its public API/release stage:
  `Stable`, `Candidate`, or `Planned`.
- **Assessment** explains current evidence quality:
  `Wrong`, `Hold`, or `Correct`.

These values are never substituted for one another. In particular, `Stable`
does not mean visually correct or fully runtime-verified.

The generated [catalog classification matrix](goal-loop/coverage-matrix.md) is
the complete row-level inventory. `packages/design-systems/catalog/src/registry.ts`
is its sole source of truth.

## Dependency-ordered batches

1. **P0 — Foundation and documentation shell**
   - Classification/evaluation integrity, colour, typography, spacing, radius,
     elevation, motion, focus, touch targets, Text, Heading, and Icon.
2. **P1 — Essential actions and inputs**
   - Actions plus Forms & Inputs whose contracts do not depend on overlays.
3. **P2 — Feedback and overlays**
   - Progress, result communication, focus containment, and dismissal
     lifecycles.
4. **P3 — Selection and navigation**
   - View switching, location, pagination, and compact selection controls.
5. **P4 — Content and layout**
   - Reading, comparison, empty states, surfaces, and Web-only tabular content.
6. **P5 — Candidate patterns**
   - Consumer-owned combinations only after real product use proves a reusable
     domain-neutral contract.

Within a batch, fix shared Foundation or Primitive causes before dependent
Composites. Optional breadth does not block Core completion.

## Assessment cadence

```text
Wrong -- fix + static proof --> Hold
Hold  -- next-round current runtime proof + 100/100 --> Correct
```

- A `Wrong` row cannot become `Correct` in the same round.
- Any changed `Correct` row returns to `Hold` until its evidence is refreshed.
- A directly observed regression may demote `Correct` to `Wrong`.
- Platform-specific `UNVERIFIED` evidence keeps the aggregate row at `Hold`.

## Storybook workflow

- Local: `pnpm storybook`
- Static build: `pnpm build:storybook`
- Web components require controls, documented states, accessibility checks,
  and representative interactions.
- Native components share the semantic contract but keep platform-specific
  runtime and screen-reader evidence separate from Web proof.
