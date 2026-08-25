# 비공개 GitHub Packages 배포

이 저장소의 10개 `@kimgseok/design-*` 패키지는 최종 전용 저장소
`KimGSeok/design-system`에서 비공개 GitHub Packages로 배포하도록
준비되어 있습니다.

## 안전 경계

- 현재 프로필 저장소 `KimGSeok/KimGSeok`에서는 배포 작업이 실행되지
  않습니다.
- 릴리스 워크플로는 전용 저장소의 `main`에서 수동 실행할 때만
  동작합니다.
- 저장소의 `.npmrc`에는 레지스트리 주소만 있으며 토큰은 없습니다.
- 실제 publish 명령도 `GITHUB_REPOSITORY=KimGSeok/design-system`이
  아니면 중단됩니다.

## 전용 저장소로 옮긴 뒤 한 번만 설정할 것

1. GitHub에 private 저장소 `KimGSeok/design-system`을 만들고 이
   모노레포를 `main`에 올립니다.
2. 저장소의 **Settings → Actions → General → Workflow permissions**에서
   `Read and write permissions`와 GitHub Actions의 Pull Request 생성을
   허용합니다.
3. **Actions → Release private design-system packages → Run workflow**를
   `main`에서 실행합니다.
4. 첫 배포 뒤 각 Package settings에서 visibility가 **Private**인지,
   source repository가 `KimGSeok/design-system`인지, **Inherit access
   from repository**가 켜졌는지 확인합니다.

첫 실행 시 레지스트리에 없는 `0.1.0` 패키지를 배포합니다. 이후 코드
변경에는 `pnpm changeset`으로 변경 패키지와 patch/minor/major를
기록합니다. 릴리스 워크플로를 실행하면 버전 PR을 만들고, 그 PR을
머지한 뒤 워크플로를 다시 실행하면 새 버전이 배포됩니다.

배포자는 별도 PAT를 저장할 필요가 없습니다. 같은 저장소의
`GITHUB_TOKEN`에 워크플로가 `packages: write` 권한을 부여합니다.

## 로컬 프로젝트에서 설치

GitHub Packages의 npm 패키지는 private/public 여부와 관계없이 인증이
필요합니다. 소비자 저장소에는 다음처럼 환경 변수 참조만 커밋합니다.

```ini
# .npmrc
@kimgseok:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

GitHub의 classic Personal Access Token에 `read:packages` 권한을 주고,
해당 사용자가 private 소스 저장소 또는 패키지를 읽을 수 있게 한 뒤
로컬 환경 변수로 설정합니다. 토큰 문자열 자체는 파일에 기록하거나
커밋하지 않습니다.

```bash
export NODE_AUTH_TOKEN=YOUR_CLASSIC_PAT
pnpm add @kimgseok/design-tokens @kimgseok/design-primitives
```

## 다른 GitHub 저장소의 Actions에서 설치

각 패키지의 **Package settings → Manage Actions access → Add
repository**에서 소비자 저장소를 Read로 추가합니다. 소비자
워크플로에는 다음 권한과 레지스트리 설정을 사용합니다.

```yaml
permissions:
  contents: read
  packages: read

steps:
  - uses: actions/checkout@v6
  - uses: actions/setup-node@v7
    with:
      node-version: 22
      registry-url: https://npm.pkg.github.com
      scope: '@kimgseok'
  - run: pnpm install --frozen-lockfile
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Vercel·EAS 같은 외부 빌드

외부 빌드 시스템에는 `read:packages` classic PAT를
`NODE_AUTH_TOKEN`이라는 암호화된 환경 변수로 등록합니다. 소스에는
위의 환경 변수 참조형 `.npmrc`만 둡니다. 토큰 소유자의 GitHub
접근권한이 제거되면 설치도 즉시 실패하므로 개인 토큰 대신 전용 머신
계정을 쓰는 편이 운영에 안전합니다.

## 배포 전 검증

```bash
pnpm verify:publishing
pnpm check
```

`verify:publishing`은 10개 패키지의 scope, 전용 저장소 연결,
`restricted` 설정, 토큰 미포함, 워크플로 저장소 가드를 검사합니다.
`pnpm check`은 빌드, 실제 tarball 생성, 깨끗한 Next.js 소비자 설치와
빌드, 테스트, 타입 검사, Storybook 및 웹 시각 검증까지 수행합니다.
