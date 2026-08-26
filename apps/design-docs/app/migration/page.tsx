import type { Metadata } from "next";
import { DocumentationPage } from "../DocumentationPage";

export const metadata: Metadata = {
  title: "마이그레이션",
  description: "버전 또는 외부 디자인 시스템에서 이동할 때의 가이드를 확인합니다.",
};

export default function MigrationPage() {
  return (
    <DocumentationPage
      description="실제 호환성 변경과 이전 경로가 생길 때만 버전별 migration guide를 발행합니다."
      eyebrow="MIGRATION"
      title="마이그레이션"
    >
      <section aria-labelledby="migration-status-title">
        <h2 id="migration-status-title">현재 공개 가이드 없음</h2>
        <p>
          아직 이전 public major version이나 지원하는 외부 시스템 migration
          contract가 없습니다. 저장소 내부 경로 재구성은 공개 패키지명과 import
          경로를 바꾸지 않습니다.
        </p>
      </section>
    </DocumentationPage>
  );
}
