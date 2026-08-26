import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CatalogEntry, CatalogPlatform } from "@kimgseok/design-catalog";
import { documentedComponents } from "../../docs-navigation";
import { sourceUrl, storyUrl } from "../../documentation-links";

export function generateStaticParams() {
  return documentedComponents.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = documentedComponents.find((item) => item.slug === slug);
  return {
    title: entry?.name ?? "Component",
    description: entry?.description,
  };
}

function platformLabel(platform: CatalogPlatform) {
  return platform === "web" ? "Web" : "React Native";
}

function importSnippet(entry: CatalogEntry, platform: CatalogPlatform) {
  const importPath = entry.importPaths[platform];
  if (!importPath) return null;
  return `import { ${entry.exportNames[platform]} } from "${importPath}";`;
}

function relatedEntries(entry: CatalogEntry) {
  const composed = (entry.composition ?? [])
    .map((name) => documentedComponents.find((candidate) => candidate.name === name))
    .filter((candidate): candidate is CatalogEntry => Boolean(candidate));
  const samePackage = documentedComponents.filter(
    (candidate) =>
      candidate.slug !== entry.slug &&
      candidate.packageName === entry.packageName &&
      candidate.maturity === "stable",
  );
  return Array.from(
    new Map([...composed, ...samePackage].map((candidate) => [candidate.slug, candidate])).values(),
  ).slice(0, 4);
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = documentedComponents.find((item) => item.slug === slug);
  if (!entry) notFound();

  const evidenceUrl = entry.storyId ? storyUrl(entry.storyId) : null;
  const related = relatedEntries(entry);

  return (
    <main id="main-content" className="component-detail">
      <Link className="back-link" href="/components">← 전체 컴포넌트</Link>

      <header className="detail-header">
        <div className="detail-kicker">
          <span>{entry.category}</span>
          <span className={`status-badge ${entry.maturity === "stable" ? "status-stable" : "status-candidate"}`}>
            {entry.maturity}
          </span>
        </div>
        <h1>{entry.name}</h1>
        <p className="hero-description">{entry.description}</p>
        <div className="detail-actions">
          {evidenceUrl ? (
            <a className="primary-link" href={evidenceUrl} rel="noreferrer" target="_blank">
              Storybook에서 상태 보기 <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {entry.sourcePaths.web ? (
            <a className="secondary-link" href={sourceUrl(entry.sourcePaths.web)} rel="noreferrer" target="_blank">
              소스 보기 <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </header>

      <dl className="contract-grid">
        <div>
          <dt>성숙도</dt>
          <dd>{entry.maturity}</dd>
        </div>
        <div>
          <dt>플랫폼</dt>
          <dd>{entry.platforms.map(platformLabel).join(" · ")}</dd>
        </div>
        <div>
          <dt>패키지</dt>
          <dd><code>{entry.packageName}</code></dd>
        </div>
        <div>
          <dt>구현 기준</dt>
          <dd>{entry.authority}</dd>
        </div>
      </dl>

      <section aria-labelledby="install-title">
        <div className="detail-section-heading">
          <p className="eyebrow">CONTRACT</p>
          <h2 id="install-title">플랫폼별 import</h2>
          <p>문서용 별칭이 아니라 각 패키지가 실제로 공개하는 이름입니다.</p>
        </div>
        {entry.packageName === "consumer-owned" ? (
          <div className="inline-note">
            <strong>독립 패키지가 아닙니다.</strong>
            <p>{entry.usage.when}</p>
          </div>
        ) : (
          <div className="platform-contracts">
            {entry.platforms.map((platform) => {
              const snippet = importSnippet(entry, platform);
              const sourcePath = entry.sourcePaths[platform];
              return (
                <article key={platform}>
                  <div>
                    <h3>{platformLabel(platform)}</h3>
                    {entry.exportNames[platform] ? <code>{entry.exportNames[platform]}</code> : null}
                  </div>
                  {snippet ? <pre><code>{snippet}</code></pre> : null}
                  {sourcePath ? (
                    <a href={sourceUrl(sourcePath)} rel="noreferrer" target="_blank">
                      {sourcePath} <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="usage-title">
        <div className="detail-section-heading">
          <p className="eyebrow">USAGE</p>
          <h2 id="usage-title">사용 판단</h2>
        </div>
        <div className="usage-grid">
          <article>
            <span aria-hidden="true">✓</span>
            <div><h3>이럴 때 사용</h3><p>{entry.usage.when}</p></div>
          </article>
          <article>
            <span aria-hidden="true">×</span>
            <div><h3>여기까지 맡기지 않음</h3><p>{entry.usage.avoid}</p></div>
          </article>
        </div>
        {entry.composition ? (
          <p className="composition"><strong>구성:</strong> {entry.composition.join(" + ")}</p>
        ) : null}
      </section>

      <section aria-labelledby="evidence-title">
        <div className="detail-section-heading">
          <p className="eyebrow">EVIDENCE</p>
          <h2 id="evidence-title">상태와 검증</h2>
          <p>
            기본·disabled·오류·로딩과 플랫폼별 접근성 상태는 Storybook이
            소유합니다. 비즈니스 정책과 데이터 요청은 소비자 프로젝트가 소유합니다.
          </p>
        </div>
        {entry.storyId ? (
          <div className="evidence-row">
            <code>{entry.storyId}</code>
            {evidenceUrl ? (
              <a href={evidenceUrl} rel="noreferrer" target="_blank">대표 story 열기 <span aria-hidden="true">↗</span></a>
            ) : (
              <span>Storybook URL을 연결하면 바로 열 수 있습니다.</span>
            )}
          </div>
        ) : (
          <div className="inline-note">이 항목은 별도 Storybook story가 없습니다.</div>
        )}
      </section>

      <section className="reference-section" aria-labelledby="reference-title">
        <div className="detail-section-heading">
          <p className="eyebrow">REFERENCE NOTE</p>
          <h2 id="reference-title">외부 카탈로그 판단</h2>
        </div>
        <p>
          Toss / SEED / Montage: {entry.cataloguePresence.toss ? "있음" : "없음"} ·{" "}
          {entry.cataloguePresence.seed ? "있음" : "없음"} ·{" "}
          {entry.cataloguePresence.montage ? "있음" : "없음"}
        </p>
        <p>{entry.gap}</p>
      </section>

      {related.length ? (
        <nav className="related-components" aria-labelledby="related-title">
          <p className="eyebrow">RELATED</p>
          <h2 id="related-title">함께 보는 컴포넌트</h2>
          <ul>
            {related.map((candidate) => (
              <li key={candidate.slug}>
                <Link href={`/components/${candidate.slug}`}>
                  <strong>{candidate.name}</strong>
                  <span>{candidate.description}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </main>
  );
}
