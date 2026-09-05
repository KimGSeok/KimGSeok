# Current Task

## Active task

Extract the reusable value of the Loci design-system workbench into a
domain-neutral, registry-driven system. Reclassify all current exports as
Foundation, Primitive, Composite, Pattern, or internal helper; then close the
highest-value missing composite contract beginning with Calendar, DatePicker,
and DateRangePicker. Expand `apps/design-docs` into the official catalogue while
keeping Storybook as the exhaustive interaction and QA surface.

Status: completed for the user-approved static and browser scope on
2026-08-24. Emulator, device, and physical screen-reader follow-up remains
explicitly deferred by the user and is not a blocker for this goal.

## Follow-up implementation checklist (2026-09-04)

Current inventory: 46 catalogue entries = 44 stable public components,
1 foundation-only `Tokens` entry, and 1 consumer-owned candidate pattern
(`SearchFilter`). Of the 44 stable components, 41 support Web and React Native;
`Table`, `Calendar`, and `Breadcrumb` are intentionally Web-only.

### Confirmed baseline

- [x] Keep every stable public Web/Native export represented exactly once in
  the typed catalogue.
- [x] Generate Design Docs routes from the 44 stable component entries.
- [x] Preserve the seven rich documentation pages and ten shared Docs /
  Storybook examples introduced by PRs #5 and #6.
- [x] Re-run workspace package tests plus catalogue, Design Docs, and motion
  type checks on the current `main` head (`2e1e17e`).

### Next implementation batch

- [x] Replace the legacy `motion.fast` Button documentation label with the
  semantic `press` recipe used by the implementation.
- [x] Replace the legacy `motion.normal` / `motion.slow` Progress labels with
  the semantic `stateChange` / `progressLoop` recipes and describe Web/Native
  behavior separately where their renderers differ.
- [x] Add a contract check that rejects legacy motion labels in active rich
  documentation and validates documented recipe names against the motion SSOT.
- [x] Make rich-documentation membership auditable against the typed catalogue
  so a component cannot silently fall back to the generic page.
- [ ] Migrate the first state-heavy batch to rich documentation using existing
  component contracts and Storybook evidence: `BottomSheet`, `Menu`,
  `ConfirmationDialog`, `SearchField`, `Slider`, `ToastViewport`,
  `DateTimeField`, `DatePicker`, `DateRangePicker`, and `ActionArea`.
- [ ] Migrate the remaining 27 generic component pages incrementally after the
  first batch, without changing component behavior merely for documentation.

### Composition safety implementation receipt (2026-09-05)

Base: `e7e210af82cfb04237dc8b8d51dbca23a28a9df5` plus this uncommitted
working-tree patch. This receipt does not re-score or certify all components.

- [x] Preserve 44 public components; add three consumer examples, not new
  shared components: list/search/filter/pagination, form/save/retry, and
  detail/date/confirmation/Toast. Docs and Storybook import the same sources.
- [x] Default auxiliary form buttons to `type="button"`; preserve Select's
  supplied id and permit DateTimeField user range errors to remain field state.
- [x] Consume Escape only at the top Dialog/BottomSheet or active Menu;
  add pointer cancellation to both Web date-picker composites.
- [x] Isolate Toast async completion/rejection by notification/open session;
  ignore stale Native picker/select callbacks after close, disable, or replacement.
- [x] Use semantic Skeleton/range fills; 44px calendar date targets; readable
  outside-month dates and error text; remove reduced-motion Progress transitions.
- [x] Correct Native TextField, Skeleton and motion Docs contracts. Execute
  actual feedback normalizers instead of duplicate functions in their tests.
- [x] `pnpm test`: existing workspace checks and 19 no-browser regression tests.
- [x] Package, examples, Docs, Next consumer and Native specimen type checks.
- [x] Public package builds, `pnpm verify:packages` (11 packages),
  `pnpm build:design-docs` (55 static pages), and `pnpm build:storybook`.
- [x] HTTP 200 at `http://localhost:3005/compositions`; this is server response
  evidence, not rendered or interactive browser evidence.

Evidence limits: the React execution tests mock DOM/Native host boundaries;
they verify component handlers, markup, state and lifecycle, not actual focus,
layout, screen-reader output or device behavior. React test renderer emits its
upstream deprecation warning. Rich Docs remain 7 pages; 37 generic pages have
not been migrated by this patch. Shared examples are now 13 (10 individual + 3
compositions). No commit, push, publishing, CI redesign or inventory expansion.

### Remaining deferred or conditional work

- [ ] `DEFERRED_QA UNVERIFIED`: run browser-rendered accessibility, responsive,
  visual, and interaction checks only when explicitly requested.
- [ ] `DEFERRED_QA UNVERIFIED`: run iOS/Android device and physical
  screen-reader verification only when explicitly requested.
- [ ] Promote `SearchFilter` from consumer-owned candidate only after a real
  product use case proves a reusable cross-product contract.
- [ ] Add `FileUpload` only after it is explicitly brought into scope; it does
  not gate the current design-system goal.

### Static acceptance for each documentation batch

- [ ] `pnpm test`
- [ ] `pnpm --filter @kimgseok/design-catalog typecheck`
- [ ] `pnpm --filter @kimgseok/design-docs typecheck`
- [ ] `pnpm --filter @kimgseok/design-motion typecheck`
- [ ] Confirm the worktree remains clean except for the intended batch diff.

## Order of work

1. Build one typed registry for role, layer, maturity, catalogue presence,
   public Toss analogue or gap, package ownership, and Web/Native support.
2. Audit package exports and map existing components to Foundation, Primitive,
   Composite, Pattern, Product-only, or helper without changing behavior.
3. Specify Calendar as a reusable selection primitive and DatePicker /
   DateRangePicker as composites. Product policies remain callback/data inputs;
   no booking, match, place, or schedule concept may enter the contract.
4. Implement the Web interaction and a platform-owned/app-injected Native
   boundary with explicit open/select/cancel/error/disabled behavior.
5. Add Storybook state evidence, Expo fixtures, registry-driven Design Docs
   pages, and automated registry/export consistency checks.
6. Classify PasswordField, NumberField, SearchFilter, MultiSelect, and other
   combinations as Stable, Experimental, Candidate, or Product-only. Implement
   only those whose current evidence satisfies the composite promotion rule.
7. Run three independent adversarial review rounds per required review lens,
   fix every finding, and re-score.

## Acceptance criteria for the current task

- Source URLs and observations are recorded with a verification date.
- Catalogue presence and the selection class are explicit.
- Implementation decisions cite public Toss guidance; SEED and Montage do not
  override it.
- The user-approved Toss palette remains private behind semantic tokens; no
  visual assets, component APIs, or source code are copied.
- Any missing product decision is marked `Ask`, not guessed.
- The static Storybook artifact builds and is ready for a hosting adapter.
- Consumer examples import packages and add domain meaning without forking
  component behavior.
- Registry facts drive Design Docs and fail verification when a public export
  lacks an auditable role.
- Calendar/date composites cover real calendar arithmetic, range rules,
  keyboard/focus semantics, locale-safe labels, and async-free controlled state.
