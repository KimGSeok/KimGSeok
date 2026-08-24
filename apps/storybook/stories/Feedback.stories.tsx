import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Callout, Progress, Spinner, ToastViewport } from '@kimgseok/design-feedback/web';

const meta = { title: 'Feedback/Progress', component: Progress, parameters: { layout: 'padded' }, tags: ['autodocs'], args: { accessibilityLabel: '업로드 진행률', value: 0.64 } } satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Determinate: Story = {};
export const Indeterminate: Story = { args: { value: undefined } };
export const Clamped: Story = { args: { value: 1.4 } };
export const NonFinite: Story = { args: { value: Number.NaN } };
export const Spinners: Story = { render: () => <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}><Spinner size="sm" /><Spinner accessibilityLabel="결제 처리 중" size="md" /><Spinner size="lg" /></div> };
export const Dark: Story = { render: () => <div data-theme="dark" style={{ background: 'var(--kg-color-bg-canvas)', display: 'grid', gap: 20, padding: 24 }}><Progress accessibilityLabel="다크 모드 진행률" value={0.4} /><Spinner /></div> };
function ToastDemo({ tone = 'positive' }: { tone?: 'positive' | 'negative' }) { const [open, setOpen] = useState(true); const [retried, setRetried] = useState(false); const action = tone === 'negative' ? { label: '다시 시도', onAction: () => setRetried(true), onError: () => undefined } : undefined; const toast = { action, durationMs: null, message: tone === 'negative' ? '저장하지 못했어요' : '저장했어요', onOpenChange: setOpen, open, tone } as const; return <div><button onClick={() => setOpen(true)} type="button">토스트 열기</button><output>{retried ? '재시도함' : ''}</output><ToastViewport toast={toast} /></div>; }
export const ToastSuccess: Story = { render: () => <ToastDemo /> };
export const ToastError: Story = { render: () => <ToastDemo tone="negative" /> };
function ToastRejectDemo() { const [open, setOpen] = useState(true); const [error, setError] = useState(''); const [count, setCount] = useState(0); return <div><output>{error} 실행 횟수 {count}</output><ToastViewport toast={{ action: { label: '다시 시도', onAction: async () => { setCount((current) => current + 1); await new Promise((resolve) => setTimeout(resolve, 50)); throw new Error('offline'); }, onError: () => setError('재시도 실패') }, message: '저장하지 못했어요', onOpenChange: setOpen, open, tone: 'negative' }} /></div>; }
export const ToastReject: Story = { render: () => <ToastRejectDemo /> };
function TimedToastDemo() { const [open, setOpen] = useState(true); return <ToastViewport toast={{ durationMs: 1000, message: '잠시 표시되는 안내', onOpenChange: setOpen, open, tone: 'neutral' }} />; }
export const ToastTimed: Story = { render: () => <TimedToastDemo /> };
export const Callouts: Story = { render: () => <div style={{ display: 'grid', gap: 12 }}><Callout description="입력한 정보는 언제든 수정할 수 있습니다." title="알아두세요" /><Callout description="네트워크 연결을 확인하고 다시 시도해 주세요." title="불러오지 못했어요" tone="negative" /><Callout description="변경 사항이 자동으로 저장됩니다." title="저장 방식" tone="positive" /></div> };
