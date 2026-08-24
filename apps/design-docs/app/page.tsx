"use client";

import { Badge } from "@kimgseok/design-primitives/web";
import Link from "next/link";
import {
  catalog,
  catalogCategories,
  catalogSummary,
  foundationDimensions,
} from "@kimgseok/design-catalog";
import { ComponentPreview } from "./ComponentPreview";

const componentGroups = catalogCategories.filter(
  ({ category }) => !["Foundation", "Patterns"].includes(category),
);
const patterns = catalog.filter(({ layer }) => layer === "pattern");

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">WEB + REACT NATIVE</p>
          <h1 id="hero-title">
            제품을 빠르게 만들고,
            <br />
            같은 기준으로 완성합니다.
          </h1>
          <p className="hero-description">
            Toss의 공개 디자인 원칙을 구현 기준으로 번역한 개인 디자인
            시스템입니다. 공통 계약을 공유하고 Web과 Native의 사용 방식은 각
            플랫폼에 맞춥니다.
          </p>
          <div className="hero-meta" aria-label="디자인 시스템 현재 상태">
            <Badge label="Registry-driven" tone="positive" />
            <span>
              {catalogSummary.foundation} Foundation ·{" "}
              {catalogSummary.primitive} Primitive · {catalogSummary.composite}{" "}
              Composite
            </span>
          </div>
        </div>
        <ComponentPreview />
      </section>

      <section
        className="section"
        id="foundations"
        aria-labelledby="foundations-title"
      >
        <div className="section-heading">
          <p className="eyebrow">01 / FOUNDATIONS</p>
          <h2 id="foundations-title">표현보다 먼저 합의하는 기반</h2>
          <p>
            원시 값을 직접 사용하지 않고 의미와 역할을 통해 제품의 일관성을
            유지합니다.
          </p>
        </div>
        <div className="foundation-grid">
          {foundationDimensions.map((item, index) => (
            <article key={item}>
              <span>0{index + 1}</span>
              <h3>{item}</h3>
              <p>Semantic tokens · Light/Dark · Web/Native</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section"
        id="components"
        aria-labelledby="components-title"
      >
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">02 / COMPONENTS</p>
            <h2 id="components-title">제품 제작에 필요한 구성 요소</h2>
          </div>
          <p>
            상태, 접근성, 비동기 동작과 플랫폼 차이를 컴포넌트 계약에
            포함했습니다.
          </p>
        </div>
        <div className="component-grid">
          {componentGroups.map((group) => (
            <article id={group.category.toLowerCase()} key={group.category}>
              <div>
                <h3>{group.category}</h3>
                <span>{group.entries.length}</span>
              </div>
              <ul className="catalog-list">
                {group.entries.map((entry) => (
                  <li key={entry.slug}>
                    <Link href={`/components/${entry.slug}`}><strong>{entry.name}</strong></Link>
                    <span>
                      {entry.layer} · {entry.maturity} ·{" "}
                      {entry.platforms.join("/")}
                    </span>
                    <code>
                      {Object.entries(entry.importPaths)
                        .map(([platform, path]) => `${platform}: ${path}`)
                        .join(" · ")}
                    </code>
                    <small>
                      Catalogue T/S/M:{" "}
                      {entry.cataloguePresence.toss ? "yes" : "no"}/
                      {entry.cataloguePresence.seed ? "yes" : "no"}/
                      {entry.cataloguePresence.montage ? "yes" : "no"}
                    </small>
                    <small>
                      {entry.authority} · {entry.gap}
                    </small>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section principles"
        id="patterns"
        aria-labelledby="patterns-title"
      >
        <div className="section-heading">
          <p className="eyebrow">03 / PATTERNS</p>
          <h2 id="patterns-title">컴포넌트를 넘어 제품의 흐름까지</h2>
        </div>
        <ol>
          {patterns.map((entry, index) => (
            <li key={entry.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{entry.name}</h3>
                <p>{entry.description}</p>
                <small>
                  {entry.maturity} · consumer composition · {entry.gap}
                </small>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="section platform-section"
        id="platforms"
        aria-labelledby="platforms-title"
      >
        <div>
          <p className="eyebrow">04 / PLATFORMS</p>
          <h2 id="platforms-title">
            같아야 할 것과 달라야 할 것을 구분합니다.
          </h2>
        </div>
        <p>
          색상, 의미, 상태와 결과는 공유합니다. 키보드, 터치, picker, safe
          area와 스크린리더 안내는 플랫폼 규칙을 따릅니다.
        </p>
      </section>
    </main>
  );
}
