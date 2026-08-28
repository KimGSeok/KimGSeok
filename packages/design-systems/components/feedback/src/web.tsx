"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  normalizeProgress,
  normalizeToastDuration,
  type CalloutContract,
  type FeedbackTone,
  type ProgressContract,
  type SpinnerContract,
  type ToastContract,
} from "./contracts";

const spinnerSizes = { sm: 16, md: 24, lg: 32 } as const;
export function Spinner({
  accessibilityLabel = "로딩 중",
  size = "md",
  decorative = false,
}: SpinnerContract) {
  const diameter = spinnerSizes[size];
  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : accessibilityLabel}
      aria-live={decorative ? undefined : "polite"}
      role={decorative ? undefined : "status"}
      style={{
        alignItems: "center",
        display: "inline-flex",
        justifyContent: "center",
        minHeight: diameter,
        minWidth: diameter,
      }}
    >
      <style>{`@keyframes kg-feedback-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.kg-feedback-spinner{animation:none!important}}`}</style>
      <span
        aria-hidden="true"
        className="kg-feedback-spinner"
        style={{
          animation:
            "kg-feedback-spin var(--kg-foundation-motion-duration-progress-loop) var(--kg-foundation-motion-easing-linear) infinite",
          border: decorative
            ? "2px solid transparent"
            : "2px solid var(--kg-color-feedback-spinner-track)",
          borderRadius: "50%",
          borderRightColor: decorative ? "currentColor" : undefined,
          borderTopColor: decorative
            ? "currentColor"
            : "var(--kg-color-feedback-spinner-indicator)",
          boxSizing: "border-box",
          height: diameter,
          width: diameter,
        }}
      />
    </span>
  );
}

export function Progress({
  accessibilityLabel,
  value,
  size = "md",
}: ProgressContract) {
  const normalized = normalizeProgress(value);
  const percent =
    normalized === undefined ? undefined : Math.round(normalized * 100);
  const indeterminate = normalized === undefined;
  const fillStyle = {
    animation: indeterminate
      ? "kg-feedback-indeterminate var(--kg-foundation-motion-duration-progress-loop) var(--kg-foundation-motion-easing-standard) infinite"
      : undefined,
    transform: indeterminate ? undefined : `scaleX(${normalized})`,
  } as CSSProperties;
  return (
    <div
      aria-label={accessibilityLabel}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={percent}
      role="progressbar"
      style={{
        background: "var(--kg-color-feedback-progress-track)",
        borderRadius: 999,
        height: size === "sm" ? 4 : 8,
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <style>{`@keyframes kg-feedback-indeterminate{0%{transform:translateX(-100%) scaleX(.35)}100%{transform:translateX(100%) scaleX(.35)}}@media(prefers-reduced-motion:reduce){.kg-feedback-progress-indeterminate{animation:none!important;background:repeating-linear-gradient(135deg,var(--kg-color-feedback-progress-fill) 0 6px,var(--kg-color-feedback-progress-track) 6px 12px)!important;transform:none!important}}`}</style>
      <span
        aria-hidden="true"
        className={
          indeterminate
            ? "kg-feedback-progress kg-feedback-progress-indeterminate"
            : "kg-feedback-progress"
        }
        style={{
          ...fillStyle,
          background: "var(--kg-color-feedback-progress-fill)",
          borderRadius: "inherit",
          display: "block",
          height: "100%",
          transformOrigin: "left",
          transition: "transform var(--kg-foundation-motion-duration-state-change) var(--kg-foundation-motion-easing-standard)",
          width: "100%",
        }}
      />
    </div>
  );
}

function statusColors(tone: FeedbackTone) {
  if (tone === "neutral")
    return {
      background: "var(--kg-color-bg-surface)",
      border: "var(--kg-color-border-strong)",
      foreground: "var(--kg-color-fg-primary)",
    };
  return {
    background: `var(--kg-color-status-${tone}-bg)`,
    border: `var(--kg-color-status-${tone}-border)`,
    foreground: `var(--kg-color-status-${tone}-fg)`,
  };
}

function Toast({
  open,
  message,
  tone = "neutral",
  durationMs,
  action,
  onOpenChange,
}: ToastContract) {
  const [paused, setPaused] = useState(false);
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const normalizedDuration = normalizeToastDuration(
    durationMs,
    Boolean(action) || tone === "negative",
  );
  const persistent = normalizedDuration === null;
  useEffect(() => {
    if (!open || paused || persistent) return;
    const timer = window.setTimeout(
      () => onOpenChange(false),
      normalizedDuration,
    );
    return () => window.clearTimeout(timer);
  }, [normalizedDuration, onOpenChange, open, paused, persistent]);
  if (!open) return null;
  const runAction = async () => {
    if (!action || lock.current) return;
    lock.current = true;
    setPending(true);
    try {
      await action.onAction();
      onOpenChange(false);
    } catch (error) {
      try {
        action.onError(error);
      } catch {
        /* durable caller error surface owns secondary failure */
      }
    } finally {
      lock.current = false;
      setPending(false);
    }
  };
  const accent =
    tone === "neutral"
      ? "var(--kg-color-border-strong)"
      : `var(--kg-color-status-${tone}-border)`;
  const controlStyle = {
    background: "transparent",
    border: 0,
    color: "inherit",
    cursor: pending ? "wait" : "pointer",
    font: "inherit",
    fontWeight: 600,
    minHeight: 44,
    padding: "0 4px",
  } as const;
  return (
    <div
      aria-atomic="true"
      aria-live={tone === "negative" ? "assertive" : "polite"}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role={tone === "negative" ? "alert" : "status"}
      style={{
        alignItems: "center",
        background: "var(--kg-color-feedback-overlay-bg)",
        borderLeft: `4px solid ${accent}`,
        borderRadius: "var(--kg-foundation-radius-lg)",
        bottom: "max(24px, env(safe-area-inset-bottom))",
        boxShadow: "0 8px 24px rgba(0,0,0,.2)",
        color: "var(--kg-color-feedback-overlay-fg)",
        display: "flex",
        fontFamily: "var(--kg-typography-family-web)",
        gap: 12,
        left: "50%",
        maxWidth: "min(480px, calc(100vw - 32px))",
        minHeight: 48,
        padding: "12px 16px",
        position: "fixed",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      {action ? (
        <button
          aria-disabled={pending}
          disabled={pending}
          onClick={() => void runAction()}
          style={{ ...controlStyle, textDecoration: "underline" }}
          type="button"
        >
          {pending ? `${action.label} 중` : action.label}
        </button>
      ) : null}
      {persistent ? (
        <button
          aria-label="알림 닫기"
          disabled={pending}
          onClick={() => onOpenChange(false)}
          style={controlStyle}
          type="button"
        >
          닫기
        </button>
      ) : null}
    </div>
  );
}

export function ToastViewport({ toast }: { toast: ToastContract | null }) {
  return toast ? <Toast {...toast} /> : null;
}

export function Callout({
  title,
  description,
  tone = "info",
  announce = false,
}: CalloutContract) {
  const colors = statusColors(tone);
  return (
    <div
      aria-live={announce ? "polite" : undefined}
      role={announce ? "status" : undefined}
      style={{
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: "var(--kg-foundation-radius-lg)",
        color: colors.foreground,
        display: "grid",
        fontFamily: "var(--kg-typography-family-web)",
        gap: 4,
        padding: 16,
      }}
    >
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
    </div>
  );
}
