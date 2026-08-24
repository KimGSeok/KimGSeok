import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@kimgseok/design-button/web";
import {
  BottomSheet,
  ConfirmationDialog,
  Dialog,
  Menu,
  Tooltip,
} from "@kimgseok/design-overlays/web";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
function DialogDemo({ destructive = false }: { destructive?: boolean }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const footer = (
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
      <Button onAction={() => setOpen(false)} variant="tertiary">
        취소
      </Button>
      <Button
        onAction={() => setOpen(false)}
        variant={destructive ? "danger" : "primary"}
      >
        {destructive ? "삭제하기" : "저장하기"}
      </Button>
    </div>
  );
  return (
    <>
      <Button onAction={() => setOpen(true)} ref={triggerRef}>
        다이얼로그 열기
      </Button>
      <Dialog
        closeOnBackdrop
        description={
          destructive
            ? "삭제한 데이터는 복구할 수 없습니다."
            : "변경 내용을 저장할까요?"
        }
        footer={footer}
        intent={destructive ? "destructive" : "default"}
        onOpenChange={setOpen}
        open={open}
        returnFocusRef={triggerRef}
        title={
          destructive ? "프로젝트를 삭제할까요?" : "변경 내용을 저장할까요?"
        }
      />
    </>
  );
}
export const Default: Story = { render: () => <DialogDemo /> };
export const Destructive: Story = { render: () => <DialogDemo destructive /> };
export const Dark: Story = {
  render: () => (
    <div
      data-theme="dark"
      style={{
        background: "var(--kg-color-bg-canvas)",
        minHeight: 160,
        padding: 24,
      }}
    >
      <DialogDemo />
    </div>
  ),
};
function BottomSheetDemo() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button onAction={() => setOpen(true)} ref={triggerRef}>
        바텀시트 열기
      </Button>
      <BottomSheet
        description="계속 사용할 계정을 선택해 주세요."
        onOpenChange={setOpen}
        open={open}
        returnFocusRef={triggerRef}
        title="계정 선택"
      >
        <div style={{ display: "grid", gap: 8 }}>
          <Button onAction={() => setOpen(false)} variant="secondary">
            개인 계정
          </Button>
          <Button onAction={() => setOpen(false)} variant="secondary">
            팀 계정
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
export const BottomSheetDefault: Story = { render: () => <BottomSheetDemo /> };
function NestedDialogDemo() {
  const [outerOpen, setOuterOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);
  return (
    <>
      <Button onAction={() => setOuterOpen(true)}>상위 다이얼로그 열기</Button>
      <Dialog
        footer={
          <Button onAction={() => setOuterOpen(false)} variant="tertiary">
            상위 닫기
          </Button>
        }
        onOpenChange={setOuterOpen}
        open={outerOpen}
        title="상위 작업"
      >
        <Button onAction={() => setInnerOpen(true)}>
          하위 다이얼로그 열기
        </Button>
        <Dialog
          footer={
            <Button onAction={() => setInnerOpen(false)} variant="tertiary">
              하위 닫기
            </Button>
          }
          onOpenChange={setInnerOpen}
          open={innerOpen}
          title="하위 작업"
        >
          <p>가장 위의 오버레이만 상호작용할 수 있습니다.</p>
        </Dialog>
      </Dialog>
    </>
  );
}
export const Nested: Story = { render: () => <NestedDialogDemo /> };
export const TooltipDefault: Story = {
  render: () => (
    <div style={{ padding: 64 }}>
      <Tooltip content="새 항목을 추가합니다" delayMs={20}>
        {(triggerProps) => <Button {...triggerProps}>도움말</Button>}
      </Tooltip>
    </div>
  ),
};
export const TooltipViewportEdge: Story = {
  render: () => (
    <div style={{ minHeight: 240, position: "relative" }}>
      <div style={{ left: 0, position: "absolute", top: 0 }}>
        <Tooltip
          content="좁은 화면에서도 잘리지 않는 긴 한국어 도움말입니다"
          delayMs={20}
        >
          {(triggerProps) => (
            <button {...triggerProps} type="button">
              가장자리 도움말
            </button>
          )}
        </Tooltip>
      </div>
    </div>
  ),
};
function DialogTooltipDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onAction={() => setOpen(true)}>도움말 다이얼로그 열기</Button>
      <Dialog
        footer={<Button onAction={() => setOpen(false)}>확인</Button>}
        onOpenChange={setOpen}
        open={open}
        title="도움말 테스트"
      >
        <Tooltip content="다이얼로그는 유지됩니다" delayMs={20}>
          {(triggerProps) => (
            <button {...triggerProps} type="button">
              내부 도움말
            </button>
          )}
        </Tooltip>
      </Dialog>
    </>
  );
}
export const DialogTooltip: Story = { render: () => <DialogTooltipDemo /> };
function MenuDemo({
  dark = false,
  controlled = false,
}: {
  dark?: boolean;
  controlled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(true);
  const [message, setMessage] = useState("선택 없음");
  return (
    <div
      data-theme={dark ? "dark" : "light"}
      style={{
        background: "var(--kg-color-bg-canvas)",
        minHeight: 280,
        padding: 24,
      }}
    >
      <Menu
        accessibilityLabel="문서 편집 메뉴"
        header="편집"
        items={[
          { value: "rename", label: "이름 바꾸기" },
          {
            value: "compact",
            label: "간단히 보기",
            kind: "checkbox",
            checked: compact,
          },
          { value: "archive", label: "보관하기" },
          { value: "delete", label: "삭제할 수 없음", disabled: true },
        ]}
        onAction={(value) => setMessage(`${value} 작업을 선택했습니다.`)}
        onCheckedChange={(_, checked) => {
          setCompact(checked);
          setMessage(`간단히 보기 ${checked ? "켬" : "끔"}`);
        }}
        onOpenChange={controlled ? setOpen : undefined}
        open={controlled ? open : undefined}
        placement="bottom-start"
        triggerLabel="편집 메뉴 열기"
      />
      <button
        onClick={() => setMessage("메뉴 밖 작업")}
        style={{ marginLeft: 16 }}
        type="button"
      >
        메뉴 밖 작업
      </button>
      <output aria-live="polite" style={{ display: "block", marginTop: 16 }}>
        {message}
      </output>
    </div>
  );
}
export const MenuDefault: Story = { render: () => <MenuDemo /> };
export const MenuControlled: Story = { render: () => <MenuDemo controlled /> };
export const MenuDark: Story = { render: () => <MenuDemo dark /> };
export const MenuDefaultOpen: Story = {
  render: () => (
    <div style={{ minHeight: 240, padding: 24 }}>
      <Menu
        accessibilityLabel="처음 열린 메뉴"
        defaultOpen
        items={[
          { value: "first", label: "첫 작업" },
          { value: "second", label: "둘째 작업" },
        ]}
        onAction={() => undefined}
        triggerLabel="처음부터 열린 메뉴"
      />
    </div>
  ),
};
const menuPlacements = [
  "top",
  "top-start",
  "top-end",
  "right",
  "right-start",
  "right-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
] as const;
function MenuPlacementDemo() {
  const [placement, setPlacement] =
    useState<(typeof menuPlacements)[number]>("bottom-start");
  return (
    <div style={{ minHeight: 520, padding: "180px 280px" }}>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 24 }}
      >
        {menuPlacements.map((item) => (
          <button
            aria-pressed={placement === item}
            key={item}
            onClick={() => setPlacement(item)}
            type="button"
          >
            {item} 배치
          </button>
        ))}
      </div>
      <Menu
        accessibilityLabel="배치 확인 메뉴"
        items={[{ value: "item", label: "배치 항목" }]}
        onAction={() => undefined}
        onOpenChange={() => undefined}
        open
        placement={placement}
        triggerLabel="배치 기준"
      />
    </div>
  );
}
export const MenuPlacements: Story = { render: () => <MenuPlacementDemo /> };
function ConfirmationDemo({
  fail = false,
  destructive = false,
}: {
  fail?: boolean;
  destructive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("대기");
  const [calls, setCalls] = useState(0);
  return (
    <>
      <Button onAction={() => setOpen(true)}>
        {destructive ? "삭제 확인 열기" : "변경 확인 열기"}
      </Button>
      <ConfirmationDialog
        cancelLabel="취소"
        confirmLabel={destructive ? "삭제하기" : "변경하기"}
        description={
          destructive
            ? "삭제한 데이터는 복구할 수 없어요."
            : "선택한 설정으로 변경합니다."
        }
        intent={destructive ? "destructive" : "default"}
        onConfirm={async () => {
          setCalls((current) => current + 1);
          await new Promise((resolve) => setTimeout(resolve, 100));
          if (fail) throw new Error("failed");
          setResult("완료");
        }}
        onConfirmError={() => setResult("실패")}
        onOpenChange={setOpen}
        open={open}
        title={destructive ? "프로젝트를 삭제할까요?" : "설정을 변경할까요?"}
      />
      <output aria-live="polite">결과: {result}</output>
      <output data-confirm-count>{calls}</output>
    </>
  );
}
export const ConfirmationSuccess: Story = {
  render: () => <ConfirmationDemo />,
};
export const ConfirmationError: Story = {
  render: () => <ConfirmationDemo fail />,
};
export const ConfirmationDestructive: Story = {
  render: () => <ConfirmationDemo destructive />,
};
function ConfirmationRaceDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onAction={() => setOpen(true)}>경합 확인 열기</Button>
      <button onClick={() => setOpen(false)} type="button">
        외부 닫기
      </button>
      <button onClick={() => setOpen(true)} type="button">
        외부 다시 열기
      </button>
      <ConfirmationDialog
        cancelLabel="취소"
        confirmLabel="처리하기"
        description="이전 비동기 작업이 새 세션을 닫지 않아야 합니다."
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }}
        onConfirmError={() => undefined}
        onOpenChange={setOpen}
        open={open}
        title="세션 경합 확인"
      />
    </>
  );
}
export const ConfirmationRace: Story = {
  render: () => <ConfirmationRaceDemo />,
};
