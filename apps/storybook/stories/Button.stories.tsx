import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionArea, Button } from '@kimgseok/design-button/web';
import ButtonDefaultExample from '@kimgseok/design-examples/button-default';
import ButtonVariantsExample from '@kimgseok/design-examples/button-variants';

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: { children: '저장하기', size: 'md', variant: 'primary' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const DocumentationDefault: Story = { render: () => <ButtonDefaultExample /> };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Tertiary: Story = { args: { variant: 'tertiary' } };
export const Danger: Story = { args: { variant: 'danger', children: '삭제하기' } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };

export const ControlledLoading: Story = {
  render: (args) => {
    const [loading, setLoading] = useState(false);
    return <Button {...args} loading={loading} onAction={async () => { setLoading(true); await new Promise((resolve) => window.setTimeout(resolve, 800)); setLoading(false); }}>저장하기</Button>;
  }
};

function DuplicateLockDemo() {
  const [count, setCount] = useState(0);
  return <Button onAction={async () => { setCount((value) => value + 1); await new Promise((resolve) => window.setTimeout(resolve, 300)); }}>{`실행 횟수 ${count}`}</Button>;
}

export const DuplicateActivationLock: Story = { render: () => <DuplicateLockDemo /> };

function RetryDemo() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  return <div><Button loading={loading} onAction={async () => { setLoading(true); setMessage(''); await new Promise((resolve) => window.setTimeout(resolve, 200)); setLoading(false); throw new Error('save_failed'); }} onActionError={() => setMessage('저장하지 못했어요. 다시 시도해 주세요.')}>저장하기</Button><p aria-live="polite">{message}</p></div>;
}

export const RetryableError: Story = { render: () => <RetryDemo /> };

export const LongKoreanLabel: Story = { args: { children: '변경사항을 확인하고 안전하게 저장하기' } };

export const AllVariants: Story = {
  render: () => <ButtonVariantsExample />
};

function ActionAreaDemo({ loading = false, dark = false }: { loading?: boolean; dark?: boolean }) { const [message, setMessage] = useState(''); return <div data-theme={dark ? 'dark' : 'light'} style={{ background: 'var(--kg-color-bg-canvas)', minHeight: 240, paddingTop: 80 }}><ActionArea accessibilityLabel="주문 작업" primary={{ label: '주문하기', loading, onAction: () => setMessage('주문을 시작했습니다.'), onActionError: () => setMessage('주문하지 못했어요.') }} secondary={{ label: '장바구니', onAction: () => setMessage('장바구니에 담았습니다.'), onActionError: () => setMessage('장바구니에 담지 못했어요.') }} /><output aria-live="polite">{message}</output></div>; }
export const BottomActionArea: Story = { render: () => <ActionAreaDemo /> };
export const BottomActionAreaLoading: Story = { render: () => <ActionAreaDemo loading /> };
export const BottomActionAreaDark: Story = { render: () => <ActionAreaDemo dark /> };
