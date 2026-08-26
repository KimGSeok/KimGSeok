"use client";

import { useState } from "react";
import { Button } from "@kimgseok/design-button/web";
import { Dialog } from "@kimgseok/design-overlays/web";

export default function DialogDefaultExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onAction={() => setOpen(true)}>다이얼로그 열기</Button>
      <Dialog
        closeOnBackdrop
        description="변경 내용을 저장할까요?"
        footer={<div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><Button onAction={() => setOpen(false)} variant="tertiary">취소</Button><Button onAction={() => setOpen(false)}>저장하기</Button></div>}
        onOpenChange={setOpen}
        open={open}
        title="변경 내용을 저장할까요?"
      />
    </>
  );
}
