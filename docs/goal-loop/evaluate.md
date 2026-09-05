# Evaluation

Assessment is current evidence, not catalogue metadata. `Stable` describes an
API/release stage; only this ledger may use `Wrong`, `Hold`, or `Correct`.

## Hard gates

| Gate | Pass condition | Failure result |
| --- | --- | --- |
| Classification integrity | One catalogue ID per row; role, layer, selection class, maturity, and platform are independent fields. | `Wrong` |
| Authority and gap | Every material decision has a dated source or an explicit unresolved `Ask`. | `Wrong` |
| Public contract | Public exports, source owners, and real Docs/Storybook consumers agree. | `Wrong` |
| Critical accessibility | No known broken semantics, keyboard path, focus lifecycle, or misleading state. | `Wrong` |
| Current evidence | Required route, state, viewport, and platform are observed against the assessed snapshot. | `Hold (UNVERIFIED)` |

A score cannot override a failed hard gate.

## Scorecard

| Area | Points | Full-credit evidence |
| --- | ---: | --- |
| Source and classification | 15 | Authority, role, layer, selection class, maturity, platform, and gap are explicit. |
| Contract and implementation | 20 | Public export, API, state owner, composition boundary, and consumer import agree. |
| Visual quality | 20 | Typography, density, spacing, controls, border/focus/radius, and colour hierarchy fit the target surface. |
| Interaction and accessibility | 20 | State matrix, keyboard, focus, contrast, async, announcement, and reduced-motion behavior are exercised. |
| Platform and responsive | 15 | Web/Native responsibilities and required viewports have current evidence. |
| Documentation and evidence | 10 | Rich guidance, real examples, Storybook, tests, snapshot ID, and evidence locators are current. |

The machine-readable weights and transition rules live in
`packages/design-systems/catalog/src/registry.ts`; their sum and boundary cases
are contract-tested.

## Verdict rules

- **Correct:** exactly 100/100, every hard gate passes, current evidence exists,
  and no Critical, Major, Minor, Patch, or Investigate item remains.
- **Hold:** 60–99/100 without a blocking gate failure, or any required evidence
  remains `UNVERIFIED`.
- **Wrong:** 0–59/100 or a blocking hard gate fails.
- A `Wrong` item may move only to `Wrong` or `Hold` in one round.
- A `Hold` item needs a later assessment snapshot to become `Correct`.
- A changed `Correct` item returns to `Hold`; an observed regression may return
  it directly to `Wrong`.

## Current assessment snapshot

- Snapshot ID: `design-docs-2026-09-04-r1`
- Baseline HEAD: `2e1e17e`
- Scope: classification/evaluation integrity plus Design Docs typography,
  density, focus, and homepage search composition.
- Current score: `86/100`
- Aggregate status: `Hold`
- Promotion ceiling this round: `Hold`; the affected items entered this round
  as `Wrong` and cannot move directly to `Correct`.
- Evidence: `/private/tmp/kimgseok-design-docs-r1/evidence.json`
  (`sha256:dd26a27dbb6b2e4fa2404b7784e69638a97e451922b38d8183d72638660557d5`),
  containing 9 current PNG captures, their individual SHA-256 digests, and
  browser measurements.

### Measured hard gates

| Gate | Result | Current evidence |
| --- | --- | --- |
| Classification integrity | Pass | 46/46 rows derive selection class from catalogue presence; 44/44 public UI rows have one user role; Tokens and SearchFilter have no fabricated role. |
| Authority and gap | Pass | Each row retains catalogue presence, authority, gap, and generated selection rationale; public reference entry points are dated in `references.md`. |
| Public contract | Pass | Catalogue export/source/Storybook checks, generated-matrix drift check, Docs tests, typecheck, and production build pass. |
| Critical accessibility | Pass | axe reports 0 violations on the 9 assessed Web captures; focus, keyboard DatePicker, search, filter, and scroll-region paths pass. |
| Current evidence | Pass for this batch | Home, catalogue, and Button detail were observed at 1440×1000, 1280×900, and 390×844 after the last rendered-source edit. |

### Measured score

| Area | Earned | Maximum | Deduction evidence |
| --- | ---: | ---: | --- |
| Source and classification | 13 | 15 | Row-level catalogue presence is explicit and deterministic; per-component archival captures are not stored. |
| Contract and implementation | 20 | 20 | Public exports, source owners, Storybook IDs, real Docs consumers, generated coverage, and exact-name search ranking agree. |
| Visual quality | 18 | 20 | Type, density, 1px borders, 2px focus, and CJK wrapping pass the assessed views; the user reference is intent-level rather than an exact pixel target. |
| Interaction and accessibility | 18 | 20 | axe and browser keyboard/state paths pass; physical screen-reader behavior remains unverified. |
| Platform and responsive | 10 | 15 | 1440px, 1280px, 390px, and the maintained 320px regression check pass on Web; Native device rendering remains unverified. |
| Documentation and evidence | 7 | 10 | Matrix, policy, tests, digest, and rich examples are current; rich guidance covers 7/44 components. |
| **Total** | **86** | **100** | `getAssessmentStatus(86, 0 blocking failures, current evidence)` = `Hold`. |

| Surface | Before | Current | Evidence |
| --- | --- | --- | --- |
| Role classification | Correct | Correct | 44/44 public components have one generated role. |
| Selection class and coverage table | Wrong | Hold | 46/46 rows derive Foundation/Core/Extended/Optional from public presence; generated matrix and drift test pass. |
| Release maturity semantics | Wrong | Hold | `Stable` is explicitly separated from assessment and machine-tested; later comprehension review remains. |
| Design Docs first-frame density | Wrong | Hold | 9 captures show the measured hierarchy with no overflow, clipping, axe violation, or browser error. |
| Public component contracts | Hold | Hold | Shared behavior and geometry intentionally unchanged. |
| Native runtime and physical screen reader | Hold (`UNVERIFIED`) | Hold (`UNVERIFIED`) | Explicitly deferred outside this batch. |
| Rich component guidance | Hold | Hold | 7/44 components have rich docs; expansion is a later batch. |

## Required next-round promotion evidence

1. Re-open the same committed or content-digested snapshot rather than editing
   while scoring it; retain the capture/evidence digest.
2. Re-run catalogue generation/checks, package tests, Docs tests, typecheck, and
   production build.
3. Compare the rendered home, catalogue, and representative detail page at
   1440px, 1280px, and 390px widths.
4. Add Native device and physical screen-reader evidence for shared contracts.
5. Expand rich guidance from 7/44 and archive row-level public reference
   captures. Only a later 100/100 result with no finding promotes `Hold` to
   `Correct`.

## Historical evaluation — 2026-08-24

The following scores are retained as immutable evidence for the older approved
snapshot. They are not the current score.

| Scope and round | UI | QA | UX | Historical result |
| --- | ---: | ---: | ---: | --- |
| SearchField R2 | 97 | 91 | 91 | Findings fed later patches. |
| Menu and Slider final | 100 | 100 | 100 | Static batch passed. |
| Confirmation and DateTime R1 | 68 | 78 | 84 | Semantic and lifecycle findings patched. |
| Confirmation and DateTime R2 | 96 | 94 | 100 | Announcement and stale-settlement findings patched. |
| Confirmation and DateTime R3 | 100 | 100 | 100 | No component-code blocker remained. |
| Holistic Foundation/Core/Extended R1 | 100 | 96 | 88 | Stale completion evidence was corrected. |
| Holistic Foundation/Core/Extended R2 | 100 | 100 | 100 | Evidence-owner typo corrected. |
| Holistic Foundation/Core/Extended R3 | 100 | 100 | 100 | Historical static scope certified. |
| Registry and Date Picker R1 | 55 | 58 | 72 | Metadata, accessibility, range, and constraint gaps patched. |
| Registry and Date Picker R2 | 84 | 88 | 82 | Imports, export gate, and interactions patched. |
| Registry and Date Picker R3 | 100 | 100 | 98 | Range-cancel restoration evidence requested. |
| Registry and Date Picker closure | 100 | 100 | 100 | Historical static/browser scope passed. |

Historical device gaps remain explicit: iOS/Android device motion and physical
screen-reader behavior were not proven by package or browser checks.
