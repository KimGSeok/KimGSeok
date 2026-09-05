import type { Metadata } from "next";
import {
  textSizes,
  textWeights,
  typographyScale,
  type TextSize,
  type TextStyleKind,
  type TextWeight,
} from "@kimgseok/design-tokens/typography";
import { DocumentationPage } from "../../DocumentationPage";

export const metadata: Metadata = {
  title: "Typography",
  description: "Text와 Title의 size, weight, composed typography token을 확인합니다.",
};

const styleExamples = [
  {
    token: "title-xxl-bold",
    label: "Title",
    description: "제목과 정보 위계를 만들며 l 이상에서는 좁은 tracking을 사용합니다.",
  },
  {
    token: "text-l-medium",
    label: "Text",
    description: "본문과 데이터 표현에 사용하며 모든 size에서 중립 tracking을 유지합니다.",
  },
] as const;

function sampleStyle(kind: TextStyleKind, size: TextSize, weight: TextWeight) {
  return {
    fontFamily: "var(--kg-typography-family-web)",
    fontSize: `var(--kg-typography-size-${size}-font-size)`,
    fontWeight: `var(--kg-typography-weight-${weight})`,
    letterSpacing: `var(--kg-typography-tracking-${kind}-${size})`,
    lineHeight: `var(--kg-typography-size-${size}-line-height)`,
  };
}

export default function TypographyPage() {
  return (
    <DocumentationPage
      description="kind, size, weight를 하나의 textStyle token으로 조합합니다. 이름만 보고도 결과를 예측할 수 있고 Web과 React Native에서 같은 계약을 사용합니다."
      eyebrow="FOUNDATION"
      title="Typography"
    >
      <section aria-labelledby="type-anatomy-title">
        <h2 id="type-anatomy-title">Text와 Title</h2>
        <p>
          공개 이름은 <code>kind-size-weight</code> 순서입니다. Text와 Title은 같은
          size·weight scale을 공유하되 tracking 역할을 분리합니다.
        </p>
        <ul className="typography-style-grid">
          {styleExamples.map(({ token, label, description }) => {
            const [kind, size, weight] = token.split("-") as [TextStyleKind, TextSize, TextWeight];
            return (
              <li key={token}>
                <span style={sampleStyle(kind, size, weight)}>가나다라 Aa</span>
                <strong>{label}</strong>
                <code>{token}</code>
                <p>{description}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="type-size-title">
        <h2 id="type-size-title">Sizes</h2>
        <ol className="type-role-list">
          {textSizes.map((size) => {
            const value = typographyScale.sizes[size];
            return (
              <li key={size}>
                <span className="type-sample" style={sampleStyle("text", size, "regular")}>가나다라 Aa</span>
                <div>
                  <strong>{size}</strong>
                  <code>{value.fontSize}px / {value.lineHeight}px</code>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="type-weight-title">
        <h2 id="type-weight-title">Pretendard weights</h2>
        <ul className="typography-weight-list">
          {textWeights.map((weight) => (
            <li key={weight}>
              <span style={sampleStyle("text", "m", weight)}>가나다라 Aa</span>
              <strong>{weight}</strong>
              <code>{typographyScale.weights[weight]}</code>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="type-api-title">
        <h2 id="type-api-title">Consumer API</h2>
        <pre tabIndex={0}><code>{`import { colors } from "@kimgseok/design-tokens/colors";
import { Text } from "@kimgseok/design-primitives/web";

<Text textStyle="text-l-medium" color={colors.red500}>
  안전한 object token
</Text>

<Text textStyle="text-l-medium" color="red-500">
  안전한 string union token
</Text>`}</code></pre>
        <p>
          token 문자열은 lowercase입니다. 기존 <code>role</code>과 <code>tone</code>은
          0.x 마이그레이션 호환용이고 신규 코드는 <code>textStyle</code>과 <code>color</code>를 사용합니다.
        </p>
      </section>

      <section aria-labelledby="type-rule-title">
        <h2 id="type-rule-title">사용 원칙</h2>
        <p>
          일반 본문과 필수 안내는 s(14px) 이상을 사용합니다. xxs와 xs는 조밀한
          비필수 metadata에만 사용하고, 잘림은 컴포넌트가 명시적으로 선택합니다.
        </p>
      </section>
    </DocumentationPage>
  );
}
