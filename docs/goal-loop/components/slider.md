# Slider

Verified: 2026-08-24

## Selection

- Class: Core
- Toss TDS Mobile: present — <https://tossmini-docs.toss.im/tds-mobile/components/slider/>
- Toss TDS React Native: present — <https://tossmini-docs.toss.im/tds-react-native/components/slider/>
- Daangn SEED: present — component catalogue
- Wanted Montage: present — component catalogue

## Toss implementation translation

Public Toss guidance defines a numeric sliding control with controlled value,
minimum and maximum, step on React Native, range labels, current-value feedback,
and screen-reader adjustment. The original shared contract uses semantic action
tokens instead of exposing arbitrary palette colours.

- controlled `value`, `onValueChange`, `min`, `max`, and `step`; range endpoints
  and value must align to the step grid
- optional min/mid/max labels and formatted accessible current value
- optional visible live value; disabled state remains readable
- Web uses the native range input for keyboard and assistive technology support
- Native exposes the adjustable role, min/max/now/text, increment/decrement
  accessibility actions, track tapping and continuous drag with step normalization

## Evidence

- Web: `Forms/SliderDefault`, `SliderDisabled`, and `SliderDark`
- Native: `apps/native-specimen/App.tsx`
- Contract and normalization checks: `packages/design-systems/components/forms/scripts/test.mjs`

## Toss gaps and Ask

None for the current single-value scope. A dual-thumb range selector is a
separate product decision and is not implied by the public single-value Slider.
