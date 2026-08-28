import {
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type ReactElement,
} from "react";
import {
  AccessibilityInfo,
  findNodeHandle,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getNativeTheme } from "@kimgseok/design-tokens/native";
import { useReducedMotion } from "@kimgseok/design-motion/native";
import { NativeButton } from "@kimgseok/design-button/native";
import {
  assertConfirmationContract,
  assertMenuContract,
  type BottomSheetContract,
  type ConfirmationContract,
  type DialogContract,
  type MenuContract,
  type TooltipContract,
} from "./contracts";

function useTheme() {
  return getNativeTheme(
    useColorScheme() === "dark" ? "dark" : "light",
    Platform.OS === "android" ? "android" : "ios",
  );
}
export function NativeDialog({
  open,
  title,
  description,
  children,
  footer,
  intent = "default",
  closeOnBackdrop = false,
  onOpenChange,
}: DialogContract) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const canCloseOnBackdrop = intent !== "destructive" && closeOnBackdrop;
  return (
    <Modal
      animationType={reduceMotion ? "none" : "fade"}
      onRequestClose={() => onOpenChange(false)}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={open}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable
          accessibilityViewIsModal
          onPress={() => {
            if (canCloseOnBackdrop) onOpenChange(false);
          }}
          style={{
            alignItems: "center",
            backgroundColor: "rgba(25,31,40,.56)",
            flex: 1,
            justifyContent: "center",
            paddingBottom: Math.max(16, insets.bottom),
            paddingHorizontal: 16,
            paddingTop: Math.max(16, insets.top),
          }}
        >
          <Pressable
            accessibilityLabel={`${title}${description ? `. ${description}` : ""}`}
            accessibilityRole="summary"
            onPress={(event) => event.stopPropagation()}
            style={[
              theme.foundation.elevation["2"],
              {
                backgroundColor: theme.color.semantic.bg.raised,
                borderRadius: theme.foundation.radius.xl,
                gap: 16,
                maxHeight: "100%",
                overflow: "hidden",
                padding: 24,
                width: "100%",
              },
            ]}
          >
            <View style={{ gap: 8 }}>
              <Text
                accessible={false}
                style={[
                  theme.typography.role.heading,
                  { color: theme.color.semantic.fg.primary },
                ]}
              >
                {title}
              </Text>
              {description ? (
                <Text
                  accessible={false}
                  style={[
                    theme.typography.role.body,
                    { color: theme.color.semantic.fg.secondary },
                  ]}
                >
                  {description}
                </Text>
              ) : null}
            </View>
            {children ? (
              <ScrollView
                bounces={false}
                contentContainerStyle={{ gap: 12 }}
                keyboardShouldPersistTaps="handled"
                style={{ flexShrink: 1 }}
              >
                {children}
              </ScrollView>
            ) : null}
            {footer}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function NativeBottomSheet({
  open,
  title,
  description,
  children,
  footer,
  intent = "default",
  closeOnBackdrop = true,
  onOpenChange,
}: BottomSheetContract) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const canCloseOnBackdrop = intent !== "destructive" && closeOnBackdrop;
  return (
    <Modal
      animationType={reduceMotion ? "none" : "slide"}
      onRequestClose={() => onOpenChange(false)}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={open}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable
          accessibilityViewIsModal
          onPress={() => {
            if (canCloseOnBackdrop) onOpenChange(false);
          }}
          style={{
            backgroundColor: "rgba(25,31,40,.56)",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            accessibilityLabel={`${title}${description ? `. ${description}` : ""}`}
            accessibilityRole="summary"
            onPress={(event) => event.stopPropagation()}
            style={[
              theme.foundation.elevation["2"],
              {
                backgroundColor: theme.color.semantic.bg.raised,
                borderTopLeftRadius: theme.foundation.radius.xl,
                borderTopRightRadius: theme.foundation.radius.xl,
                gap: 16,
                maxHeight: "80%",
                overflow: "hidden",
                paddingBottom: Math.max(24, insets.bottom),
                paddingHorizontal: 24,
                paddingTop: 12,
                width: "100%",
              },
            ]}
          >
            <View
              accessible={false}
              style={{
                alignSelf: "center",
                backgroundColor: theme.color.semantic.border.strong,
                borderRadius: 999,
                height: 4,
                width: 40,
              }}
            />
            <View style={{ gap: 8 }}>
              <Text
                accessible={false}
                style={[
                  theme.typography.role.heading,
                  { color: theme.color.semantic.fg.primary },
                ]}
              >
                {title}
              </Text>
              {description ? (
                <Text
                  accessible={false}
                  style={[
                    theme.typography.role.body,
                    { color: theme.color.semantic.fg.secondary },
                  ]}
                >
                  {description}
                </Text>
              ) : null}
            </View>
            {children ? (
              <ScrollView
                bounces={false}
                contentContainerStyle={{ gap: 12 }}
                keyboardShouldPersistTaps="handled"
                style={{ flexShrink: 1 }}
              >
                {children}
              </ScrollView>
            ) : null}
            {footer}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type NativeTooltipProps = TooltipContract & {
  existingHint?: string;
  children: (props: { accessibilityHint: string }) => ReactElement;
};
export function NativeTooltip({
  content,
  existingHint,
  children,
}: NativeTooltipProps) {
  const existing = existingHint?.trim();
  const accessibilityHint =
    existing && existing !== content ? `${existing}. ${content}` : content;
  return children({ accessibilityHint });
}

export function NativeConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  intent = "default",
  closeOnBackdrop = false,
  onOpenChange,
  onConfirm,
  onConfirmError,
}: ConfirmationContract) {
  assertConfirmationContract({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel,
    intent,
    closeOnBackdrop,
    onOpenChange,
    onConfirm,
    onConfirmError,
  });
  const theme = useTheme();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const session = useRef(0);
  useEffect(() => {
    session.current += 1;
    setPending(false);
    setError("");
    lock.current = false;
  }, [open]);
  const confirm = async () => {
    if (lock.current) return;
    lock.current = true;
    const operation = session.current;
    setPending(true);
    setError("");
    try {
      await onConfirm();
      if (operation === session.current && open) onOpenChange(false);
    } catch (nextError) {
      if (operation !== session.current) return;
      const message = "작업을 완료하지 못했어요. 다시 시도해 주세요.";
      setError(message);
      if (Platform.OS === "ios")
        void AccessibilityInfo.announceForAccessibility(message);
      try {
        onConfirmError(nextError);
      } catch {}
    } finally {
      if (operation === session.current) {
        lock.current = false;
        setPending(false);
      }
    }
  };
  const footer = (
    <View style={{ gap: 8 }}>
      <NativeButton
        disabled={pending}
        onAction={() => onOpenChange(false)}
        variant="tertiary"
      >
        {cancelLabel}
      </NativeButton>
      <NativeButton
        loading={pending}
        onAction={confirm}
        onActionError={onConfirmError}
        variant={intent === "destructive" ? "danger" : "primary"}
      >
        {confirmLabel}
      </NativeButton>
      {error ? (
        <Text
          accessibilityLiveRegion="assertive"
          style={[
            theme.typography.role.body,
            { color: theme.color.semantic.status.negative.fg },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
  return (
    <NativeDialog
      closeOnBackdrop={intent === "destructive" ? false : closeOnBackdrop}
      description={description}
      footer={footer}
      intent={intent}
      onOpenChange={(next) => {
        if (!pending) onOpenChange(next);
      }}
      open={open}
      title={title}
    />
  );
}

export function NativeMenu({
  accessibilityLabel,
  triggerLabel,
  items,
  header,
  open,
  defaultOpen,
  disabled = false,
  onOpenChange,
  onAction,
  onCheckedChange,
}: MenuContract) {
  assertMenuContract({
    accessibilityLabel,
    triggerLabel,
    items,
    header,
    open,
    defaultOpen,
    disabled,
    onOpenChange,
    onAction,
    onCheckedChange,
  });
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const controlled = open !== undefined;
  const [localOpen, setLocalOpen] = useState(defaultOpen ?? false);
  const shown = controlled ? open : localOpen;
  const triggerRef = useRef<ComponentRef<typeof Pressable>>(null);
  const firstItemRef = useRef<ComponentRef<typeof Pressable>>(null);
  const wasShown = useRef(false);
  const setShown = (next: boolean) => {
    if (!controlled) setLocalOpen(next);
    onOpenChange?.(next);
  };
  const choose = (item: MenuContract["items"][number]) => {
    if (item.disabled) return;
    if (item.kind === "checkbox") onCheckedChange?.(item.value, !item.checked);
    else {
      onAction(item.value);
      setShown(false);
    }
  };
  useEffect(() => {
    const target = shown
      ? firstItemRef.current
      : wasShown.current
        ? triggerRef.current
        : null;
    wasShown.current = shown;
    if (!target) return;
    const timer = setTimeout(() => {
      const handle = findNodeHandle(target);
      if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
    }, 80);
    return () => clearTimeout(timer);
  }, [shown]);
  let assignedFirst = false;
  return (
    <>
      <Pressable
        accessibilityLabel={triggerLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: shown }}
        disabled={disabled}
        onPress={() => setShown(true)}
        ref={triggerRef}
        style={{
          alignItems: "center",
          alignSelf: "flex-start",
          backgroundColor: theme.color.semantic.bg.surface,
          borderColor: theme.color.semantic.border.strong,
          borderRadius: theme.foundation.radius.md,
          borderWidth: 1,
          justifyContent: "center",
          minHeight: 44,
          paddingHorizontal: 12,
        }}
      >
        <Text
          accessible={false}
          style={[
            theme.typography.role.label,
            {
              color: disabled
                ? theme.color.semantic.fg.disabled
                : theme.color.semantic.fg.primary,
            },
          ]}
        >
          {triggerLabel}
        </Text>
      </Pressable>
      <Modal
        animationType={reduceMotion ? "none" : "fade"}
        onRequestClose={() => setShown(false)}
        presentationStyle="overFullScreen"
        statusBarTranslucent
        transparent
        visible={shown}
      >
        <Pressable
          accessibilityViewIsModal
          onPress={() => setShown(false)}
          style={{
            backgroundColor: "rgba(25,31,40,.32)",
            flex: 1,
            paddingBottom: Math.max(16, insets.bottom),
            paddingHorizontal: 16,
            paddingTop: Math.max(16, insets.top),
          }}
        >
          <Pressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="menu"
            onPress={(event) => event.stopPropagation()}
            style={[
              theme.foundation.elevation["2"],
              {
                alignSelf: "flex-end",
                backgroundColor: theme.color.semantic.bg.raised,
                borderColor: theme.color.semantic.border.subtle,
                borderRadius: theme.foundation.radius.lg,
                borderWidth: 1,
                maxWidth: 360,
                minWidth: 240,
                overflow: "hidden",
                padding: 8,
              },
            ]}
          >
            {header ? (
              <Text
                accessibilityRole="header"
                style={[
                  theme.typography.role.caption,
                  {
                    color: theme.color.semantic.fg.secondary,
                    fontWeight: "600",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  },
                ]}
              >
                {header}
              </Text>
            ) : null}
            {items.map((item) => {
              const first = !item.disabled && !assignedFirst;
              if (first) assignedFirst = true;
              return (
                <Pressable
                  accessibilityLabel={item.label}
                  accessibilityRole={
                    item.kind === "checkbox" ? "checkbox" : "menuitem"
                  }
                  accessibilityState={{
                    checked:
                      item.kind === "checkbox" ? item.checked : undefined,
                    disabled: item.disabled,
                  }}
                  disabled={item.disabled}
                  key={item.value}
                  onPress={() => choose(item)}
                  ref={first ? firstItemRef : undefined}
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 12,
                    justifyContent: "space-between",
                    minHeight: 48,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    accessible={false}
                    style={[
                      theme.typography.role.body,
                      {
                        color: item.disabled
                          ? theme.color.semantic.fg.disabled
                          : theme.color.semantic.fg.primary,
                        flex: 1,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.kind === "checkbox" && item.checked ? (
                    <Text
                      accessible={false}
                      style={[
                        theme.typography.role.body,
                        { color: theme.color.semantic.action.primary.bg },
                      ]}
                    >
                      ✓
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
