"use client";

import { useState } from "react";
import { Button } from "@kimgseok/design-button/web";
import { Callout } from "@kimgseok/design-feedback/web";
import { Card, Heading, Text } from "@kimgseok/design-primitives/web";
import { colors } from "@kimgseok/design-tokens/colors";
import { DatePicker } from "@kimgseok/design-date-picker/web";

export function ComponentPreview() {
  const [saved, setSaved] = useState(false);
  const [date, setDate] = useState<`${number}-${number}-${number}` | "">("");

  return (
    <Card accessibilityLabel="디자인 시스템 실제 컴포넌트 미리보기" variant="raised">
      <div className="preview-stack">
        <div className="preview-heading">
          <Heading level={2} textStyle="title-l-semibold">실제 컴포넌트를 바로 사용해보세요</Heading>
        </div>
        <Text as="p" color={colors.fgSecondary} textStyle="text-s-regular">
          이 미리보기는 배포 대상 Web 컴포넌트를 직접 렌더링합니다.
        </Text>
        <DatePicker
          helpText="날짜를 선택한 뒤 버튼으로 결과를 확인하세요."
          label="기준 날짜"
          onValueChange={(nextDate) => {
            setDate(nextDate);
            setSaved(false);
          }}
          value={date}
        />
        <div className="preview-actions">
          <Button disabled={!date} onAction={() => setSaved(true)} size="sm">선택 확인하기</Button>
        </div>
        {saved && date ? <Callout announce description={`${date} 날짜를 선택했습니다.`} title="선택을 확인했어요" tone="positive" /> : null}
      </div>
    </Card>
  );
}
