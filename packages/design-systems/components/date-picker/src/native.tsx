import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AccessibilityInfo,
  Modal,
  Pressable,
  Text,
  View,
  useColorScheme,
  Platform,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getNativeTheme } from "@kimgseok/design-tokens/native";
import { useReducedMotion } from "@kimgseok/design-motion/native";
import {
  assertDatePickerContract,
  assertDateRangePickerContract,
  formatDateForLocale,
  resolveDatePickerMessages,
  type DateConstraint,
  type DatePickerContract,
  type DatePickerMessages,
  type DateRangePickerContract,
  type DateRangeValue,
  type DateValue,
} from "./contracts";

export interface NativePickerApi<TCommit, TCurrent = TCommit> {
  commit: (value: TCommit) => void;
  cancel: () => void;
  context: {
    locale: string;
    messages: DatePickerMessages;
    constraints: DateConstraint;
    kind: "single" | "range";
    value: TCurrent;
    label: string;
    required: boolean;
    disabled: boolean;
  };
}
export type NativeDatePickerProps = DatePickerContract & {
  renderPicker: (
    api: NativePickerApi<Exclude<DateValue, "">, DateValue>,
  ) => ReactNode;
};
export type NativeDateRangePickerProps = DateRangePickerContract & {
  renderPicker: (api: NativePickerApi<DateRangeValue>) => ReactNode;
};

function NativeField({
  label,
  value,
  disabled,
  required,
  helpText,
  errorMessage,
  messages,
  onPress,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
  errorMessage?: string;
  messages: DatePickerMessages;
  onPress: () => void;
}) {
  const theme = getNativeTheme(
    useColorScheme() === "dark" ? "dark" : "light",
    Platform.OS === "android" ? "android" : "ios",
  );
  return (
    <View style={{ gap: 6 }}>
      <Text
        style={[
          theme.typography.role.label,
          { color: theme.color.semantic.fg.primary },
        ]}
      >
        {label}
        {required ? ` (${messages.required})` : ""}
      </Text>
      <Pressable
        accessibilityHint={errorMessage ?? helpText}
        accessibilityLabel={`${label}, ${value || messages.notSelected}${errorMessage ? ", 오류" : ""}`}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={{
          alignItems: "center",
          borderColor: errorMessage
            ? theme.color.semantic.status.negative.border
            : theme.color.semantic.border.strong,
          borderRadius: theme.foundation.radius.md,
          borderWidth: 1,
          flexDirection: "row",
          minHeight: 48,
          paddingHorizontal: 14,
        }}
      >
        <Text
          style={[
            theme.typography.role.body,
            {
              color: value
                ? theme.color.semantic.fg.primary
                : theme.color.semantic.fg.tertiary,
              flex: 1,
            },
          ]}
        >
          {value || messages.chooseDate}
        </Text>
      </Pressable>
      {errorMessage || helpText ? (
        <Text
          accessible
          accessibilityLiveRegion={errorMessage ? "assertive" : "none"}
          style={[
            theme.typography.role.label,
            {
              color: errorMessage
                ? theme.color.semantic.status.negative.fg
                : theme.color.semantic.fg.secondary,
            },
          ]}
        >
          {errorMessage ?? helpText}
        </Text>
      ) : null}
    </View>
  );
}

function PickerModal({
  label,
  open,
  onClose,
  children,
}: {
  label: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const style: StyleProp<ViewStyle> = {
    flex: 1,
    paddingTop: insets.top,
    paddingRight: insets.right,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
  };
  return (
    <Modal
      animationType={reduceMotion ? "none" : "slide"}
      onDismiss={onClose}
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      visible={open}
    >
      <View accessibilityLabel={label} accessibilityViewIsModal style={style}>
        {children}
      </View>
    </Modal>
  );
}

export function NativeDatePicker({
  renderPicker,
  ...props
}: NativeDatePickerProps) {
  assertDatePickerContract(props);
  if (typeof renderPicker !== "function")
    throw new Error("NativeDatePicker requires renderPicker.");
  const copy = resolveDatePickerMessages(props.locale, props.messages);
  const locale = props.locale ?? "ko-KR";
  const [open, setOpen] = useState(false);
  const session = useRef(0);
  useEffect(() => () => { session.current += 1; }, []);
  const close = () => {
    session.current += 1;
    setOpen(false);
  };
  useEffect(() => {
    if (props.disabled && open) close();
  }, [props.disabled, open]);
  const begin = () => {
    if (props.disabled) return;
    session.current += 1;
    setOpen(true);
  };
  const current = session.current;
  const commit = (
    value: Parameters<NativePickerApi<Exclude<DateValue, "">>["commit"]>[0],
  ) => {
    if (!open || current !== session.current) return;
    if (props.disabled) return close();
    assertDatePickerContract({ ...props, value });
    props.onValueChange(value);
    close();
    void AccessibilityInfo.announceForAccessibility(
      `${props.label}, ${formatDateForLocale(value, locale)}`,
    );
  };
  return (
    <>
      <NativeField
        {...props}
        messages={copy}
        onPress={begin}
        value={formatDateForLocale(props.value, locale)}
      />
      <PickerModal
        label={`${props.label} ${copy.calendar}`}
        onClose={close}
        open={open}
      >
        {renderPicker({
          commit,
          cancel: () => { if (open && current === session.current) close(); },
          context: {
            kind: "single",
            value: props.value,
            label: props.label,
            required: props.required ?? false,
            disabled: props.disabled ?? false,
            locale,
            messages: copy,
            constraints: {
              min: props.min,
              max: props.max,
              isDateUnavailable: props.isDateUnavailable,
            },
          },
        })}
      </PickerModal>
    </>
  );
}
export function NativeDateRangePicker({
  renderPicker,
  ...props
}: NativeDateRangePickerProps) {
  assertDateRangePickerContract(props);
  if (typeof renderPicker !== "function")
    throw new Error("NativeDateRangePicker requires renderPicker.");
  const copy = resolveDatePickerMessages(props.locale, props.messages);
  const locale = props.locale ?? "ko-KR";
  const [open, setOpen] = useState(false);
  const session = useRef(0);
  useEffect(() => () => { session.current += 1; }, []);
  const label = props.value.start
    ? `${formatDateForLocale(props.value.start, locale)} ${copy.rangeSeparator} ${props.value.end ? formatDateForLocale(props.value.end, locale) : copy.chooseEndDate}`
    : "";
  const close = () => {
    session.current += 1;
    setOpen(false);
  };
  useEffect(() => {
    if (props.disabled && open) close();
  }, [props.disabled, open]);
  const begin = () => {
    if (props.disabled) return;
    session.current += 1;
    setOpen(true);
  };
  const current = session.current;
  const commit = (value: DateRangeValue) => {
    if (!open || current !== session.current) return;
    if (props.disabled) return close();
    assertDateRangePickerContract({ ...props, value });
    props.onValueChange(value);
    close();
    void AccessibilityInfo.announceForAccessibility(
      `${props.label}, ${formatDateForLocale(value.start, locale)} ${copy.rangeSeparator} ${formatDateForLocale(value.end, locale)}`,
    );
  };
  return (
    <>
      <NativeField {...props} messages={copy} onPress={begin} value={label} />
      <PickerModal
        label={`${props.label} ${copy.calendar}`}
        onClose={close}
        open={open}
      >
        {renderPicker({
          commit,
          cancel: () => { if (open && current === session.current) close(); },
          context: {
            kind: "range",
            value: props.value,
            label: props.label,
            required: props.required ?? false,
            disabled: props.disabled ?? false,
            locale,
            messages: copy,
            constraints: {
              min: props.min,
              max: props.max,
              isDateUnavailable: props.isDateUnavailable,
            },
          },
        })}
      </PickerModal>
    </>
  );
}
