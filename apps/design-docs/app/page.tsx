import Link from "next/link";
import { catalog } from "@kimgseok/design-catalog";
import { ComponentPreview } from "./ComponentPreview";

const stableComponents = catalog.filter(
  ({ layer, maturity, name }) =>
    maturity === "stable" && layer !== "pattern" && name !== "Tokens",
);
const sharedComponents = stableComponents.filter(
  ({ platforms }) => platforms.includes("web") && platforms.includes("native"),
);
const webOnlyComponents = stableComponents.filter(
  ({ platforms }) => platforms.length === 1 && platforms[0] === "web",
);
export default function Home() {
  return (
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">WEB + REACT NATIVE</p>
          <h1 id="hero-title">제품보다 먼저 합의하는 공통 UI 계약입니다.</h1>
          <p className="hero-description">
            Web과 React Native가 의미와 상태를 공유하고, 플랫폼별 상호작용은
            각 환경의 기준에 맞게 구현합니다.
          </p>
          <form action="/components" className="home-search">
            <label htmlFor="home-component-query">컴포넌트 검색</label>
            <div>
              <input
                id="home-component-query"
                name="q"
                placeholder="Button, 토스트, 날짜…"
                type="search"
              />
              <button type="submit">찾기</button>
            </div>
          </form>
          <div className="hero-meta" aria-label="디자인 시스템 현재 상태">
            <strong>{stableComponents.length} stable components</strong>
            <span aria-hidden="true">·</span>
            <span>{sharedComponents.length} Web + Native</span>
            <span aria-hidden="true">·</span>
            <span>{webOnlyComponents.length} Web only</span>
          </div>
        </div>
        <ComponentPreview />
      </section>

      <section className="section home-discovery" aria-labelledby="discovery-title">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">DOCUMENTATION</p>
            <h2 id="discovery-title">문서는 사용 순서로 탐색합니다.</h2>
          </div>
          <p>
            코드의 폴더 경계와 문서의 탐색 구조를 분리했습니다. 문서에서는
            기초 계약을 익힌 뒤 이름으로 컴포넌트를 찾습니다.
          </p>
        </div>
        <div className="discovery-grid">
          <article className="discovery-card discovery-card-primary">
            <span>01</span>
            <h3>시작하기</h3>
            <p>설치와 플랫폼별 import 경계를 먼저 확인합니다.</p>
            <Link href="/getting-started">사용 준비하기 <span aria-hidden="true">→</span></Link>
          </article>
          <article className="discovery-card">
            <span>02</span>
            <h3>파운데이션</h3>
            <p>Colors와 Typography의 semantic token 계약을 확인합니다.</p>
            <Link href="/foundation">파운데이션 보기 <span aria-hidden="true">→</span></Link>
          </article>
          <article className="discovery-card">
            <span>03</span>
            <h3>컴포넌트</h3>
            <p>주된 사용자 역할별 그룹으로 훑고, 전체 stable 목록은 A–Z로 검색합니다.</p>
            <Link href="/components">전체 컴포넌트 찾기 <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>
    </main>
  );
}
