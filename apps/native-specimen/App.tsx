import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getNativeTheme } from '@kimgseok/design-tokens/native';
import { NativeActionArea, NativeButton } from '@kimgseok/design-button/native';
import { NativeAvatar, NativeBadge, NativeCard, NativeDivider, NativeEmptyState, NativeHeading, NativeIconButton, NativeListItem, NativeSkeletonRegion, NativeSurface, NativeText } from '@kimgseok/design-primitives/native';
import { NativeCheckbox, NativeDateTimeField, NativeRadioGroup, NativeSearchField, NativeSelect, NativeSlider, NativeSwitch, NativeTextArea, NativeTextField } from '@kimgseok/design-forms/native';
import { NativeCallout, NativeProgress, NativeSpinner, NativeToastHost } from '@kimgseok/design-feedback/native';
import { NativeBottomSheet, NativeConfirmationDialog, NativeDialog, NativeMenu, NativeTooltip } from '@kimgseok/design-overlays/native';
import { NativeAppBar, NativeChip, NativeChipGroup, NativeFilterBar, NativePagination, NativeSegmentedControl, NativeTabs } from '@kimgseok/design-navigation/native';
import { NativeDatePicker, NativeDateRangePicker } from '@kimgseok/design-date-picker/native';
import type { DateRangeValue, DateValue } from '@kimgseok/design-date-picker/contracts';

export default function App() {
  const [notifications, setNotifications] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [accountType, setAccountType] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('디자인 시스템');
  const [selectOpen, setSelectOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tab, setTab] = useState('overview');
  const [viewMode, setViewMode] = useState('list');
  const [freeShipping, setFreeShipping] = useState(false);
  const [filters, setFilters] = useState<string[]>(['free']);
  const [page, setPage] = useState(6);
  const [sliderValue, setSliderValue] = useState(50);
  const [compactMenu, setCompactMenu] = useState(true);
  const [menuMessage, setMenuMessage] = useState('선택 없음');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('2026-08-24');
  const [nativeDate, setNativeDate] = useState<DateValue>('2026-08-24');
  const [nativeRange, setNativeRange] = useState<DateRangeValue>({ start: '2026-08-24', end: '2026-08-27' });
  const [confirmationResult, setConfirmationResult] = useState('삭제 대기');
  const mode = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = getNativeTheme(mode, Platform.OS === 'android' ? 'android' : 'ios');
  const darkTheme = getNativeTheme('dark', Platform.OS === 'android' ? 'android' : 'ios');
  const type = theme.typography.role;
  const colors = theme.color.semantic;
  useEffect(() => { if (Platform.OS === 'ios' && menuMessage !== '선택 없음') void AccessibilityInfo.announceForAccessibility(menuMessage); }, [menuMessage]);

  return <SafeAreaProvider><View style={[styles.screen, { backgroundColor: colors.bg.canvas }]}><NativeAppBar leadingAction={{ accessibilityLabel: '뒤로 가기', icon: 'chevron-left', onAction: () => undefined, onActionError: () => undefined }} subtitle="큰 글꼴과 안전 영역을 확인합니다" title="오늘 주문하면 내일 도착하는 무료 배송 상품" trailingActions={[{ accessibilityLabel: '추가하기', disabled: true, icon: 'add', onAction: () => undefined, onActionError: () => undefined }, { accessibilityLabel: '저장 중', icon: 'check', loading: true, onAction: () => undefined, onActionError: () => undefined }]} />
    <ScrollView contentContainerStyle={styles.content}>
      <NativeText role="caption" tone="tertiary">FOUNDATION / REACT NATIVE</NativeText>
      <NativeHeading role="display">읽기 쉽고, 행동이 분명한 인터페이스</NativeHeading>
      <NativeText tone="secondary">한국어 장문, 시스템 다크 모드, 플랫폼 폰트와 action 상태를 확인하는 Expo specimen입니다.</NativeText>
      <View style={styles.actions}>
        {(['primary', 'secondary', 'tertiary', 'danger'] as const).map((variant) => <NativeButton key={variant} accessibilityLabel={`${variant} 예시 버튼`} onAction={() => undefined} variant={variant}>{variant}</NativeButton>)}
        <NativeButton accessibilityLabel="저장 중 예시 버튼" loading>저장하기</NativeButton>
        <NativeButton accessibilityLabel="비활성화 예시 버튼" disabled>저장하기</NativeButton>
      </View>
      <View style={styles.iconActions}>
        <NativeIconButton accessibilityLabel="추가하기" icon="add" variant="primary" />
        <NativeIconButton accessibilityLabel="메뉴 열기" icon="menu" />
        <NativeIconButton accessibilityLabel="사용할 수 없는 버튼" disabled icon="add" />
      </View>
      <NativeDivider />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}><NativeBadge label="기본" /><NativeBadge label="배송 완료" tone="positive" /><NativeBadge label="확인 필요" tone="caution" /><NativeBadge label="결제 실패" tone="negative" /><NativeBadge label="새 소식" tone="info" /><View style={{ maxWidth: 180 }}><NativeBadge label="오늘 주문하면 내일 도착하는 무료 배송 상품" size="sm" /></View></View>
      <View style={{ backgroundColor: darkTheme.color.semantic.bg.canvas, flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12 }}><NativeBadge label="dark neutral" mode="dark" /><NativeBadge label="dark positive" mode="dark" tone="positive" /><NativeBadge label="dark caution" mode="dark" tone="caution" /><NativeBadge label="dark negative" mode="dark" tone="negative" /><NativeBadge label="dark info" mode="dark" tone="info" /></View>
      <View style={{ alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}><NativeAvatar accessibility={{ kind: 'decorative' }} name="김경석" size="sm" /><NativeAvatar accessibility={{ kind: 'labelled', label: '김경석 프로필 사진' }} name="김경석" /><NativeAvatar accessibility={{ kind: 'labelled', label: 'OpenAI 팀 프로필 사진' }} name="OpenAI" size="lg" /><NativeAvatar accessibility={{ kind: 'labelled', label: '복합 이모지 이니셜 예시' }} name="👩‍💻Kim" /></View>
      <NativeCard><NativeHeading role="heading">주문 요약</NativeHeading><NativeText tone="secondary">내일 새벽 도착 예정인 주문의 배송지와 요청 사항을 확인하세요.</NativeText><NativeButton onAction={() => undefined} size="sm" variant="secondary">배송 정보 확인</NativeButton></NativeCard>
      <View style={{ backgroundColor: darkTheme.color.semantic.bg.canvas, padding: 12 }}><NativeCard mode="dark" variant="raised"><NativeHeading mode="dark" role="heading">배송 정보</NativeHeading><NativeText mode="dark" tone="secondary">서울시 강남구 테헤란로</NativeText></NativeCard></View>
      <NativeListItem description="배송 및 수령 방법" leadingIcon="menu" metadata="오늘" title="주문 정보" />
      <NativeListItem action={{ onAction: () => undefined, onActionError: () => undefined }} description="공동현관 출입 방법과 수령 가능 시간을 배송 기사에게 전달합니다" leadingIcon="check" title="내일 새벽 도착 예정인 주문의 배송지 및 요청 사항" trailing="chevron" />
      <NativeListItem action={{ onAction: () => undefined, onActionError: () => undefined }} disabled description="변경할 수 없는 주문" title="비활성 주문" trailing="chevron" />
      <NativeListItem action={{ onAction: () => undefined, onActionError: () => undefined }} loading description="상태를 갱신하고 있습니다" title="로딩 주문" trailing="chevron" />
      <View style={{ maxWidth: 320 }}><NativeEmptyState action={{ label: '다시 시도', onAction: () => new Promise<void>((resolve) => setTimeout(resolve, 300)), onActionError: () => undefined }} description="네트워크 연결을 확인한 뒤 다시 시도해 주세요. 큰 글꼴에서도 줄바꿈과 버튼 순서를 확인합니다." icon="menu" title="내일 새벽 도착 예정인 주문 내역을 불러오지 못했어요" /></View>
      <View style={{ maxWidth: 320 }}><NativeSkeletonRegion accessibilityLabel="주문 정보를 불러오는 중" items={[{ size: 'lg' }, { size: 'full' }, { shape: 'block', size: 'full' }, { shape: 'circle', size: 'md' }]} /></View>
      <View style={styles.feedback}><NativeSpinner accessibilityLabel="동기화 중" /><View style={styles.progresses}><NativeProgress accessibilityLabel="업로드 0퍼센트" value={0} /><NativeProgress accessibilityLabel="업로드 64퍼센트" value={0.64} /><NativeProgress accessibilityLabel="업로드 100퍼센트" value={1} /><NativeProgress accessibilityLabel="처리 단계 확인 중" /></View></View>
      <NativeCallout description="네트워크 연결을 확인하고 다시 시도해 주세요." title="불러오지 못했어요" tone="negative" />
      <NativeButton onAction={() => setDialogOpen(true)} variant="secondary">다이얼로그 열기</NativeButton>
      <NativeButton onAction={() => setSheetOpen(true)} variant="secondary">바텀시트 열기</NativeButton>
      <NativeActionArea accessibilityLabel="주문 작업" primary={{ label: '주문하기', onAction: () => undefined, onActionError: () => undefined }} secondary={{ label: '장바구니', onAction: () => undefined, onActionError: () => undefined }} />
      <NativeTooltip content="새 항목을 추가합니다" existingHint="두 번 탭하여 도움말을 엽니다">{({ accessibilityHint }) => <Pressable accessibilityHint={accessibilityHint} accessibilityLabel="도움말" accessibilityRole="button" style={styles.tooltipTrigger}><Text style={[type.body, { color: colors.fg.primary }]}>도움말</Text></Pressable>}</NativeTooltip>
      <NativeMenu accessibilityLabel="문서 편집 메뉴" header="편집" items={[{ value: 'rename', label: '이름 바꾸기' }, { value: 'compact', label: '간단히 보기', kind: 'checkbox', checked: compactMenu }, { value: 'archive', label: '보관하기' }, { value: 'delete', label: '삭제할 수 없음', disabled: true }]} onAction={(value) => setMenuMessage(`${value} 작업을 선택했습니다.`)} onCheckedChange={(_, checked) => { setCompactMenu(checked); setMenuMessage(`간단히 보기 ${checked ? '켬' : '끔'}`); }} triggerLabel="편집 메뉴 열기" />
      <View accessibilityLiveRegion="polite"><NativeText>{menuMessage}</NativeText></View>
      <NativeTabs accessibilityLabel="프로젝트 정보" items={[{ value: 'overview', label: '개요', content: <View style={styles.actions}><NativeHeading role="heading">개요</NativeHeading><NativeText>프로젝트의 핵심 정보를 확인합니다.</NativeText><NativeButton onAction={() => undefined} variant="secondary">패널 안 작업</NativeButton></View> }, { value: 'activity', label: '활동', content: <NativeText>최근 활동을 확인합니다.</NativeText> }, { value: 'members', label: '멤버', content: <NativeText>참여 중인 멤버를 확인합니다.</NativeText> }, { value: 'disabled', label: '사용 불가', disabled: true, content: null }]} onValueChange={setTab} value={tab} />
      <NativeSegmentedControl accessibilityLabel="보기 방식" items={[{ value: 'list', label: '목록으로 길게 보기' }, { value: 'grid', label: '격자로 보기' }, { value: 'map', label: '지도에서 보기' }, { value: 'disabled', label: '사용할 수 없음', disabled: true }]} onValueChange={setViewMode} value={viewMode} />
      <NativeChipGroup accessibilityLabel="배송 필터"><NativeChip label="오늘 주문하면 내일 도착하는 무료 배송 상품" onSelectedChange={setFreeShipping} selected={freeShipping} /><NativeChip label="리뷰가 많은 상품" onSelectedChange={() => undefined} selected /><NativeChip disabled label="사용 불가" onSelectedChange={() => undefined} selected={false} /></NativeChipGroup>
      <NativeFilterBar accessibilityLabel="상품 필터" items={[{ value: 'free', label: '무료 배송' }, { value: 'tomorrow', label: '내일 도착' }, { value: 'review', label: '리뷰 많은 순' }, { value: 'soldout', label: '품절 상품', disabled: true }]} onSelectedValuesChange={setFilters} selectedValues={filters} />
      <View style={{ maxWidth: 320 }}><NativeFilterBar accessibilityLabel="오늘 주문하면 내일 도착하는 무료 배송 상품을 위한 상세 필터" items={[{ value: 'free', label: '오늘 주문하면 내일 도착하는 무료 배송 상품' }, { value: 'tomorrow', label: '내일 도착' }]} loading onSelectedValuesChange={() => undefined} selectedValues={['free']} /></View>
      <NativePagination accessibilityLabel="검색 결과 페이지" onPageChange={setPage} page={page} totalPages={20} />
      <NativePagination accessibilityLabel="첫 페이지 경계 예시" onPageChange={() => undefined} page={1} totalPages={20} />
      <NativePagination accessibilityLabel="마지막 페이지 경계 예시" onPageChange={() => undefined} page={20} totalPages={20} />
      <NativePagination accessibilityLabel="비활성 페이지 이동 예시" disabled onPageChange={() => undefined} page={6} totalPages={20} />
      <NativeSurface elevation={1} level="raised">
        <NativeHeading role="title">공통 primitive surface</NativeHeading>
        <NativeText tone="secondary">토큰과 접근성 계약을 Web과 공유합니다.</NativeText>
      </NativeSurface>
      <NativeTextField helpText="실명을 입력해 주세요." label="이름" placeholder="이름을 입력하세요" />
      <NativeTextField errorMessage="이름을 두 글자 이상 입력해 주세요." label="오류 상태" value="김" />
      <NativeTextArea helpText="최대 500자" label="소개" placeholder="자기소개를 입력하세요" />
      <NativeSearchField label="상품 검색" onSearch={async () => { await new Promise<void>((resolve) => setTimeout(resolve, 300)); }} onSearchError={() => undefined} onValueChange={setSearchQuery} value={searchQuery} />
      <NativeSlider label="알림 음량" labels={{ min: '작게', mid: '보통', max: '크게' }} onValueChange={setSliderValue} showValue step={5} value={sliderValue} valueLabel={(next) => `${next}%`} />
      <NativeDateTimeField helpText="오늘 이후 날짜를 선택하세요." kind="date" label="방문 날짜" min="2026-08-24" onOpenChange={setDatePickerOpen} onValueChange={setVisitDate} open={datePickerOpen} renderPicker={({ onCancel, onSelect }) => <View accessibilityLabel="방문 날짜 선택" style={[styles.selectSheet, { backgroundColor: colors.bg.raised, borderColor: colors.border.subtle }]}><Pressable accessibilityRole="button" onPress={() => onSelect('2026-08-25')} style={styles.selectOption}><Text style={[type.body, { color: colors.fg.primary }]}>2026년 8월 25일</Text></Pressable><Pressable accessibilityRole="button" onPress={onCancel} style={styles.selectOption}><Text style={[type.body, { color: colors.fg.secondary }]}>취소</Text></Pressable></View>} value={visitDate} />
      <NativeDatePicker helpText="앱이 플랫폼 picker를 주입하는 Composite입니다." label="기준 날짜" min="2026-08-24" onValueChange={setNativeDate} renderPicker={({ commit, cancel }) => <View accessibilityLabel="기준 날짜 플랫폼 선택기" style={[styles.selectSheet, { backgroundColor: colors.bg.raised, borderColor: colors.border.subtle }]}><Pressable accessibilityRole="button" onPress={() => commit('2026-08-25')} style={styles.selectOption}><Text style={[type.body, { color: colors.fg.primary }]}>2026년 8월 25일 선택</Text></Pressable><Pressable accessibilityRole="button" onPress={cancel} style={styles.selectOption}><Text style={[type.body, { color: colors.fg.secondary }]}>취소</Text></Pressable></View>} value={nativeDate} />
      <NativeDateRangePicker label="여행 기간" min="2026-08-24" onValueChange={setNativeRange} renderPicker={({ commit, cancel }) => <View accessibilityLabel="여행 기간 플랫폼 선택기" style={[styles.selectSheet, { backgroundColor: colors.bg.raised, borderColor: colors.border.subtle }]}><Pressable accessibilityRole="button" onPress={() => commit({ start: '2026-08-25', end: '2026-08-28' })} style={styles.selectOption}><Text style={[type.body, { color: colors.fg.primary }]}>8월 25일부터 28일까지</Text></Pressable><Pressable accessibilityRole="button" onPress={cancel} style={styles.selectOption}><Text style={[type.body, { color: colors.fg.secondary }]}>취소</Text></Pressable></View>} value={nativeRange} />
      <NativeButton onAction={() => setConfirmationOpen(true)} variant="danger">삭제 확인 열기</NativeButton>
      <NativeConfirmationDialog cancelLabel="취소" confirmLabel="삭제하기" description="삭제한 데이터는 복구할 수 없어요." intent="destructive" onConfirm={async () => { await new Promise<void>((resolve) => setTimeout(resolve, 200)); setConfirmationResult('삭제 완료'); }} onConfirmError={() => setConfirmationResult('삭제 실패')} onOpenChange={setConfirmationOpen} open={confirmationOpen} title="프로젝트를 삭제할까요?" />
      <View accessibilityLiveRegion="polite"><NativeText>{confirmationResult}</NativeText></View>
      <View style={{ maxWidth: 320 }}><NativeSearchField label="오늘 주문하면 내일 도착하는 무료 배송 상품을 검색하세요" onSearch={() => undefined} onSearchError={() => undefined} onValueChange={() => undefined} placeholder="배송 상품명 또는 카테고리를 길게 입력해도 검색할 수 있습니다" value="내일 도착" /></View>
      <NativeSwitch checked={notifications} label="알림 받기" onCheckedChange={setNotifications} />
      <NativeCheckbox checked={agreed} label="약관에 동의합니다" onCheckedChange={setAgreed} />
      <NativeRadioGroup label="계정 유형" onValueChange={setAccountType} options={[{ label: '개인', value: 'personal' }, { label: '팀', value: 'team' }]} value={accountType} />
      <NativeSelect label="기본 계정" onOpenChange={setSelectOpen} onValueChange={setAccountType} open={selectOpen} options={[{ label: '개인', value: 'personal' }, { label: '팀', value: 'team' }]} renderSheet={({ open, options, value, onSelect, onCancel }) => open ? <View accessibilityLabel="기본 계정 선택 목록" accessibilityRole="menu" style={[styles.selectSheet, { backgroundColor: colors.bg.raised, borderColor: colors.border.subtle }]}>{options.map((option) => <Pressable accessibilityRole="menuitem" accessibilityState={{ selected: option.value === value }} key={option.value} onPress={() => onSelect(option.value)} style={styles.selectOption}><Text style={[type.body, { color: colors.fg.primary }]}>{option.label}{option.value === value ? ' (선택됨)' : ''}</Text></Pressable>)}<Pressable accessibilityRole="button" onPress={onCancel} style={styles.selectOption}><Text style={[type.body, { color: colors.fg.secondary }]}>취소</Text></Pressable></View> : null} value={accountType} />
      <View style={[styles.surface, theme.foundation.elevation['1'], { backgroundColor: colors.bg.raised }]}>
        <Text style={[type.title, { color: colors.fg.primary }]}>오늘의 작업을 빠르게 끝내세요</Text>
        <Text style={[type.body, { color: colors.fg.secondary }]}>중요한 안내와 맥락을 전달하는 본문입니다. 텍스트 확대 설정에서도 높이가 잘리지 않도록 고정 높이를 사용하지 않습니다.</Text>
      </View>
      <NativeDialog closeOnBackdrop description="삭제한 데이터는 복구할 수 없습니다." footer={<View style={styles.dialogActions}><NativeButton onAction={() => setDialogOpen(false)} variant="tertiary">취소</NativeButton><NativeButton onAction={() => setDialogOpen(false)} variant="danger">삭제하기</NativeButton></View>} intent="destructive" onOpenChange={setDialogOpen} open={dialogOpen} title="프로젝트를 삭제할까요?" />
      <NativeBottomSheet description="계속 사용할 계정을 선택해 주세요." onOpenChange={setSheetOpen} open={sheetOpen} title="계정 선택"><View style={styles.actions}><NativeButton onAction={() => setSheetOpen(false)} variant="secondary">개인 계정</NativeButton><NativeButton onAction={() => setSheetOpen(false)} variant="secondary">팀 계정</NativeButton></View></NativeBottomSheet>
    </ScrollView>
    <NativeToastHost toast={{ action: { label: '다시 시도', onAction: () => undefined, onError: () => undefined }, message: '저장하지 못했어요', onOpenChange: setToastOpen, open: toastOpen, tone: 'negative' }} />
  </View></SafeAreaProvider>;
}

const styles = StyleSheet.create({ screen: { flex: 1 }, content: { gap: 16, padding: 24 }, actions: { gap: 12 }, dialogActions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }, feedback: { alignItems: 'center', flexDirection: 'row', gap: 12 }, progresses: { flex: 1, gap: 8 }, iconActions: { alignItems: 'center', flexDirection: 'row', gap: 12 }, selectSheet: { borderRadius: 16, borderWidth: 1, gap: 4, padding: 8 }, selectOption: { justifyContent: 'center', minHeight: 44, paddingHorizontal: 12 }, surface: { borderRadius: 20, gap: 12, marginTop: 16, padding: 24 }, tooltipTrigger: { alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'center', minHeight: 44, paddingHorizontal: 12 } });
