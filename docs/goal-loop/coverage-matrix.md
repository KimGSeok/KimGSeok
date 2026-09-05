# Catalog Classification Matrix

> Generated from `packages/design-systems/catalog/src/registry.ts` by
> `pnpm --filter @kimgseok/design-catalog generate:coverage`. Do not edit the
> inventory rows by hand.

## Measured inventory

- 46 catalogue entries: 44 stable public UI components,
  one foundation-only Tokens entry, and one consumer-owned Candidate pattern.
- 41 shared Web + Native components; 3 Web-only components:
  Table, Calendar, Breadcrumb.
- User-role totals: Content & Data 8, Layout 2, Actions 3, Forms & Inputs 15, Feedback 6, Overlays 5, Navigation 5.
- Selection-class totals: Foundation 4, Core 33, Extended 8, Optional 1.
- Tokens is the single non-UI Foundation entry; SearchFilter is the single
  consumer-owned Pattern entry. Their user role is deliberately empty.
- Assessment is deliberately absent from this table. It is current-snapshot
  evidence recorded in `evaluate.md`, not a permanent catalogue fact.

## Independent classification axes

- **Role:** the primary job a user completes with the component.
- **Entry kind:** whether the row is a Foundation fact, a public UI component,
  or a consumer-owned Pattern.
- **Layer:** implementation/composition structure. It does not determine the Docs group.
- **Selection class:** why the system carries the item.
- **Maturity:** maturity는 배포/API 단계이며 현재 UI 품질이나 검증 완료를 뜻하지 않습니다.
- **Platform:** where a maintained public implementation exists.

- **Foundation:** 토큰·타이포그래피·아이콘처럼 다른 UI가 성립하기 전에 필요한 기반입니다.
- **Core:** Foundation을 제외하고 Toss·SEED v2·Montage 세 공개 카탈로그에 모두 존재합니다.
- **Extended:** Foundation을 제외하고 두 공개 카탈로그에 존재합니다.
- **Optional:** 공개 카탈로그 교집합이 두 곳 미만인 선택적 확장으로, Core 완료를 막지 않습니다.

## Entries

`T/S/M` records public catalogue presence in Toss TDS, Daangn SEED, and
Wanted Montage. Presence narrows the inventory; it does not make those systems
equal visual or behavioural authorities.

| Entry | Entry kind | User role | Selection class | Selection evidence | Layer | Release maturity | Platform | T/S/M | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tokens | Foundation | — | Foundation | 다른 UI 계약보다 먼저 필요한 Foundation 항목 | Foundation | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-tokens` |
| Icon | Component | Content & Data | Foundation | 다른 UI 계약보다 먼저 필요한 Foundation 항목 | Foundation | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-icons` |
| Text | Component | Content & Data | Foundation | 다른 UI 계약보다 먼저 필요한 Foundation 항목 | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-primitives` |
| Heading | Component | Content & Data | Foundation | 다른 UI 계약보다 먼저 필요한 Foundation 항목 | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-primitives` |
| Badge | Component | Content & Data | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-primitives` |
| Avatar | Component | Content & Data | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-primitives` |
| Card | Component | Content & Data | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-primitives` |
| ListItem | Component | Content & Data | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-primitives` |
| Table | Component | Content & Data | Extended | 공개 카탈로그 교집합: SEED v2 + Montage | Primitive | Stable | Web | N/Y/Y | `@kimgseok/design-primitives` |
| Surface | Component | Layout | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-primitives` |
| Divider | Component | Layout | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-primitives` |
| Button | Component | Actions | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-button` |
| IconButton | Component | Actions | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-primitives` |
| ActionArea | Component | Actions | Extended | 공개 카탈로그 교집합: Toss + Montage | Composite | Stable | Web + Native | Y/N/Y | `@kimgseok/design-button` |
| TextField | Component | Forms & Inputs | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-forms` |
| TextArea | Component | Forms & Inputs | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-forms` |
| Checkbox | Component | Forms & Inputs | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-forms` |
| Switch | Component | Forms & Inputs | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-forms` |
| RadioGroup | Component | Forms & Inputs | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-forms` |
| Select | Component | Forms & Inputs | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-forms` |
| Slider | Component | Forms & Inputs | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-forms` |
| SearchField | Component | Forms & Inputs | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Composite | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-forms` |
| DateTimeField | Component | Forms & Inputs | Extended | 공개 카탈로그 교집합: SEED v2 + Montage | Composite | Stable | Web + Native | N/Y/Y | `@kimgseok/design-forms` |
| Calendar | Component | Forms & Inputs | Extended | 공개 카탈로그 교집합: SEED v2 + Montage | Primitive | Stable | Web | N/Y/Y | `@kimgseok/design-date-picker` |
| DatePicker | Component | Forms & Inputs | Extended | 공개 카탈로그 교집합: SEED v2 + Montage | Composite | Stable | Web + Native | N/Y/Y | `@kimgseok/design-date-picker` |
| DateRangePicker | Component | Forms & Inputs | Extended | 공개 카탈로그 교집합: SEED v2 + Montage | Composite | Stable | Web + Native | N/Y/Y | `@kimgseok/design-date-picker` |
| Chip | Component | Forms & Inputs | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-navigation` |
| ChipGroup | Component | Forms & Inputs | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-navigation` |
| FilterBar | Component | Forms & Inputs | Extended | 공개 카탈로그 교집합: SEED v2 + Montage | Composite | Stable | Web + Native | N/Y/Y | `@kimgseok/design-navigation` |
| Spinner | Component | Feedback | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-feedback` |
| Progress | Component | Feedback | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-feedback` |
| Callout | Component | Feedback | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-feedback` |
| ToastViewport | Component | Feedback | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-feedback` |
| SkeletonRegion | Component | Feedback | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-primitives` |
| EmptyState | Component | Feedback | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Composite | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-primitives` |
| Dialog | Component | Overlays | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-overlays` |
| BottomSheet | Component | Overlays | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-overlays` |
| Tooltip | Component | Overlays | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-overlays` |
| Menu | Component | Overlays | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-overlays` |
| ConfirmationDialog | Component | Overlays | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Composite | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-overlays` |
| Tabs | Component | Navigation | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-navigation` |
| SegmentedControl | Component | Navigation | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-navigation` |
| Pagination | Component | Navigation | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-navigation` |
| AppBar | Component | Navigation | Core | 공개 카탈로그 교집합: Toss + SEED v2 + Montage | Primitive | Stable | Web + Native | Y/Y/Y | `@kimgseok/design-navigation` |
| Breadcrumb | Component | Navigation | Extended | 공개 카탈로그 교집합: SEED v2 + Montage | Primitive | Stable | Web | N/Y/Y | `@kimgseok/design-navigation` |
| SearchFilter | Pattern | — | Optional | 두 곳 이상의 공개 카탈로그 교집합 없음; 선택적 제품 패턴 | Pattern | Candidate | Web + Native | N/N/N | `consumer-owned` |

## Verification boundary

- The catalogue test requires every public Web and Native function export to
  have exactly one row with a real source path and Storybook owner.
- Static Web/Native wiring does not prove browser, device, or physical
  screen-reader behaviour. Missing runtime evidence remains `UNVERIFIED` in
  the assessment ledger.
