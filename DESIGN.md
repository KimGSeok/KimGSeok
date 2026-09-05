# KimGSeok Design System

## 1. Atmosphere & Identity

명료하고 탐색 가능한 제품 문서와, 제품 화면에 바로 설치할 수 있는 조용한 UI 기반을 지향한다. 시각적 서명은 Toss 계열의 선명한 blue ramp와 Pretendard의 안정적인 한글 리듬이며, 장식보다 정보 위계와 상태 전달을 우선한다.

## 2. Color

실제 값과 light/dark alias의 기계 판독 원본은 `packages/design-systems/foundation/tokens/src/tokens.json`이다.

### Palette

| Family | Steps | 기준 값 | Usage |
|---|---|---|---|
| gray | 50–900 | `#f9fafb` → `#191f28` | 표면, 텍스트, 경계 |
| blue | 50–900 | `#e8f3ff` → `#194aa6` | 브랜드, 정보, focus |
| red | 50–900 | `#ffeeee` → `#a51926` | 오류, 위험 |
| orange | 50–900 | `#fff3e0` → `#e45600` | 주의 |
| yellow | 50–900 | `#fff9e7` → `#dd7d02` | 주의 배경 |
| green | 50–900 | `#f0faf6` → `#027648` | 성공 |
| teal | 50–900 | `#edf8f8` → `#076565` | 보조 데이터 |
| purple | 50–900 | `#f9f0fc` → `#65237b` | 제한적인 보조 강조 |
| neutral | white / black | `#ffffff` / `#000000` | 절대 명암 기준 |

### Semantic roles

`fg`, `bg`, `border`, `status`, `action`, `selection`, `feedback`가 light/dark theme에서 같은 의미를 유지한다. 컴포넌트 내부와 일반 제품 UI는 semantic token을 기본으로 사용한다. `Text`의 콘텐츠 강조처럼 명시적인 색조가 필요한 경우에만 typed palette token을 허용한다.

### Rules

- CSS에서는 `--kg-color-*`, React Native에서는 `getNativeTheme()`를 사용한다.
- `Text color`는 `fg-primary` 같은 semantic foreground 또는 `red-500` 같은 lowercase palette union만 받는다.
- `colors.red500`은 raw hex가 아니라 cross-platform token 식별자인 `red-500`을 반환한다.
- 중립 팔레트의 공개 이름은 `gray`로 통일한다. CSS 변수·typed color·Native palette도 같은 표기를 사용하며, 표기 변경으로 색상값을 바꾸지 않는다.
- 새 색상은 이 문서와 `tokens.json`을 함께 갱신한 뒤 사용한다.

## 3. Typography

### Font stack

- Web: `Pretendard Variable`, `Pretendard`, platform/system fallbacks. Design Docs와 Storybook은 `pretendard@1.3.9`의 unicode-range variable subset을 self-host한다.
- iOS: `System`
- Android: `sans-serif`
- 별도 mono/serif family는 사용하지 않는다.

### Size scale

| Size | Font size | Line height | Usage |
|---|---:|---:|---|
| xxs | 10px | 14px | 조밀한 비필수 metadata만 허용 |
| xs | 12px | 16px | caption, 보조 metadata |
| s | 14px | 20px | label, 보조 본문 |
| m | 16px | 24px | 기본 본문 |
| l | 20px | 28px | 강조 본문, 작은 heading |
| xl | 24px | 32px | section title |
| xxl | 32px | 40px | page title, display |

### Weight scale

| Weight | Value |
|---|---:|
| regular | 400 |
| medium | 500 |
| semibold | 600 |
| bold | 700 |

### Composed token grammar

공개 토큰은 `<kind>-<size>-<weight>` 형식이다. `kind`는 `text | title`, `size`는 `xxs | xs | s | m | l | xl | xxl`, `weight`는 위 네 단계다. 예: `text-l-medium`, `title-xl-bold`. `title`은 l부터 음수 tracking을 사용하고 `text`는 중립 tracking을 사용한다.

기존 role은 마이그레이션 alias로만 유지한다: `display → title-xxl-bold`, `title → title-xl-bold`, `heading → title-l-bold`, `body → text-m-regular`, `label → text-s-semibold`, `caption → text-xs-regular`.

### Rules

- 일반 본문은 s(14px) 미만을 사용하지 않는다. xxs/xs는 비필수 metadata 전용이다.
- `Text`는 `textStyle`, `Heading`은 `title-*` textStyle을 사용한다.
- `role`과 `tone`은 0.x 호환 API이며 신규 코드에서는 사용하지 않는다.

## 4. Spacing & Layout

모든 spacing은 4px base unit을 따른다: `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64`. Radius는 `none, sm, md, lg, xl, full`이고 최소 touch target은 44px이다. Docs와 showcase는 좁은 화면에서 한 열로 재배치하며 primary content에 가로 스크롤을 만들지 않는다. 브라우저 intrinsic sizing, `%`, `min()`, `max()`, `clamp()`는 layout mechanics로서 raw 표현을 허용한다.

## 5. Components

### Text

- **Structure**: semantic inline/block element + composed typography token + typed text color.
- **Variants**: `text-*`, `title-*`; Web의 `span | p | strong`, Native의 `RNText`.
- **States**: visual interaction state 없음; `numberOfLines`로 명시적인 truncation만 허용.
- **Accessibility**: 본문 최소 s, 색상 contrast는 소비 표면과 함께 검증.

### Heading

- **Structure**: Web `h1 | h2 | h3`, Native header accessibility role.
- **Variants**: `title-<size>-<weight>`만 허용.
- **Accessibility**: 시각 크기와 문서 heading level을 분리하고 heading 순서를 건너뛰지 않는다.

### Remaining public components

Button, feedback, overlay, navigation, form, date-picker, primitive 패키지는 각 패키지 contract를 따른다. Docs 탐색 그룹의 단일 원본은 `packages/design-systems/catalog/src/registry.ts`이며, 패키지 계층과 탐색 분류를 혼합하지 않는다.

### Component Documentation Harness

- **Structure**: 컴포넌트 목록 사이드바 + 상세 콘텐츠 + 실제 섹션에서 생성된 페이지 목차.
- **Examples**: private `@kimgseok/design-examples`가 공개 Web package entrypoint만 소비하며 Docs Preview/Code와 Storybook이 같은 예제를 사용한다.
- **States**: 예제 선택, Preview/Code, reset, 코드 복사 pending·성공·실패·재시도. 테마 전환은 실제 theme scope를 제공할 때만 노출한다.
- **Accessibility**: tab/tabpanel 관계, 복사 결과 live region, keyboard focus, overlay의 기존 focus lifecycle을 보존한다.
- **Boundary**: 예제는 네트워크·라우팅·비즈니스 정책을 소유하지 않으며 Docs 전용 motion을 컴포넌트에 덧씌우지 않는다.

### Composition examples and recovery

- 목록 탐색, 입력·저장, 상세·확인 예제는 기존 공개 컴포넌트를 조합한다. 예제의 검색·검증·실패 시뮬레이션은 소비자 책임을 보여주는 로컬 fixture이며 새 공용 컴포넌트가 아니다.
- 선택·탐색 버튼의 기본 HTML type은 button이다. 중첩 오버레이의 Escape는 최상위 한 레이어만 닫는다. 날짜 선택은 값을 변경하지 않는 명시적 취소 경로를 제공한다.
- 사용자 입력의 범위 오류는 필드 오류 상태로 표현한다. 개발자의 잘못된 형식·범위 설정은 계약 오류로 유지한다.
- Toast는 선택적 id로 표시 세션을 구분한다. id를 생략하면 메시지·action 레이블·열림 상태 변경으로 세션을 구분하며, 이전 작업의 완료·오류·취소는 새 세션에 반영하지 않는다.
- Skeleton은 `feedback.skeleton.fill`을 사용한다(light gray.200, dark gray.600). 날짜 범위는 `selection.rangeBg`를 사용한다(light blue.50, dark gray.800). 필수 오류 안내는 최소 text-s-regular이다.
- Table은 문자열 셀의 읽기용 표를 유지한다. 행별 행동은 ListItem 등으로 조합하며 복합 셀 API는 이번 범위에 추가하지 않는다.

## 6. Motion & Interaction

| Recipe | Duration | Easing | Usage |
|---|---:|---|---|
| press | 120ms | standard | press, hover, focus feedback |
| stateChange | 180ms | standard | selection, value, colour state |
| enter | 200ms | decelerate | small surface entry |
| exit | 140ms | accelerate | small surface exit |
| overlay | 240ms | decelerate | Dialog, BottomSheet, Menu |
| progressLoop | 1200ms | linear | Spinner, indeterminate Progress |
| skeletonPulse | 1600ms | standard | calm Skeleton opacity pulse |
| reduced | 0ms | linear | reduced-motion replacement |

`@kimgseok/design-motion` is the cross-platform source for recipes and reduced-motion state. The legacy `fast`, `normal`, and `slow` durations remain compatibility aliases only. Components do not embed durations or easing strings.

Animations use transform and opacity only. Colour-only state feedback may remain under reduced motion, but spatial movement and continuous rotation stop. A reduced-motion preference that has not resolved yet is treated as reduced. Every interactive primitive includes the applicable hover, pressed, focus-visible, disabled, loading, and pointer-cancel states; non-applicable states are documented rather than simulated.

Loading uses separate patterns: Skeleton is for initial layout loading, Spinner/Progress is for bounded local work, and background refresh preserves existing content. Products own data fetching, empty/error copy, and retry policy. `useStableLoading` prevents a short request from flashing a loading surface and keeps a visible loading surface stable long enough to read.

## 7. Depth & Surface

전략은 mixed다. 기본 분리는 semantic border와 tonal surface로 만들고, raised surface와 overlay에만 elevation 1–2를 사용한다. 장식적인 shadow 추가는 허용하지 않으며 `foundation.elevation` 토큰을 통해서만 사용한다.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- 목표는 WCAG 2.2 AA다: 일반 텍스트 4.5:1, 큰 텍스트 및 focus indicator 3:1 이상.
- 모든 interactive element는 keyboard reachability와 visible focus를 제공한다.
- 상태를 색상만으로 전달하지 않으며 reduced motion을 존중한다.
- xxs/xs는 핵심 본문이나 필수 안내에 사용하지 않는다.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|---|---|---|---|
| 없음 | — | — | — |
