import Link from "next/link";
import { ComponentPreview } from "./ComponentPreview";
import { HomeSearch } from "./HomeSearch";

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">WEB + REACT NATIVE</p>
          <h1 id="hero-title">필요한 UI를 찾고, 확인하고, 바로 적용하세요.</h1>
          <p className="hero-description">
            Web과 React Native가 공유하는 사용 기준과 플랫폼별 구현을 한곳에서
            확인할 수 있습니다.
          </p>
          <HomeSearch />
        </div>
        <ComponentPreview />
      </section>

      <section className="section home-discovery" aria-labelledby="discovery-title">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">DOCUMENTATION</p>
            <h2 id="discovery-title">세 가지 경로만 기억하세요.</h2>
          </div>
          <p>
            처음이면 설치부터 시작하고, 화면을 만들 때는 <span className="no-break">컴포넌트를 찾고</span>,
            공통 표현 기준이 필요할 때 파운데이션을 확인합니다.
          </p>
        </div>
        <div className="discovery-grid">
          <article className="discovery-card discovery-card-primary">
            <span>01</span>
            <h3>시작하기</h3>
            <p>준비 과정과 플랫폼별 import를 순서대로 확인합니다.</p>
            <Link href="/getting-started">사용 준비하기 <span aria-hidden="true">→</span></Link>
          </article>
          <article className="discovery-card">
            <span>02</span>
            <h3>컴포넌트</h3>
            <p>이름이나 역할로 찾고, <span className="no-break">지원 플랫폼과</span> 사용 기준을 확인합니다.</p>
            <Link href="/components">전체 컴포넌트 찾기 <span aria-hidden="true">→</span></Link>
          </article>
          <article className="discovery-card">
            <span>03</span>
            <h3>파운데이션</h3>
            <p>Colors와 Typography가 제품 전체에서 공유하는 의미를 확인합니다.</p>
            <Link href="/foundation">파운데이션 보기 <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>
    </main>
  );
}
