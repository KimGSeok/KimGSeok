# Constraints

- This repository is a pnpm workspace. Keep the profile repository concerns at
  the root and isolate reusable design-system code under
  `packages/design-systems`.
- Preserve the existing profile workflow and generated SVGs.
- Never copy source, Figma assets, logos, or icon sets from Toss, Daangn, or
  Wanted. The user explicitly approved using the public Toss TDS colour palette
  as the initial baseline; record its provenance in tokens and documentation.
- Toss App-in-Toss materials are restricted to that partner-service context;
  they are behavioural references only.
- The public Toss palette must stay behind semantic tokens so a future brand
  replacement is one source change.
- Follow `reference-policy.md`: catalogue comparison selects component types,
  while public Toss TDS governs component implementation. A missing public Toss
  analogue is an explicit gap, not permission to substitute another system.
- Work in dependency-ordered component batches from
  `docs/design-system-priority.md`; do not implement product patterns before
  their primitives are complete.
- Loci is a local architecture and evidence reference only. Do not copy its
  product-specific palette, visual identity, or permissive style overrides.
- Public packages must not know product entities, routes, API clients, analytics,
  permissions, or business policies. Generic constraints such as min/max,
  disabled values, validation state, and lifecycle callbacks are allowed.
- Do not publish speculative combinations merely because their parts exist.
  A Composite must remove repeated accessibility or lifecycle risk and expose a
  stable domain-neutral contract. Otherwise record it as Candidate or
  Product-only.
- Do not duplicate registry facts across the Next.js site, Storybook, and
  coverage docs. One typed registry must drive catalogue navigation and be
  checked against public exports.
- The docs application consumes actual workspace packages. It must not create
  look-alike replacements for package components.
