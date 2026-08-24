# Date and time field

Verified: 2026-08-24

## Selection

- Class: Extended
- Toss public analogue: none as an independent Date/Time Picker component
- Toss evidence: React Native TextField documentation demonstrates a field
  press opening an application-owned date picker.
- Daangn SEED: present — date/time input catalogue
- Wanted Montage: present — date/time input catalogue

## Original platform contract

Toss TextField hierarchy and semantic field tokens remain the visual baseline.
Web delegates selection to standard `date`, `time`, and `datetime-local` inputs.
Native exposes the same normalized string value and a labelled field trigger,
while the application injects its platform picker through `renderPicker`.
Both validate format, range, disabled/required, help, and error states.

Evidence: `Forms/DateAndTime`, `DateAndTimeError`, the Expo specimen, and forms
contract checks.

## Toss gaps and Ask

- The design system intentionally does not choose a calendar layout, wheel
  picker, timezone policy, locale display, or recurrence model. Those remain
  app-owned because public Toss guidance does not publish them.
