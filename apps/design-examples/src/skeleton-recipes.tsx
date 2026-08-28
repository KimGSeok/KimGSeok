"use client";

import { SkeletonRegion } from "@kimgseok/design-primitives/web";

export default function SkeletonRecipesExample() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 420 }}>
      <SkeletonRegion
        accessibilityLabel="주문 목록을 불러오는 중"
        count={3}
        recipe="list-item"
      />
      <SkeletonRegion
        accessibilityLabel="주문 요약을 불러오는 중"
        recipe="card"
      />
    </div>
  );
}
