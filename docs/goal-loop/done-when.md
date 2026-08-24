# Stop Conditions

The active foundation or component passes only when all conditions hold:

- Independent UI/design-system, QA/accessibility, and UX/product evaluators
  each score 100/100.
- No Critical, Major, Minor, Patch, or Investigate item remains.
- Required type, unit, accessibility, visual, and platform checks pass.
- Catalogue presence, selection class, and Toss implementation translation are
  recorded. Any missing public Toss analogue has an explicit approved decision.
- Web and React Native/Expo static evidence exists for shared components.
  Device and screen-reader runtime evidence may be deferred only by an explicit
  user decision and must remain recorded as a user-owned release follow-up.
- Every public export is classified by layer, maturity, package, and platform
  support in the typed registry; Design Docs consumes that registry without a
  manually duplicated component inventory.
- Composite contracts are demonstrably domain-neutral and include the
  accessibility and lifecycle responsibility that justifies promotion above a
  product-local composition.
- A consumer can import the public packages and apply brand/domain composition
  without copying component behavior or importing the Design Docs application.

The loop is blocked, rather than passed, if any of these prevents meaningful
work:

- A required platform runtime, credentials, or reference source is unavailable.
- A required product behaviour cannot be inferred and needs a user decision.
