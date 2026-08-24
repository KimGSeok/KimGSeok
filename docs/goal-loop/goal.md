# KimGSeok Design System Goal

## Goal

Build a production-ready design-system foundation for React web and React
Native/Expo apps. It shares design intent and tokens across platforms without
copying visual assets, source code, or restricted UI kits of its references.
The user explicitly selected the public Toss TDS colour palette as the initial
colour baseline and public Toss TDS as the component implementation baseline.

## Audience

- Product engineers building React web applications.
- Product engineers building React Native/Expo applications.
- Designers and reviewers who need one inspectable component contract.

## Success criteria

1. Typography, colour, spacing, radius, elevation, motion, and interaction
   tokens have a named source of truth and Web/RN outputs.
2. The prioritized component inventory in `docs/design-system-priority.md` has
   Web and RN implementations where the platform supports the role, with the
   same documented semantic API and platform-appropriate accessibility.
3. Component families are narrowed through the Toss TDS, Daangn SEED, and
   Wanted Montage catalogues. Selected components translate public Toss TDS as
   the implementation baseline under `reference-policy.md`.
4. Each component batch receives three adversarial reviews from each relevant lens:
   UI/design-system, QA/accessibility, and UX/product.
5. No component is called complete below independent 100/100 evaluation.
6. The public package surface separates Foundation, Primitive, Composite, and
   Pattern roles so product repositories import generic behavior and add only
   brand and domain meaning.
7. `apps/design-docs` is the official domain-neutral catalogue. It renders the
   real package exports and exposes role, maturity, Web/Native support,
   reference authority, and explicit gaps from one auditable registry.

## In scope

- Foundation tokens and their documentation.
- Component contracts and implementations in the published priority order.
- Web and React Native/Expo implementations, verification, and documentation.
- Reusable, domain-neutral composites whose accessibility or lifecycle would
  otherwise be reimplemented inconsistently by every product.
- A standalone Next.js design documentation site and registry consistency gate.

## Out of scope

- Reproducing Toss, Daangn, or Wanted visual identities or proprietary assets.
- Product-specific business flows, network/data layers, or an application UI.
- Product entities, policies, analytics, routing, server DTOs, and brand themes.
- iOS/Android native (Swift/Kotlin) libraries in the first phase.

## Non-negotiable constraints

- Use semantic tokens in components; components must not directly depend on
  palette values.
- SEED and Montage may narrow inventory and inform architecture or evidence,
  but they must not override public Toss guidance for component implementation.
- Web and Native share contracts and tokens, not a forced common renderer.
- Meet WCAG 2.2 AA for the Web implementation where applicable.
- Storybook must build as a publishable static artifact with docs, controls,
  accessibility checks, and representative component states.
