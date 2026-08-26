import {
  componentCategoryDefinitions,
  componentCategoryPolicy,
} from "@kimgseok/design-catalog";
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
        <h1>필요한 컴포넌트를<br />바로 찾으세요.</h1>
        <p>
          이름이나 역할로 검색하고 플랫폼을 확인한 뒤, 상세 계약과 실제 상태
          증거로 이동할 수 있습니다.
        </p>
      </header>
      <details className="component-category-guide">
        <summary>컴포넌트 그룹 분류 기준</summary>
        <div>
          <p>{componentCategoryPolicy.principle}</p>
          <ul className="component-category-list">
            {componentCategoryDefinitions.map(({ category, description, examples }) => (
              <li key={category}>
                <strong>{category}</strong>
                <span>{description}</span>
                <small>예: {examples.join(", ")}</small>
              </li>
            ))}
          </ul>
          <ul className="component-category-rules">
            {componentCategoryPolicy.rules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </div>
      </details>
      <ComponentCatalog
        entries={componentEntries}
        initialPlatform={first(params.platform)}
        initialQuery={first(params.q)}
      />
    </main>
  );
}
