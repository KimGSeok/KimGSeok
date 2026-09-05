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
        <pre tabIndex={0}><code>{`pnpm install --frozen-lockfile
pnpm build`}</code></pre>
      </section>

      <section aria-labelledby="web-title">
        <h2 id="web-title">Web에서 사용하기</h2>
        <p>Pretendard와 semantic token CSS를 앱 진입점에서 한 번 불러온 뒤 필요한 컴포넌트를 가져옵니다.</p>
        <pre tabIndex={0}><code>{`pnpm add pretendard

import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "@kimgseok/design-tokens/css";
import { Button } from "@kimgseok/design-button/web";

export function ContinueButton({ onContinue }: { onContinue: () => void }) {
  return <Button onAction={onContinue}>계속</Button>;
}`}</code></pre>
      </section>

      <section aria-labelledby="native-title">
        <h2 id="native-title">React Native에서 사용하기</h2>
        <p>Native export는 같은 사용 의미를 유지하면서 터치와 접근성 동작을 플랫폼에 맞게 구현합니다.</p>
        <pre tabIndex={0}><code>{`import { NativeButton } from "@kimgseok/design-button/native";

export function ContinueButton({ onContinue }: { onContinue: () => void }) {
  return <NativeButton onAction={onContinue}>계속</NativeButton>;
}`}</code></pre>
      </section>
    </DocumentationPage>
  );
}
