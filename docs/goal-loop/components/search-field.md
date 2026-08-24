# SearchField

## Purpose

검색어 입력과 명시적 검색 실행을 한 조작으로 제공한다. 자동완성, 결과 목록, 필터 조합, 최근 검색어는 제품 화면이 소유한다.

## Contract

- `label`, controlled `value`, `onValueChange`, `onSearch`, `onSearchError`는 필수다. 빈 값은 실행하지 않는다.
- `onSearch`가 진행 중이면 내부 pending lock과 busy/disabled 상태로 중복 실행을 막는다. 제품이 `loading`을 주면 같은 상태를 외부에서 제어한다.
- 실패 결과 문구는 제품이 `onSearchError`로 live region 또는 화면 상태에 표시한다. 필드가 성공/실패 메시지를 임의로 만들지 않는다.
- Web은 `type=search`, Enter, 지우기와 실행 버튼을 제공한다. Native는 search return key와 동등한 지우기/실행 Pressable을 제공한다.
- focus는 foundation `border.focus`와 ring을 사용한다. 48px field, 44px 보조 조작을 최소 터치 타깃으로 유지한다.

## Catalogue evidence and implementation authority

| Reference | Authority | Use |
| --- | --- | --- |
| Toss | implementation authority | 명확한 검색 실행, 간결한 입력 surface, 공개 상태·동작 지침을 원본 semantic API로 번역 |
| SEED | catalogue/evidence only | 검색 입력 계열의 coverage와 누락 상태 확인; API·상태·스타일은 채택하지 않음 |
| Montage | catalogue/evidence only | Search field 존재와 검증 항목 확인; API·상태·스타일은 채택하지 않음 |
| Loci analogue | architecture/evidence only | Web/RN renderer 분리와 touch target만 참고; raw style escape hatch와 direct color는 거부 |

## Toss gaps and Ask

None for the current explicit-search scope. Product-owned autocomplete, recent
searches, and result behaviour remain outside this component.

## Evidence gate

- Storybook: 기본, pending, 실패 feedback, dark, keyboard Enter/clear/focus, 320px 장문 label.
- Expo: iOS/Android에서 return key, pending/busy, disabled, 큰 글꼴과 TalkBack/VoiceOver label을 실제 캡처한다.
