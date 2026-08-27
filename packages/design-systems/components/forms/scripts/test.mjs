import { readFile } from "node:fs/promises";
const [web, native] = await Promise.all([
  readFile(new URL("../src/web.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/native.tsx", import.meta.url), "utf8"),
]);
for (const name of [
  "TextField",
  "TextArea",
  "Checkbox",
  "Switch",
  "RadioGroup",
  "Select",
  "SearchField",
  "Slider",
])
  if (!web.includes(`function ${name}`)) throw new Error(`Missing Web ${name}`);
for (const name of [
  "NativeTextField",
  "NativeTextArea",
  "NativeSwitch",
  "NativeCheckbox",
  "NativeRadioGroup",
  "NativeSelect",
  "NativeSearchField",
  "NativeSlider",
])
  if (!native.includes(`function ${name}`))
    throw new Error(`Missing Native ${name}`);
if (!web.includes("aria-invalid") || !web.includes("aria-describedby"))
  throw new Error("Field error/help accessibility contract missing.");
if (!native.includes("AccessibilityInfo.announceForAccessibility"))
  throw new Error("Native errors must be announced intentionally.");
if (!web.includes("matches(':focus-visible')") || !web.includes("focusedValue === option.value"))
  throw new Error("Web choice controls must expose explicit focus-visible states.");
if (!native.includes("pressed && !disabled ? 0.72 : 1"))
  throw new Error("Native choice controls must expose pressed feedback.");
if (!native.includes("onSelect: select") || !native.includes("onCancel: close"))
  throw new Error(
    "Native Select lifecycle must close on selection and cancellation.",
  );
if (
  !web.includes('type="search"') ||
  !web.includes("setPending(true)") ||
  !native.includes('returnKeyType="search"') ||
  !native.includes("setPending(true)")
)
  throw new Error(
    "SearchField must provide a guarded Web and Native search submission path.",
  );
const { assertSliderContract, normalizeSliderValue } = await import(
  "../src/contracts.ts"
);
assertSliderContract({
  label: "음량",
  value: 50,
  min: 0,
  max: 100,
  step: 5,
  labels: { min: "작게", max: "크게" },
  onValueChange() {},
});
for (const value of [
  { label: " ", value: 50, onValueChange() {} },
  { label: "값", value: 101, onValueChange() {} },
  { label: "값", value: 53, step: 5, onValueChange() {} },
  { label: "값", value: 0, min: 0, max: 12, step: 5, onValueChange() {} },
  { label: "값", value: 0, min: 10, max: 10, onValueChange() {} },
  { label: "값", value: 0, step: 0, onValueChange() {} },
  { label: "값", value: 0, labels: { min: "", max: "끝" }, onValueChange() {} },
]) {
  let threw = false;
  try {
    assertSliderContract(value);
  } catch {
    threw = true;
  }
  if (!threw)
    throw new Error(`Slider invariant accepted ${JSON.stringify(value)}`);
}
if (
  normalizeSliderValue(53, 0, 100, 5) !== 55 ||
  normalizeSliderValue(-1, 0, 100, 5) !== 0 ||
  normalizeSliderValue(103, 0, 100, 5) !== 100
)
  throw new Error("Slider normalization is incorrect.");
if (
  !web.includes('type="range"') ||
  !web.includes("aria-valuetext") ||
  !web.includes("aria-describedby") ||
  !native.includes('accessibilityRole="adjustable"') ||
  !native.includes("onAccessibilityAction") ||
  !native.includes("onResponderMove")
)
  throw new Error("Slider platform accessibility contract missing.");
const { assertDateTimeFieldContract } = await import("../src/contracts.ts");
const dateField = {
  label: "방문일",
  kind: "date",
  value: "2026-08-24",
  min: "2026-08-01",
  max: "2026-08-31",
  onValueChange() {},
};
assertDateTimeFieldContract(dateField);
for (const value of [
  { ...dateField, value: "08/24/2026" },
  { ...dateField, value: "2026-02-30" },
  { ...dateField, value: "2026-09-01" },
  {
    ...dateField,
    kind: "time",
    value: "24:00",
    min: undefined,
    max: undefined,
  },
  {
    ...dateField,
    kind: "datetime-local",
    value: "2025-02-29T12:00",
    min: undefined,
    max: undefined,
  },
  { ...dateField, kind: "week" },
  { ...dateField, min: "2026-09-01", max: "2026-08-01" },
]) {
  let threw = false;
  try {
    assertDateTimeFieldContract(value);
  } catch {
    threw = true;
  }
  if (!threw)
    throw new Error(
      `DateTimeField invariant accepted ${JSON.stringify(value)}`,
    );
}
assertDateTimeFieldContract({
  ...dateField,
  value: "2024-02-29",
  min: undefined,
  max: undefined,
});
if (
  !web.includes("function DateTimeField") ||
  !native.includes("function NativeDateTimeField") ||
  !native.includes("renderPicker") ||
  !native.includes("effectiveOpen = open && !disabled") ||
  !native.includes("onSelect: select") ||
  !native.includes("onCancel: () => onOpenChange(false)") ||
  !native.includes('Platform.OS === "ios" && errorMessage')
)
  throw new Error("DateTimeField platform contract missing.");
