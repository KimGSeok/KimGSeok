import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CatalogEntry, CatalogPlatform } from "@kimgseok/design-catalog";
import { getComponentDoc } from "../../component-docs";
import { getRelatedComponentEntries } from "../../component-relations";
import { documentedComponents } from "../../docs-navigation";
import { sourceUrl, storyUrl } from "../../documentation-links";
import { ComponentDocumentation } from "./ComponentDocumentation";

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

function platformSummary(entry: CatalogEntry) {
  const labels = entry.platforms.map(platformLabel);
  return labels.length === 1 ? `${labels[0]} only` : labels.join(" + ");
}

function platformDescription(entry: CatalogEntry) {
  if (entry.platforms.length > 1) {
    return "같은 사용 목적을 공유하며 입력과 접근성 동작은 각 플랫폼 환경에 맞게 구현합니다.";
  }
  return entry.platforms[0] === "web"
    ? "현재 공개 구현은 Web만 지원하며 React Native import를 제공하지 않습니다."
    : "현재 공개 구현은 React Native만 지원하며 Web import를 제공하지 않습니다.";
}

function importSnippet(entry: CatalogEntry, platform: CatalogPlatform) {
  const importPath = entry.importPaths[platform];
  if (!importPath) return null;
  return `import { ${entry.exportNames[platform]} } from "${importPath}";`;
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
  const related = getRelatedComponentEntries(entry, documentedComponents);
  const componentDoc = getComponentDoc(entry.slug);
  const toc = [
    ["usage", "사용 기준"],
    ["installation", "설치"],
    ["states", "상태와 상호작용"],
    ["guidance", "접근성과 API"],
    ["platforms", "플랫폼"],
    ...(related.length ? [["related", "관련 컴포넌트"]] : []),
  ];

  if (componentDoc) {
    return <ComponentDocumentation doc={componentDoc} entry={entry} related={related} />;
  }

  return (
    <main id="main-content" className="component-detail component-detail-rich">
      <div className="component-doc-main">
        <Link className="back-link" href="/components">← 전체 컴포넌트</Link>

        <header className="detail-header rich-detail-header">
          <div className="detail-kicker">
            <span>{entry.role}</span>
            <span>{platformSummary(entry)}</span>
          </div>
          <h1>{entry.name}</h1>
          <p className="hero-description">{entry.description}</p>
          {evidenceUrl ? (
            <div className="detail-actions">
              <a className="primary-link" href={evidenceUrl} rel="noreferrer" target="_blank">
                Web Storybook에서 미리보기 <span aria-hidden="true">↗</span>
              </a>
            </div>
          ) : null}
        </header>

        <details className="mobile-on-this-page">
          <summary>이 페이지에서</summary>
          <nav aria-label="이 페이지에서"><ul>{toc.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ul></nav>
        </details>

        <section aria-labelledby="usage-title" id="usage">
          <div className="detail-section-heading"><p className="eyebrow">USAGE</p><h2 id="usage-title">사용 기준</h2></div>
          <div className="usage-grid">
            <article><span aria-hidden="true">✓</span><div><h3>이럴 때 사용</h3><p>{entry.usage.when}</p></div></article>
            <article><span aria-hidden="true">×</span><div><h3>여기까지 맡기지 않음</h3><p>{entry.usage.avoid}</p></div></article>
          </div>
          {entry.composition ? (
            <p className="composition"><strong>함께 구성되는 요소:</strong> {entry.composition.join(" + ")}</p>
          ) : null}
        </section>

        <section aria-labelledby="installation-title" id="installation">
          <div className="detail-section-heading">
            <p className="eyebrow">INSTALLATION</p>
            <h2 id="installation-title">플랫폼별 import</h2>
            <p>사용할 플랫폼의 공개 경로에서 컴포넌트를 가져옵니다.</p>
          </div>
          <div className="platform-contracts">
            {entry.platforms.map((platform) => {
              const snippet = importSnippet(entry, platform);
              return (
                <article key={platform}>
                  <div>
                    <h3>{platformLabel(platform)}</h3>
                    {entry.exportNames[platform] ? <code>{entry.exportNames[platform]}</code> : null}
                  </div>
                  {snippet ? <pre tabIndex={0}><code>{snippet}</code></pre> : null}
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="states-title" id="states">
          <div className="detail-section-heading">
            <p className="eyebrow">STATES</p>
            <h2 id="states-title">상태와 상호작용</h2>
            <p>컴포넌트가 제공하는 상태와 상호작용 예제는 Storybook에서 확인합니다.</p>
          </div>
          {evidenceUrl ? (
            <div className="evidence-row">
              <span>Web 구현의 동작과 상태를 실제 컴포넌트로 확인할 수 있습니다.</span>
              <a href={evidenceUrl} rel="noreferrer" target="_blank">Storybook 열기 <span aria-hidden="true">↗</span></a>
            </div>
          ) : entry.storyId ? (
            <div className="inline-note">
              <strong>Storybook 예제는 등록되어 있습니다.</strong>
              <p>현재 환경에는 Storybook URL이 연결되지 않았습니다.</p>
            </div>
          ) : (
            <div className="inline-note">
              <strong>등록된 Storybook 예제가 없습니다.</strong>
              <p>상태 예제가 추가되기 전에는 공개 타입과 구현 소스를 함께 확인하세요.</p>
            </div>
          )}
        </section>

        <section aria-labelledby="guidance-title" id="guidance">
          <div className="detail-section-heading">
            <p className="eyebrow">GUIDANCE</p>
            <h2 id="guidance-title">접근성과 API</h2>
          </div>
          <div className="inline-note">
            <strong>상세 가이드를 보강하고 있습니다.</strong>
            <p>현재 페이지는 사용 기준과 공개 import를 제공합니다. 구체적인 접근성 요구사항과 Props 문서가 비어 있다는 사실이 기능을 지원하지 않는다는 뜻은 아닙니다. 도입 전 Storybook과 공개 타입을 함께 확인하세요.</p>
          </div>
        </section>

        <section aria-labelledby="platforms-title" id="platforms">
          <div className="detail-section-heading"><p className="eyebrow">PLATFORMS</p><h2 id="platforms-title">지원 플랫폼</h2></div>
          <div className="inline-note">
            <strong>{platformSummary(entry)}</strong>
            <p>{platformDescription(entry)}</p>
          </div>
          {entry.platforms.some((platform) => entry.sourcePaths[platform]) ? (
            <div className="detail-actions">
              {entry.platforms.map((platform) => {
                const sourcePath = entry.sourcePaths[platform];
                return sourcePath ? <a className="secondary-link" href={sourceUrl(sourcePath)} key={platform} rel="noreferrer" target="_blank">{platformLabel(platform)} 구현 소스 보기 <span aria-hidden="true">↗</span></a> : null;
              })}
            </div>
          ) : null}
        </section>

        {related.length ? (
          <nav className="related-components" aria-labelledby="related-title" id="related">
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
      </div>
      <aside aria-label="현재 컴포넌트 목차" className="on-this-page"><strong>이 페이지에서</strong><nav aria-label="이 페이지에서"><ul>{toc.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ul></nav></aside>
    </main>
  );
}
