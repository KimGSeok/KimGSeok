"use client";

import { useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type MouseEvent } from 'react';
import { Icon } from '@kimgseok/design-icons/web';
import { assertActionAreaContract, buttonSize, type ActionAreaContract, type SharedButtonProps } from './contracts';

export interface WebButtonProps extends SharedButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled' | 'className' | 'style' | 'onClick'> {}

const actionName = (variant: NonNullable<SharedButtonProps['variant']>, state: 'bg' | 'bgHover' | 'bgPressed' | 'bgDisabled' | 'fg' | 'fgDisabled') => `var(--kg-color-action-${variant}-${state.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)})`;

export function Button({ variant = 'primary', size = 'md', loading = false, disabled = false, leadingIcon, trailingIcon, children, onAction, onActionError, onBlur, onFocus, onKeyDown, onKeyUp, onPointerDown, onPointerEnter, onPointerLeave, onPointerUp, ...props }: WebButtonProps) {
  const [state, setState] = useState<'bg' | 'bgHover' | 'bgPressed'>('bg');
  const [focused, setFocused] = useState(false);
  const [pending, setPending] = useState(false);
  const actionLock = useRef(false);
  const inactive = disabled || loading || pending;
  const metrics = buttonSize[size];
  const base: CSSProperties = {
    alignItems: 'center', background: actionName(variant, inactive ? 'bgDisabled' : state), border: 0, borderRadius: 'var(--kg-foundation-radius-lg)', color: actionName(variant, inactive ? 'fgDisabled' : 'fg'), cursor: inactive ? 'not-allowed' : 'pointer', display: 'inline-flex', fontFamily: 'var(--kg-typography-family-web)', fontSize: 'var(--kg-typography-role-label-font-size)', fontWeight: 'var(--kg-typography-role-label-font-weight)', gap: 'var(--kg-foundation-space-2)', justifyContent: 'center', minHeight: metrics.minHeight, minWidth: metrics.minHeight, outline: focused ? 'var(--kg-foundation-focus-ring-width) solid var(--kg-color-border-focus)' : 'none', outlineOffset: 'var(--kg-foundation-focus-ring-offset)', padding: `0 ${metrics.horizontalPadding}px`, transition: `background var(--kg-foundation-motion-fast) ease`
  };
  async function activate(event: MouseEvent<HTMLButtonElement>) {
    if (inactive) { event.preventDefault(); return; }
    if (actionLock.current) { event.preventDefault(); return; }
    actionLock.current = true; setPending(true);
    try { await onAction?.(); } catch (error) { onActionError?.(error); } finally { actionLock.current = false; setPending(false); }
  }
  return <button {...props} aria-busy={loading || pending || undefined} disabled={inactive} onBlur={(event) => { setFocused(false); setState('bg'); onBlur?.(event); }} onClick={activate} onFocus={(event) => { setFocused(event.currentTarget.matches(':focus-visible')); setState('bg'); onFocus?.(event); }} onKeyDown={(event) => { if (event.key === ' ' || event.key === 'Enter') setState('bgPressed'); onKeyDown?.(event); }} onKeyUp={(event) => { if (event.key === ' ' || event.key === 'Enter') setState('bg'); onKeyUp?.(event); }} onPointerDown={(event) => { setState('bgPressed'); onPointerDown?.(event); }} onPointerEnter={(event) => { if (!inactive && event.pointerType === 'mouse') setState('bgHover'); onPointerEnter?.(event); }} onPointerLeave={(event) => { setState('bg'); onPointerLeave?.(event); }} onPointerUp={(event) => { setState(event.pointerType === 'mouse' ? 'bgHover' : 'bg'); onPointerUp?.(event); }} style={{ ...base, maxWidth: '100%' }} type={props.type ?? 'button'}>
    {leadingIcon ? <Icon name={leadingIcon} size={20} /> : null}<span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>{loading || pending ? <span aria-hidden="true">…</span> : trailingIcon ? <Icon name={trailingIcon} size={20} /> : null}
  </button>;
}

export function ActionArea({ accessibilityLabel, primary, secondary, sticky = true }: ActionAreaContract) { assertActionAreaContract({ accessibilityLabel, primary, secondary, sticky }); return <section aria-label={accessibilityLabel} style={{ background: 'var(--kg-color-bg-canvas)', borderTop: '1px solid var(--kg-color-border-subtle)', bottom: 0, display: 'flex', gap: 'var(--kg-foundation-space-2)', padding: 'var(--kg-foundation-space-3) var(--kg-foundation-space-4)', position: sticky ? 'sticky' : 'static', width: '100%', zIndex: 1 }}>{secondary ? <Button disabled={secondary.disabled} loading={secondary.loading} onAction={secondary.onAction} onActionError={secondary.onActionError} variant="secondary">{secondary.label}</Button> : null}<Button disabled={primary.disabled} loading={primary.loading} onAction={primary.onAction} onActionError={primary.onActionError} variant="primary">{primary.label}</Button></section>; }
