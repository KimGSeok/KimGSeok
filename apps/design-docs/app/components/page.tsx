import type { Metadata } from "next";
import { documentedComponents } from "../docs-navigation";
import { ComponentCatalog } from "./ComponentCatalog";

export const metadata: Metadata = {
  title: "Components",
  description: "이름, 용도, 플랫폼으로 디자인 시스템 컴포넌트를 찾습니다.",
};

const componentEntries = documentedComponents
  .toSorted((left, right) => left.name.localeCompare(right.name, "en"));

export default async function ComponentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  return (
    <main id="main-content" className="catalog-page">
      <header className="catalog-hero">
        <p className="eyebrow">COMPONENTS</p>
        <h1>필요한 컴포넌트를 바로 찾으세요.</h1>
        <p>
          이름이나 만들려는 화면의 역할로 검색하고, 대상 플랫폼에서 사용할 수
          있는지 확인하세요.
        </p>
      </header>
      <ComponentCatalog
        entries={componentEntries}
        initialPlatform={first(params.platform)}
        initialQuery={first(params.q)}
      />
    </main>
  );
}
