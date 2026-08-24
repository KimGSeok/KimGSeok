# Confirmation flow

Verified: 2026-08-24

## Selection

- Class: Extended
- Toss TDS: present — `ConfirmDialog` and asynchronous `useDialog` confirmation
- Daangn SEED: present — dialog/action catalogue
- Wanted Montage: present — dialog catalogue

## Toss implementation translation

The original `ConfirmationDialog` composes the existing accessible Dialog and
Button primitives. It provides distinct confirm/cancel labels, controlled open
state, optional destructive intent, guarded asynchronous confirmation, pending
action lock, close-on-success, stay-open-on-error, and an explicit error result.
Destructive confirmation never closes from the backdrop.

Evidence: `Overlays/ConfirmationSuccess`, `ConfirmationError`,
`ConfirmationDestructive`, the Expo specimen, and overlay contract checks.

## Toss gaps and Ask

None for the current two-choice confirmation scope.
