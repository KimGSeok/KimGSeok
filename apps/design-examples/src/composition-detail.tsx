"use client";

import { useState } from "react";
import { Button } from "@kimgseok/design-button/web";
import type { DateValue } from "@kimgseok/design-date-picker/contracts";
import { DatePicker } from "@kimgseok/design-date-picker/web";
import { Callout, ToastViewport } from "@kimgseok/design-feedback/web";
import {
  ConfirmationDialog,
  Dialog,
  Menu,
} from "@kimgseok/design-overlays/web";
import { ListItem } from "@kimgseok/design-primitives/web";

export default function CompositionDetailExample() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [date, setDate] = useState<DateValue>("");
  const [savedDate, setSavedDate] = useState<DateValue>("");
  const [toast, setToast] = useState(false);
  const [error, setError] = useState(false);
  return (
    <section aria-label="콘텐츠 상세 예제" style={{ width: "100%" }}>
      <ListItem
        title="가을 소식"
        description={
          savedDate
            ? `게시 예정일 ${savedDate}`
            : "게시 예정일을 선택해 주세요."
        }
        trailing="chevron"
        action={{
          onAction: () => {
            setDate(savedDate);
            setOpen(true);
          },
          onActionError: () => setError(true),
        }}
      />
      {error ? (
        <Callout
          tone="negative"
          title="변경하지 못했습니다"
          description="상세 화면에서 다시 시도해 주세요."
          announce
        />
      ) : null}
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="가을 소식"
        description="게시 예정일을 선택한 뒤 변경 내용을 확인하세요."
        footer={
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="tertiary" onAction={() => setOpen(false)}>
              취소
            </Button>
            <Button
              disabled={!date || date === savedDate}
              onAction={() => setConfirm(true)}
            >
              변경 내용 확인
            </Button>
          </div>
        }
      >
        <div style={{ display: "grid", gap: 16 }}>
          <Menu
            accessibilityLabel="콘텐츠 작업"
            triggerLabel="더 보기"
            items={[{ value: "reset", label: "날짜 변경 되돌리기" }]}
            onAction={() => setDate(savedDate)}
          />
          <DatePicker
            label="게시 예정일"
            value={date}
            onValueChange={setDate}
          />
          <ConfirmationDialog
            open={confirm}
            onOpenChange={setConfirm}
            title="게시 예정일을 변경할까요?"
            description={date || "날짜를 선택해 주세요."}
            confirmLabel="변경"
            cancelLabel="돌아가기"
            onConfirm={() => {
              setSavedDate(date);
              setOpen(false);
              setToast(true);
              setError(false);
            }}
            onConfirmError={() => setError(true)}
          />
        </div>
      </Dialog>
      <ToastViewport
        toast={{
          id: savedDate,
          open: toast,
          message: "게시 예정일을 변경했습니다",
          tone: "positive",
          onOpenChange: setToast,
        }}
      />
    </section>
  );
}
