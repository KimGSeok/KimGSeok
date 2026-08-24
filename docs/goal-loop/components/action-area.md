# ActionArea / BottomCTA

화면 단위의 주요 행동을 하단에 정렬한다. primary는 정확히 하나, secondary는 최대 하나다. 제품은 실행 결과·이동·오류 메시지를 callback에서 소유하며 ActionArea는 Button의 pending/disabled/중복 실행 계약을 재사용한다.

공개 Toss BottomCTA의 Single/Double, fixed placement, 명확한 primary hierarchy를
구현 기준으로 원본 semantic Button 조합에 번역한다. Wanted Montage는
ActionArea 계열을 inventory에 포함할 catalogue evidence일 뿐 grouping이나 API의
구현 권한이 아니다. SEED에는 직접 동등한 하단 action-area 컴포넌트가 없으며
Action Button 존재만 selection evidence로 기록한다. Loci는 Web/RN renderer
분리만 참고하며 raw style override는 거부한다. 각 원본의 브랜드 값·자산·API는
사용하지 않는다.

## Toss gaps and Ask

None for the current Single/Double and fixed/static scope. Native safe-area,
keyboard avoidance, and accessibility behaviour are platform requirements, not
permission to import another design system's component decisions.

Web은 `sticky` 하단 section, Native는 safe screen layout에 배치되는 full-width action row를 제공한다. 실제 앱은 scroll content 밖 root footer에 NativeActionArea를 배치한다. Storybook은 secondary/primary, loading, dark, keyboard를 검증하고 Expo는 safe-area·큰 글꼴을 실기기에서 증명한다.
