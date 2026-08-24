export interface FieldContract {
  label: string;
  helpText?: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface ChoiceContract {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export interface RadioOption { label: string; value: string; disabled?: boolean; }
export interface SearchFieldContract { label: string; value: string; onValueChange: (value: string) => void; onSearch: (value: string) => void | Promise<void>; onSearchError: (error: unknown) => void; placeholder?: string; disabled?: boolean; loading?: boolean; }
export function assertSearchFieldContract({ label, value, onValueChange, onSearch, onSearchError, placeholder, disabled = false, loading = false }: SearchFieldContract) { if (!label.trim() || typeof value !== 'string' || typeof onValueChange !== 'function' || typeof onSearch !== 'function' || typeof onSearchError !== 'function' || placeholder !== undefined && !placeholder.trim() || typeof disabled !== 'boolean' || typeof loading !== 'boolean') throw new Error('SearchField contract is invalid.'); }
export interface SliderLabels { min: string; max: string; mid?: string; }
export interface SliderContract { label: string; value: number; min?: number; max?: number; step?: number; disabled?: boolean; labels?: SliderLabels; valueLabel?: (value: number) => string; showValue?: boolean; onValueChange: (value: number) => void; }
export function normalizeSliderValue(value: number, min: number, max: number, step: number) { const steps = Math.round((Math.min(max, Math.max(min, value)) - min) / step); return Number(Math.min(max, min + steps * step).toFixed(10)); }
export function assertSliderContract({ label, value, min = 0, max = 100, step = 1, disabled = false, labels, valueLabel, onValueChange }: SliderContract) { const gridSteps = (max - min) / step; const valueSteps = (value - min) / step; if (!label.trim() || !Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(step) || min >= max || step <= 0 || value < min || value > max || Math.abs(gridSteps - Math.round(gridSteps)) > 1e-8 || Math.abs(valueSteps - Math.round(valueSteps)) > 1e-8 || typeof disabled !== 'boolean' || typeof onValueChange !== 'function' || valueLabel !== undefined && typeof valueLabel !== 'function' || labels && (!labels.min.trim() || !labels.max.trim() || labels.mid !== undefined && !labels.mid.trim())) throw new Error('Slider requires a valid step-aligned label, range, value, labels, and change callback.'); }
export type DateTimeKind = 'date' | 'time' | 'datetime-local';
export interface DateTimeFieldContract { label: string; kind: DateTimeKind; value: string; onValueChange: (value: string) => void; min?: string; max?: string; disabled?: boolean; required?: boolean; helpText?: string; errorMessage?: string; }
const datePatterns: Record<DateTimeKind, RegExp> = { date: /^\d{4}-\d{2}-\d{2}$/, time: /^\d{2}:\d{2}$/, 'datetime-local': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/ };
export function isValidDateTimeValue(kind: DateTimeKind, input: string) { const pattern = datePatterns[kind]; if (!pattern?.test(input)) return false; const [datePart, timePart] = kind === 'datetime-local' ? input.split('T') : kind === 'date' ? [input, undefined] : [undefined, input]; if (datePart) { const [year, month, day] = datePart.split('-').map(Number); const date = new Date(Date.UTC(year!, month! - 1, day)); if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month! - 1 || date.getUTCDate() !== day) return false; } if (timePart) { const [hour, minute] = timePart.split(':').map(Number); if (hour! < 0 || hour! > 23 || minute! < 0 || minute! > 59) return false; } return true; }
export function assertDateTimeFieldContract({ label, kind, value, min, max, disabled = false, required = false, helpText, errorMessage, onValueChange }: DateTimeFieldContract) { if (!label.trim() || !datePatterns[kind] || value && !isValidDateTimeValue(kind, value) || min && !isValidDateTimeValue(kind, min) || max && !isValidDateTimeValue(kind, max) || min && max && min > max || value && min && value < min || value && max && value > max || typeof disabled !== 'boolean' || typeof required !== 'boolean' || helpText !== undefined && !helpText.trim() || errorMessage !== undefined && !errorMessage.trim() || typeof onValueChange !== 'function') throw new Error('DateTimeField requires a valid platform value, range, labels, and callback.'); }
