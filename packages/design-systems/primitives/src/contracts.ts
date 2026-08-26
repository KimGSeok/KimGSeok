import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import type { IconName } from '@kimgseok/design-icons/names';
import type { TextColorToken } from '@kimgseok/design-tokens/colors';
import type { TextStyle } from '@kimgseok/design-tokens/typography';

export type { PaletteColorToken, SemanticTextColorToken, TextColorToken } from '@kimgseok/design-tokens/colors';
export type { BodyTextStyle, TextSize, TextStyle, TextStyleKind, TextWeight, TitleTextStyle } from '@kimgseok/design-tokens/typography';

export type TextRole = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption';
export type TextTone = 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'onBrand';
export type SurfaceLevel = 'surface' | 'raised';
export type BadgeTone = 'neutral' | 'positive' | 'caution' | 'negative' | 'info';

export const textStyleByRole = {
  display: 'title-xxl-bold',
  title: 'title-xl-bold',
  heading: 'title-l-bold',
  body: 'text-m-regular',
  label: 'text-s-semibold',
  caption: 'text-xs-regular'
} as const satisfies Record<TextRole, TextStyle>;

export const textColorByTone = {
  primary: 'fg-primary',
  secondary: 'fg-secondary',
  tertiary: 'fg-tertiary',
  disabled: 'fg-disabled',
  onBrand: 'fg-on-brand'
} as const satisfies Record<TextTone, TextColorToken>;

export interface SharedTextProps {
  children: ReactNode;
  textStyle?: TextStyle;
  color?: TextColorToken;
  /** @deprecated Use textStyle. Compatibility support remains for the 0.x migration. */
  role?: TextRole;
  /** @deprecated Use color. Compatibility support remains for the 0.x migration. */
  tone?: TextTone;
  numberOfLines?: number;
}

export interface SharedSurfaceProps {
  children: ReactNode;
  level?: SurfaceLevel;
  elevation?: 0 | 1 | 2;
}

export interface SharedIconButtonProps {
  accessibilityLabel: string;
  icon: IconName;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onAction?: () => void | Promise<void>;
  onActionError?: (error: unknown) => void;
}
export interface SharedBadgeProps { label: string; tone?: BadgeTone; size?: 'sm' | 'md'; }
export function assertBadgeContract({ label, tone = 'neutral', size = 'md' }: SharedBadgeProps) { if (!label.trim()) throw new Error('Badge label must not be blank.'); if (!['neutral', 'positive', 'caution', 'negative', 'info'].includes(tone) || !['sm', 'md'].includes(size)) throw new Error('Badge tone or size is invalid.'); }
export type CardVariant = 'outlined' | 'raised';
export interface SharedCardProps { children: ReactNode; variant?: CardVariant; accessibilityLabel?: string; }
function hasCardContent(children: ReactNode): boolean { return Children.toArray(children).some((child) => { if (typeof child === 'string') return Boolean(child.trim()); if (typeof child === 'number') return true; if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) return hasCardContent(child.props.children); return true; }); }
export function assertCardContract({ children, variant = 'outlined', accessibilityLabel }: SharedCardProps) { if (!hasCardContent(children) || !['outlined', 'raised'].includes(variant) || accessibilityLabel !== undefined && !accessibilityLabel.trim()) throw new Error('Card contract is invalid.'); }
export function assertNativeCardContract(props: SharedCardProps) { assertCardContract(props); if (props.accessibilityLabel !== undefined) throw new Error('NativeCard does not accept accessibilityLabel; use a visible NativeHeading.'); }
export interface ListItemAction { onAction: () => void | Promise<void>; onActionError: (error: unknown) => void; accessibilityLabel?: string; }
export interface SharedListItemProps { title: string; description?: string; metadata?: string; leadingIcon?: IconName; trailing?: 'chevron' | 'none'; action?: ListItemAction; disabled?: boolean; loading?: boolean; }
export function assertListItemContract({ title, description, metadata, leadingIcon, trailing = 'none', action, disabled = false, loading = false }: SharedListItemProps) { if (!title.trim() || description !== undefined && !description.trim() || metadata !== undefined && !metadata.trim() || !['chevron', 'none'].includes(trailing) || trailing === 'chevron' && action === undefined || leadingIcon !== undefined && !['add', 'check', 'chevron-left', 'chevron-right', 'close', 'menu'].includes(leadingIcon) || typeof disabled !== 'boolean' || typeof loading !== 'boolean' || loading && action === undefined || action !== undefined && (typeof action.onAction !== 'function' || typeof action.onActionError !== 'function' || action.accessibilityLabel !== undefined && !action.accessibilityLabel.trim())) throw new Error('ListItem contract is invalid.'); }
export function getListItemAccessibleName({ title, description, metadata, action }: SharedListItemProps) { return action?.accessibilityLabel ?? [title, description, metadata].filter((value): value is string => Boolean(value)).join(', '); }
export interface EmptyStateAction { label: string; onAction: () => void | Promise<void>; onActionError: (error: unknown) => void; }
export interface SharedEmptyStateProps { title: string; description: string; icon?: IconName; action?: EmptyStateAction; }
export function assertEmptyStateContract({ title, description, icon, action }: SharedEmptyStateProps) { if (!title.trim() || !description.trim() || icon !== undefined && !['add', 'check', 'chevron-left', 'chevron-right', 'close', 'menu'].includes(icon) || action !== undefined && (!action.label.trim() || typeof action.onAction !== 'function' || typeof action.onActionError !== 'function')) throw new Error('EmptyState contract is invalid.'); }
export interface SharedSkeletonProps { shape?: 'text' | 'block' | 'circle'; size?: 'sm' | 'md' | 'lg' | 'full'; }
export function assertSkeletonContract({ shape = 'text', size = 'md' }: SharedSkeletonProps) { if (!['text', 'block', 'circle'].includes(shape) || !['sm', 'md', 'lg', 'full'].includes(size) || shape === 'circle' && size === 'full') throw new Error('Skeleton contract is invalid.'); }
export interface SharedSkeletonRegionProps { accessibilityLabel: string; items: readonly SharedSkeletonProps[]; }
export function assertSkeletonRegionContract({ accessibilityLabel, items }: SharedSkeletonRegionProps) { if (!accessibilityLabel.trim() || !Array.isArray(items) || items.length === 0) throw new Error('SkeletonRegion contract is invalid.'); items.forEach(assertSkeletonContract); }
export interface TableColumn { id: string; label: string; align?: 'start' | 'end'; }
export interface TableRow { id: string; cells: Record<string, string>; }
export interface SharedTableProps { caption: string; columns: readonly TableColumn[]; rows: readonly TableRow[]; }
export function assertTableContract({ caption, columns, rows }: SharedTableProps) { if (!caption.trim() || !Array.isArray(columns) || columns.length < 1 || columns.length > 8 || !Array.isArray(rows) || rows.length === 0) throw new Error('Table contract is invalid.'); const ids = new Set<string>(); for (const column of columns) { if (!column.id.trim() || !column.label.trim() || ids.has(column.id) || column.align !== undefined && !['start', 'end'].includes(column.align)) throw new Error('Table contract is invalid.'); ids.add(column.id); } const rowIds = new Set<string>(); for (const row of rows) { if (!row.id.trim() || rowIds.has(row.id)) throw new Error('Table contract is invalid.'); rowIds.add(row.id); for (const id of Array.from(ids)) if (typeof row.cells[id] !== 'string' || !row.cells[id].trim()) throw new Error('Table contract is invalid.'); if (Object.keys(row.cells).some((id) => !ids.has(id))) throw new Error('Table contract is invalid.'); } }
export type AvatarAccessibility = { kind: 'decorative' } | { kind: 'labelled'; label: string };
export interface SharedAvatarProps { name: string; sourceUri?: string; size?: 'sm' | 'md' | 'lg'; accessibility: AvatarAccessibility; }
export function getAvatarInitials(name: string) {
  const value = name.trim();
  const Segmenter = (Intl as typeof Intl & { Segmenter?: new (locale?: string, options?: { granularity: 'grapheme' }) => { segment(input: string): Iterable<{ segment: string }> } }).Segmenter;
  const graphemes = Segmenter ? Array.from(new Segmenter(undefined, { granularity: 'grapheme' }).segment(value), ({ segment }) => segment) : Array.from(value);
  return graphemes.slice(0, 2).join('').toLocaleUpperCase();
}
export function assertAvatarContract({ name, sourceUri, size = 'md', accessibility }: SharedAvatarProps) {
  if (!name.trim() || !['sm', 'md', 'lg'].includes(size)) throw new Error('Avatar name or size is invalid.');
  if (sourceUri !== undefined) {
    let parsed: URL;
    try { parsed = new URL(sourceUri); } catch { throw new Error('Avatar sourceUri must be a valid HTTPS URL.'); }
    if (parsed.protocol !== 'https:' || !parsed.hostname || parsed.username || parsed.password || /[\u0000-\u0020\u007f\\]/.test(sourceUri)) throw new Error('Avatar sourceUri must be a valid HTTPS URL without credentials.');
  }
  if (!accessibility || !['decorative', 'labelled'].includes(accessibility.kind) || accessibility.kind === 'labelled' && !accessibility.label.trim()) throw new Error('Avatar accessibility contract is invalid.');
}
export const avatarSize = { sm: 32, md: 40, lg: 56 } as const;

export const controlSize = { sm: 44, md: 48, lg: 56 } as const;
