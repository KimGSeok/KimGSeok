import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import Link from "next/link";
import type { CatalogEntry, CatalogPlatform } from "@kimgseok/design-catalog";
import type { ComponentDocDefinition } from "../../component-docs";
import { sourceUrl, storyUrl } from "../../documentation-links";
import { ComponentShowcase } from "./ComponentShowcase";

function platformLabel(platform: CatalogPlatform) {
  return platform === "web" ? "Web" : "React Native";
}

function platformSummary(entry: CatalogEntry) {
  const labels = entry.platforms.map(platformLabel);
  return labels.length === 1 ? `${labels[0]} only` : labels.join(" + ");
}

function importSnippet(entry: CatalogEntry, platform: CatalogPlatform) {
  const importPath = entry.importPaths[platform];
  const exportName = entry.exportNames[platform];
  return importPath && exportName ? `import { ${exportName} } from "${importPath}";` : null;
}

export async function ComponentDocumentation({ entry, doc, related }: { entry: CatalogEntry; doc: ComponentDocDefinition; related: readonly CatalogEntry[] }) {
  const repoRoot = resolve(process.cwd(), "../..");
  const examples = await Promise.all(doc.examples.map(async ({ Preview, ...example }) => ({
    ...example,
    code: (await readFile(resolve(repoRoot, example.sourcePath), "utf8")).trim(),
    preview: <Preview />,
  })));
  const storybookEvidence = entry.storyId ? storyUrl(entry.storyId) : null;
  const toc = [
    ["examples", "예제"],
    ["usage", "사용 기준"],
    ["installation", "설치"],
    ["accessibility", "접근성"],
    ["api-reference", "API"],
    ...(doc.motion ? [["motion", "모션"]] : []),
    ["platforms", "플랫폼"],
    ...(related.length ? [["related", "관련 컴포넌트"]] : []),
  ];

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
        </header>
        <details className="mobile-on-this-page"><summary>이 페이지에서</summary><nav aria-label="이 페이지에서"><ul>{toc.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ul></nav></details>

        <section aria-labelledby="examples-title" id="examples">
          <div className="detail-section-heading">
            <p className="eyebrow">EXAMPLES</p>
            <h2 id="examples-title">실제 동작과 코드</h2>
            <p>공개 패키지를 직접 렌더링하며 Preview와 Code가 <span className="no-break">같은 예제 소스를</span> 사용합니다.</p>
          </div>
          <ComponentShowcase examples={examples} />
        </section>

        <section aria-labelledby="usage-title" id="usage">
          <div className="detail-section-heading"><p className="eyebrow">USAGE</p><h2 id="usage-title">사용 기준</h2></div>
          <div className="usage-grid">
            <article><span aria-hidden="true">✓</span><div><h3>이럴 때 사용</h3><p>{entry.usage.when}</p></div></article>
            <article><span aria-hidden="true">×</span><div><h3>여기까지 맡기지 않음</h3><p>{entry.usage.avoid}</p></div></article>
          </div>
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
              return snippet ? <article key={platform}><div><h3>{platformLabel(platform)}</h3><code>{entry.exportNames[platform]}</code></div><pre tabIndex={0}><code>{snippet}</code></pre></article> : null;
            })}
          </div>
        </section>

        <section aria-labelledby="accessibility-title" id="accessibility">
          <div className="detail-section-heading"><p className="eyebrow">ACCESSIBILITY</p><h2 id="accessibility-title">접근성 계약</h2></div>
          <ul className="contract-list">{doc.accessibility.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section aria-labelledby="api-title" id="api-reference">
          <div className="detail-section-heading"><p className="eyebrow">API REFERENCE</p><h2 id="api-title">주요 Props</h2><p>컴포넌트가 직접 소유하는 사용 계약입니다. <span className="no-break">플랫폼 기본 속성은</span> 각 import의 타입 정의를 따릅니다.</p></div>
          <div aria-label="주요 Props 표" className="api-table-shell" role="region" tabIndex={0}>
            <table className="api-table">
              <thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">설명</th></tr></thead>
              <tbody>{doc.api.map((item) => <tr key={item.name}><th scope="row"><code>{item.name}</code>{item.required ? <span>필수</span> : null}</th><td><code>{item.type}</code></td><td><code>{item.defaultValue}</code></td><td>{item.description}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {doc.motion ? (
          <section aria-labelledby="motion-title" id="motion">
            <div className="detail-section-heading"><p className="eyebrow">MOTION</p><h2 id="motion-title">실제 상태 전환</h2><p>Docs가 별도 효과를 덧씌우지 않고 컴포넌트에 구현된 motion token만 설명합니다.</p></div>
            <dl className="motion-contract"><div><dt>Trigger</dt><dd>{doc.motion.trigger}</dd></div><div><dt>Token</dt><dd><code>{doc.motion.token}</code></dd></div><div><dt>Behavior</dt><dd>{doc.motion.behavior}</dd></div><div><dt>Reduced motion</dt><dd>{doc.motion.reducedMotion}</dd></div></dl>
          </section>
        ) : null}

        <section aria-labelledby="platforms-title" id="platforms">
          <div className="detail-section-heading"><p className="eyebrow">PLATFORMS</p><h2 id="platforms-title">지원 플랫폼</h2></div>
          <div className="inline-note"><strong>{platformSummary(entry)}</strong><p>{doc.platformNote}</p><p>{entry.platforms.includes("native") ? "현재 Docs의 라이브 Preview는 Web 구현입니다. Native는 import와 타입 계약을 제공하며 실제 화면은 Native specimen에서 검증합니다." : "현재 공개 구현과 라이브 Preview는 Web만 지원합니다."}</p></div>
          <div className="detail-actions">
            {storybookEvidence ? <a className="secondary-link" href={storybookEvidence} rel="noreferrer" target="_blank">Storybook 검증 보기 <span aria-hidden="true">↗</span></a> : null}
            {entry.sourcePaths.web ? <a className="secondary-link" href={sourceUrl(entry.sourcePaths.web)} rel="noreferrer" target="_blank">구현 소스 보기 <span aria-hidden="true">↗</span></a> : null}
          </div>
        </section>

        {related.length ? (
          <nav className="related-components" aria-labelledby="related-title" id="related">
            <p className="eyebrow">RELATED</p><h2 id="related-title">함께 보는 컴포넌트</h2>
            <ul>{related.map((candidate) => <li key={candidate.slug}><Link href={`/components/${candidate.slug}`}><strong>{candidate.name}</strong><span>{candidate.description}</span><span aria-hidden="true">→</span></Link></li>)}</ul>
          </nav>
        ) : null}
      </div>
      <aside aria-label="현재 컴포넌트 목차" className="on-this-page"><strong>이 페이지에서</strong><nav aria-label="이 페이지에서"><ul>{toc.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ul></nav></aside>
    </main>
  );
}
