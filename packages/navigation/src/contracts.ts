import { Children, isValidElement, type ElementType, type ReactElement, type ReactNode } from 'react';
import type { IconName } from '@kimgseok/design-icons/names';

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
  content: ReactNode;
  panelFocusable?: boolean;
}

export interface TabsContract {
  accessibilityLabel: string;
  items: readonly TabItem[];
  value: string;
  onValueChange: (value: string) => void;
}
export interface SegmentItem { value: string; label: string; disabled?: boolean; }
export interface SegmentedControlContract { accessibilityLabel: string; items: readonly SegmentItem[]; value: string; onValueChange: (value: string) => void; }
export interface ChipContract { label: string; selected: boolean; disabled?: boolean; onSelectedChange: (selected: boolean) => void; }
export interface ChipGroupContract { accessibilityLabel: string; children: ReactElement<ChipContract> | readonly ReactElement<ChipContract>[]; }
export interface FilterItem { value: string; label: string; disabled?: boolean; }
export interface FilterBarContract { accessibilityLabel: string; items: readonly FilterItem[]; selectedValues: readonly string[]; onSelectedValuesChange: (values: string[]) => void; clearLabel?: string; disabled?: boolean; loading?: boolean; }
export interface PaginationContract { accessibilityLabel: string; page: number; totalPages: number; disabled?: boolean; onPageChange: (page: number) => void; }
export interface AppBarAction { accessibilityLabel: string; icon: IconName; disabled?: boolean; loading?: boolean; onAction: () => void | Promise<void>; onActionError: (error: unknown) => void; }
export interface AppBarContract { title: string; subtitle?: string; leadingAction?: AppBarAction; trailingActions?: readonly AppBarAction[]; }
export interface BreadcrumbItem { label: string; href?: string; }
export interface BreadcrumbContract { accessibilityLabel: string; items: readonly BreadcrumbItem[]; }
export type PaginationItem = number | 'ellipsis';
export function assertChipGroupContract(accessibilityLabel: string, children: ReactNode, expectedType: ElementType) { const items = Children.toArray(children); if (!accessibilityLabel.trim() || items.length === 0) throw new Error('ChipGroup requires a label and at least one Chip.'); if (items.some((item) => !isValidElement(item) || item.type !== expectedType)) throw new Error('ChipGroup accepts only its platform Chip children.'); }
export function assertFilterBarContract({ accessibilityLabel, items, selectedValues, onSelectedValuesChange, clearLabel = '선택 해제', disabled = false, loading = false }: FilterBarContract) { if (!accessibilityLabel.trim() || items.length < 1 || items.length > 8 || typeof onSelectedValuesChange !== 'function' || !clearLabel.trim() || typeof disabled !== 'boolean' || typeof loading !== 'boolean') throw new Error('FilterBar requires a label, one to eight items, and a selection callback.'); if (items.some((item) => !item.value.trim() || !item.label.trim() || item.disabled !== undefined && typeof item.disabled !== 'boolean') || new Set(items.map((item) => item.value)).size !== items.length || new Set(items.map((item) => item.label)).size !== items.length) throw new Error('FilterBar items require unique non-blank values and boolean disabled states.'); const valid = new Set(items.filter((item) => !item.disabled).map((item) => item.value)); if (selectedValues.some((value) => !valid.has(value)) || new Set(selectedValues).size !== selectedValues.length) throw new Error('FilterBar selected values must be unique enabled item values.'); }

export function assertTabsContract(items: readonly TabItem[], value: string, accessibilityLabel: string) {
  if (!accessibilityLabel.trim()) throw new Error('Tabs accessibilityLabel must not be blank.');
  if (items.length === 0) throw new Error('Tabs requires at least one item.');
  const values = new Set(items.map((item) => item.value));
  if (values.size !== items.length) throw new Error('Tabs item values must be unique.');
  if (items.some((item) => !item.value.trim() || !item.label.trim())) throw new Error('Tabs item values and labels must not be blank.');
  if (!items.some((item) => !item.disabled)) throw new Error('Tabs requires at least one enabled item.');
  const selected = items.find((item) => item.value === value);
  if (!selected || selected.disabled) throw new Error('Tabs value must reference an enabled item.');
}
export function assertSegmentedControlContract(items: readonly SegmentItem[], value: string, accessibilityLabel: string) {
  if (!accessibilityLabel.trim() || items.length < 2 || items.length > 4) throw new Error('SegmentedControl requires a label and two to four items.');
  if (new Set(items.map((item) => item.value)).size !== items.length || items.some((item) => !item.value.trim() || !item.label.trim())) throw new Error('SegmentedControl items require unique non-blank values and labels.');
  const selected = items.find((item) => item.value === value); if (!selected || selected.disabled) throw new Error('SegmentedControl value must reference an enabled item.');
}
export function assertPaginationContract({ accessibilityLabel, page, totalPages }: Pick<PaginationContract, 'accessibilityLabel' | 'page' | 'totalPages'>) {
  if (!accessibilityLabel.trim()) throw new Error('Pagination accessibilityLabel must not be blank.');
  if (!Number.isInteger(totalPages) || totalPages < 1) throw new Error('Pagination totalPages must be a positive integer.');
  if (!Number.isInteger(page) || page < 1 || page > totalPages) throw new Error('Pagination page must reference an existing page.');
}
export function getPaginationItems(page: number, totalPages: number): PaginationItem[] {
  assertPaginationContract({ accessibilityLabel: 'pagination', page, totalPages });
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const pages = Array.from(new Set([1, totalPages, page - 1, page, page + 1].filter((item) => item >= 1 && item <= totalPages))).sort((a, b) => a - b);
  const result: PaginationItem[] = [];
  pages.forEach((item, index) => { const previous = pages[index - 1]; if (previous !== undefined && item - previous > 1) result.push('ellipsis'); result.push(item); });
  return result;
}
export function shouldAnnounceNativePagination(platform: string, isInitial: boolean) { return platform === 'ios' && !isInitial; }
export function assertAppBarContract({ title, subtitle, leadingAction, trailingActions = [] }: Pick<AppBarContract, 'title' | 'subtitle' | 'leadingAction' | 'trailingActions'>) { if (!title.trim() || subtitle !== undefined && !subtitle.trim()) throw new Error('AppBar title and optional subtitle must not be blank.'); if (trailingActions.length > 2) throw new Error('AppBar accepts at most two trailing actions.'); const actions = [...(leadingAction ? [leadingAction] : []), ...trailingActions]; if (actions.some((action) => !action.accessibilityLabel.trim())) throw new Error('AppBar actions require non-blank accessibility labels.'); if (actions.some((action) => typeof action.onAction !== 'function' || typeof action.onActionError !== 'function')) throw new Error('AppBar actions require action and error callbacks.'); if (new Set(actions.map((action) => action.accessibilityLabel)).size !== actions.length) throw new Error('AppBar action accessibility labels must be unique.'); }
export function assertBreadcrumbContract({ accessibilityLabel, items }: BreadcrumbContract) { if (!accessibilityLabel.trim() || items.length < 2 || items.length > 5) throw new Error('Breadcrumb requires a label and two to five items.'); if (items.some((item) => !item.label.trim())) throw new Error('Breadcrumb item labels must not be blank.'); if (new Set(items.map((item) => item.label)).size !== items.length) throw new Error('Breadcrumb item labels must be unique.'); const ancestorHrefs = items.slice(0, -1).map((item) => item.href); if (ancestorHrefs.some((href) => !href || !href.startsWith('/') || href.startsWith('//') || href.includes('\\') || /[\u0000-\u0020\u007f]/.test(href)) || items.at(-1)?.href !== undefined) throw new Error('Breadcrumb ancestors require safe root-relative href and the current item must not have href.'); }
