"use client";
import { Button } from "@kimgseok/design-button/web";
import { Calendar } from "@kimgseok/design-date-picker/web";
import { ToastViewport } from "@kimgseok/design-feedback/web";
import { Tabs } from "@kimgseok/design-navigation/web";
export function ButtonDemo() {
  return (
    <>
      <Button onAction={() => undefined}>동작 확인</Button>
      <Calendar
        accessibilityLabel="검증 달력"
        onValueChange={() => undefined}
        value="2026-08-24"
      />
      <ToastViewport toast={null} />
      <Tabs
        accessibilityLabel="검증 탭"
        items={[{ content: "내용", label: "첫 탭", value: "first" }]}
        onValueChange={() => undefined}
        value="first"
      />
    </>
  );
}
