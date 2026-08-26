import type { Metadata } from "next";
import Link from "next/link";
import { DocumentationPage } from "../DocumentationPage";

export const metadata: Metadata = {
  title: "파운데이션",
  description: "Colors와 Typography의 공통 표현 계약을 확인합니다.",
};

const foundations = [
  {
    description: "원시 palette를 감추고 역할과 상태에 따라 semantic color를 선택합니다.",
    href: "/foundation/colors",
    label: "Colors",
  },
  {
    description: "임의의 크기 대신 display부터 caption까지 제한된 역할을 사용합니다.",
    href: "/foundation/typography",
    label: "Typography",
  },
] as const;

export default function FoundationPage() {
  return (
    <DocumentationPage
      description="컴포넌트를 만들기 전에 제품 전체가 공유할 표현의 의미를 먼저 고정합니다."
      eyebrow="FOUNDATION"
      title="파운데이션"
    >
      <section aria-labelledby="foundation-index-title">
        <h2 className="sr-only" id="foundation-index-title">파운데이션 목록</h2>
        <ul className="doc-link-grid">
          {foundations.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <strong>{item.label}</strong>
                <span>{item.description}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </DocumentationPage>
  );
}
