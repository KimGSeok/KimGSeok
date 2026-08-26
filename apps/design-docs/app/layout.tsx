import type { Metadata } from "next";
import Link from "next/link";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "@kimgseok/design-tokens/css";
import "./globals.css";
import { DocsSidebar } from "./DocsSidebar";
import { storybookUrl } from "./documentation-links";
import { docsNavigation } from "./docs-navigation";

export const metadata: Metadata = {
  title: {
    default: "KimGSeok Design System",
    template: "%s · KimGSeok Design System",
  },
  description:
    "Toss의 공개 원칙을 구현 기준으로 삼은 Web 및 React Native 디자인 시스템입니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
        <header className="site-header">
          <div className="site-header-sidebar">
            <Link className="wordmark" href="/" aria-label="KimGSeok Design System 홈">
              <span aria-hidden="true" className="wordmark-mark">K</span>
              <span>Design System</span>
            </Link>
          </div>
          <div className="site-header-main">
            <nav aria-label="주요 문서">
              {docsNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
            </nav>
            {storybookUrl ? <a className="storybook-link" href={storybookUrl}>Storybook <span aria-hidden="true">↗</span></a> : <span />}
          </div>
        </header>
        <div className="docs-shell">
          <DocsSidebar />
          <div className="docs-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
