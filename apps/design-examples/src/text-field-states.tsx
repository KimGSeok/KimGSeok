"use client";

import { TextField } from "@kimgseok/design-forms/web";

export default function TextFieldStatesExample() {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      <TextField defaultValue="김" errorMessage="이름을 두 글자 이상 입력해 주세요." label="오류 상태" />
      <TextField disabled label="비활성 상태" value="김경석" />
      <TextField label="필수 입력" required />
    </div>
  );
}
