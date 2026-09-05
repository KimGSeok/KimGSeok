import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Metadata } from "next";
import CompositionListExample from "@kimgseok/design-examples/composition-list";
import CompositionFormExample from "@kimgseok/design-examples/composition-form";
import CompositionDetailExample from "@kimgseok/design-examples/composition-detail";
import { DocumentationPage } from "../DocumentationPage";
import { ComponentShowcase } from "../components/[slug]/ComponentShowcase";

export const metadata: Metadata = {
  title: "화면 조합",
  description: "공개 컴포넌트로 목록, 입력, 상세 화면을 구성하는 예제입니다.",
};

const compositions = [
  {
    id: "composition-list",
    title: "목록 · 검색 · 필터",
    description:
      "검색·필터를 바꾸면 첫 페이지로 돌아갑니다. 결과가 없을 때는 빈 상태에서 조건을 초기화합니다. 데이터는 로컬 fixture입니다.",
    Preview: CompositionListExample,
  },
  {
    id: "composition-form",
    title: "입력 · 저장 · 복구",
    description:
      "첫 유효 저장은 600ms 뒤 실패하도록 만든 예제입니다. 입력값을 유지하고 재시도하면 성공합니다. 날짜 범위 오류는 화면을 중단하지 않고 필드에서 안내합니다.",
    Preview: CompositionFormExample,
  },
  {
    id: "composition-detail",
    title: "상세 · 날짜 · 확인",
    description:
      "ListItem에서 상세를 열고 날짜를 선택한 뒤 변경을 확인합니다. Menu·달력·확인창은 현재 팝업만 닫고, 최종 변경 후 Toast를 표시합니다.",
    Preview: CompositionDetailExample,
  },
] as const;

export default async function CompositionsPage() {
  const examples = await Promise.all(
    compositions.map(async ({ Preview, ...example }) => ({
      ...example,
      code: (
        await readFile(
          resolve(process.cwd(), `../design-examples/src/${example.id}.tsx`),
          "utf8"
        )
      ).trim(),
      preview: <Preview />,
    }))
  );
  return (
    <DocumentationPage
      title="화면 조합"
      eyebrow="COMPOSITIONS"
      description="44개 컴포넌트를 늘리지 않고 실제 사용자 흐름으로 연결합니다. 제품 상태와 저장 정책은 예제가 소유하고, 공용 컴포넌트는 표시·입력·상호작용을 맡습니다."
    >
      <ComponentShowcase examples={examples} />
      <section aria-labelledby="composition-boundaries">
        <h2 id="composition-boundaries">적용 범위</h2>
        <p>
          이 예제는 실제 공개 Web 패키지를 사용합니다. Table은 읽기 전용 문자열
          데이터를, 행 단위 작업은 ListItem을 사용합니다. 서버 요청·권한·저장
          정책은 제품에서 연결하세요.
        </p>
        <p>
          동일한 문구의 새 Toast로 교체할 때는 새 id를 지정하세요. 이전 알림의
          비동기 결과가 새 알림을 닫지 않도록 세션을 구분합니다.
        </p>
        <p>
          Native는 같은 상태 의미를 공유하지만 이 페이지의 Web 예제가 Native
          렌더링·포커스 검증을 대신하지 않습니다. 브라우저·디바이스 검증은 아직
          수행하지 않았습니다.
        </p>
      </section>
    </DocumentationPage>
  );
}
