import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog } from "@kimgseok/design-catalog";

export function generateStaticParams() {
  return catalog.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: catalog.find((item) => item.slug === slug)?.name ?? "Component",
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = catalog.find((item) => item.slug === slug);
  if (!entry) notFound();
  return (
    <main id="main-content" className="component-detail">
      <Link href="/#components">← 전체 구성 요소</Link>
      <p className="eyebrow">
        {entry.category} / {entry.layer}
      </p>
      <h1>{entry.name}</h1>
      <p className="hero-description">{entry.description}</p>
      <dl className="contract-grid">
        <div>
          <dt>성숙도</dt>
          <dd>{entry.maturity}</dd>
        </div>
        <div>
          <dt>플랫폼</dt>
          <dd>{entry.platforms.join(" · ")}</dd>
        </div>
        <div>
          <dt>구현 기준</dt>
          <dd>{entry.authority}</dd>
        </div>
        <div>
          <dt>Toss 공개 유사체</dt>
          <dd>{entry.tossAnalogue}</dd>
        </div>
      </dl>
      <section>
        <h2>설치와 import</h2>
        {Object.entries(entry.importPaths).map(([platform, path]) => (
          <pre key={platform}>
            <code>{`import { ${entry.name} } from "${path}"; // ${platform}`}</code>
          </pre>
        ))}
      </section>
      <section>
        <h2>사용 기준</h2>
        <p>
          {entry.layer === "composite"
            ? "반복되는 접근성 또는 수명주기를 제품마다 다시 구현하지 않을 때 사용합니다."
            : "도메인 의미 없이 하나의 UI 역할이 필요할 때 사용합니다."}
        </p>
        {entry.composition ? (
          <p>구성: {entry.composition.join(" + ")}</p>
        ) : null}
      </section>
      <section>
        <h2>상태와 검증</h2>
        <p>
          기본, disabled, 오류, 로딩과 플랫폼별 접근성 상태는 Storybook에서
          검증합니다. 비즈니스 정책, 데이터 요청, 라우팅과 분석은 소비자
          프로젝트가 소유합니다.
        </p>
      </section>
      <section>
        <h2>레퍼런스 판단</h2>
        <p>
          Catalogue T/S/M: {entry.cataloguePresence.toss ? "yes" : "no"}/
          {entry.cataloguePresence.seed ? "yes" : "no"}/
          {entry.cataloguePresence.montage ? "yes" : "no"}
        </p>
        <p>{entry.gap}</p>
      </section>
    </main>
  );
}
