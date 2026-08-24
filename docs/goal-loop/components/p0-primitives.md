# P0 Primitive Contract

## Scope and roles

- `Text`: renders one typography role and semantic foreground tone. Arbitrary
  font composition and visual overrides are forbidden.
- `Heading`: owns semantic heading level separately from visual type role.
- `Icon`: renders only a reviewed named registry at 16, 20, or 24 pixels.
  Decorative is the default; meaningful icons require a label.
- `IconButton`: owns icon size, colour, accessible name, touch target, action
  state and focus treatment. Raw glyph, SVG, or arbitrary ReactNode icons are
  forbidden.
- `Surface`: grouped or raised content container. Page canvas is not a card and
  must be owned by the application theme root.
- `Divider`: decorative visual separation by default; it must not replace a
  heading or group label.

## Reference decisions

| Reference | Adopt | Reject |
| --- | --- | --- |
| Toss TDS | semantic action hierarchy, finite text/icon sizes, full-screen theme consistency | source, assets, font, component API and proprietary iconography |
| Daangn SEED | named registry, semantic token indirection, separate Web/Native renderers | package API and brand-specific tokens/icons |
| Wanted Montage | anatomy/state/platform documentation and explicit elevation roles | names, assets, code and exact component styling |
| Loci local system | separate `web.tsx`/`native.tsx`, icon registry idea, 44px minimum touch target | direct palette usage, raw library icons, permissive `style`/`className`, product-specific tones |

## State and token matrix

| Primitive | State | Required mapping |
| --- | --- | --- |
| Text/Heading | role/tone/clamp | `typography.role.*`, `fg.*`; truncation is explicit |
| Icon | decorative/labelled | inherited semantic colour; controlled name and size |
| IconButton | base/hover/pressed/focus/disabled/loading | `action.<variant>.*`, focus tokens, 44px minimum |
| Surface | grouped/raised | `bg.surface` or `bg.raised`, border tokens, elevation 0-2 |
| Divider | decorative | `border.strong`; hidden from accessibility tree |

## Platform policy

- Web uses native heading/button semantics, `:focus-visible` behaviour and
  document-scoped `data-theme`.
- React Native uses platform fonts, Pressable state, `accessibilityState`, and
  iOS/Android elevation adapters.
- The public API does not accept unrestricted visual overrides. Missing icons
  are added to the registry only after review; callers must not bypass it.

## Evidence

- Web stories: `apps/storybook/stories/Primitives.stories.tsx`.
- Native fixture: `apps/native-specimen/App.tsx`.
- Dark theme runtime assertion: `apps/web-specimen/visual-check.mjs` verifies
  the document theme root and computed canvas colour.
