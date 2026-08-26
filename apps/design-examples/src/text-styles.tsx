"use client";

import { Surface, Text } from "@kimgseok/design-primitives/web";
import { colors } from "@kimgseok/design-tokens/colors";

export default function TextStylesExample() {
  return (
    <Surface>
      <div style={{ display: "grid", gap: 12 }}>
        <Text as="span" textStyle="title-xxl-bold">읽기 쉬운 디스플레이</Text>
        <Text as="span" textStyle="title-xl-bold">명확한 제목</Text>
        <Text as="p" textStyle="text-m-regular">본문은 중요한 맥락을 자연스럽게 전달합니다.</Text>
        <Text as="p" color={colors.fgSecondary} textStyle="text-xs-regular">보조 정보는 본문보다 낮은 위계를 갖습니다.</Text>
        <Text as="p" color={colors.red500} textStyle="text-l-medium">palette token 강조</Text>
      </div>
    </Surface>
  );
}
