import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppBar, Breadcrumb, Chip, ChipGroup, FilterBar, Pagination, SegmentedControl, Tabs } from '@kimgseok/design-navigation/web';
import TabsDefaultExample from '@kimgseok/design-examples/tabs-default';

const meta = { title: 'Navigation/Tabs', component: Tabs, parameters: { layout: 'padded' }, tags: ['autodocs'] } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ dark = false, overflow = false, external = false }: { dark?: boolean; overflow?: boolean; external?: boolean }) {
  const [value, setValue] = useState('overview');
  const base = [{ value: 'overview', label: '개요', content: <p>프로젝트의 핵심 정보를 확인합니다.</p> }, { value: 'activity', label: '활동', content: <p>최근 활동을 확인합니다.</p> }, { value: 'members', label: '멤버', content: <p>참여 중인 멤버를 확인합니다.</p> }, { value: 'disabled', label: '사용 불가', disabled: true, content: <p>표시되지 않습니다.</p> }];
  const items = overflow ? [...base, ...Array.from({ length: 6 }, (_, index) => ({ value: `more-${index}`, label: index === 5 ? '최근 결제 내역과 환불 진행 상태' : `추가 탭 ${index + 1}`, content: <p>추가 콘텐츠 {index + 1}</p> }))] : base;
  return <div data-theme={dark ? 'dark' : 'light'} style={{ background: 'var(--kg-color-bg-canvas)', color: 'var(--kg-color-fg-primary)', maxWidth: 480, padding: 24 }}>{external ? <button onClick={() => setValue('more-5')} type="button">마지막 탭 외부 선택</button> : null}<Tabs accessibilityLabel="프로젝트 정보" items={items} onValueChange={setValue} value={value} /></div>;
}
export const Default: Story = { render: () => <TabsDefaultExample /> };
export const Overflow: Story = { render: () => <Demo overflow /> };
export const Dark: Story = { render: () => <Demo dark /> };
export const ExternalSelection: Story = { render: () => <Demo external overflow /> };
function SegmentedDemo() { const [value, setValue] = useState('list'); return <SegmentedControl accessibilityLabel="보기 방식" items={[{ value: 'list', label: '목록' }, { value: 'grid', label: '격자' }, { value: 'map', label: '지도' }, { value: 'disabled', label: '사용 불가', disabled: true }]} onValueChange={setValue} value={value} />; }
export const Segmented: Story = { render: () => <SegmentedDemo /> };
function TwoSegmentDemo() { const [value, setValue] = useState('monthly'); return <SegmentedControl accessibilityLabel="조회 기간" items={[{ value: 'monthly', label: '월간' }, { value: 'yearly', label: '연간' }]} onValueChange={setValue} value={value} />; }
export const SegmentedTwo: Story = { render: () => <TwoSegmentDemo /> };
function LongSegmentDemo({ dark = false }: { dark?: boolean }) { const [value, setValue] = useState('recent'); return <div data-theme={dark ? 'dark' : 'light'} style={{ background: 'var(--kg-color-bg-canvas)', color: 'var(--kg-color-fg-primary)', padding: 16, width: 320 }}><SegmentedControl accessibilityLabel="결제 조회 방식" items={[{ value: 'recent', label: '최근 결제 내역' }, { value: 'refund', label: '환불 진행 상태' }, { value: 'disabled', label: '사용할 수 없는 항목', disabled: true }]} onValueChange={setValue} value={value} /></div>; }
export const SegmentedLong: Story = { render: () => <LongSegmentDemo /> };
export const SegmentedDark: Story = { render: () => <LongSegmentDemo dark /> };
function ChipDemo() { const [selected, setSelected] = useState(false); return <ChipGroup accessibilityLabel="배송 필터"><Chip label="무료 배송" onSelectedChange={setSelected} selected={selected} /><Chip label="선택됨" onSelectedChange={() => undefined} selected /><Chip disabled label="사용 불가" onSelectedChange={() => undefined} selected={false} /></ChipGroup>; }
export const Chips: Story = { render: () => <ChipDemo /> };
function LongChipDemo({ dark = false }: { dark?: boolean }) { const [selected, setSelected] = useState(false); return <div data-theme={dark ? 'dark' : 'light'} style={{ background: 'var(--kg-color-bg-canvas)', color: 'var(--kg-color-fg-primary)', padding: 16, width: 320 }}><ChipGroup accessibilityLabel="상품 필터"><Chip label="오늘 주문하면 내일 도착하는 무료 배송 상품" onSelectedChange={setSelected} selected={selected} /><Chip label="리뷰가 많은 상품" onSelectedChange={() => undefined} selected /><Chip label="신상품" onSelectedChange={() => undefined} selected={false} /></ChipGroup></div>; }
export const ChipsLong: Story = { render: () => <LongChipDemo /> };
export const ChipsDark: Story = { render: () => <LongChipDemo dark /> };
function FilterBarDemo({ dark = false, narrow = false, long = false, loading = false, disabled = false }: { dark?: boolean; narrow?: boolean; long?: boolean; loading?: boolean; disabled?: boolean }) { const [selectedValues, setSelectedValues] = useState<string[]>(['free']); const label = long ? '오늘 주문하면 내일 도착하는 무료 배송 상품을 위한 상세 필터' : '상품 필터'; return <div data-theme={dark ? 'dark' : 'light'} style={{ background: 'var(--kg-color-bg-canvas)', boxSizing: 'border-box', color: 'var(--kg-color-fg-primary)', maxWidth: narrow ? 320 : 480, padding: 16, width: '100%' }}><FilterBar accessibilityLabel={label} disabled={disabled} items={[{ value: 'free', label: long ? '오늘 주문하면 내일 도착하는 무료 배송 상품' : '무료 배송' }, { value: 'tomorrow', label: '내일 도착' }, { value: 'review', label: '리뷰 많은 순' }, { value: 'soldout', label: '품절 상품', disabled: true }]} loading={loading} onSelectedValuesChange={setSelectedValues} selectedValues={selectedValues} /><output aria-live="polite">선택 필터: {selectedValues.join(', ') || '없음'}</output></div>; }
export const FilterBarDefault: Story = { render: () => <FilterBarDemo /> };
export const FilterBarNarrow: Story = { render: () => <FilterBarDemo long narrow /> };
export const FilterBarDark: Story = { render: () => <FilterBarDemo dark /> };
export const FilterBarLoading: Story = { render: () => <FilterBarDemo loading /> };
export const FilterBarDisabled: Story = { render: () => <FilterBarDemo disabled /> };
function PaginationDemo({ dark = false, initialPage = 6, disabled = false, totalPages = 20, narrow = false }: { dark?: boolean; initialPage?: number; disabled?: boolean; totalPages?: number; narrow?: boolean }) { const [page, setPage] = useState(initialPage); return <div data-theme={dark ? 'dark' : 'light'} style={{ background: 'var(--kg-color-bg-canvas)', color: 'var(--kg-color-fg-primary)', padding: 16, width: narrow ? 320 : undefined }}><Pagination accessibilityLabel="검색 결과 페이지" disabled={disabled} onPageChange={setPage} page={page} totalPages={totalPages} /></div>; }
export const PaginationDefault: Story = { render: () => <PaginationDemo /> };
export const PaginationFirst: Story = { render: () => <PaginationDemo initialPage={1} /> };
export const PaginationDisabled: Story = { render: () => <PaginationDemo disabled /> };
export const PaginationDark: Story = { render: () => <PaginationDemo dark /> };
export const PaginationLast: Story = { render: () => <PaginationDemo initialPage={20} /> };
export const PaginationSmall: Story = { render: () => <PaginationDemo initialPage={2} totalPages={3} /> };
export const PaginationNarrow: Story = { render: () => <PaginationDemo narrow /> };
function AppBarDemo({ dark = false, long = false }: { dark?: boolean; long?: boolean }) { const [count, setCount] = useState(0); return <div data-theme={dark ? 'dark' : 'light'} style={{ background: 'var(--kg-color-bg-canvas)', color: 'var(--kg-color-fg-primary)', width: long ? 320 : 480 }}><AppBar leadingAction={{ accessibilityLabel: '뒤로 가기', icon: 'chevron-left', onAction: () => setCount((value) => value + 1), onActionError: () => undefined }} subtitle={long ? '상품과 배송 정보를 확인하세요' : undefined} title={long ? '오늘 주문하면 내일 도착하는 무료 배송 상품' : '주문 상세'} trailingActions={[{ accessibilityLabel: '메뉴 열기', icon: 'menu', onAction: () => undefined, onActionError: () => undefined }]} /><p aria-live="polite">뒤로 가기 실행 {count}회</p></div>; }
export const AppBarDefault: Story = { render: () => <AppBarDemo /> };
export const AppBarLong: Story = { render: () => <AppBarDemo long /> };
export const AppBarDark: Story = { render: () => <AppBarDemo dark /> };
export const AppBarNoActions: Story = { render: () => <div style={{ width: 320 }}><AppBar title="알림" /></div> };
export const AppBarTwoActions: Story = { render: () => <div style={{ width: 320 }}><AppBar leadingAction={{ accessibilityLabel: '뒤로 가기', icon: 'chevron-left', onAction: () => undefined, onActionError: () => undefined }} subtitle="상품과 배송 정보를 확인하세요" title="오늘 주문하면 내일 도착하는 무료 배송 상품" trailingActions={[{ accessibilityLabel: '추가하기', icon: 'add', onAction: () => undefined, onActionError: () => undefined }, { accessibilityLabel: '메뉴 열기', icon: 'menu', onAction: () => undefined, onActionError: () => undefined }]} /></div> };
export const AppBarDisabledLoading: Story = { render: () => <div style={{ width: 320 }}><AppBar title="편집" trailingActions={[{ accessibilityLabel: '닫기', disabled: true, icon: 'close', onAction: () => undefined, onActionError: () => undefined }, { accessibilityLabel: '저장 중', icon: 'check', loading: true, onAction: () => undefined, onActionError: () => undefined }]} /></div> };
function AppBarErrorDemo() { const [error, setError] = useState(''); return <div style={{ width: 320 }}><AppBar title="저장 오류" trailingActions={[{ accessibilityLabel: '저장하기', icon: 'check', onAction: async () => { throw new Error('save failed'); }, onActionError: () => setError('저장하지 못했어요. 다시 시도해 주세요.') }]} /><p aria-live="polite">{error}</p></div>; }
export const AppBarError: Story = { render: () => <AppBarErrorDemo /> };
const breadcrumbItems = [{ label: '홈', href: '/home' }, { label: '쇼핑', href: '/shopping' }, { label: '상품', href: '/products' }, { label: '노트북', href: '/products/laptops' }, { label: '오늘 주문하면 내일 도착하는 업무용 노트북' }];
const breadcrumbShort = [{ label: '홈', href: '/home' }, { label: '상품', href: '/products' }, { label: '노트북' }];
export const BreadcrumbDefault: Story = { render: () => <Breadcrumb accessibilityLabel="현재 위치" items={breadcrumbShort} /> };
export const BreadcrumbTwo: Story = { render: () => <Breadcrumb accessibilityLabel="현재 위치" items={[{ label: '홈', href: '/home' }, { label: '알림' }]} /> };
export const BreadcrumbFive: Story = { render: () => <div style={{ boxSizing: 'border-box', maxWidth: 320, width: '100%' }}><Breadcrumb accessibilityLabel="현재 위치" items={breadcrumbItems} /></div> };
export const BreadcrumbDark: Story = { render: () => <div data-theme="dark" style={{ background: 'var(--kg-color-bg-canvas)', color: 'var(--kg-color-fg-primary)', padding: 16 }}><Breadcrumb accessibilityLabel="현재 위치" items={breadcrumbShort} /></div> };
