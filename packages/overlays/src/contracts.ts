import type { ReactNode } from 'react';
export interface DialogContract { open: boolean; title: string; description?: string; children?: ReactNode; footer?: ReactNode; intent?: 'default' | 'destructive'; closeOnBackdrop?: boolean; onOpenChange: (open: boolean) => void; }
export interface BottomSheetContract { open: boolean; title: string; description?: string; children?: ReactNode; footer?: ReactNode; intent?: 'default' | 'destructive'; closeOnBackdrop?: boolean; onOpenChange: (open: boolean) => void; }
export interface TooltipContract { content: string; delayMs?: number; }
export interface ConfirmationContract {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  intent?: 'default' | 'destructive';
  closeOnBackdrop?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  onConfirmError: (error: unknown) => void;
}
export function assertConfirmationContract({ open, title, description, confirmLabel, cancelLabel, intent = 'default', closeOnBackdrop = false, onOpenChange, onConfirm, onConfirmError }: ConfirmationContract) { if (typeof open !== 'boolean' || !title.trim() || description !== undefined && !description.trim() || !confirmLabel.trim() || !cancelLabel.trim() || confirmLabel.trim() === cancelLabel.trim() || intent !== 'default' && intent !== 'destructive' || typeof closeOnBackdrop !== 'boolean' || typeof onOpenChange !== 'function' || typeof onConfirm !== 'function' || typeof onConfirmError !== 'function') throw new Error('Confirmation requires distinct labels, valid state, intent, and lifecycle callbacks.'); }
export type MenuPlacement = 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
export interface MenuItem {
  value: string;
  label: string;
  kind?: 'action' | 'checkbox';
  checked?: boolean;
  disabled?: boolean;
}
export interface MenuContract {
  accessibilityLabel: string;
  triggerLabel: string;
  items: readonly MenuItem[];
  header?: string;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  placement?: MenuPlacement;
  onOpenChange?: (open: boolean) => void;
  onAction: (value: string) => void;
  onCheckedChange?: (value: string, checked: boolean) => void;
}
const menuPlacements: readonly MenuPlacement[] = ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end'];
export function assertMenuContract({ accessibilityLabel, triggerLabel, items, header, open, defaultOpen, disabled = false, placement = 'bottom-start', onOpenChange, onAction, onCheckedChange }: MenuContract) {
  if (!accessibilityLabel.trim() || !triggerLabel.trim() || header !== undefined && !header.trim() || items.length === 0 || typeof disabled !== 'boolean' || typeof onAction !== 'function') throw new Error('Menu requires labels, at least one item, and an action callback.');
  if (open !== undefined && typeof open !== 'boolean' || defaultOpen !== undefined && typeof defaultOpen !== 'boolean' || open !== undefined && defaultOpen !== undefined || open !== undefined && typeof onOpenChange !== 'function') throw new Error('Menu controlled and uncontrolled open state must not be mixed.');
  if (items.some((item) => !item.value.trim() || !item.label.trim() || item.kind !== undefined && item.kind !== 'action' && item.kind !== 'checkbox' || item.disabled !== undefined && typeof item.disabled !== 'boolean' || item.kind === 'checkbox' && typeof item.checked !== 'boolean') || new Set(items.map((item) => item.value)).size !== items.length) throw new Error('Menu items require unique values, labels, kinds, and valid states.');
  if (items.some((item) => item.kind === 'checkbox') && typeof onCheckedChange !== 'function') throw new Error('Checkbox menu items require onCheckedChange.');
  if (!menuPlacements.includes(placement)) throw new Error('Menu placement is invalid.');
}
