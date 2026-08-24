# Menu

Verified: 2026-08-24

## Selection

- Class: Core
- Toss TDS: present — <https://tossmini-docs.toss.im/tds-mobile/components/menu/>
- Daangn SEED: present — component catalogue
- Wanted Montage: present — component catalogue

## Toss implementation translation

Public Toss guidance defines a labelled dropdown container, optional header,
plain action items, controlled checkbox items, controlled or uncontrolled
trigger state, outside dismissal, and trigger-relative placement. This system
translates that intent into one data contract instead of copying Toss compound
component names or props.

- `accessibilityLabel`, `triggerLabel`, optional `header`
- unique action or checkbox `items`; checkbox state is controlled
- controlled `open` + `onOpenChange`, or uncontrolled `defaultOpen`
- Web supports the twelve published placement directions, outside click,
  Escape, Tab dismissal, and arrow/Home/End navigation. Escape and action
  completion return focus to the trigger; pointer-outside dismissal preserves
  the user's newly clicked focus destination.
- Native uses a modal raised menu, platform back dismissal, outside dismissal,
  48px rows, and checkbox state semantics
- disabled items remain visible but cannot run an action

## Evidence

- Web: `Overlays/MenuDefault`, `MenuControlled`, and `MenuDark`
- Native: `apps/native-specimen/App.tsx`
- Contract checks: `packages/overlays/scripts/test.mjs`

## Toss gaps and Ask

None for the current action and checkbox menu scope. Native anchor-relative
placement is not promised because platform modal geometry differs; the shared
contract preserves role and behaviour rather than a forced renderer.
