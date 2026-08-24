# Iteration Rules

This rule applies only while the user explicitly requests `$goal-loop`.

1. Read `goal.md`, `context.md`, `constraints.md`, `task.md`, `references.md`,
   `reference-policy.md`, `evaluate.md`, and `done-when.md` before working on
   the active component.
2. Use Toss TDS, Daangn SEED, and Wanted Montage to record catalogue presence
   and select the component family; do not average their implementations.
3. Use public Toss TDS as the implementation brief. Record `Toss public
   analogue: none` and an `Ask` item for any material gap rather than silently
   substituting SEED or Montage.
4. Convert only source-backed Toss gaps and evaluator fail items into the next patch.
5. For each component batch, complete three adversarial review rounds in every lens:
   UI/design-system, QA/accessibility, UX/product. Independent agents perform
   final evaluation when implementation exists.
6. The score is the lowest independent evaluator score. Any Critical, Major, or
   Minor issue means continue; no self-score can certify completion.
7. Re-run relevant checks and visual evidence after every patch.
8. Continue until 100/100 with no fail item, or write the exact blocker in
   `evaluate.md`.
