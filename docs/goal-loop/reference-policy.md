# Reference Authority Policy

## Decision

Reference catalogues and implementation authority have different jobs.

- **Component selection:** Toss TDS, Daangn SEED, and Wanted Montage are used
  to identify and narrow the component families worth carrying. Catalogue
  overlap is stronger selection evidence than a component appearing in only
  one reference.
- **Component implementation:** public Toss TDS documentation is the primary
  authority for component hierarchy, anatomy, variants, states, interaction,
  feedback, layout rhythm, motion, and copy style.
- **System architecture:** SEED may continue to inform the token pipeline and
  platform/package separation. Montage may inform only the format of platform
  evidence and state-matrix documentation; it cannot add or redefine component
  states. Neither may override Toss for a component implementation decision.
- **Developer ergonomics:** shadcn/ui may inform a registry-shaped distribution
  model, local ownership, concise component discovery, and example-first docs.
  It does not supply this system's visual values, component contract, maturity,
  or accessibility evidence.
- **Rendered density:** current public Toss and Daangn product surfaces may be
  observed in `reference_intent` mode for scanability, hierarchy, control
  density, and familiar Korean interaction cues. Record the exact source,
  viewport, state, and verification date. Do not copy their brand skin, assets,
  private tokens, or product-specific composition.
- **Local evidence:** Loci remains an architecture and verification analogue
  only. It is not a visual or component-API authority.

The result is not an average of three design systems: the catalogues constrain
what is built, while Toss determines how a selected component is implemented.

## Precedence

Use the first applicable source in this order:

1. An explicit user decision.
2. Public Toss TDS component and foundation documentation.
3. Accessibility and platform requirements that must be satisfied even when a
   public Toss example does not show them.
4. An original semantic Web/Native contract that translates the Toss intent
   without copying a protected API or source.
5. SEED v2 and Montage observations for catalogue presence, architecture, and
   evidence gaps only.
   They may identify that coverage is missing but cannot supply the missing
   anatomy, API, state, behaviour, or appearance.
6. shadcn/ui observations for developer-facing registry and documentation
   ergonomics only.

Do not merge competing SEED or Montage variants into a Toss-based component.
Do not use their styling, naming, or API to fill a Toss gap silently.

## When Toss has no public analogue

Record `Toss public analogue: none` before implementation. The component may
still be selected because it is shared by the other catalogues or required by a
product, but:

- Toss foundations and interaction language remain the visual baseline;
- the other references may define the role to be covered, not the final API or
  appearance;
- any material behaviour that cannot be derived from platform standards and
  existing Toss principles is marked `Ask` and requires an explicit decision.

## Inventory classes

- **Foundation:** system prerequisites such as tokens, typography, and icons;
  these sit outside component-catalogue overlap scoring.
- **Core:** a direct component family in all three public catalogues.
- **Extended:** present in exactly two public catalogues.
- **Optional:** present in fewer than two public catalogues; product-specific
  breadth stays here and cannot block Core completion.

Every candidate records its catalogue presence before entering the priority
queue. The typed registry derives the class from that presence; manual class
overrides are not allowed. `Menu` and `Slider` are Core rows and therefore
precede Optional breadth.

Every active component document contains a `Toss gaps and Ask` section. Write
`None` when public Toss guidance plus platform/accessibility requirements fully
determine the current scope; otherwise list each unresolved material decision.

## Existing documents and code

Older component documents may say that a SEED or Montage detail was “adopted.”
Those rows are retained as comparison history, not normative implementation
authority. This policy takes precedence. Re-audit the active component against
public Toss guidance before changing it or certifying it complete.

Toss source, proprietary APIs, assets, icons, fonts, and restricted Figma
material are never copied. The user-approved public Toss palette remains the
only exact visual baseline and stays private behind semantic tokens.

## Current public reference entry points

- Toss TDS colour and component documentation:
  <https://tossmini-docs.toss.im/tds-mobile/>
- Daangn SEED v2 component documentation:
  <https://v2.seed-design.io/>
- shadcn/ui component and registry documentation:
  <https://ui.shadcn.com/docs/components> and
  <https://ui.shadcn.com/docs/registry/getting-started>

These URLs are discovery entry points, not perpetual proof. A score uses a
dated observation in the current assessment snapshot.
