import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, DateTimeField, RadioGroup, SearchField, Select, Slider, Switch, TextArea, TextField } from '@kimgseok/design-forms/web';
import { Calendar, DatePicker, DateRangePicker } from '@kimgseok/design-date-picker/web';
import TextFieldDefaultExample from '@kimgseok/design-examples/text-field-default';
import TextFieldStatesExample from '@kimgseok/design-examples/text-field-states';

const meta = { title: 'Forms/TextField', component: TextField, parameters: { layout: 'padded' }, tags: ['autodocs'], args: { label: '이름', placeholder: '이름을 입력하세요' } } satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const DocumentationDefault: Story = { render: () => <TextFieldDefaultExample /> };
export const HelpText: Story = { args: { helpText: '실명을 입력해 주세요.' } };
export const Error: Story = { args: { defaultValue: '김', errorMessage: '이름을 두 글자 이상 입력해 주세요.' } };
export const DocumentationStates: Story = { render: () => <TextFieldStatesExample /> };
export const Disabled: Story = { args: { disabled: true, value: '김경석' } };
export const Required: Story = { args: { required: true } };
export const Multiline: Story = { render: () => <TextArea helpText="최대 500자" label="소개" placeholder="자기소개를 입력하세요" /> };

const options = [{ label: '개인', value: 'personal' }, { label: '팀', value: 'team' }];
function ChoicesDemo() { const [checked, setChecked] = useState(false); const [notifications, setNotifications] = useState(true); const [kind, setKind] = useState('personal'); return <div style={{ display: 'grid', gap: 12 }}><Checkbox checked={checked} label="약관에 동의합니다" onCheckedChange={setChecked} /><Switch checked={notifications} label="알림 받기" onCheckedChange={setNotifications} /><RadioGroup label="계정 유형" name="account" onValueChange={setKind} options={options} value={kind} /><Select label="기본 계정" onValueChange={setKind} options={options} value={kind} /></div>; }
export const Choices: Story = { render: () => <ChoicesDemo /> };

function ValidationLifecycleDemo() {
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(''); const [kind, setKind] = useState('personal'); const [touched, setTouched] = useState(false); const [serverError, setServerError] = useState(''); const [submittedKind, setSubmittedKind] = useState('');
  const clientError = touched && name.trim().length < 2 ? '이름을 두 글자 이상 입력해 주세요. 이 오류는 올바르게 수정하면 즉시 사라집니다.' : '';
  return <form onSubmit={(event) => { event.preventDefault(); setTouched(true); if (name.trim().length < 2) nameRef.current?.focus(); else { setSubmittedKind(String(new FormData(event.currentTarget).get('accountType') ?? '')); setServerError('이미 사용 중인 이름입니다. 다시 제출하거나 초기화할 때까지 유지됩니다.'); } }} style={{ display: 'grid', gap: 12 }}>
    <TextField errorMessage={clientError || serverError || undefined} label="이름" name="name" onBlur={() => setTouched(true)} onChange={(event) => setName(event.currentTarget.value)} ref={nameRef} required value={name} />
    <Select label="계정 유형" name="accountType" onValueChange={setKind} options={[...options, { label: '사용 불가', value: 'disabled', disabled: true }]} value={kind} />
    <output aria-live="polite">제출된 계정: {submittedKind || '없음'}</output>
    <button type="submit">검증하기</button><button onClick={() => setServerError('')} type="button">서버 오류 초기화</button>
  </form>;
}
export const ValidationLifecycle: Story = { render: () => <ValidationLifecycleDemo /> };

function DisabledSelectionsDemo() { return <div style={{ display: 'grid', gap: 12 }}><Checkbox checked disabled label="선택된 비활성 체크박스" onCheckedChange={() => undefined} /><Switch checked disabled label="선택된 비활성 스위치" onCheckedChange={() => undefined} /><RadioGroup label="비활성 옵션" name="disabled-options" onValueChange={() => undefined} options={[{ label: '선택된 비활성', value: 'disabled', disabled: true }, { label: '사용 가능', value: 'enabled' }]} value="disabled" /><Select disabled errorMessage="현재 계정에서는 변경할 수 없습니다." label="비활성 선택" onValueChange={() => undefined} options={options} required value="personal" /></div>; }
export const DisabledSelections: Story = { render: () => <DisabledSelectionsDemo /> };
export const DarkStates: Story = { render: () => <div data-theme="dark" style={{ background: 'var(--kg-color-bg-canvas)', display: 'grid', gap: 12, padding: 24 }}><TextField errorMessage="다크 모드 오류 상태입니다." label="이름" value="김" /><ChoicesDemo /></div> };

function SearchFieldDemo({ fail = false, long = false }: { fail?: boolean; long?: boolean }) {
  const [query, setQuery] = useState('디자인 시스템'); const [message, setMessage] = useState(''); const [calls, setCalls] = useState(0);
  const label = long ? '오늘 주문하면 내일 도착하는 무료 배송 상품을 검색하세요' : '상품 검색';
  return <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}><SearchField label={label} onSearch={async (next) => { setCalls((current) => current + 1); await new Promise((resolve) => setTimeout(resolve, 120)); if (fail) throw new Error('검색 실패'); setMessage(`“${next}” 검색 결과를 불러왔습니다.`); }} onSearchError={() => setMessage('검색 결과를 불러오지 못했습니다. 다시 시도해 주세요.')} onValueChange={(next) => { setQuery(next); if (!next) setMessage(''); }} placeholder={long ? '배송 상품명 또는 카테고리를 길게 입력해도 검색할 수 있습니다' : undefined} value={query} /><output aria-live="polite">{message}</output><output data-search-count>{calls}</output></div>;
}
export const Search: Story = { render: () => <SearchFieldDemo /> };
export const SearchError: Story = { render: () => <SearchFieldDemo fail /> };
export const SearchDark: Story = { render: () => <div data-theme="dark" style={{ background: 'var(--kg-color-bg-canvas)', padding: 24 }}><SearchFieldDemo /></div> };
export const SearchNarrow: Story = { render: () => <div style={{ maxWidth: 320 }}><SearchFieldDemo long /></div> };

function SliderDemo({ dark = false, disabled = false }: { dark?: boolean; disabled?: boolean }) { const [value, setValue] = useState(50); return <div data-theme={dark ? 'dark' : 'light'} style={{ background: 'var(--kg-color-bg-canvas)', maxWidth: 480, padding: 24 }}><Slider disabled={disabled} label="알림 음량" labels={{ min: '작게', mid: '보통', max: '크게' }} onValueChange={setValue} showValue step={5} value={value} valueLabel={(next) => `${next}%`} /></div>; }
export const SliderDefault: Story = { render: () => <SliderDemo /> };
export const SliderDisabled: Story = { render: () => <SliderDemo disabled /> };
export const SliderDark: Story = { render: () => <SliderDemo dark /> };
function DateTimeDemo() { const [date, setDate] = useState('2026-08-24'); const [time, setTime] = useState('09:30'); const [dateTime, setDateTime] = useState('2026-08-24T09:30'); return <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}><DateTimeField helpText="오늘 이후 날짜를 선택하세요." kind="date" label="방문 날짜" min="2026-08-24" onValueChange={setDate} value={date} /><DateTimeField kind="time" label="방문 시간" onValueChange={setTime} value={time} /><DateTimeField kind="datetime-local" label="예약 일시" onValueChange={setDateTime} value={dateTime} /></div>; }
export const DateAndTime: Story = { render: () => <DateTimeDemo /> };
export const DateAndTimeError: Story = { render: () => <DateTimeField errorMessage="날짜를 다시 확인해 주세요." kind="date" label="방문 날짜" onValueChange={() => undefined} required value="2026-08-24" /> };
export const DateAndTimeDisabled: Story = { render: () => <DateTimeField disabled kind="date" label="변경할 수 없는 방문 날짜" onValueChange={() => undefined} value="2026-08-24" /> };
function DatePickerDemo() { const [date, setDate] = useState<`${number}-${number}-${number}` | ''>('2026-08-24'); const [range, setRange] = useState<{ start: `${number}-${number}-${number}` | ''; end: `${number}-${number}-${number}` | '' }>({ start: '', end: '' }); return <div style={{ display: 'grid', gap: 24, maxWidth: 480 }}><DatePicker helpText="오늘 이후 날짜를 선택하세요." label="방문 날짜" min="2026-08-24" onValueChange={setDate} value={date} /><DateRangePicker label="여행 기간" min="2026-08-24" onValueChange={setRange} value={range} /><Calendar accessibilityLabel="일정 달력" onValueChange={setDate} value={date} /></div>; }
export const CalendarAndDatePicker: Story = { render: () => <DatePickerDemo /> };
export const DatePickerConstraints: Story = { render: () => { const [value, setValue] = useState<`${number}-${number}-${number}` | ''>('2026-08-26'); return <DatePicker helpText="8월 24일부터 31일, 주말 제외" isDateUnavailable={(date) => ['2026-08-29', '2026-08-30'].includes(date)} label="업무일" max="2026-08-31" min="2026-08-24" onValueChange={setValue} value={value} weekStartsOn={1} />; } };
export const DatePickerErrorAndDisabled: Story = { render: () => <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}><DatePicker errorMessage="날짜를 다시 확인해 주세요." label="오류 날짜" onValueChange={() => undefined} required value="" /><DatePicker disabled label="변경할 수 없는 날짜" onValueChange={() => undefined} value="2026-08-24" /></div> };
export const DateRangePreset: Story = { render: () => { const [value, setValue] = useState<{ start: `${number}-${number}-${number}` | ''; end: `${number}-${number}-${number}` | '' }>({ start: '2026-08-24', end: '2026-08-28' }); return <DateRangePicker helpText="새 시작일을 누르면 기존 범위를 다시 선택합니다." label="여행 기간" onValueChange={setValue} value={value} />; } };
export const DatePickerControlled: Story = { render: () => { const [value, setValue] = useState<`${number}-${number}-${number}` | ''>('2026-08-24'); return <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}><DatePicker label="제어 날짜" onValueChange={setValue} value={value} /><button onClick={() => setValue('2026-09-10')} type="button">외부에서 9월 10일로 변경</button></div>; } };
