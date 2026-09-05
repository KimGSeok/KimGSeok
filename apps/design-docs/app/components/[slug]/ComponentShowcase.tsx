"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { writeClipboardWithTimeout } from "./clipboard";

export interface RenderedExample {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly code: string;
  readonly preview: ReactNode;
}

export function ComponentShowcase({ examples }: { examples: readonly RenderedExample[] }) {
  const [selectedId, setSelectedId] = useState(examples[0]?.id ?? "");
  const [view, setView] = useState<"preview" | "code">("preview");
  const [resetKey, setResetKey] = useState(0);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied" | "failed">("idle");
  const copyRequest = useRef(0);
  const selected = examples.find(({ id }) => id === selectedId) ?? examples[0];
  useEffect(() => () => { copyRequest.current += 1; }, []);
  if (!selected) return null;

  async function copyCode() {
    if (copyStatus === "copying") return;
    const request = ++copyRequest.current;
    setCopyStatus("copying");
    try {
      await writeClipboardWithTimeout((text) => navigator.clipboard.writeText(text), selected.code);
      if (copyRequest.current === request) setCopyStatus("copied");
    } catch {
      if (copyRequest.current === request) setCopyStatus("failed");
    }
  }

  function selectExample(id: string) {
    if (copyStatus === "copying") return;
    copyRequest.current += 1;
    setSelectedId(id);
    setCopyStatus("idle");
  }

  function moveExample(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keyOffset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? examples.length - 1 : keyOffset ? (index + keyOffset + examples.length) % examples.length : index;
    if (nextIndex === index && !["Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = examples[nextIndex];
    if (!next) return;
    selectExample(next.id);
    requestAnimationFrame(() => document.getElementById(`example-tab-${next.id}`)?.focus());
  }

  return (
    <div className="component-showcase">
      <div className="example-picker" aria-label="컴포넌트 예제" role="tablist">
        {examples.map((item, index) => (
          <button
            aria-selected={item.id === selected.id}
            disabled={copyStatus === "copying"}
            id={`example-tab-${item.id}`}
            key={item.id}
            onClick={() => selectExample(item.id)}
            onKeyDown={(event) => moveExample(event, index)}
            role="tab"
            tabIndex={item.id === selected.id ? 0 : -1}
            type="button"
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="showcase-heading">
        <div>
          <h2>{selected.title}</h2>
          <p>{selected.description}</p>
        </div>
        <div className="showcase-tools" aria-label="예제 표시 설정" role="group">
          <button aria-pressed={view === "preview"} onClick={() => setView("preview")} type="button">Preview</button>
          <button aria-pressed={view === "code"} onClick={() => setView("code")} type="button">Code</button>
          {view === "preview" ? (
            <>
              <button onClick={() => setResetKey((current) => current + 1)} type="button">Reset</button>
            </>
          ) : (
            <button disabled={copyStatus === "copying"} onClick={copyCode} type="button">{copyStatus === "copying" ? "복사 중…" : copyStatus === "copied" ? "복사됨" : copyStatus === "failed" ? "다시 복사" : "코드 복사"}</button>
          )}
        </div>
      </div>
      <div
        aria-labelledby={`example-tab-${selected.id}`}
        className={`showcase-panel showcase-panel-${view}`}
        id={`example-${selected.id}`}
        role="tabpanel"
      >
        {view === "preview" ? <div className="showcase-preview" key={`${selected.id}-${resetKey}`}>{selected.preview}</div> : <pre tabIndex={0}><code>{selected.code}</code></pre>}
      </div>
      <p aria-live="polite" className="sr-only">{copyStatus === "copied" ? "예제 코드를 복사했습니다." : copyStatus === "failed" ? "예제 코드를 복사하지 못했습니다." : ""}</p>
    </div>
  );
}
