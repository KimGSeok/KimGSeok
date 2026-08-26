# Design Systems

Web과 React Native가 의미와 상태 계약을 공유하는 디자인 시스템 workspace입니다.
이 디렉터리는 프로필 저장소의 다른 코드와 분리된 디자인 시스템 소스 경계입니다.

```text
packages/design-systems/
  foundation/
    tokens/
    icons/
  primitives/
  components/
    button/
    forms/
    date-picker/
    feedback/
    overlays/
    navigation/
  catalog/
```

`foundation`, `primitives`, `components`는 코드의 의존성과 배포 책임을 나누는
경계입니다. Design Docs의 탐색 분류와 동일한 폴더 구조를 뜻하지 않습니다.

## Design Docs 컴포넌트 그룹

Design Docs는 모든 공개 UI를 `Components` 아래에 유지하고 종류별 헤더로만
그룹화합니다. 컴포넌트가 다른 컴포넌트를 합성하는지, 어느 패키지에 있는지,
`primitive` 또는 `composite`인지 여부는 탐색 분류에 사용하지 않습니다.

그룹의 순서·설명·예시는 `catalog/src/registry.ts`의
`componentCategoryDefinitions`가 단일 원본입니다. 새 컴포넌트를 등록할 때는
다음 순서로 하나의 `category`를 선택합니다.

1. 공개 API로 사용자가 완료하는 주된 결과를 찾습니다.
2. 그 결과와 일치하는 기존 그룹 하나에 배치합니다.
3. 부수적인 역할은 중복 배치하지 않고 검색 별칭이나 관련 컴포넌트로 연결합니다.
4. 기존 기준으로 분류할 수 없을 때만 설명과 예시를 포함한 새 그룹을 제안합니다.

Docs IA 테스트는 모든 stable 컴포넌트가 정확히 한 그룹에 포함되고, 빈 그룹이나
중복 URL이 생기지 않는지 검증합니다.

## 시작하기

저장소 루트에서 실행합니다.

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm design-docs
```

컴포넌트 상태와 상호작용은 `pnpm storybook`으로 확인합니다.

## 검증

```bash
pnpm build
pnpm verify:packages
pnpm test
pnpm -r --if-present typecheck
```
