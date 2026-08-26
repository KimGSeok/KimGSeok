import type { Metadata } from "next";
import { DocumentationPage } from "../DocumentationPage";

export const metadata: Metadata = {
  title: "유틸리티",
  description: "디자인 시스템이 공개하는 독립 utility API를 확인합니다.",
};

export default function UtilitiesPage() {
  return (
    <DocumentationPage
      description="컴포넌트 밖에서 여러 UI가 공유해야 하는 공개 기능만 이 영역에 둡니다."
      eyebrow="UTILITIES"
      title="유틸리티"
    >
      <section aria-labelledby="utility-status-title">
        <h2 id="utility-status-title">현재 공개 항목 없음</h2>
        <p>
          Toss Docs의 Overlay Extension을 이름만 복제하지 않습니다. 현재 overlay
          stack과 focus lifecycle은 overlays 컴포넌트 패키지의 내부 책임이므로
          별도 utility API로 공개하지 않습니다.
        </p>
      </section>
    </DocumentationPage>
  );
}
