"use client";

import { useState } from "react";
import { Button } from "@kimgseok/design-button/web";
import { Callout, Progress, Spinner } from "@kimgseok/design-feedback/web";
import { Badge, Card, Heading, Text } from "@kimgseok/design-primitives/web";
import { DatePicker } from "@kimgseok/design-date-picker/web";

export function ComponentPreview() {
  const [saved, setSaved] = useState(false);
  const [date, setDate] = useState<`${number}-${number}-${number}` | "">("");

  return (
    <Card accessibilityLabel="디자인 시스템 실제 컴포넌트 미리보기" variant="raised">
      <div className="preview-stack">
        <div className="preview-heading">
          <div>
            <Badge label="Stable" tone="positive" />
            <Heading level={2} role="title">같은 계약, 플랫폼에 맞는 구현</Heading>
          </div>
          <Spinner accessibilityLabel="동기화 상태 확인 중" size="sm" />
        </div>
        <Text as="p" tone="secondary">
          이 화면 자체가 배포 대상 패키지를 직접 사용합니다. 문서용 복제 컴포넌트는 만들지 않습니다.
        </Text>
        <Progress accessibilityLabel="승인된 정적 범위 구현률" value={1} />
        <DatePicker helpText="실제 패키지의 Composite 예시입니다." label="기준 날짜" onValueChange={setDate} value={date} />
        <div className="preview-actions">
          <Button onAction={() => setSaved(true)}>기준 확인하기</Button>
          <Button variant="secondary">구성 살펴보기</Button>
          <Button disabled variant="tertiary">준비 중</Button>
        </div>
        {saved ? <Callout announce description="실제 Button과 Callout의 상호작용입니다." title="디자인 시스템이 연결됐어요" tone="positive" /> : null}
      </div>
    </Card>
  );
}
