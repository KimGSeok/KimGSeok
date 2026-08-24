# FilterBar

FilterBar는 결과 데이터나 정렬을 소유하지 않는, 1–8개 controlled 다중 선택 필터의 집합이다. 선택된 값과 해제 요청만 제품에 전달한다. 검색 결과 수, server loading/error, filter persistence는 제품이 소유한다.

## Reference authority

- `Toss public analogue: none`. 공개 TDS 카탈로그에는 독립 FilterBar가 없으므로
  기존 구현을 TDS 컴포넌트의 복제나 직접 번역으로 주장하지 않는다. Toss의
  공개 foundation, action hierarchy, touch target, feedback 원칙만 구현 기준으로
  사용한다.
- SEED와 Wanted Montage는 필터·선택 계열을 inventory에 포함할 근거와 누락
  상태를 찾는 비교 자료다. 두 시스템의 API, grouping, anatomy, styling은
  FilterBar의 구현 기준이 아니다.
- Loci analogue: Web/RN renderer split과 touch target만 참고하며 raw style/color escape hatch는 거부한다.

현재 계약은 새 정책 이전에 만들어진 provisional implementation이다. 다음
변경이나 완료 판정 전에 공개 Toss 원칙으로 재감사하고, Toss에서 결정할 수
없는 material behaviour는 `Ask`로 남긴다.

## Toss gaps and Ask

- `Ask`: 1–8개 제한과 다중 선택을 이 시스템의 원본 제품 계약으로 유지할지.
- `Ask`: Chip wrap을 기본 anatomy로 유지할지, Toss 공개 action/selection
  language에 맞춘 다른 surface가 필요한지.
- `Ask`: 선택 해제 action의 노출 조건과 header 내 위치를 현재 방식으로
  유지할지.

Web은 named section과 Chip button group, Native는 header와 Chip wrap을 제공한다. 선택이 있을 때만 reset control을 노출한다. 제품은 결과/error copy를 소유하고, FilterBar는 `loading`에서 interaction lock과 busy announcement를 소유한다. 44px target, focus, disabled state, 320px wrap, dark mode는 Storybook/Expo fixture로 검증한다.
