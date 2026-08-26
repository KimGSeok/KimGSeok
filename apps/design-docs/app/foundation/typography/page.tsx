import type { Metadata } from "next";
import { DocumentationPage } from "../../DocumentationPage";

export const metadata: Metadata = {
  title: "Typography",
  description: "Web과 React Native가 공유하는 typography role을 확인합니다.",
};

const typographyRoles = ["display", "title", "heading", "body", "label", "caption"] as const;

export default function TypographyPage() {
  return (
    <DocumentationPage
      description="크기와 굵기를 화면마다 조합하지 않고, 정보 위계에 맞는 제한된 역할을 선택합니다."
      eyebrow="FOUNDATION"
      title="Typography"
    >
      <section aria-labelledby="type-role-title">
        <h2 id="type-role-title">Roles</h2>
        <ol className="type-role-list">
          {typographyRoles.map((role) => (
            <li key={role}>
              <span className={`type-sample type-${role}`}>가나다라 Aa</span>
              <div>
                <strong>{role}</strong>
                <code>--kg-typography-role-{role}-*</code>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="type-rule-title">
        <h2 id="type-rule-title">사용 원칙</h2>
        <p>
          본문과 필수 안내는 body 이상을 사용하고 caption은 보조 메타데이터에만
          사용합니다. 잘림은 컴포넌트가 명시적으로 선택해야 합니다.
        </p>
      </section>
    </DocumentationPage>
  );
}
