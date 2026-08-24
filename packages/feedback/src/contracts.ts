export type FeedbackSize = 'sm' | 'md' | 'lg';
export interface SpinnerContract { accessibilityLabel?: string; size?: FeedbackSize; }
export interface ProgressContract { accessibilityLabel: string; value?: number; size?: 'sm' | 'md'; }
export type FeedbackTone = 'neutral' | 'info' | 'positive' | 'caution' | 'negative';
export interface ToastAction { label: string; onAction: () => void | Promise<void>; onError: (error: unknown) => void; }
export interface ToastContract { open: boolean; message: string; tone?: FeedbackTone; durationMs?: number | null; action?: ToastAction; onOpenChange: (open: boolean) => void; }
export interface CalloutContract { title: string; description?: string; tone?: FeedbackTone; announce?: boolean; }
export function normalizeProgress(value: number | undefined) { return value === undefined || !Number.isFinite(value) ? undefined : Math.min(1, Math.max(0, value)); }
export function normalizeToastDuration(value: number | null | undefined, persistent: boolean) { if (persistent || value === null) return null; if (value === undefined || !Number.isFinite(value)) return 4000; return Math.max(1000, value); }
