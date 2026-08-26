# Changesets

배포 가능한 패키지의 동작이나 공개 API가 바뀌면 PR에 changeset을 함께
추가합니다.

```bash
pnpm changeset
```

문서, 테스트, 내부 도구만 바뀌어 릴리스가 필요하지 않다면 changeset을
추가하지 않습니다. 버전 반영과 실제 배포는
`.github/workflows/release-packages.yml`이 담당합니다.
