# Evaluation

## Scorecard (100 points per evaluator)

| Area | Points | Pass condition |
| --- | ---: | --- |
| Reference translation | 20 | Catalogue selection records all three sources; implementation follows public Toss authority, with explicit Toss gaps and no copied protected material. |
| Token and API contract | 20 | Semantic, themeable, platform-safe contract with no ambiguous state. |
| UI/design-system | 20 | Hierarchy, states, responsive behaviour, and documentation are coherent. |
| QA/accessibility | 20 | Tests/checks cover state matrix, keyboard/screen-reader/touch behaviour, and regressions. |
| UX/product | 20 | Clear hierarchy, action result, loading/disabled/error behaviour, and platform fit. |

## Severity

- Critical: unsafe, inaccessible, broken, or materially misleading behaviour.
- Major: contract, state, platform, or reference-translation failure that
  prevents release.
- Minor: documented quality issue; still blocks 100/100 until fixed.

## Evaluation protocol

- The implementer may self-check but cannot certify a final score.
- UI/design-system, QA/accessibility, and UX/product independent evaluators
  inspect documents, diff, commands, and evidence.
- Aggregate score equals the lowest evaluator score.
- Three adversarial rounds are required for each lens per component batch.

## Current heartbeat

Goal-loop Heartbeat:
- iteration: 24
- target_score: 100
- current_score: UI 100, QA 100, UX 100; aggregate 100
- historical_batch_score: SearchField R2 UI 97, QA 91, UX 91; Menu/Slider final
  UI 100, QA 100, UX 100; Confirmation/DateTime R1 UI 68, QA 78, UX 84, R2
  UI 96, QA 94, UX 100, R3 component-code review UI 100, QA 100, UX 100.
- decision_update: 2026-08-24; catalogues narrow component types and public Toss TDS is the implementation authority
- active_phase: complete
- readiness: Ready; Goal, Context, Constraints, Task, Evaluation, References,
  Iteration rules, and Stop conditions are all present
- active_task: none
- historical_completed_before_decision: FilterBar clear-action focus recovery, strict boolean contract validation,
  named native option busy state, Web contrast correction, and 320px fixture containment; SearchField
  Storybook locators were made strict while running the whole regression suite.
- next_action: none for the user-approved static/browser/package scope.
- fail_items:
  - none
- blockers:
  - none for the current static completion scope
- deferred_release_evidence:
  - User decision 2026-08-24: skip emulator/device testing now; the user will run it later.
  - iOS CoreSimulatorService remains unavailable (`xcrun simctl` connection refused).
  - Android AVD `Medium_Phone_API_35` exists and boots, but its adb connection was unavailable;
    the attempted headless process was stopped after the user deferred emulator testing.
- evidence_state: Foundation/Core/Extended plus registry/date-picker scope is
  100/100. Design Docs Next.js production build and Chromium keyboard/focus,
  axe, console, and 320px checks pass. Storybook production build and the full
  browser interaction/a11y regression pass. Package tests/typechecks, Native
  specimen typecheck, public-export registry gate, and git diff check pass.
- r1_closure: added auditable registry authority/gap/import/platform metadata;
  corrected EmptyState/Table ownership; added APG row/grid/button anatomy,
  dialog initial focus and focus return, range highlighting, Native commit and
  disabled-session validation, Web/RN consumers, state stories, and a passing
  Design Docs Chromium check for keyboard, axe, console, and 320px containment.
- r2_closure: replaced inferred catalogue presence with explicit T/S/M sets;
  exposed T/S/M and platform-specific import paths in Design Docs; enforced an
  exact public-Web-export registry gate; validated controlled Calendar ranges;
  and added passing browser assertions for APG navigation, Tab trap, focus
  return, constraint blocking, disabled/error, range restart/completion, and
  external controlled updates.
- iteration_21_to_24_closure: publishable JS/DTS packages; clean tarball-installed Next consumer; complete Web client boundaries; Native modal safe-area/back/dismiss/isolation; locale-aware Web/Native messages and date announcements; value-complete Native adapter context; controlled range rejection/disabled/cancel restoration; exact Web/Native registry gates; registry-generated component docs routes.
- continue: no

## Independent review rounds

| Scope and round | UI | QA | UX | Result |
| --- | ---: | ---: | ---: | --- |
| SearchField R2 | 97 | 91 | 91 | historical findings fed later patches |
| Menu and Slider final | 100 | 100 | 100 | static batch passed |
| Confirmation and DateTime R1 | 68 | 78 | 84 | semantic validation, disabled lifecycle, intent validation, and announcements patched |
| Confirmation and DateTime R2 | 96 | 94 | 100 | Android duplicate announcement and stale async settlement patched |
| Confirmation and DateTime R3 code review | 100 | 100 | 100 | no component-code blocker |
| Holistic Foundation/Core/Extended R1 | 100 | 96 | 88 | stale completion evidence; coverage matrix and heartbeat patched |
| Holistic Foundation/Core/Extended R2 | 100 | 100 | 100 | ActionArea evidence-owner typo corrected; no blocker remains |
| Holistic Foundation/Core/Extended R3 | 100 | 100 | 100 | static release scope certified; no blocker remains |
| Registry and Date Picker R1 | 55 | 58 | 72 | audit metadata, a11y anatomy, constraints, range and evidence patched |
| Registry and Date Picker R2 | 84 | 88 | 82 | explicit T/S/M, platform imports, export gate and interaction regression patched |
| Registry and Date Picker R3 | 100 | 100 | 98 | UX requested explicit range-cancel restoration evidence |
| Registry and Date Picker closure | 100 | 100 | 100 | range cancel/value/focus/reopen restoration passed; static/browser goal complete |
