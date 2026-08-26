import type { Metadata } from "next";
import { DocumentationPage } from "../../DocumentationPage";

export const metadata: Metadata = {
  title: "Colors",
  description: "palette와 semantic color token의 사용 경계를 확인합니다.",
};

const semanticColors = [
  { label: "Background / Canvas", token: "--kg-color-bg-canvas", swatch: "color-canvas" },
  { label: "Background / Surface", token: "--kg-color-bg-surface", swatch: "color-surface" },
  { label: "Background / Brand", token: "--kg-color-bg-brand", swatch: "color-brand" },
  { label: "Foreground / Primary", token: "--kg-color-fg-primary", swatch: "color-fg-primary" },
  { label: "Status / Positive", token: "--kg-color-status-positive-bg", swatch: "color-positive" },
  { label: "Status / Negative", token: "--kg-color-status-negative-bg", swatch: "color-negative" },
] as const;

export default function ColorsPage() {
  return (
    <DocumentationPage
      description="컴포넌트는 palette 숫자를 직접 고르지 않고, 배경·전경·상태·행동의 semantic token을 사용합니다."
      eyebrow="FOUNDATION"
      title="Colors"
    >
      <section aria-labelledby="semantic-colors-title">
        <h2 id="semantic-colors-title">Semantic colors</h2>
        <ul className="color-token-grid">
          {semanticColors.map((color) => (
            <li key={color.token}>
              <span aria-hidden="true" className={`color-token-swatch ${color.swatch}`} />
              <strong>{color.label}</strong>
              <code>{color.token}</code>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="color-rule-title">
        <h2 id="color-rule-title">사용 원칙</h2>
        <p>
          palette는 token 제작 단계에서만 사용합니다. 제품과 컴포넌트는 light/dark
          theme에서 같은 의미를 유지하는 semantic alias만 참조합니다.
        </p>
      </section>
    </DocumentationPage>
  );
}
