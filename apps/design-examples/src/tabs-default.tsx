"use client";

import { useState } from "react";
import { Tabs } from "@kimgseok/design-navigation/web";

const items = [
  { value: "overview", label: "개요", content: <p>프로젝트의 핵심 정보를 확인합니다.</p> },
  { value: "activity", label: "활동", content: <p>최근 활동을 확인합니다.</p> },
  { value: "members", label: "멤버", content: <p>참여 중인 멤버를 확인합니다.</p> },
  { value: "disabled", label: "사용 불가", disabled: true, content: <p>표시되지 않습니다.</p> },
] as const;

export default function TabsDefaultExample() {
  const [value, setValue] = useState("overview");
  return <Tabs accessibilityLabel="프로젝트 정보" items={items} onValueChange={setValue} value={value} />;
}
