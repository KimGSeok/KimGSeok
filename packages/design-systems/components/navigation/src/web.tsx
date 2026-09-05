"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { IconButton } from "@kimgseok/design-primitives/web";
import { Icon } from "@kimgseok/design-icons/web";
import {
  assertAppBarContract,
  assertBreadcrumbContract,
  assertChipGroupContract,
  assertFilterBarContract,
  assertPaginationContract,
  assertSegmentedControlContract,
  assertTabsContract,
  getPaginationItems,
  type AppBarContract,
  type BreadcrumbContract,
  type ChipContract,
  type ChipGroupContract,
  type FilterBarContract,
  type PaginationContract,
  type SegmentedControlContract,
  type TabsContract,
} from "./contracts";

export function Tabs({
  accessibilityLabel,
  items,
  value,
  onValueChange,
}: TabsContract) {
  assertTabsContract(items, value, accessibilityLabel);
  const id = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusVisibleIndex, setFocusVisibleIndex] = useState<number | null>(
    null,
  );
  const selectedIndex = items.findIndex((item) => item.value === value);
  useLayoutEffect(() => {
    refs.current[selectedIndex]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [selectedIndex]);
  const selectAt = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    onValueChange(item.value);
    refs.current[index]?.focus();
    refs.current[index]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  };
  const move = (start: number, step: 1 | -1) => {
    for (let offset = 1; offset <= items.length; offset += 1) {
      const next = (start + step * offset + items.length) % items.length;
      if (!items[next]?.disabled) {
        selectAt(next);
        return;
      }
    }
  };
  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(index, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(index, -1);
    } else if (event.key === "Home") {
      event.preventDefault();
      const next = items.findIndex((item) => !item.disabled);
      if (next >= 0) selectAt(next);
    } else if (event.key === "End") {
      event.preventDefault();
      for (let next = items.length - 1; next >= 0; next -= 1) {
        if (!items[next]?.disabled) {
          selectAt(next);
          break;
        }
      }
    }
  };
  return (
    <div
      style={{
        color: "var(--kg-color-fg-primary)",
        fontFamily: "var(--kg-typography-family-web)",
        minWidth: 0,
      }}
    >
      <div
        aria-label={accessibilityLabel}
        role="tablist"
        style={{
          borderBottom: "1px solid var(--kg-color-border-subtle)",
          display: "flex",
          gap: 4,
          overflowX: "auto",
        }}
      >
        {items.map((item, index) => {
          const selected = index === selectedIndex;
          return (
            <button
              aria-controls={`${id}-panel-${index}`}
              aria-selected={selected}
              disabled={item.disabled}
              id={`${id}-tab-${index}`}
              key={item.value}
              onBlur={() => setFocusVisibleIndex(null)}
              onClick={() => selectAt(index)}
              onFocus={(event) =>
                setFocusVisibleIndex(
                  event.currentTarget.matches(":focus-visible") ? index : null,
                )
              }
              onKeyDown={(event) => onKeyDown(event, index)}
              ref={(node) => {
                refs.current[index] = node;
              }}
              role="tab"
              type="button"
              style={{
                background: "transparent",
                border: 0,
                borderBottom: selected
                  ? "2px solid var(--kg-color-action-primary-bg)"
                  : "2px solid transparent",
                color: item.disabled
                  ? "var(--kg-color-fg-disabled)"
                  : selected
                    ? "var(--kg-color-fg-primary)"
                    : "var(--kg-color-fg-secondary)",
                cursor: item.disabled ? "not-allowed" : "pointer",
                flex: "0 0 auto",
                font: "inherit",
                fontWeight: selected ? 600 : 500,
                minHeight: 44,
                outline:
                  focusVisibleIndex === index
                    ? "var(--kg-foundation-focus-ring-width) solid var(--kg-color-border-focus)"
                    : "none",
                outlineOffset: "var(--kg-foundation-focus-ring-offset)",
                padding: "8px 12px",
                whiteSpace: "nowrap",
              }}
              tabIndex={selected ? 0 : -1}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item, index) => (
        <div
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== selectedIndex}
          id={`${id}-panel-${index}`}
          key={item.value}
          role="tabpanel"
          style={{ paddingBlock: 16 }}
          tabIndex={
            index === selectedIndex && item.panelFocusable === true ? 0 : -1
          }
        >
          {index === selectedIndex ? item.content : null}
        </div>
      ))}
    </div>
  );
}

export function SegmentedControl({
  accessibilityLabel,
  items,
  value,
  onValueChange,
}: SegmentedControlContract) {
  assertSegmentedControlContract(items, value, accessibilityLabel);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = items.findIndex((item) => item.value === value);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const select = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    onValueChange(item.value);
    refs.current[index]?.focus();
  };
  const move = (start: number, step: 1 | -1) => {
    for (let offset = 1; offset <= items.length; offset += 1) {
      const next = (start + step * offset + items.length) % items.length;
      if (!items[next]?.disabled) {
        select(next);
        return;
      }
    }
  };
  const edge = (fromEnd: boolean) => {
    const order = Array.from(items.keys());
    if (fromEnd) order.reverse();
    const next = order.find((index) => !items[index]?.disabled);
    if (next !== undefined) select(next);
  };
  return (
    <div
      aria-label={accessibilityLabel}
      role="radiogroup"
      style={{
        background: "var(--kg-color-bg-surface)",
        borderRadius: "var(--kg-foundation-radius-lg)",
        display: "flex",
        fontFamily: "var(--kg-typography-family-web)",
        gap: 2,
        maxWidth: 480,
        overflow: "hidden",
        padding: 4,
        width: "100%",
      }}
    >
      {items.map((item, index) => {
        const selected = index === selectedIndex;
        return (
          <button
            aria-checked={selected}
            disabled={item.disabled}
            key={item.value}
            onBlur={() => setFocusIndex(null)}
            onClick={() => select(index)}
            onFocus={(event) =>
              setFocusIndex(
                event.currentTarget.matches(":focus-visible") ? index : null,
              )
            }
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                move(index, 1);
              } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                move(index, -1);
              } else if (event.key === "Home") {
                event.preventDefault();
                edge(false);
              } else if (event.key === "End") {
                event.preventDefault();
                edge(true);
              }
            }}
            ref={(node) => {
              refs.current[index] = node;
            }}
            role="radio"
            type="button"
            style={{
              background: selected
                ? "var(--kg-color-bg-raised)"
                : "transparent",
              border: 0,
              borderRadius: "var(--kg-foundation-radius-md)",
              boxShadow: selected ? "var(--kg-foundation-elevation-1)" : "none",
              color: item.disabled
                ? "var(--kg-color-fg-disabled)"
                : selected
                  ? "var(--kg-color-fg-primary)"
                  : "var(--kg-color-fg-secondary)",
              flex: "1 1 0",
              font: "inherit",
              fontWeight: selected ? 600 : 500,
              minHeight: 44,
              minWidth: 0,
              outline:
                focusIndex === index
                  ? "var(--kg-foundation-focus-ring-width) solid var(--kg-color-border-focus)"
                  : "none",
              outlineOffset: "var(--kg-foundation-focus-ring-offset)",
              overflow: "hidden",
              padding: "8px 12px",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            tabIndex={selected ? 0 : -1}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function Chip({
  label,
  selected,
  disabled = false,
  onSelectedChange,
}: ChipContract) {
  if (!label.trim()) throw new Error("Chip label must not be blank.");
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      aria-pressed={selected}
      disabled={disabled}
      onBlur={() => {
        setFocused(false);
        setPressed(false);
      }}
      onClick={() => onSelectedChange(!selected)}
      onFocus={(event) =>
        setFocused(event.currentTarget.matches(":focus-visible"))
      }
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") setPressed(true);
      }}
      onKeyUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerDown={() => setPressed(true)}
      onPointerLeave={() => setPressed(false)}
      onPointerUp={() => setPressed(false)}
      style={{
        background: disabled
          ? "var(--kg-color-selection-disabled-bg)"
          : selected
            ? "var(--kg-color-selection-selected-bg)"
            : pressed
              ? "var(--kg-color-bg-surface)"
              : "var(--kg-color-selection-unselected-bg)",
        border: `1px solid ${selected ? "var(--kg-color-selection-selected-bg)" : "var(--kg-color-selection-unselected-border)"}`,
        borderRadius: 999,
        color: disabled
          ? "var(--kg-color-selection-disabled-fg)"
          : selected
            ? "var(--kg-color-selection-selected-fg)"
            : "var(--kg-color-fg-primary)",
        fontFamily: "var(--kg-typography-family-web)",
        fontSize: "var(--kg-typography-role-label-font-size)",
        fontWeight: "var(--kg-typography-role-label-font-weight)",
        maxWidth: "100%",
        minHeight: 44,
        minWidth: 0,
        outline: focused
          ? "var(--kg-foundation-focus-ring-width) solid var(--kg-color-border-focus)"
          : "none",
        outlineOffset: "var(--kg-foundation-focus-ring-offset)",
        padding: "8px 14px",
      }}
      type="button"
    >
      <span
        style={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </button>
  );
}
export function ChipGroup({ accessibilityLabel, children }: ChipGroupContract) {
  assertChipGroupContract(accessibilityLabel, children, Chip);
  return (
    <div
      aria-label={accessibilityLabel}
      role="group"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--kg-foundation-space-2)",
        maxWidth: "100%",
      }}
    >
      {children}
    </div>
  );
}
export function FilterBar({
  accessibilityLabel,
  items,
  selectedValues,
  onSelectedValuesChange,
  clearLabel = "선택 해제",
  disabled = false,
  loading = false,
}: FilterBarContract) {
  assertFilterBarContract({
    accessibilityLabel,
    items,
    selectedValues,
    onSelectedValuesChange,
    clearLabel,
    disabled,
    loading,
  });
  const [clearFocused, setClearFocused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inactive = disabled || loading;
  const selected = new Set(selectedValues);
  const toggle = (value: string) => {
    if (!inactive)
      onSelectedValuesChange(
        selected.has(value)
          ? selectedValues.filter((item) => item !== value)
          : [...selectedValues, value],
      );
  };
  const clear = () => {
    onSelectedValuesChange([]);
    requestAnimationFrame(() => {
      const next = sectionRef.current?.querySelector<HTMLButtonElement>(
        "button:not(:disabled)",
      );
      next?.focus();
    });
  };
  return (
    <section
      aria-busy={loading || undefined}
      aria-label={accessibilityLabel}
      ref={sectionRef}
      style={{
        display: "grid",
        gap: "var(--kg-foundation-space-2)",
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 8,
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        <span
          style={{
            color: "var(--kg-color-fg-primary)",
            flex: 1,
            fontFamily: "var(--kg-typography-family-web)",
            fontSize: "var(--kg-typography-role-label-font-size)",
            fontWeight: "var(--kg-typography-role-label-font-weight)",
            minWidth: 0,
            overflowWrap: "anywhere",
          }}
        >
          {accessibilityLabel}
        </span>
        {selectedValues.length ? (
          <button
            disabled={inactive}
            onBlur={() => setClearFocused(false)}
            onClick={clear}
            onFocus={() => setClearFocused(true)}
            style={{
              background: "transparent",
              border: 0,
              color: inactive
                ? "var(--kg-color-fg-disabled)"
                : "var(--kg-color-fg-secondary)",
              flex: "0 0 auto",
              font: "inherit",
              minHeight: 44,
              outline: clearFocused
                ? "var(--kg-foundation-focus-ring-width) solid var(--kg-color-border-focus)"
                : "none",
              outlineOffset: "var(--kg-foundation-focus-ring-offset)",
              padding: "8px 4px",
              textDecoration: "underline",
            }}
            type="button"
          >
            {clearLabel}
          </button>
        ) : null}
      </div>
      <ChipGroup accessibilityLabel={`${accessibilityLabel} 옵션`}>
        {items.map((item) => (
          <Chip
            disabled={inactive || item.disabled}
            key={item.value}
            label={item.label}
            onSelectedChange={() => toggle(item.value)}
            selected={selected.has(item.value)}
          />
        ))}
      </ChipGroup>
    </section>
  );
}

export function Pagination({
  accessibilityLabel,
  page,
  totalPages,
  disabled = false,
  onPageChange,
}: PaginationContract) {
  assertPaginationContract({ accessibilityLabel, page, totalPages });
  const [focused, setFocused] = useState<string | null>(null);
  const button = (target: number, label: string, content: string) => {
    const inactive = disabled || target < 1 || target > totalPages;
    return (
      <button
        aria-label={label}
        disabled={inactive}
        key={label}
        onBlur={() => setFocused(null)}
        onClick={() => onPageChange(target)}
        onFocus={(event) =>
          setFocused(
            event.currentTarget.matches(":focus-visible") ? label : null,
          )
        }
        style={{
          background: "var(--kg-color-bg-surface)",
          border: "1px solid var(--kg-color-border-subtle)",
          borderRadius: "var(--kg-foundation-radius-md)",
          color: inactive
            ? "var(--kg-color-fg-disabled)"
            : "var(--kg-color-fg-primary)",
          font: "inherit",
          minHeight: 44,
          minWidth: 44,
          outline:
            focused === label
              ? "var(--kg-foundation-focus-ring-width) solid var(--kg-color-border-focus)"
              : "none",
          outlineOffset: "var(--kg-foundation-focus-ring-offset)",
          padding: "8px 10px",
        }}
        type="button"
      >
        {content}
      </button>
    );
  };
  const current = (item: number) => (
    <span
      aria-current="page"
      aria-label={`${item}페이지, 현재 페이지`}
      key={item}
      style={{
        alignItems: "center",
        background: "var(--kg-color-action-primary-bg)",
        border: "1px solid var(--kg-color-action-primary-bg)",
        borderRadius: "var(--kg-foundation-radius-md)",
        color: "var(--kg-color-action-primary-fg)",
        display: "inline-flex",
        justifyContent: "center",
        minHeight: 44,
        minWidth: 44,
        padding: "8px 10px",
      }}
    >
      {item}
    </span>
  );
  return (
    <nav
      aria-label={accessibilityLabel}
      style={{
        alignItems: "center",
        display: "flex",
        flexWrap: "wrap",
        fontFamily: "var(--kg-typography-family-web)",
        gap: 4,
      }}
    >
      {button(page - 1, "이전 페이지", "‹")}
      {getPaginationItems(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span
            aria-hidden="true"
            key={`ellipsis-${index}`}
            style={{ minWidth: 24, textAlign: "center" }}
          >
            …
          </span>
        ) : item === page ? (
          current(item)
        ) : (
          button(item, `${item}페이지`, String(item))
        ),
      )}
      {button(page + 1, "다음 페이지", "›")}
    </nav>
  );
}

export function AppBar({
  title,
  subtitle,
  leadingAction,
  trailingActions = [],
}: AppBarContract) {
  assertAppBarContract({ title, subtitle, leadingAction, trailingActions });
  const action = (item: NonNullable<AppBarContract["leadingAction"]>) => (
    <IconButton
      accessibilityLabel={item.accessibilityLabel}
      disabled={item.disabled}
      icon={item.icon}
      key={item.accessibilityLabel}
      loading={item.loading}
      onAction={item.onAction}
      onActionError={item.onActionError}
      size="sm"
    />
  );
  const sideWidth = Math.max(
    48,
    trailingActions.length * 44 + Math.max(0, trailingActions.length - 1) * 4,
  );
  return (
    <header
      style={{
        alignItems: "center",
        background: "var(--kg-color-bg-canvas)",
        borderBottom: "1px solid var(--kg-color-border-subtle)",
        color: "var(--kg-color-fg-primary)",
        display: "grid",
        fontFamily: "var(--kg-typography-family-web)",
        gap: 8,
        gridTemplateColumns: `${sideWidth}px minmax(0, 1fr) ${sideWidth}px`,
        minHeight: 64,
        padding: "8px 16px",
      }}
    >
      <div style={{ justifySelf: "start" }}>
        {leadingAction ? action(leadingAction) : null}
      </div>
      <div style={{ minWidth: 0, textAlign: "center" }}>
        <h1
          style={{
            fontSize: "var(--kg-typography-role-heading-font-size)",
            fontWeight: "var(--kg-typography-role-heading-font-weight)",
            lineHeight: "var(--kg-typography-role-heading-line-height)",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            style={{
              color: "var(--kg-color-fg-secondary)",
              fontSize: "var(--kg-typography-role-caption-font-size)",
              lineHeight: "var(--kg-typography-role-caption-line-height)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      <div style={{ display: "flex", gap: 4, justifySelf: "end" }}>
        {trailingActions.map(action)}
      </div>
    </header>
  );
}

export function Breadcrumb({ accessibilityLabel, items }: BreadcrumbContract) {
  assertBreadcrumbContract({ accessibilityLabel, items });
  const [focused, setFocused] = useState<string | null>(null);
  return (
    <nav
      aria-label={accessibilityLabel}
      style={{
        color: "var(--kg-color-fg-secondary)",
        fontFamily: "var(--kg-typography-family-web)",
        maxWidth: "100%",
      }}
    >
      <ol
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li
              key={item.label}
              style={{ alignItems: "center", display: "flex", minWidth: 0 }}
            >
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  style={{ display: "inline-flex", flex: "0 0 auto" }}
                >
                  <Icon name="chevron-right" size={16} />
                </span>
              ) : null}
              {current ? (
                <span
                  aria-current="page"
                  style={{
                    color: "var(--kg-color-fg-primary)",
                    display: "block",
                    fontWeight: 600,
                    maxWidth: 240,
                    overflow: "hidden",
                    padding: "10px 8px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  onBlur={() => setFocused(null)}
                  onFocus={(event) =>
                    setFocused(
                      event.currentTarget.matches(":focus-visible")
                        ? item.label
                        : null,
                    )
                  }
                  style={{
                    color: "var(--kg-color-fg-secondary)",
                    display: "block",
                    maxWidth: 200,
                    minHeight: 44,
                    outline:
                      focused === item.label
                        ? "var(--kg-foundation-focus-ring-width) solid var(--kg-color-border-focus)"
                        : "none",
                    outlineOffset: "var(--kg-foundation-focus-ring-offset)",
                    overflow: "hidden",
                    padding: "11px 8px",
                    textDecoration: "underline",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
