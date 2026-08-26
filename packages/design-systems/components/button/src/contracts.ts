import type { IconName } from '@kimgseok/design-icons/names';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface SharedButtonProps {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  onAction?: () => void | Promise<void>;
  onActionError?: (error: unknown) => void;
}
export interface ActionAreaAction { label: string; onAction: () => void | Promise<void>; onActionError: (error: unknown) => void; loading?: boolean; disabled?: boolean; }
export interface ActionAreaContract { accessibilityLabel: string; primary: ActionAreaAction; secondary?: ActionAreaAction; sticky?: boolean; }
export function assertActionAreaContract({ accessibilityLabel, primary, secondary, sticky = true }: ActionAreaContract) { const actions = [primary, ...(secondary ? [secondary] : [])]; if (!accessibilityLabel.trim() || typeof sticky !== 'boolean' || actions.some((action) => !action.label.trim() || typeof action.onAction !== 'function' || typeof action.onActionError !== 'function' || action.loading !== undefined && typeof action.loading !== 'boolean' || action.disabled !== undefined && typeof action.disabled !== 'boolean') || secondary?.label === primary.label) throw new Error('ActionArea requires a named primary action and an optional distinct secondary action.'); }

export const buttonSize = {
  sm: { minHeight: 44, horizontalPadding: 12 },
  md: { minHeight: 48, horizontalPadding: 16 },
  lg: { minHeight: 56, horizontalPadding: 20 }
} as const;
