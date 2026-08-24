"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { Dialog } from "@kimgseok/design-overlays/web";
import {
  assertCalendarContract,
  assertDatePickerContract,
  assertDateRangePickerContract,
  formatDateValue,
  isDateAllowed,
  resolveDatePickerMessages,
  parseDateValue,
  type CalendarContract,
  type DatePickerContract,
  type DatePickerMessages,
  type DateRangePickerContract,
  type DateRangeValue,
  type DateValue,
} from "./contracts";

const dayMs = 86_400_000;
const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const addMonths = (date: Date, months: number) =>
  new Date(
    date.getFullYear(),
    date.getMonth() + months,
    Math.min(
      date.getDate(),
      new Date(date.getFullYear(), date.getMonth() + months + 1, 0).getDate(),
    ),
  );
const labelStyle = {
  color: "var(--kg-color-fg-primary)",
  display: "block",
  fontSize: "var(--kg-typography-role-label-font-size)",
  fontWeight: "var(--kg-typography-role-label-font-weight)",
  marginBottom: 8,
} as const;

type WebCalendarProps = CalendarContract & { focusOnMount?: boolean };
export function Calendar({
  accessibilityLabel,
  value,
  highlightedRange,
  focusedDate,
  locale = "ko-KR",
  messages,
  weekStartsOn = 0,
  disabled = false,
  min,
  max,
  isDateUnavailable,
  onValueChange,
  focusOnMount = false,
}: WebCalendarProps) {
  assertCalendarContract({
    accessibilityLabel,
    value,
    highlightedRange,
    focusedDate,
    locale,
    weekStartsOn,
    disabled,
    min,
    max,
    isDateUnavailable,
    onValueChange,
  });
  const initial = parseDateValue(focusedDate || value) ?? new Date();
  const copy: DatePickerMessages = resolveDatePickerMessages(locale, messages);
  const [cursor, setCursor] = useState(initial);
  useEffect(() => {
    const next = parseDateValue(focusedDate || value);
    if (next) setCursor(next);
  }, [focusedDate, value]);
  const cellRefs = useRef(new Map<string, HTMLButtonElement>());
  const month = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const offset = (month.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(month, -offset);
  const dates = Array.from({ length: 42 }, (_, index) =>
    addDays(gridStart, index),
  );
  const weekday = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
          addDays(new Date(2024, 0, 7 + weekStartsOn), index),
        ),
      ),
    [locale, weekStartsOn],
  );
  const move = (date: Date) => {
    setCursor(date);
    requestAnimationFrame(() =>
      cellRefs.current.get(formatDateValue(date))?.focus(),
    );
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    const movements: Record<string, () => Date> = {
      ArrowLeft: () => addDays(date, -1),
      ArrowRight: () => addDays(date, 1),
      ArrowUp: () => addDays(date, -7),
      ArrowDown: () => addDays(date, 7),
      Home: () => addDays(date, -((date.getDay() - weekStartsOn + 7) % 7)),
      End: () => addDays(date, 6 - ((date.getDay() - weekStartsOn + 7) % 7)),
      PageUp: () => addMonths(date, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(date, event.shiftKey ? 12 : 1),
    };
    const next = movements[event.key]?.();
    if (!next) return;
    event.preventDefault();
    move(next);
  };
  const monthLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(month);
  return (
    <section
      aria-label={accessibilityLabel}
      style={{ fontFamily: "var(--kg-typography-family-web)", maxWidth: 360 }}
    >
      <header
        style={{
          alignItems: "center",
          display: "grid",
          gridTemplateColumns: "44px 1fr 44px",
          marginBottom: 8,
        }}
      >
        <button
          aria-label={copy.previousMonth}
          disabled={disabled}
          onClick={() => move(addMonths(cursor, -1))}
          style={navStyle}
          type="button"
        >
          ‹
        </button>
        <h3
          aria-live="polite"
          style={{ fontSize: 18, margin: 0, textAlign: "center" }}
        >
          {monthLabel}
        </h3>
        <button
          aria-label={copy.nextMonth}
          disabled={disabled}
          onClick={() => move(addMonths(cursor, 1))}
          style={navStyle}
          type="button"
        >
          ›
        </button>
      </header>
      <div
        role="grid"
        aria-label={monthLabel}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(40px, 1fr))",
        }}
      >
        <div role="row" style={{ display: "contents" }}>
          {weekday.map((day) => (
            <span
              key={day}
              role="columnheader"
              style={{
                color: "var(--kg-color-fg-secondary)",
                fontSize: 12,
                padding: 8,
                textAlign: "center",
              }}
            >
              {day}
            </span>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, week) => (
          <div key={week} role="row" style={{ display: "contents" }}>
            {dates.slice(week * 7, week * 7 + 7).map((date) => {
              const key = formatDateValue(date);
              const endpoint =
                key === highlightedRange?.start ||
                key === highlightedRange?.end;
              const selected = key === value || endpoint;
              const inRange = Boolean(
                highlightedRange?.start &&
                  highlightedRange.end &&
                  key > highlightedRange.start &&
                  key < highlightedRange.end,
              );
              const unavailable = !isDateAllowed(key, {
                min,
                max,
                isDateUnavailable,
              });
              const outside = date.getMonth() !== month.getMonth();
              const active = formatDateValue(cursor) === key;
              return (
                <span
                  aria-selected={selected}
                  key={key}
                  role="gridcell"
                  style={{
                    background: inRange
                      ? "var(--kg-color-bg-brand-subtle)"
                      : "transparent",
                  }}
                >
                  <button
                    aria-disabled={disabled || unavailable || undefined}
                    aria-label={new Intl.DateTimeFormat(locale, {
                      dateStyle: "full",
                    }).format(date)}
                    data-calendar-active={
                      focusOnMount && active ? "true" : undefined
                    }
                    disabled={disabled}
                    onClick={() => {
                      if (!unavailable) onValueChange(key);
                    }}
                    onKeyDown={(event) => onKeyDown(event, date)}
                    ref={(node) => {
                      if (node) cellRefs.current.set(key, node);
                      else cellRefs.current.delete(key);
                    }}
                    style={{
                      ...dayStyle,
                      background: selected
                        ? "var(--kg-color-action-primary-bg)"
                        : "transparent",
                      color:
                        disabled || unavailable
                          ? "var(--kg-color-fg-disabled)"
                          : selected
                            ? "var(--kg-color-action-primary-fg)"
                            : outside
                              ? "var(--kg-color-fg-tertiary)"
                              : "var(--kg-color-fg-primary)",
                      outline: active
                        ? "var(--kg-foundation-focus-ring-width) solid var(--kg-color-border-focus)"
                        : "none",
                    }}
                    tabIndex={active ? 0 : -1}
                    type="button"
                  >
                    {date.getDate()}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function FieldShell({
  label,
  valueLabel,
  required,
  disabled,
  helpText,
  errorMessage,
  messages,
  onOpen,
  triggerRef,
}: {
  label: string;
  valueLabel: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  errorMessage?: string;
  messages: DatePickerMessages;
  onOpen: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}) {
  const messageId = useId();
  const displayValue = valueLabel || messages.chooseDate;
  return (
    <div>
      <span style={labelStyle}>
        {label}
        {required ? ` (${messages.required})` : ""}
      </span>
      <button
        aria-describedby={helpText && !errorMessage ? messageId : undefined}
        aria-errormessage={errorMessage ? messageId : undefined}
        aria-haspopup="dialog"
        aria-invalid={Boolean(errorMessage) || undefined}
        aria-label={`${label}, ${displayValue}`}
        disabled={disabled}
        onClick={onOpen}
        ref={triggerRef}
        style={{
          alignItems: "center",
          background: "var(--kg-color-bg-canvas)",
          border: `1px solid ${errorMessage ? "var(--kg-color-status-negative-border)" : "var(--kg-color-border-strong)"}`,
          borderRadius: "var(--kg-foundation-radius-md)",
          color: valueLabel
            ? "var(--kg-color-fg-primary)"
            : "var(--kg-color-fg-tertiary)",
          display: "flex",
          font: "inherit",
          justifyContent: "space-between",
          minHeight: 48,
          padding: "0 14px",
          width: "100%",
        }}
        type="button"
      >
        <span>{displayValue}</span>
        <span aria-hidden="true">▣</span>
      </button>
      {helpText || errorMessage ? (
        <span
          id={messageId}
          role={errorMessage ? "alert" : undefined}
          style={{
            color: errorMessage
              ? "var(--kg-color-status-negative-fg)"
              : "var(--kg-color-fg-secondary)",
            display: "block",
            fontSize: 13,
            marginTop: 6,
          }}
        >
          {errorMessage ?? helpText}
        </span>
      ) : null}
    </div>
  );
}

export function DatePicker(props: DatePickerContract) {
  assertDatePickerContract(props);
  const {
    label,
    value,
    locale = "ko-KR",
    messages,
    disabled,
    required,
    helpText,
    errorMessage,
    onValueChange,
  } = props;
  const copy = resolveDatePickerMessages(locale, messages);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const valueLabel =
    value && parseDateValue(value)
      ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
          parseDateValue(value)!,
        )
      : "";
  return (
    <>
      <FieldShell
        disabled={disabled}
        errorMessage={errorMessage}
        helpText={helpText}
        label={label}
        messages={copy}
        onOpen={() => setOpen(true)}
        required={required}
        triggerRef={triggerRef}
        valueLabel={valueLabel}
      />
      <Dialog
        initialFocusSelector="[data-calendar-active='true']"
        onOpenChange={setOpen}
        open={open}
        returnFocusRef={triggerRef}
        title={label}
      >
        <Calendar
          accessibilityLabel={`${label} ${copy.calendar}`}
          {...props}
          focusOnMount
          onValueChange={(next) => {
            onValueChange(next);
            setOpen(false);
          }}
        />
      </Dialog>
    </>
  );
}

export function DateRangePicker(props: DateRangePickerContract) {
  assertDateRangePickerContract(props);
  const {
    label,
    value,
    locale = "ko-KR",
    messages,
    disabled,
    required,
    helpText,
    errorMessage,
    onValueChange,
  } = props;
  const copy = resolveDatePickerMessages(locale, messages);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRangeValue>(value);
  useEffect(() => {
    setDraft(value);
  }, [value.start, value.end]);
  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) setDraft(value);
  };
  useEffect(() => {
    if (disabled && open) changeOpen(false);
  }, [disabled, open]);
  const format = (item: DateValue) =>
    item && parseDateValue(item)
      ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
          parseDateValue(item)!,
        )
      : "";
  const select = (next: Exclude<DateValue, "">) => {
    if (!draft.start || draft.end || next < draft.start)
      setDraft({ start: next, end: "" });
    else {
      const completed = { start: draft.start, end: next };
      setDraft(completed);
      onValueChange(completed);
      changeOpen(false);
    }
  };
  return (
    <>
      <FieldShell
        disabled={disabled}
        errorMessage={errorMessage}
        helpText={helpText}
        label={label}
        messages={copy}
        onOpen={() => setOpen(true)}
        required={required}
        valueLabel={
          value.start
            ? `${format(value.start)} ${copy.rangeSeparator} ${format(value.end) || copy.chooseEndDate}`
            : ""
        }
      />
      <Dialog
        initialFocusSelector="[data-calendar-active='true']"
        onOpenChange={changeOpen}
        open={open}
        title={label}
      >
        <p
          aria-live="polite"
          style={{ color: "var(--kg-color-fg-secondary)", marginTop: 0 }}
        >
          {draft.start && !draft.end
            ? copy.chooseEndDate
            : copy.chooseStartDate}
        </p>
        <Calendar
          accessibilityLabel={`${label} ${copy.calendar}`}
          {...props}
          focusOnMount
          highlightedRange={draft}
          value={draft.end || draft.start}
          onValueChange={select}
        />
      </Dialog>
    </>
  );
}

const navStyle = {
  background: "transparent",
  border: 0,
  borderRadius: 8,
  color: "var(--kg-color-fg-primary)",
  fontSize: 28,
  minHeight: 44,
  minWidth: 44,
} as const;
const dayStyle = {
  border: 0,
  borderRadius: 999,
  font: "inherit",
  height: 40,
  margin: 2,
  padding: 0,
  width: 40,
} as const;
