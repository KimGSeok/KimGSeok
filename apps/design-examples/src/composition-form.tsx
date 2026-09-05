"use client";

import { useRef, useState } from "react";
import { Button } from "@kimgseok/design-button/web";
import { DateTimeField, Select, TextField } from "@kimgseok/design-forms/web";
import { Callout, ToastViewport } from "@kimgseok/design-feedback/web";

/** Local fixture: the first valid save fails so retry can be exercised without a backend. */
export default function CompositionFormExample() {
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("draft");
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(false);
  const lock = useRef(false);
  const attempts = useRef(0);
  const nameError =
    submitted && !name.trim() ? "제목을 입력해 주세요." : undefined;
  const dateError =
    date && (date < "2026-09-01" || date > "2026-09-30")
      ? "2026년 9월 날짜를 입력해 주세요."
      : undefined;

  async function save() {
    if (lock.current) return;
    setSubmitted(true);
    if (!name.trim() || dateError) return;
    lock.current = true;
    setSaving(true);
    setError(false);
    setToast(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      attempts.current += 1;
      if (attempts.current === 1) throw new Error("Example save failure");
      setToast(true);
    } catch {
      setError(true);
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }

  return (
    <form
      aria-label="콘텐츠 작성"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
      style={{
        display: "grid",
        gap: "var(--kg-foundation-space-4)",
        width: "100%",
      }}
    >
      <TextField
        label="제목"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        disabled={saving}
        errorMessage={nameError}
      />
      <Select
        id="composition-visibility"
        label="공개 상태"
        value={visibility}
        onValueChange={setVisibility}
        disabled={saving}
        options={[
          { value: "draft", label: "초안" },
          { value: "published", label: "공개" },
        ]}
      />
      <DateTimeField
        label="게시 예정일"
        kind="date"
        value={date}
        onValueChange={setDate}
        min="2026-09-01"
        max="2026-09-30"
        helpText="선택 사항입니다. 2026년 9월 날짜를 입력해 주세요."
        errorMessage={dateError}
        disabled={saving}
      />
      {error ? (
        <Callout
          tone="negative"
          title="저장하지 못했습니다"
          description="입력한 내용은 유지됩니다. 다시 저장해 주세요."
          announce
        />
      ) : null}
      <Button type="submit" loading={saving}>
        {error ? "다시 저장" : "저장"}
      </Button>
      <ToastViewport
        toast={{
          id: attempts.current,
          open: toast,
          message: "저장했습니다",
          tone: "positive",
          onOpenChange: setToast,
        }}
      />
    </form>
  );
}
