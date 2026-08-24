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
5. SEED and Montage observations for catalogue presence and evidence gaps only.
   They may identify that coverage is missing but cannot supply the missing
   anatomy, API, state, behaviour, or appearance.

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
- **Extended:** present in at least two catalogues or explicitly required by a
  product.
- **Optional:** single-reference or product-specific breadth; it cannot block
  Core completion unless explicitly promoted.

Every candidate records its catalogue presence before entering the priority
queue. `Menu` and `Slider` are Core gaps and therefore precede optional breadth.

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
