"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "@kimgseok/design-button/web";
import {
  resolveMotionRecipe,
  useMotionPresence,
  useReducedMotion,
} from "@kimgseok/design-motion/web";
import {
  assertConfirmationContract,
  assertMenuContract,
  type BottomSheetContract,
  type ConfirmationContract,
  type DialogContract,
  type MenuContract,
  type MenuPlacement,
  type TooltipContract,
} from "./contracts";
import { isTopOverlay, registerOverlay } from "./web-overlay-manager";

const focusableSelector =
  'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

type WebDialogProps = DialogContract & {
  returnFocusRef?: RefObject<HTMLElement | null>;
  initialFocusSelector?: string;
};
export function Dialog({
  open,
  title,
  description,
  children,
  footer,
  intent = "default",
  closeOnBackdrop = false,
  onOpenChange,
  returnFocusRef,
  initialFocusSelector,
}: WebDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();
  const presence = useMotionPresence(open, reduceMotion);
  const transition = resolveMotionRecipe(
    presence.phase === "exiting" ? "exit" : "overlay",
    reduceMotion,
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (!presence.rendered) return;
    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const panel = panelRef.current;
    if (!panel) return;
    const unregister = registerOverlay(panel);
    queueMicrotask(() => {
      (
        (initialFocusSelector ? panel.querySelector<HTMLElement>(initialFocusSelector) : null) ??
        panel.querySelector<HTMLElement>("[autofocus]") ??
        panel.querySelector<HTMLElement>(focusableSelector) ??
        panel
      ).focus();
    });
    return () => {
      const wasTop = unregister();
      const target = returnFocusRef?.current ?? previousFocus.current;
      if (wasTop) requestAnimationFrame(() => target?.focus());
    };
  }, [initialFocusSelector, presence.rendered, returnFocusRef]);
  if (!presence.rendered) return null;
  const visible = presence.phase === "entered";
  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      if (event.defaultPrevented || !isTopOverlay(event.currentTarget)) return;
      event.preventDefault();
      event.stopPropagation();
      onOpenChange(false);
      return;
    }
    if (event.key !== "Tab") return;
    const nodes = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(focusableSelector),
    );
    if (!nodes.length) {
      event.preventDefault();
      event.currentTarget.focus();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const canCloseOnBackdrop = intent !== "destructive" && closeOnBackdrop;
  return createPortal(
    <div
      onMouseDown={(event) => {
        if (canCloseOnBackdrop && event.target === event.currentTarget)
          onOpenChange(false);
      }}
      style={{
        alignItems: "center",
        background: "rgba(25,31,40,.56)",
        display: "flex",
        inset: 0,
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        padding: 16,
        position: "fixed",
        transition: `opacity ${transition.duration}ms ${transition.easing}`,
        zIndex: 1100,
      }}
    >
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        onKeyDown={trapFocus}
        ref={panelRef}
        role="dialog"
        style={{
          background: "var(--kg-color-bg-raised)",
          borderRadius: "var(--kg-foundation-radius-xl)",
          boxShadow: "0 16px 48px rgba(0,0,0,.24)",
          boxSizing: "border-box",
          color: "var(--kg-color-fg-primary)",
          display: "grid",
          fontFamily: "var(--kg-typography-family-web)",
          gap: 16,
          gridTemplateRows: "auto minmax(0, 1fr) auto",
          maxHeight: "min(720px, calc(100dvh - 32px))",
          maxWidth: 480,
          overflow: "hidden",
          padding: 24,
          transform: visible ? "translateY(0) scale(1)" : "translateY(4px) scale(.98)",
          transition: `transform ${transition.duration}ms ${transition.easing}`,
          width: "100%",
        }}
        tabIndex={-1}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <h2
            id={titleId}
            style={{
              fontSize: "var(--kg-typography-role-heading-font-size)",
              lineHeight: "var(--kg-typography-role-heading-line-height)",
              margin: 0,
            }}
          >
            {title}
          </h2>
          {description ? (
            <p
              id={descriptionId}
              style={{ color: "var(--kg-color-fg-secondary)", margin: 0 }}
            >
              {description}
            </p>
          ) : null}
        </div>
        <div style={{ minHeight: 0, overflow: "auto" }}>{children}</div>
        {footer}
      </div>
    </div>,
    document.body,
  );
}

type WebBottomSheetProps = BottomSheetContract & {
  returnFocusRef?: RefObject<HTMLElement | null>;
};
export function BottomSheet({
  open,
  title,
  description,
  children,
  footer,
  intent = "default",
  closeOnBackdrop = true,
  onOpenChange,
  returnFocusRef,
}: WebBottomSheetProps) {
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();
  const presence = useMotionPresence(open, reduceMotion);
  const transition = resolveMotionRecipe(
    presence.phase === "exiting" ? "exit" : "overlay",
    reduceMotion,
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (!presence.rendered) return;
    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const panel = panelRef.current;
    if (!panel) return;
    const unregister = registerOverlay(panel);
    queueMicrotask(() =>
      (panel.querySelector<HTMLElement>(focusableSelector) ?? panel).focus(),
    );
    return () => {
      const wasTop = unregister();
      const target = returnFocusRef?.current ?? previousFocus.current;
      if (wasTop) requestAnimationFrame(() => target?.focus());
    };
  }, [presence.rendered, returnFocusRef]);
  if (!presence.rendered) return null;
  const visible = presence.phase === "entered";
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      if (event.defaultPrevented || !isTopOverlay(event.currentTarget)) return;
      event.preventDefault();
      event.stopPropagation();
      onOpenChange(false);
      return;
    }
    if (event.key !== "Tab") return;
    const nodes = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(focusableSelector),
    );
    if (!nodes.length) {
      event.preventDefault();
      event.currentTarget.focus();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  const canCloseOnBackdrop = intent !== "destructive" && closeOnBackdrop;
  return createPortal(
    <div
      onMouseDown={(event) => {
        if (canCloseOnBackdrop && event.target === event.currentTarget)
          onOpenChange(false);
      }}
      style={{
        alignItems: "flex-end",
        background: "rgba(25,31,40,.56)",
        display: "flex",
        inset: 0,
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        position: "fixed",
        transition: `opacity ${transition.duration}ms ${transition.easing}`,
        zIndex: 1100,
      }}
    >
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        onKeyDown={onKeyDown}
        ref={panelRef}
        role="dialog"
        style={{
          background: "var(--kg-color-bg-raised)",
          borderRadius:
            "var(--kg-foundation-radius-xl) var(--kg-foundation-radius-xl) 0 0",
          boxSizing: "border-box",
          color: "var(--kg-color-fg-primary)",
          display: "grid",
          fontFamily: "var(--kg-typography-family-web)",
          gap: 16,
          gridTemplateRows: "auto auto minmax(0, 1fr) auto",
          maxHeight: "min(80dvh, 720px)",
          maxWidth: 640,
          overflow: "hidden",
          padding: "12px 24px max(24px, env(safe-area-inset-bottom))",
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: `transform ${transition.duration}ms ${transition.easing}`,
          width: "100%",
        }}
        tabIndex={-1}
      >
        <span
          aria-hidden="true"
          style={{
            background: "var(--kg-color-border-strong)",
            borderRadius: 999,
            height: 4,
            justifySelf: "center",
            width: 40,
          }}
        />
        <div style={{ display: "grid", gap: 8 }}>
          <h2
            id={titleId}
            style={{
              fontSize: "var(--kg-typography-role-heading-font-size)",
              lineHeight: "var(--kg-typography-role-heading-line-height)",
              margin: 0,
            }}
          >
            {title}
          </h2>
          {description ? (
            <p
              id={descriptionId}
              style={{ color: "var(--kg-color-fg-secondary)", margin: 0 }}
            >
              {description}
            </p>
          ) : null}
        </div>
        <div style={{ minHeight: 0, overflow: "auto" }}>{children}</div>
        {footer}
      </div>
    </div>,
    document.body,
  );
}

type TooltipTriggerProps = HTMLAttributes<HTMLElement> & {
  "aria-describedby"?: string;
  ref: (node: HTMLElement | null) => void;
};
type WebTooltipProps = TooltipContract & {
  children: (triggerProps: TooltipTriggerProps) => ReactElement;
};
export function Tooltip({ content, children, delayMs = 500 }: WebTooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const timer = useRef<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const clearTimer = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };
  const show = () => {
    clearTimer();
    timer.current = window.setTimeout(
      () => setOpen(true),
      Math.max(0, Number.isFinite(delayMs) ? delayMs : 500),
    );
  };
  const hide = () => {
    clearTimer();
    setOpen(false);
  };
  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const margin = 8;
    const gap = 8;
    const center = triggerRect.left + triggerRect.width / 2;
    const half = tooltipRect.width / 2;
    const left = Math.min(
      window.innerWidth - margin - half,
      Math.max(margin + half, center),
    );
    const topAbove = triggerRect.top - gap - tooltipRect.height;
    const top =
      topAbove >= margin
        ? topAbove
        : Math.min(
            window.innerHeight - margin - tooltipRect.height,
            triggerRect.bottom + gap,
          );
    setPosition({ left, top: Math.max(margin, top) });
  }, []);
  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    const observer = new ResizeObserver(reposition);
    if (triggerRef.current) observer.observe(triggerRef.current);
    if (tooltipRef.current) observer.observe(tooltipRef.current);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open, reposition]);
  useEffect(() => {
    if (!open) return;
    const consumeEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      hide();
    };
    document.addEventListener("keydown", consumeEscape, true);
    return () => document.removeEventListener("keydown", consumeEscape, true);
  }, [open]);
  useEffect(() => {
    const onStackChange = (event: Event) => {
      const top = (event as CustomEvent<{ top?: HTMLElement }>).detail.top;
      if (top && triggerRef.current && !top.contains(triggerRef.current))
        hide();
    };
    document.addEventListener("kg-overlay-stack-change", onStackChange);
    return () =>
      document.removeEventListener("kg-overlay-stack-change", onStackChange);
  }, []);
  useEffect(() => () => clearTimer(), []);
  const trigger = children({
    "aria-describedby": open ? id : undefined,
    onBlur: hide,
    onFocus: (event) => {
      triggerRef.current = event.currentTarget;
      show();
    },
    onPointerEnter: (event) => {
      triggerRef.current = event.currentTarget;
      if (event.pointerType !== "touch") show();
    },
    onPointerLeave: hide,
    ref: (node) => {
      triggerRef.current = node;
    },
  });
  const portalTarget =
    triggerRef.current?.closest<HTMLElement>('[role="dialog"]')
      ?.parentElement ??
    (typeof document !== "undefined" ? document.body : null);
  return (
    <>
      {trigger}
      {open && portalTarget
        ? createPortal(
            <div
              id={id}
              ref={tooltipRef}
              role="tooltip"
              style={{
                background: "var(--kg-color-feedback-overlay-bg)",
                borderRadius: "var(--kg-foundation-radius-sm)",
                color: "var(--kg-color-feedback-overlay-fg)",
                fontFamily: "var(--kg-typography-family-web)",
                fontSize: "var(--kg-typography-role-caption-font-size)",
                left: position.left,
                maxWidth: "min(240px, calc(100vw - 16px))",
                padding: "6px 8px",
                pointerEvents: "none",
                position: "fixed",
                top: position.top,
                transform: "translateX(-50%)",
                width: "max-content",
                zIndex: 1200,
              }}
            >
              {content}
            </div>,
            portalTarget,
          )
        : null}
    </>
  );
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  intent = "default",
  closeOnBackdrop = false,
  onOpenChange,
  onConfirm,
  onConfirmError,
}: ConfirmationContract) {
  assertConfirmationContract({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel,
    intent,
    closeOnBackdrop,
    onOpenChange,
    onConfirm,
    onConfirmError,
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const session = useRef(0);
  useEffect(() => {
    session.current += 1;
    setPending(false);
    setError("");
    lock.current = false;
  }, [open]);
  const confirm = async () => {
    if (lock.current) return;
    lock.current = true;
    const operation = session.current;
    setPending(true);
    setError("");
    try {
      await onConfirm();
      if (operation === session.current && open) onOpenChange(false);
    } catch (nextError) {
      if (operation !== session.current) return;
      setError("작업을 완료하지 못했어요. 다시 시도해 주세요.");
      try {
        onConfirmError(nextError);
      } catch {}
    } finally {
      if (operation === session.current) {
        lock.current = false;
        setPending(false);
      }
    }
  };
  const footer = (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "flex-end",
      }}
    >
      <Button
        disabled={pending}
        onAction={() => onOpenChange(false)}
        variant="tertiary"
      >
        {cancelLabel}
      </Button>
      <Button
        loading={pending}
        onAction={confirm}
        onActionError={onConfirmError}
        variant={intent === "destructive" ? "danger" : "primary"}
      >
        {confirmLabel}
      </Button>
    </div>
  );
  return (
    <Dialog
      closeOnBackdrop={intent === "destructive" ? false : closeOnBackdrop}
      description={description}
      footer={
        <>
          {error ? (
            <p
              aria-live="assertive"
              style={{ color: "var(--kg-color-status-negative-fg)", margin: 0 }}
            >
              {error}
            </p>
          ) : null}
          {footer}
        </>
      }
      intent={intent}
      onOpenChange={(next) => {
        if (!pending) onOpenChange(next);
      }}
      open={open}
      title={title}
    />
  );
}

function menuPosition(placement: MenuPlacement) {
  const [side, align] = placement.split("-") as [string, string | undefined];
  const style: Record<string, string | number> = {
    position: "absolute",
    zIndex: 1050,
  };
  if (side === "top") {
    style.bottom = "calc(100% + 8px)";
    style.left = align === "end" ? "auto" : align === "start" ? 0 : "50%";
    style.right = align === "end" ? 0 : "auto";
    if (!align) style.transform = "translateX(-50%)";
  }
  if (side === "bottom") {
    style.top = "calc(100% + 8px)";
    style.left = align === "end" ? "auto" : align === "start" ? 0 : "50%";
    style.right = align === "end" ? 0 : "auto";
    if (!align) style.transform = "translateX(-50%)";
  }
  if (side === "left") {
    style.right = "calc(100% + 8px)";
    style.top = align === "end" ? "auto" : align === "start" ? 0 : "50%";
    style.bottom = align === "end" ? 0 : "auto";
    if (!align) style.transform = "translateY(-50%)";
  }
  if (side === "right") {
    style.left = "calc(100% + 8px)";
    style.top = align === "end" ? "auto" : align === "start" ? 0 : "50%";
    style.bottom = align === "end" ? 0 : "auto";
    if (!align) style.transform = "translateY(-50%)";
  }
  return style;
}

export function Menu({
  accessibilityLabel,
  triggerLabel,
  items,
  header,
  open,
  defaultOpen,
  disabled = false,
  placement = "bottom-start",
  onOpenChange,
  onAction,
  onCheckedChange,
}: MenuContract) {
  assertMenuContract({
    accessibilityLabel,
    triggerLabel,
    items,
    header,
    open,
    defaultOpen,
    disabled,
    placement,
    onOpenChange,
    onAction,
    onCheckedChange,
  });
  const controlled = open !== undefined;
  const [localOpen, setLocalOpen] = useState(defaultOpen ?? false);
  const shown = controlled ? open : localOpen;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusVisible, setFocusVisible] = useState(false);
  const [focusedItem, setFocusedItem] = useState<number | null>(null);
  const setShown = (next: boolean) => {
    if (!controlled) setLocalOpen(next);
    onOpenChange?.(next);
  };
  useEffect(() => {
    if (!shown) return;
    const outside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setShown(false);
    };
    document.addEventListener("pointerdown", outside);
    queueMicrotask(() =>
      itemRefs.current.find((node) => node && !node.disabled)?.focus(),
    );
    return () => document.removeEventListener("pointerdown", outside);
  }, [shown]);
  const move = (index: number, delta: 1 | -1) => {
    for (let offset = 1; offset <= items.length; offset += 1) {
      const next = (index + delta * offset + items.length) % items.length;
      if (!items[next]?.disabled) {
        itemRefs.current[next]?.focus();
        break;
      }
    }
  };
  const choose = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    if (item.kind === "checkbox") onCheckedChange?.(item.value, !item.checked);
    else {
      onAction(item.value);
      setShown(false);
      triggerRef.current?.focus();
    }
  };
  return (
    <div
      ref={rootRef}
      style={{
        display: "inline-block",
        fontFamily: "var(--kg-typography-family-web)",
        position: "relative",
      }}
    >
      <button
        aria-expanded={shown}
        aria-haspopup="menu"
        disabled={disabled}
        onBlur={() => setFocusVisible(false)}
        onClick={() => setShown(!shown)}
        onFocus={(event) =>
          setFocusVisible(event.currentTarget.matches(":focus-visible"))
        }
        ref={triggerRef}
        style={{
          background: "var(--kg-color-bg-surface)",
          border: "1px solid var(--kg-color-border-strong)",
          borderRadius: "var(--kg-foundation-radius-md)",
          color: disabled
            ? "var(--kg-color-fg-disabled)"
            : "var(--kg-color-fg-primary)",
          font: "inherit",
          minHeight: 44,
          outline: focusVisible
            ? "var(--kg-foundation-focus-ring-width) solid var(--kg-color-border-focus)"
            : "none",
          outlineOffset: "var(--kg-foundation-focus-ring-offset)",
          padding: "8px 12px",
        }}
        type="button"
      >
        {triggerLabel}
      </button>
      {shown ? (
        <div
          aria-label={accessibilityLabel}
          role="menu"
          style={{
            ...menuPosition(placement),
            background: "var(--kg-color-bg-raised)",
            border: "1px solid var(--kg-color-border-subtle)",
            borderRadius: "var(--kg-foundation-radius-lg)",
            boxShadow: "var(--kg-foundation-elevation-2)",
            boxSizing: "border-box",
            color: "var(--kg-color-fg-primary)",
            minWidth: 200,
            overflow: "hidden",
            padding: 8,
          }}
        >
          {header ? (
            <div
              role="presentation"
              style={{
                color: "var(--kg-color-fg-secondary)",
                fontSize: "var(--kg-typography-role-caption-font-size)",
                fontWeight: 600,
                padding: "8px 12px",
              }}
            >
              {header}
            </div>
          ) : null}
          {items.map((item, index) => (
            <button
              aria-checked={item.kind === "checkbox" ? item.checked : undefined}
              disabled={item.disabled}
              key={item.value}
              onBlur={() => setFocusedItem(null)}
              onClick={() => choose(index)}
              onFocus={(event) =>
                setFocusedItem(
                  event.currentTarget.matches(":focus-visible") ? index : null,
                )
              }
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  move(index, 1);
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  move(index, -1);
                } else if (event.key === "Home") {
                  event.preventDefault();
                  itemRefs.current
                    .find((node) => node && !node.disabled)
                    ?.focus();
                } else if (event.key === "End") {
                  event.preventDefault();
                  [...itemRefs.current]
                    .reverse()
                    .find((node) => node && !node.disabled)
                    ?.focus();
                } else if (event.key === "Escape") {
                  if (event.defaultPrevented) return;
                  event.preventDefault();
                  event.stopPropagation();
                  setShown(false);
                  triggerRef.current?.focus();
                } else if (event.key === "Tab") setShown(false);
              }}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              role={item.kind === "checkbox" ? "menuitemcheckbox" : "menuitem"}
              style={{
                alignItems: "center",
                background: "transparent",
                border: 0,
                borderRadius: "var(--kg-foundation-radius-md)",
                color: item.disabled
                  ? "var(--kg-color-fg-disabled)"
                  : "var(--kg-color-fg-primary)",
                display: "flex",
                font: "inherit",
                gap: 12,
                justifyContent: "space-between",
                minHeight: 44,
                outline:
                  focusedItem === index
                    ? "var(--kg-foundation-focus-ring-width) solid var(--kg-color-border-focus)"
                    : "none",
                outlineOffset:
                  "calc(var(--kg-foundation-focus-ring-offset) * -1)",
                padding: "8px 12px",
                textAlign: "left",
                width: "100%",
              }}
              tabIndex={-1}
              type="button"
            >
              <span>{item.label}</span>
              {item.kind === "checkbox" ? (
                <span aria-hidden="true">{item.checked ? "✓" : ""}</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
