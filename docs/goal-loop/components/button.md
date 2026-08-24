# Button Contract

## Reference comparison

| Axis | Toss TDS | Daangn SEED | Wanted Montage | This system |
| --- | --- | --- | --- | --- |
| Role | action hierarchy is explicit through visual type/style/size | action-button recipes map state tokens to each variant | anatomy, variants, fixed size and loading are documented | `primary`, `secondary`, `tertiary`, `danger` are semantic action roles |
| State | enabled/disabled and direct action feedback are part of usage | enabled, pressed, loading tokens are traceable to recipes | variants, state, size, loading and icon anatomy are documented | Web: hover/pressed/focus-visible/loading/disabled; Native: pressed/loading/disabled/accessibility state |
| Loading | prevents accidental duplicate action | recipe state supplies visible progress and state tokens | loading blocks interaction by default | loading disables activation and preserves the accessible name |
| Platform | mobile action-first | platform implementation from one token source | documented Web/iOS/Android exceptions | identical API intent; DOM and RN accessibility implementation are separate |

Sources: [Toss Button](https://tossmini-docs.toss.im/tds-mobile/components/button/),
[SEED token reference](https://seed-design.io/docs/foundation/design-token/%24color.fg.neutral),
[Montage text button](https://montage.wanted.co.kr/docs/components/actions/text-button/design).

## API

```ts
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  children: string;
  onAction?: () => void | Promise<void>;
  onActionError?: (error: unknown) => void;
}
```

Web and Native use the same Promise-aware `onAction`. Button acquires an
internal lock before calling it and releases the lock after its Promise settles.
Controlled `loading` remains the caller-owned visible state and is cleared on
the caller's success/error path. Rejections are caught and handed to
`onActionError`; Button never chooses product copy or error presentation.

`Button` triggers a supplied local action. It does not fetch data or select
navigation. The product surface owns result messaging (toast, inline error,
screen transition), while Button guarantees exactly one activation while
loading or disabled.

## State matrix

| State | Web | React Native | Contract |
| --- | --- | --- | --- |
| enabled | click, hover, active, focus-visible | press, accessibility focus | token-defined action colour |
| loading | no activation, `aria-busy`, visible progress | no activation, `accessibilityState.busy` | label remains available to assistive tech |
| disabled | no activation, `disabled` | no activation, `accessibilityState.disabled` | disabled token pair only |
| destructive | `variant=danger` | `variant=danger` | caller must provide irreversible-action confirmation separately |

## Non-negotiable rules

- No `color`, `background`, or arbitrary `className` override API on Button.
- Native and Web must consume semantic `action.*` aliases; no palette values.
- Icon-only actions are a later `IconButton`, not an empty Button label.
- Button labels are short, one-line Korean action phrases. Overflow is
  truncated visually while the complete string remains the accessible name.
- Icons are reviewed `IconName` entries; arbitrary nodes and glyphs are forbidden.
- Loading is not a visual-only spinner: it blocks duplicate activation.
- Buttons have a minimum 44px touch target and a visible Web focus ring.

## Verification before completion

1. Unit-test each variant/state and duplicate activation prevention.
2. Web Playwright checks keyboard focus, loading, disabled and dark mode.
3. Expo iOS/Android checks press/disabled/loading accessibility state.
4. Run three independent adversarial rounds in UI, QA and UX/Product lenses.
