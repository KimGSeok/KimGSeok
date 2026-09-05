# Reference Evidence

Verified: 2026-08-24

## Authority and precedence

The reference catalogues narrow the component inventory; they are not three
equal implementation choices. Public Toss TDS is the component implementation
baseline. SEED remains an architecture and catalogue reference, and Montage
remains a catalogue and documentation reference. See `reference-policy.md` for
the binding precedence and the explicit fallback when Toss has no public
analogue.

## Toss TDS — component implementation authority

- Sources: <https://tossmini-docs.toss.im/tds-mobile/>,
  <https://developers-apps-in-toss.toss.im/design/components.html>,
  <https://developers-apps-in-toss.toss.im/design/prepare/design.html>
- Evidence: TDS describes a product-wide system of components and templates;
  the public App-in-Toss surface lists core components and states that assets
  are licensed for the App-in-Toss service scope.
- Typography: use a finite type scale and component-owned text styles rather
  than arbitrary font sizes. Do not adopt Toss Product Sans or infer Figma
  values as code truth; the official guide warns that Figma and app fonts differ.
- Colour: use semantic roles rather than palette names in component APIs. The
  user explicitly approved the public palette as this system's initial baseline;
  do not treat Figma semantic values as code truth because the official guide
  warns they may differ from the current code.
- Foundation: quality includes interactions, animation, illustration and
  templates, not only static component states.
- Button implication: prioritise a small, recognisable set of actions and make
  state/feedback part of the component contract.
- Translate: public hierarchy, anatomy, variants, states, interaction,
  feedback, layout rhythm, motion, and copy guidance into an original semantic
  API for Web and Native.
- Reject: TDS assets, proprietary names, APIs, fonts, source, and restricted
  Figma material. Exact public palette values are the user-approved colour
  baseline only.

## Daangn SEED — catalogue and architecture reference

- Sources: <https://v2.seed-design.io/>,
  <https://v2.seed-design.io/component/text-button/style/>,
  <https://github.com/daangn/seed-design>,
  <https://seed-design.io/docs/foundation/design-token/%24color.fg.neutral>
- Evidence: SEED publishes one token source across Web, iOS, Android and Lynx,
  with CSS, styled React, headless React, Figma integration, migration tooling,
  and component-level token references.
- Typography: tokenise text roles and bind them to components; do not make
  callers compose arbitrary size/weight/line-height combinations.
- Colour: distinguish palette and semantic foreground/background/interaction
  roles; tokens resolve differently by theme.
- Foundation: separate definitions, generated styles, platform components, and
  migration/documentation tooling.
- Button implication: component states should reference semantic tokens rather
  than direct hex values and should expose accessible logic separately from
  styling when useful.
- Reject: SEED source code, package API, and Daangn brand values.
- Authority limit: SEED can justify including a component family and can inform
  token/package structure, but it cannot override Toss component behaviour,
  hierarchy, variants, or visual decisions.

## shadcn/ui — developer ergonomics reference

- Sources: <https://ui.shadcn.com/docs/components>,
  <https://ui.shadcn.com/docs/registry/getting-started>
- Evidence: shadcn/ui publishes a searchable component catalogue and a typed
  registry format whose items point to concrete files and dependencies.
- Retain: obvious component entry points, example-first documentation, and a
  registry that supports distribution without becoming a user-facing taxonomy.
- Reject: shadcn visual values, component APIs, framework assumptions, and the
  idea that registry membership alone proves quality.
- Authority limit: shadcn/ui can inform developer discovery and distribution;
  it cannot select the final visual scale or certify this system's behavior.

## Wanted Montage — catalogue and documentation reference

- Sources: <https://montage.wanted.co.kr/docs/foundations>,
  <https://montage.wanted.co.kr/docs/foundations/base-material/colors/semantic>,
  <https://montage.wanted.co.kr/docs/components/actions/text-button/design>
- Evidence: Montage documents colour, typography, grid, icons and elevation as
  foundations. Its colour system distinguishes semantic label/fill/line/
  background/status/interaction roles and its component pages document anatomy,
  variants, states, sizes, loading, and platform differences.
- Typography: specify readable styles and platform defaults; keep line-break
  behaviour explicit for Korean content.
- Colour: define semantic roles first, including disabled, interaction, status,
  inverse, and elevated surfaces.
- Foundation: record the hierarchy of surfaces and elevation instead of using
  shadows decoratively.
- Button implication: document anatomy, icon placement, fixed height by size,
  loading behaviour, and platform-specific visual exceptions.
- Reject: Wanted brand values, names, assets, and code.
- Authority limit: Montage can justify including a component family and improve
  state/platform evidence, but it cannot override Toss component behaviour,
  hierarchy, variants, or visual decisions.

## Comparison decision

| Area | Toss TDS | Daangn SEED | Wanted Montage | Original system decision |
| --- | --- | --- | --- | --- |
| Component inventory | catalogue evidence | catalogue evidence | catalogue evidence | use overlap and explicit product need to narrow families |
| Component implementation | primary authority | non-authoritative comparison | non-authoritative comparison | Toss-based original semantic Web/RN contract |
| Typography | component-level consistency | token-to-component traceability | readability and platform defaults | role-based type tokens, emitted for Web/RN |
| Colour | semantic usage | theme-resolved semantic tokens | rich semantic surface/state taxonomy | Toss public palette baseline; palette-private, semantic-public, light/dark from day one |
| Foundations | product-quality lens | package/pipeline separation | documented visual hierarchy | tokens + contracts + platform outputs + docs |
| Button | clear action prioritisation | state tokens and headless option | anatomy/states/loading/platform notes | small original API, state matrix, no brand cloning |

## Evidence limits

The public Toss documentation is a partner-facing subset and does not expose a
complete implementation contract. It is authoritative only for what it
actually publishes and is never proof that an unexposed internal TDS detail
should be replicated. Missing material is recorded as a Toss gap and handled by
the precedence in `reference-policy.md`.

## Calendar and picker extraction decision

- Toss public catalogue: <https://tossmini-docs.toss.im/tds-mobile/> does not
  publish a standalone Calendar or DatePicker. Its public React Native
  TextField example exposes a button that calls an app-owned date picker, so
  only the field-trigger boundary is a partial analogue.
- Platform authority: the W3C WAI-ARIA APG Date Picker Dialog example documents
  dialog focus return, a single tab stop in the grid, arrow/week navigation,
  Home/End, Page Up/Down, selection, and month announcements. APG explicitly
  warns that examples require assistive-technology testing before production.
  Source: <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/>.
- Catalogue comparison: SEED publishes Date Picker variants and Montage lists
  Date picker and Time picker. These sources justify the family and the need to
  document value, range, constraints, locale and controlled state; they do not
  override Toss behaviour where Toss has public evidence.
- Original decision: `Calendar` is a Web primitive. `DatePicker` and
  `DateRangePicker` are composites of a field trigger, calendar, and overlay.
  Native exports an app-injected picker boundary instead of imitating a
  platform picker. Product-specific presets, booking rules, analytics, routes,
  and copy remain consumer-owned.

## Loci workbench extraction

- Inspected source: `loci` `origin/main:apps/admin/app/design-system/page.tsx`.
- Retain: role-first navigation, Web/Native comparison, explicit reference
  fit/gap, public-export audit, helper exclusions, and decision history.
- Reject: the single 2,600+ line client page, hard-coded duplicate inventories,
  admin-route coupling, and Loci domain components inside the common system.
- Replacement: `@kimgseok/design-catalog` is the typed inventory consumed by
  the standalone `apps/design-docs`; packages remain independently importable
  and know nothing about the docs application or a product domain.

## Foundation usage policies

- Typography: Web uses the CSS stack; React Native resolves one system/loaded
  font family per platform. Text roles use numeric weights. Korean body copy
  uses `body` (16/24) or larger; `caption` is metadata only and must not carry
  essential instructions. Components must opt in to truncation and expose their
  full accessible label.
- Colour: the public Toss palette is the approved base layer. Components use
  only semantic aliases. Primary/danger filled controls use accessible dark
  palette steps with white text; `blue.500` remains a brand surface, not the
  default small-text action fill.
- Status: status aliases always name `fg`, `bg`, and `border`; a status must be
  accompanied by text or an icon and must never be the only carrier of meaning.
- Interaction: Web components implement hover, pressed, and `:focus-visible`;
  Native components implement pressed and accessibility focus. Focus uses
  `border.focus` with the shared width and offset contract.
- Motion: consumers use `foundation.motion.reduced` when the platform signals
  reduced motion.
- Elevation: level 0 is flat, level 1 is a transient raised surface, and level
  2 is a modal/popover surface. Web reads the emitted shadow; Native selects
  the iOS or Android value.

## Local rendered evidence

- Web: `apps/web-specimen/visual-check.mjs` loads the generated CSS, confirms
  the Korean content and theme toggle, fails on browser console errors, and
  captures `apps/web-specimen/artifacts/foundation-web-dark.png`.
- React Native/Expo: `apps/native-specimen/App.tsx` consumes the generated
  native theme for system mode, typography, action states, icons and elevation.
  iOS and Android Metro exports are verified at `/tmp/kimgseok-native-ios` and
  `/tmp/kimgseok-native-android`. iOS Simulator light/dark captures are stored
  under `apps/native-specimen/artifacts/`; the Expo Go developer overlay
  obscures the lower part of this first capture, so it is runtime proof but not
  final full-screen visual evidence. No Android emulator is installed.
