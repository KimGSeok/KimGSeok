import { readFile } from "node:fs/promises";
const [web, native, manager] = await Promise.all([
  readFile(new URL("../src/web.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/native.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/web-overlay-manager.ts", import.meta.url), "utf8"),
]);
for (const marker of [
  'aria-modal="true"',
  'event.key === "Escape"',
  'event.key !== "Tab"',
  "registerOverlay",
  "createPortal",
])
  if (!web.includes(marker))
    throw new Error(`Web Dialog contract missing ${marker}`);
for (const marker of ["Modal", "onRequestClose", "accessibilityViewIsModal"])
  if (!native.includes(marker))
    throw new Error(`Native Dialog contract missing ${marker}`);
if (
  !web.includes("function BottomSheet") ||
  !native.includes("function NativeBottomSheet")
)
  throw new Error("BottomSheet platform implementations missing.");
if (
  !web.includes('intent !== "destructive"') ||
  !native.includes('intent !== "destructive"')
)
  throw new Error("Destructive overlays must force backdrop dismissal off.");
if (!native.includes("useSafeAreaInsets") || !native.includes("ScrollView"))
  throw new Error(
    "Native overlays require safe-area and scrollable content boundaries.",
  );
if (
  !native.includes("isReduceMotionEnabled") ||
  !native.includes("KeyboardAvoidingView")
)
  throw new Error(
    "Native overlays require reduced-motion and keyboard avoidance.",
  );
for (const marker of [
  "stack.push(panel)",
  "document.addEventListener('focusin'",
  "child.inert = true",
  "originalOverflow",
  "kg-overlay-stack-change",
])
  if (!manager.includes(marker))
    throw new Error(`Overlay manager missing ${marker}`);
if (
  !web.includes("function Tooltip") ||
  !web.includes('role="tooltip"') ||
  !web.includes("ResizeObserver") ||
  !web.includes("consumeEscape") ||
  !native.includes("function NativeTooltip") ||
  !native.includes("accessibilityHint")
)
  throw new Error("Tooltip platform contract missing.");
const { assertMenuContract } = await import("../src/contracts.ts");
const menu = {
  accessibilityLabel: "편집 메뉴",
  triggerLabel: "메뉴 열기",
  items: [{ value: "rename", label: "이름 바꾸기" }],
  onAction() {},
};
assertMenuContract(menu);
for (const value of [
  { ...menu, accessibilityLabel: " " },
  { ...menu, items: [] },
  {
    ...menu,
    items: [
      { value: "same", label: "하나" },
      { value: "same", label: "둘" },
    ],
  },
  { ...menu, items: [{ value: "bad", label: "잘못된 종류", kind: "bogus" }] },
  {
    ...menu,
    items: [
      { value: "check", label: "체크", kind: "checkbox", checked: false },
    ],
  },
  { ...menu, open: true },
  { ...menu, open: true, defaultOpen: false, onOpenChange() {} },
  { ...menu, placement: "floating-nowhere" },
]) {
  let threw = false;
  try {
    assertMenuContract(value);
  } catch {
    threw = true;
  }
  if (!threw)
    throw new Error(`Menu invariant accepted ${JSON.stringify(value)}`);
}
for (const marker of [
  "function Menu",
  'aria-haspopup="menu"',
  'role={item.kind === "checkbox" ? "menuitemcheckbox" : "menuitem"}',
  'event.key === "Escape"',
  'document.addEventListener("pointerdown"',
])
  if (!web.includes(marker))
    throw new Error(`Web Menu contract missing ${marker}`);
for (const marker of [
  "function NativeMenu",
  'accessibilityRole="menu"',
  'item.kind === "checkbox" ? "checkbox" : "menuitem"',
  "onRequestClose",
  "setAccessibilityFocus",
  "findNodeHandle",
])
  if (!native.includes(marker))
    throw new Error(`Native Menu contract missing ${marker}`);
const { assertConfirmationContract } = await import("../src/contracts.ts");
const confirmation = {
  open: true,
  title: "삭제할까요?",
  confirmLabel: "삭제",
  cancelLabel: "취소",
  onOpenChange() {},
  onConfirm() {},
  onConfirmError() {},
};
assertConfirmationContract(confirmation);
for (const value of [
  { ...confirmation, title: " " },
  { ...confirmation, confirmLabel: "취소" },
  { ...confirmation, intent: "warning" },
  { ...confirmation, onConfirmError: undefined },
]) {
  let threw = false;
  try {
    assertConfirmationContract(value);
  } catch {
    threw = true;
  }
  if (!threw) throw new Error("Confirmation invariant accepted invalid state.");
}
if (
  !web.includes("function ConfirmationDialog") ||
  !native.includes("function NativeConfirmationDialog") ||
  !web.includes("const operation = session.current") ||
  !native.includes("const operation = session.current") ||
  !web.includes("operation === session.current") ||
  !native.includes("operation === session.current") ||
  !native.includes('Platform.OS === "ios"') ||
  !native.includes("announceForAccessibility(message)")
)
  throw new Error("Confirmation platform lifecycle missing.");
