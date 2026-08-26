import type { Metadata } from "next";
import { paletteEntries } from "@kimgseok/design-tokens/colors";
import { DocumentationPage } from "../../DocumentationPage";

export const metadata: Metadata = {
  title: "Colors",
  description: "palette와 semantic color token의 사용 경계를 확인합니다.",
};

const semanticColors = [
  { label: "Background / Canvas", token: "--kg-color-bg-canvas" },
  { label: "Background / Surface", token: "--kg-color-bg-surface" },
  { label: "Background / Brand", token: "--kg-color-bg-brand" },
  { label: "Foreground / Primary", token: "--kg-color-fg-primary" },
  { label: "Status / Positive", token: "--kg-color-status-positive-bg" },
  { label: "Status / Negative", token: "--kg-color-status-negative-bg" },
] as const;

export default function ColorsPage() {
  return (
    <DocumentationPage
      description="모든 palette의 HEX와 theme-aware semantic alias를 한 곳에서 확인합니다. Text의 color prop은 이 이름을 typed union으로 제한합니다."
      eyebrow="FOUNDATION"
      title="Colors"
    >
      <section aria-labelledby="palette-colors-title">
        <h2 id="palette-colors-title">Palette와 HEX</h2>
        <ul className="palette-token-grid">
          {paletteEntries.map((color) => (
            <li key={color.token}>
              <span aria-hidden="true" className="palette-token-swatch" style={{ background: color.value }} />
              <strong>{color.token}</strong>
              <code>{color.value}</code>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="semantic-colors-title">
        <h2 id="semantic-colors-title">Semantic colors</h2>
        <ul className="color-token-grid">
          {semanticColors.map((color) => (
            <li key={color.token}>
              <span aria-hidden="true" className="color-token-swatch" style={{ background: `var(${color.token})` }} />
              <strong>{color.label}</strong>
              <code>{color.token}</code>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="color-api-title">
        <h2 id="color-api-title">Consumer API</h2>
        <pre><code>{`import { colors } from "@kimgseok/design-tokens/colors";

<Text color={colors.red500}>Object token</Text>
<Text color="red-500">String union token</Text>
<Text color={colors.fgPrimary}>Theme-aware semantic token</Text>`}</code></pre>
        <p>
          <code>colors.red500</code>의 값은 raw HEX가 아니라 Web과 Native가 함께
          해석하는 <code>red-500</code> token 식별자입니다.
        </p>
      </section>

      <section aria-labelledby="color-rule-title">
        <h2 id="color-rule-title">사용 원칙</h2>
        <p>
          컴포넌트 내부와 일반 제품 UI는 light/dark theme에서 같은 의미를 유지하는
          semantic alias를 우선합니다. palette token은 콘텐츠 강조처럼 색조 자체가
          요구사항일 때만 명시적으로 사용합니다.
        </p>
      </section>
    </DocumentationPage>
  );
}
