export type DateValue = `${number}-${number}-${number}` | "";
export interface DateRangeValue {
  start: DateValue;
  end: DateValue;
}
export interface DatePickerMessages {
  previousMonth: string;
  nextMonth: string;
  chooseDate: string;
  chooseStartDate: string;
  chooseEndDate: string;
  calendar: string;
  notSelected: string;
  required: string;
  rangeSeparator: string;
}
export const koreanDatePickerMessages: DatePickerMessages = {
  previousMonth: "이전 달",
  nextMonth: "다음 달",
  chooseDate: "날짜를 선택하세요",
  chooseStartDate: "시작일을 선택하세요.",
  chooseEndDate: "종료일을 선택하세요.",
  calendar: "달력",
  notSelected: "선택 안 됨",
  required: "필수",
  rangeSeparator: "–",
};
export const englishDatePickerMessages: DatePickerMessages = {
  previousMonth: "Previous month",
  nextMonth: "Next month",
  chooseDate: "Choose a date",
  chooseStartDate: "Choose a start date.",
  chooseEndDate: "Choose an end date.",
  calendar: "calendar",
  notSelected: "Not selected",
  required: "Required",
  rangeSeparator: "–",
};
export function resolveDatePickerMessages(
  locale = "ko-KR",
  overrides?: Partial<DatePickerMessages>,
): DatePickerMessages {
  return {
    ...(locale.toLowerCase().startsWith("en")
      ? englishDatePickerMessages
      : koreanDatePickerMessages),
    ...overrides,
  };
}
export interface DateConstraint {
  min?: DateValue;
  max?: DateValue;
  isDateUnavailable?: (date: Exclude<DateValue, "">) => boolean;
}
export interface CalendarContract extends DateConstraint {
  accessibilityLabel: string;
  value: DateValue;
  highlightedRange?: DateRangeValue;
  focusedDate?: DateValue;
  locale?: string;
  messages?: Partial<DatePickerMessages>;
  weekStartsOn?: 0 | 1;
  disabled?: boolean;
  onValueChange: (value: Exclude<DateValue, "">) => void;
}
export interface DatePickerContract extends DateConstraint {
  label: string;
  value: DateValue;
  locale?: string;
  messages?: Partial<DatePickerMessages>;
  weekStartsOn?: 0 | 1;
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
  errorMessage?: string;
  onValueChange: (value: Exclude<DateValue, "">) => void;
}
export interface DateRangePickerContract extends DateConstraint {
  label: string;
  value: DateRangeValue;
  locale?: string;
  messages?: Partial<DatePickerMessages>;
  weekStartsOn?: 0 | 1;
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
  errorMessage?: string;
  onValueChange: (value: DateRangeValue) => void;
}

export function parseDateValue(value: DateValue): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year!, month! - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month! - 1 &&
    date.getDate() === day
    ? date
    : null;
}
export function formatDateValue(date: Date): Exclude<DateValue, ""> {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` as Exclude<
    DateValue,
    ""
  >;
}
export function formatDateForLocale(
  value: DateValue,
  locale = "ko-KR",
  options: Intl.DateTimeFormatOptions = { dateStyle: "long" },
) {
  const date = parseDateValue(value);
  if (!date) return value;
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return value;
  }
}
export function isDateAllowed(
  value: Exclude<DateValue, "">,
  constraints: DateConstraint,
) {
  return (
    (!constraints.min || value >= constraints.min) &&
    (!constraints.max || value <= constraints.max) &&
    !constraints.isDateUnavailable?.(value)
  );
}
export function assertCalendarContract({
  accessibilityLabel,
  value,
  highlightedRange,
  focusedDate,
  locale = "ko-KR",
  weekStartsOn = 0,
  min,
  max,
  disabled = false,
  isDateUnavailable,
  onValueChange,
}: CalendarContract) {
  const constraints = { min, max, isDateUnavailable };
  if (
    !accessibilityLabel.trim() ||
    (value &&
      (!parseDateValue(value) ||
        !isDateAllowed(value as Exclude<DateValue, "">, constraints))) ||
    (focusedDate && !parseDateValue(focusedDate)) ||
    (highlightedRange?.start &&
      (!parseDateValue(highlightedRange.start) ||
        !isDateAllowed(
          highlightedRange.start as Exclude<DateValue, "">,
          constraints,
        ))) ||
    (highlightedRange?.end &&
      (!highlightedRange.start ||
        !parseDateValue(highlightedRange.end) ||
        highlightedRange.end < highlightedRange.start ||
        !isDateAllowed(
          highlightedRange.end as Exclude<DateValue, "">,
          constraints,
        ))) ||
    !locale.trim() ||
    (weekStartsOn !== 0 && weekStartsOn !== 1) ||
    (min && !parseDateValue(min)) ||
    (max && !parseDateValue(max)) ||
    (min && max && min > max) ||
    typeof disabled !== "boolean" ||
    (isDateUnavailable !== undefined &&
      typeof isDateUnavailable !== "function") ||
    typeof onValueChange !== "function"
  )
    throw new Error("Calendar contract is invalid.");
}
export function assertDatePickerContract({
  label,
  value,
  locale = "ko-KR",
  weekStartsOn = 0,
  min,
  max,
  disabled = false,
  required = false,
  helpText,
  errorMessage,
  isDateUnavailable,
  onValueChange,
}: DatePickerContract) {
  if (
    !label.trim() ||
    (value && !parseDateValue(value)) ||
    !locale.trim() ||
    (weekStartsOn !== 0 && weekStartsOn !== 1) ||
    (min && !parseDateValue(min)) ||
    (max && !parseDateValue(max)) ||
    (min && max && min > max) ||
    (value &&
      !isDateAllowed(value as Exclude<DateValue, "">, {
        min,
        max,
        isDateUnavailable,
      })) ||
    typeof disabled !== "boolean" ||
    typeof required !== "boolean" ||
    (helpText !== undefined && !helpText.trim()) ||
    (errorMessage !== undefined && !errorMessage.trim()) ||
    (isDateUnavailable !== undefined &&
      typeof isDateUnavailable !== "function") ||
    typeof onValueChange !== "function"
  )
    throw new Error("DatePicker contract is invalid.");
}
export function assertDateRangePickerContract(
  contract: DateRangePickerContract,
) {
  const { value, onValueChange } = contract;
  assertDatePickerContract({
    ...contract,
    value: value.start,
    onValueChange: () => undefined,
  });
  if (
    value.end &&
    (!value.start ||
      !parseDateValue(value.end) ||
      value.end < value.start ||
      !isDateAllowed(value.end as Exclude<DateValue, "">, contract))
  )
    throw new Error("DateRangePicker range is invalid.");
  if (typeof onValueChange !== "function")
    throw new Error("DateRangePicker callback is invalid.");
}
