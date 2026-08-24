import type { Metadata } from "next";
import Link from "next/link";
import "@kimgseok/design-tokens/css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KimGSeok Design System",
    template: "%s · KimGSeok Design System",
  },
  description:
    "Toss의 공개 원칙을 구현 기준으로 삼은 Web 및 React Native 디자인 시스템입니다.",
};

const navigation = [
  { href: "/", label: "Overview" },
  { href: "/#foundations", label: "Foundations" },
  { href: "/#components", label: "Components" },
  { href: "/#patterns", label: "Patterns" },
  { href: "/#platforms", label: "Platforms" },
];

const storybookUrl = process.env.NEXT_PUBLIC_STORYBOOK_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:6006" : null);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
        <header className="site-header">
          <Link className="wordmark" href="/" aria-label="KimGSeok Design System 홈">
            <span aria-hidden="true" className="wordmark-mark">K</span>
            <span>Design System</span>
          </Link>
          <nav aria-label="주요 문서">
            {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          </nav>
          {storybookUrl ? <a className="storybook-link" href={storybookUrl}>Storybook <span aria-hidden="true">↗</span></a> : <span />}
        </header>
        {children}
      </body>
    </html>
  );
}
