# Design System Implementation Priority

선정 기준: TDS·SEED·Montage 공개 카탈로그로 컴포넌트 종류를 좁힌 뒤,
제품 사용 빈도, 의존성, 접근성·상태 복잡도, Web/Native 공통 계약 가능성을
함께 본다. 세 카탈로그의 직접 공통 항목을 Core로 우선한다.

구현 기준: 선택된 컴포넌트의 API·상태·동작·시각 위계는 공개 Toss TDS를
우선한다. SEED·Montage는 종류 선정과 구조·검증 참고이며 동등한 구현 기준이
아니다. Toss 공개 대응물이 없으면 다른 시스템을 자동 채택하지 않고
`Toss public analogue: none`과 `Ask`를 남긴다.

등급: `[Foundation]`은 카탈로그 교집합 밖의 기반, `[Core]`는 3개 공개
카탈로그 직접 공통, `[Extended]`는 2개 이상 또는 명시적 제품 필요,
`[Optional]`은 단일 레퍼런스나 선택적 확장이다.

## P0 — Foundation and essential actions

1. `[Foundation]` Typography
2. `[Foundation]` Color and semantic themes
3. `[Foundation]` Spacing, radius, elevation, motion, focus, touch target
4. `[Core]` Button
5. `[Extended]` IconButton
6. `[Foundation]` Text / Heading
7. `[Foundation]` Icon

## P1 — Form primitives

8. `[Core]` TextField
9. `[Core]` TextArea
10. `[Core]` Checkbox
11. `[Extended]` Radio / RadioGroup
12. `[Core]` Switch
13. `[Core]` Slider
14. `[Extended]` Select / Native picker contract
15. `[Extended]` FormField, Label, HelpText, ErrorMessage

## P2 — Feedback and overlays

16. `[Extended]` Spinner / Progress
17. `[Extended]` Toast
18. `[Extended]` Callout / Alert
19. `[Extended]` Dialog
20. `[Core]` BottomSheet
21. `[Extended]` Tooltip
22. `[Core]` Menu

## P3 — Selection and navigation

23. `[Core]` Tabs
24. `[Core]` SegmentedControl
25. `[Extended]` Chip
26. `[Optional]` Pagination
27. `[Extended]` NavigationBar / AppBar
28. `[Optional]` Breadcrumb (Web)

## P4 — Content composition

29. `[Core]` Badge
30. `[Extended]` Avatar
31. `[Extended]` Divider
32. `[Optional]` Card
33. `[Extended]` ListItem
34. `[Extended]` EmptyState
35. `[Core]` Skeleton
36. `[Extended]` Table (Web)

## P5 — Product patterns

37. `[Extended]` SearchField
38. `[Extended]` FilterBar
39. `[Extended]` ActionArea / BottomCTA
40. `[Extended]` Confirmation flow
41. `[Extended]` Date and time inputs
42. `[Optional]` File upload

각 컴포넌트는 세 카탈로그의 존재 여부와 선택 등급을 기록하고, 공개 Toss
기준의 원본 계약, Web/Native 구현, Storybook/Expo fixture, 접근성 검증,
적대적 리뷰 3회를 거친 뒤 다음 항목으로 넘어간다.

Foundation/Core/Extended의 현재 항목별 상태와 증거는
[`goal-loop/coverage-matrix.md`](goal-loop/coverage-matrix.md)를 단일 릴리스
인덱스로 사용한다.

## Storybook workflow

- 로컬 실행: `pnpm storybook`
- 정적 빌드: `pnpm build:storybook`
- Web 컴포넌트는 Storybook의 Controls, Autodocs, a11y 검사를 통과해야 한다.
- Native 컴포넌트는 동일 계약을 Expo specimen에서 검증하고, Storybook 문서에는
  Web/Native 차이와 Native 증거 경로를 기록한다.
