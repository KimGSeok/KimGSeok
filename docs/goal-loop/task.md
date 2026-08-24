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
