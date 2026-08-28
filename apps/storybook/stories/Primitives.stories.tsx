import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Avatar, Badge, Card, Divider, EmptyState, Heading, IconButton, ListItem, SkeletonRegion, Surface, Table, Text } from '@kimgseok/design-primitives/web';
import { Button } from '@kimgseok/design-button/web';
import TextStylesExample from '@kimgseok/design-examples/text-styles';
import SkeletonRecipesExample from '@kimgseok/design-examples/skeleton-recipes';

const meta = { title: 'Foundations/Primitives', component: Surface, parameters: { layout: 'padded' }, tags: ['autodocs'] } satisfies Meta<typeof Surface>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  render: () => <TextStylesExample />
};

export const Surfaces: Story = {
  render: () => <div style={{ display: 'grid', gap: 16 }}>
    <Surface level="surface" elevation={1}>Surface · elevation 1</Surface>
    <Surface level="raised" elevation={2}>Raised · elevation 2</Surface>
  </div>
};

export const IconButtons: Story = {
  render: () => <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
    <IconButton accessibilityLabel="메뉴 열기" icon="menu" />
    <IconButton accessibilityLabel="추가하기" icon="add" variant="primary" />
    <IconButton accessibilityLabel="닫기" icon="close" variant="danger" />
    <IconButton accessibilityLabel="사용할 수 없는 추가 버튼" disabled icon="add" />
    <IconButton accessibilityLabel="불러오는 중" icon="menu" loading />
  </div>
};

export const Dividers: Story = { render: () => <Surface><Text as="p">첫 번째 영역</Text><div style={{ margin: '16px 0' }}><Divider /></div><Text as="p">두 번째 영역</Text></Surface> };

export const DarkStates: Story = { render: () => <div data-theme="dark" style={{ background: 'var(--kg-color-bg-canvas)', padding: 24 }}><Surface level="raised"><Heading>다크 모드 표면</Heading><Text as="p" tone="secondary">semantic token으로 전환된 콘텐츠입니다.</Text><IconButton accessibilityLabel="추가하기" icon="add" variant="primary" /></Surface></div> };
export const Badges: Story = { render: () => <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{(['neutral', 'positive', 'caution', 'negative', 'info'] as const).map((tone) => <Badge key={tone} label={{ neutral: '기본', positive: '배송 완료', caution: '확인 필요', negative: '결제 실패', info: '새 소식' }[tone]} tone={tone} />)}<Badge label="오늘 주문하면 내일 도착하는 무료 배송 상품" size="sm" /></div> };
export const BadgesDark: Story = { render: () => <div data-theme="dark" style={{ background: 'var(--kg-color-bg-canvas)', display: 'flex', flexWrap: 'wrap', gap: 8, padding: 24 }}>{(['neutral', 'positive', 'caution', 'negative', 'info'] as const).map((tone) => <Badge key={tone} label={tone} tone={tone} />)}</div> };
function BadgeUsageDemo() { const [delivered, setDelivered] = useState(false); return <Surface><div style={{ alignItems: 'center', display: 'flex', gap: 8 }}><Text as="span">주문 상태</Text><Badge label={delivered ? '배송 완료' : '배송 시작'} tone={delivered ? 'positive' : 'info'} /></div><Text as="p" role="caption" tone="secondary">상태가 바뀌면 제품의 별도 결과 영역에서 안내합니다.</Text><Button onAction={() => setDelivered(true)} size="sm" variant="secondary">배송 완료로 변경</Button><p aria-live="polite" style={{ margin: 0 }}>{delivered ? '주문이 배송 완료 상태로 변경됐습니다.' : ''}</p></Surface>; }
export const BadgeUsage: Story = { render: () => <BadgeUsageDemo /> };
export const Avatars: Story = { render: () => <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}><Avatar accessibility={{ kind: 'decorative' }} name="김경석" size="sm" /><Avatar accessibility={{ kind: 'labelled', label: '김경석 프로필 사진' }} name="김경석" /><Avatar accessibility={{ kind: 'labelled', label: 'OpenAI 팀 프로필 사진' }} name="OpenAI" size="lg" /></div> };
export const AvatarsDark: Story = { render: () => <div data-theme="dark" style={{ alignItems: 'center', background: 'var(--kg-color-bg-canvas)', display: 'flex', gap: 12, padding: 24 }}><Avatar accessibility={{ kind: 'decorative' }} name="김경석" /><Avatar accessibility={{ kind: 'labelled', label: '디자인 팀 프로필 사진' }} name="Design" size="lg" /></div> };
function AvatarImageStatesDemo() { const [alternate, setAlternate] = useState(false); return <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}><Avatar accessibility={{ kind: 'labelled', label: '로드 성공 프로필 사진' }} name="성공" sourceUri="https://avatar.test/success.svg" /><Avatar accessibility={{ kind: 'labelled', label: '로드 실패 프로필 사진' }} name="실패" sourceUri="https://avatar.test/failure.svg" /><Avatar accessibility={{ kind: 'labelled', label: '교체되는 프로필 사진' }} name="교체" sourceUri={alternate ? 'https://avatar.test/replacement.svg' : 'https://avatar.test/success.svg'} /><Button onAction={() => setAlternate(true)} size="sm" variant="secondary">사진 교체</Button></div>; }
export const AvatarImageStates: Story = { render: () => <AvatarImageStatesDemo /> };
export const Cards: Story = { render: () => <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}><Card accessibilityLabel="주문 요약"><Heading level={2} role="heading">주문 요약</Heading><Text as="p" tone="secondary">상품 2개 · 오늘 도착</Text></Card><Card accessibilityLabel="배송 정보" variant="raised"><Heading level={2} role="heading">배송 정보</Heading><Text as="p" tone="secondary">서울시 강남구 테헤란로</Text></Card></div> };
export const CardsDark: Story = { render: () => <div data-theme="dark" style={{ background: 'var(--kg-color-bg-canvas)', padding: 24 }}><Card accessibilityLabel="다크 주문 요약" variant="raised"><Heading level={2} role="heading">주문 요약</Heading><Text as="p" tone="secondary">배송 현황을 확인하세요.</Text></Card></div> };
function CardLongDemo() { const [opened, setOpened] = useState(false); return <div style={{ maxWidth: 320 }}><Card><Heading level={2} role="heading" numberOfLines={2}>내일 새벽 도착 예정인 주문의 배송지와 요청 사항을 확인하세요</Heading><Text as="p" tone="secondary">수령 가능 시간과 공동현관 출입 방법을 배송 기사에게 정확히 전달하기 위한 상세 안내입니다.</Text><div style={{ marginTop: 12 }}><Button onAction={() => setOpened(true)} size="sm" variant="secondary">배송 정보 확인</Button></div>{opened ? <Text as="p" role="caption">배송 정보가 열렸습니다.</Text> : null}</Card></div>; }
export const CardsLong: Story = { render: () => <CardLongDemo /> };
function ListItemsDemo() { const [opened, setOpened] = useState(false); const [error, setError] = useState(false); const [synced, setSynced] = useState(false); const [syncCalls, setSyncCalls] = useState(0); return <div style={{ maxWidth: 360 }}><ListItem description="배송 및 수령 방법" leadingIcon="menu" metadata="오늘" title="주문 정보" /><ListItem action={{ onAction: () => setOpened(true), onActionError: () => undefined }} description="새벽 배송 예정" leadingIcon="check" metadata="오후 6:00" title="배송 현황" trailing="chevron" />{opened ? <p aria-live="polite">배송 현황을 열었습니다.</p> : null}<ListItem action={{ onAction: () => new Promise<void>((resolve) => { setSyncCalls((calls) => calls + 1); setTimeout(() => { setSynced(true); resolve(); }, 150); }), onActionError: () => undefined }} description="중복 실행을 막고 결과를 확인합니다" title="주문 동기화" trailing="chevron" /><p data-list-item-sync-calls="true" hidden>{syncCalls}</p>{synced ? <p aria-live="polite">주문 동기화가 완료됐습니다.</p> : null}<ListItem action={{ accessibilityLabel: '배송 동기화', onAction: () => { throw new Error('sync'); }, onActionError: () => setError(true) }} description="다시 시도할 수 있습니다" title="동기화" trailing="chevron" />{error ? <p aria-live="polite">동기화하지 못했어요.</p> : null}<ListItem action={{ onAction: () => undefined, onActionError: () => undefined }} disabled description="변경할 수 없는 주문" title="비활성 주문" trailing="chevron" /><ListItem action={{ onAction: () => undefined, onActionError: () => undefined }} loading description="상태를 갱신하고 있습니다" title="로딩 주문" trailing="chevron" /></div>; }
export const ListItems: Story = { render: () => <ListItemsDemo /> };
export const ListItemsDark: Story = { render: () => <div data-theme="dark" style={{ background: 'var(--kg-color-bg-canvas)', maxWidth: 360, padding: 24 }}><ListItem action={{ onAction: () => undefined, onActionError: () => undefined }} description="내일 도착 예정" leadingIcon="check" metadata="오후 6:00" title="배송 현황" trailing="chevron" /></div> };
export const ListItemsLong: Story = { render: () => <div style={{ maxWidth: 320 }}><ListItem action={{ onAction: () => undefined, onActionError: () => undefined }} description="공동현관 출입 방법과 수령 가능 시간을 배송 기사에게 전달합니다" leadingIcon="menu" metadata="오늘 오후 여섯 시 이전에 수령 가능" title="내일 새벽 도착 예정인 주문의 배송지 및 요청 사항" trailing="chevron" /></div> };
function EmptyStateDemo() { const [retried, setRetried] = useState(false); return <><EmptyState action={{ label: '다시 시도', onAction: () => setRetried(true), onActionError: () => undefined }} description="네트워크 연결을 확인한 뒤 다시 시도해 주세요." icon="menu" title="주문 내역을 불러오지 못했어요" />{retried ? <p aria-live="polite">주문 내역을 다시 불러옵니다.</p> : null}</>; }
export const EmptyStates: Story = { render: () => <EmptyStateDemo /> };
export const EmptyStatesDark: Story = { render: () => <div data-theme="dark" style={{ background: 'var(--kg-color-bg-canvas)', padding: 24 }}><EmptyState description="조건을 바꾸거나 새 항목을 추가해 주세요." icon="add" title="아직 주문 내역이 없어요" /></div> };
function EmptyStateErrorDemo() { const [failed, setFailed] = useState(false); return <><EmptyState action={{ label: '다시 시도', onAction: () => { throw new Error('retry'); }, onActionError: () => setFailed(true) }} description="잠시 후 다시 시도하거나 주문 조건을 바꿔 주세요." title="조건에 맞는 주문이 없어요" />{failed ? <p aria-live="polite">주문 내역을 다시 불러오지 못했어요.</p> : null}</>; }
export const EmptyStatesNoIconError: Story = { render: () => <div style={{ maxWidth: 320 }}><EmptyStateErrorDemo /></div> };
const skeletonItems = [{ size: 'sm' }, { size: 'md' }, { size: 'lg' }, { size: 'full' }, { shape: 'block', size: 'sm' }, { shape: 'block', size: 'md' }, { shape: 'block', size: 'lg' }, { shape: 'block', size: 'full' }, { shape: 'circle', size: 'sm' }, { shape: 'circle', size: 'md' }, { shape: 'circle', size: 'lg' }] as const;
export const Skeletons: Story = { render: () => <div style={{ maxWidth: 320 }}><SkeletonRegion accessibilityLabel="주문 정보를 불러오는 중" items={skeletonItems} /></div> };
export const SkeletonsDark: Story = { render: () => <div data-theme="dark" style={{ background: 'var(--kg-color-bg-canvas)', padding: 24 }}><SkeletonRegion accessibilityLabel="주문 정보를 불러오는 중" items={[{ size: 'md' }, { shape: 'block', size: 'full' }]} /></div> };
export const SkeletonRecipes: Story = { render: () => <SkeletonRecipesExample /> };
const orderColumns = [{ id: 'product', label: '상품' }, { id: 'status', label: '상태' }, { align: 'end', id: 'amount', label: '결제 금액' }] as const;
const orderRows = [{ id: 'one', cells: { product: '새벽 배송 상품', status: '배송 준비', amount: '12,000원' } }, { id: 'two', cells: { product: '주문한 지 오래된 한국어 장문 상품명', status: '배송 중', amount: '248,000원' } }] as const;
export const Tables: Story = { render: () => <Table caption="주문 요약" columns={orderColumns} rows={orderRows} /> };
export const TablesDark: Story = { render: () => <div data-theme="dark" style={{ background: 'var(--kg-color-bg-canvas)', padding: 24 }}><Table caption="주문 요약" columns={orderColumns} rows={orderRows} /></div> };
const narrowColumns = [{ id: 'product', label: '상품' }, { id: 'status', label: '상태' }, { id: 'receiver', label: '수령인' }, { id: 'address', label: '배송지' }, { id: 'date', label: '도착일' }, { id: 'amount', label: '결제 금액', align: 'end' }] as const;
export const TablesNarrow: Story = { render: () => <div style={{ maxWidth: 320 }}><Table caption="장문 주문 비교" columns={narrowColumns} rows={[{ id: 'one', cells: { product: '오늘 주문하면 내일 도착하는 무료 배송 상품', status: '배송 준비', receiver: '김경석', address: '서울시 강남구 테헤란로', date: '내일 새벽', amount: '248,000원' } }]} /></div> };
