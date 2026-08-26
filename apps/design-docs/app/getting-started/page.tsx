import type { Metadata } from "next";
import { DocumentationPage } from "../DocumentationPage";

export const metadata: Metadata = {
  title: "시작하기",
  description: "디자인 시스템 workspace와 플랫폼별 import 사용법을 확인합니다.",
};

export default function GettingStartedPage() {
  return (
    <DocumentationPage
      description="저장소 안에서 패키지를 준비하고, Web과 React Native가 공유하는 계약을 플랫폼별 구현으로 연결합니다."
      eyebrow="GETTING STARTED"
      title="시작하기"
    >
      <section aria-labelledby="workspace-title">
        <h2 id="workspace-title">Workspace 준비</h2>
        <p>저장소 루트에서 의존성을 설치하고 디자인 시스템 패키지를 빌드합니다.</p>
        <pre><code>{`pnpm install --frozen-lockfile
pnpm build`}</code></pre>
      </section>

      <section aria-labelledby="web-title">
        <h2 id="web-title">Web</h2>
        <p>앱 진입점에서 semantic token CSS를 한 번 불러온 뒤 Web export를 사용합니다.</p>
        <pre><code>{`import "@kimgseok/design-tokens/css";
import { Button } from "@kimgseok/design-button/web";`}</code></pre>
      </section>

      <section aria-labelledby="native-title">
        <h2 id="native-title">React Native</h2>
        <p>Native export는 같은 의미 계약을 유지하면서 플랫폼 상호작용을 직접 구현합니다.</p>
        <pre><code>{`import { NativeButton } from "@kimgseok/design-button/native";
import { nativeTheme } from "@kimgseok/design-tokens/native";`}</code></pre>
      </section>
    </DocumentationPage>
  );
}
