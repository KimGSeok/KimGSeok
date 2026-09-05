import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  Switch as RNSwitch,
  Text,
  TextInput,
  useColorScheme,
  View,
  type TextInputProps,
} from "react-native";
import { NativeIcon } from "@kimgseok/design-icons/native";
import { getNativeTheme } from "@kimgseok/design-tokens/native";
import {
  assertDateTimeFieldContract,
  assertSearchFieldContract,
  assertSliderContract,
  normalizeSliderValue,
  type ChoiceContract,
  type DateTimeFieldContract,
  type FieldContract,
  type RadioOption,
  type SearchFieldContract,
  type SliderContract,
} from "./contracts";

function useTheme() {
  const mode = useColorScheme() === "dark" ? "dark" : "light";
  return getNativeTheme(mode, Platform.OS === "android" ? "android" : "ios");
}
type NativeFieldProps = FieldContract &
  Omit<TextInputProps, "editable" | "style">;
function Field({
  multiline = false,
  label,
  helpText,
  errorMessage,
  disabled,
  required,
  onFocus,
  onBlur,
  ...props
}: NativeFieldProps) {
  const theme = useTheme();
  const message = errorMessage ?? helpText;
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (errorMessage)
      void AccessibilityInfo.announceForAccessibility(
        `${label}, ${errorMessage}`,
      );
  }, [errorMessage, label]);
  const borderColor = focused
    ? theme.color.semantic.border.focus
    : errorMessage
      ? theme.color.semantic.status.negative.border
      : theme.color.semantic.border.strong;
  return (
    <View style={{ gap: theme.foundation.space[2] }}>
      <Text
        accessible={false}
        style={[
          theme.typography.role.label,
          { color: theme.color.semantic.fg.primary },
        ]}
      >
        {label}
        {required ? " (필수)" : ""}
      </Text>
      <TextInput
        {...props}
        accessibilityHint={errorMessage ?? helpText}
        accessibilityLabel={`${label}${required ? ", 필수" : ""}${errorMessage ? ", 오류" : ""}`}
        accessibilityState={{ disabled }}
        editable={!disabled}
        multiline={multiline}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        style={[
          theme.typography.role.body,
          {
            backgroundColor: theme.color.semantic.bg.canvas,
            borderColor,
            borderRadius: theme.foundation.radius.md,
            borderWidth: focused ? 2 : 1,
            color: theme.color.semantic.fg.primary,
            minHeight: multiline ? 120 : 48,
            padding: theme.foundation.space[3],
            textAlignVertical: multiline ? "top" : "center",
          },
        ]}
      />
      {message ? (
        <Text
          accessible
          style={[
            theme.typography.role.label,
            {
              color: errorMessage
                ? theme.color.semantic.status.negative.fg
                : theme.color.semantic.fg.secondary,
            },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}
export function NativeTextField(props: NativeFieldProps) {
  return <Field {...props} />;
}
export function NativeTextArea(props: NativeFieldProps) {
  return <Field {...props} multiline />;
}
export function NativeSwitch({
  label,
  checked,
  disabled,
  onCheckedChange,
}: ChoiceContract) {
  const theme = useTheme();
  const selection = theme.color.semantic.selection;
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        justifyContent: "space-between",
        minHeight: 44,
      }}
    >
      <Text
        accessible={false}
        style={[
          theme.typography.role.body,
          {
            color: disabled
              ? selection.disabledFg
              : theme.color.semantic.fg.primary,
          },
        ]}
      >
        {label}
      </Text>
      <RNSwitch
        accessibilityLabel={label}
        disabled={disabled}
        ios_backgroundColor={
          disabled ? selection.disabledBg : selection.trackOff
        }
        onValueChange={onCheckedChange}
        thumbColor={disabled ? selection.disabledFg : selection.thumb}
        trackColor={{
          false: selection.trackOff,
          true: disabled ? selection.disabledBg : selection.selectedBg,
        }}
        value={checked}
      />
    </View>
  );
}

export function NativeCheckbox({
  label,
  checked,
  disabled,
  onCheckedChange,
}: ChoiceContract) {
  const theme = useTheme();
  const selection = theme.color.semantic.selection;
  const selectedBg = disabled ? selection.disabledBg : selection.selectedBg;
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
      style={({ pressed }) => ({
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        minHeight: 44,
        opacity: pressed && !disabled ? 0.72 : 1,
      })}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: checked ? selectedBg : selection.unselectedBg,
          borderColor: disabled
            ? selection.disabledFg
            : checked
              ? selection.selectedBg
              : selection.unselectedBorder,
          borderRadius: 6,
          borderWidth: 2,
          height: 22,
          justifyContent: "center",
          width: 22,
        }}
      >
        {checked ? (
          <NativeIcon
            color={disabled ? selection.disabledFg : selection.selectedFg}
            name="check"
            size={16}
          />
        ) : null}
      </View>
      <Text
        accessible={false}
        style={[
          theme.typography.role.body,
          {
            color: disabled
              ? selection.disabledFg
              : theme.color.semantic.fg.primary,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function NativeRadioGroup({
  label,
  options,
  value,
  onValueChange,
}: {
  label: string;
  options: RadioOption[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  const theme = useTheme();
  const selection = theme.color.semantic.selection;
  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="radiogroup"
      style={{ gap: 4 }}
    >
      <Text
        accessible={false}
        style={[
          theme.typography.role.label,
          { color: theme.color.semantic.fg.primary },
        ]}
      >
        {label}
      </Text>
      {options.map((option) => {
        const selected = option.value === value;
        const disabled = option.disabled;
        return (
          <Pressable
            accessibilityLabel={option.label}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, disabled }}
            disabled={disabled}
            key={option.value}
            onPress={() => onValueChange(option.value)}
            style={({ pressed }) => ({
              alignItems: "center",
              flexDirection: "row",
              gap: 8,
              minHeight: 44,
              opacity: pressed && !disabled ? 0.72 : 1,
            })}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: disabled
                  ? selection.disabledBg
                  : selection.unselectedBg,
                borderColor: disabled
                  ? selection.disabledFg
                  : selected
                    ? selection.selectedBg
                    : selection.unselectedBorder,
                borderRadius: 10,
                borderWidth: 2,
                height: 20,
                justifyContent: "center",
                width: 20,
              }}
            >
              {selected ? (
                <View
                  style={{
                    backgroundColor: disabled
                      ? selection.disabledFg
                      : selection.selectedBg,
                    borderRadius: 5,
                    height: 10,
                    width: 10,
                  }}
                />
              ) : null}
            </View>
            <Text
              accessible={false}
              style={[
                theme.typography.role.body,
                {
                  color: disabled
                    ? selection.disabledFg
                    : theme.color.semantic.fg.primary,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export interface NativeSelectSheetApi {
  open: boolean;
  options: RadioOption[];
  value: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
}
export type NativeSelectProps = FieldContract & {
  options: RadioOption[];
  value: string;
  open: boolean;
  onValueChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  renderSheet: (api: NativeSelectSheetApi) => ReactNode;
};
export function NativeSelect({
  label,
  options,
  value,
  open,
  disabled,
  errorMessage,
  helpText,
  required,
  onValueChange,
  onOpenChange,
  renderSheet,
}: NativeSelectProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const message = errorMessage ?? helpText;
  const valueLabel =
    options.find((option) => option.value === value)?.label ?? "선택하세요";
  const borderColor = focused
    ? theme.color.semantic.border.focus
    : errorMessage
      ? theme.color.semantic.status.negative.border
      : theme.color.semantic.border.strong;
  useEffect(() => {
    if (errorMessage)
      void AccessibilityInfo.announceForAccessibility(
        `${label}, ${errorMessage}`,
      );
  }, [errorMessage, label]);
  const effectiveOpen = open && !disabled;
  const token = useMemo(() => ({}), [effectiveOpen]);
  const activeSession = useRef<object | null>(null);
  useLayoutEffect(() => {
    activeSession.current = effectiveOpen ? token : null;
    return () => { activeSession.current = null; };
  }, [effectiveOpen, token]);
  useEffect(() => {
    if (disabled && open) onOpenChange(false);
  }, [disabled, open, onOpenChange]);
  const close = () => { if (activeSession.current === token) onOpenChange(false); };
  const select = (nextValue: string) => {
    if (!effectiveOpen || activeSession.current !== token) return;
    const option = options.find((candidate) => candidate.value === nextValue);
    if (!option || option.disabled) return;
    onValueChange(nextValue);
    close();
  };
  return (
    <View style={{ gap: 8 }}>
      <Text
        accessible={false}
        style={[
          theme.typography.role.label,
          { color: theme.color.semantic.fg.primary },
        ]}
      >
        {label}
        {required ? " (필수)" : ""}
      </Text>
      <Pressable
        accessibilityHint={
          helpText ? `선택 목록을 엽니다. ${helpText}` : "선택 목록을 엽니다"
        }
        accessibilityLabel={`${label}${required ? ", 필수" : ""}, ${valueLabel}`}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: effectiveOpen }}
        aria-invalid={Boolean(errorMessage)}
        disabled={disabled}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        onPress={() => onOpenChange(true)}
        style={{
          backgroundColor: theme.color.semantic.bg.canvas,
          borderColor,
          borderRadius: theme.foundation.radius.md,
          borderWidth: focused ? 2 : 1,
          justifyContent: "center",
          minHeight: 48,
          padding: 12,
        }}
      >
        <Text
          accessible={false}
          style={[
            theme.typography.role.body,
            { color: theme.color.semantic.fg.primary },
          ]}
        >
          {valueLabel}
        </Text>
      </Pressable>
      {message ? (
        <Text
          accessible={!errorMessage}
          style={[
            theme.typography.role.label,
            {
              color: errorMessage
                ? theme.color.semantic.status.negative.fg
                : theme.color.semantic.fg.secondary,
            },
          ]}
        >
          {message}
        </Text>
      ) : null}
      {effectiveOpen
        ? renderSheet({
            open: effectiveOpen,
            options,
            value,
            onSelect: select,
            onCancel: close,
          })
        : null}
    </View>
  );
}

export function NativeSearchField({
  label,
  value,
  onValueChange,
  onSearch,
  onSearchError,
  placeholder = "검색어를 입력하세요",
  disabled = false,
  loading = false,
}: SearchFieldContract) {
  assertSearchFieldContract({
    label,
    value,
    onValueChange,
    onSearch,
    onSearchError,
    placeholder,
    disabled,
    loading,
  });
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [pending, setPending] = useState(false);
  const actionLock = useRef(false);
  const inactive = disabled || loading || pending;
  const submit = async () => {
    if (inactive || actionLock.current || !value.trim()) return;
    actionLock.current = true;
    setPending(true);
    try {
      await onSearch(value.trim());
    } catch (error) {
      try {
        onSearchError(error);
      } catch {}
    } finally {
      actionLock.current = false;
      setPending(false);
    }
  };
  return (
    <View style={{ gap: 8 }}>
      <Text
        accessible={false}
        style={[
          theme.typography.role.label,
          { color: theme.color.semantic.fg.primary },
        ]}
      >
        {label}
      </Text>
      <View
        style={{
          alignItems: "center",
          backgroundColor: theme.color.semantic.bg.canvas,
          borderColor: focused
            ? theme.color.semantic.border.focus
            : theme.color.semantic.border.strong,
          borderRadius: theme.foundation.radius.md,
          borderWidth: focused ? 2 : 1,
          flexDirection: "row",
          minHeight: 48,
          paddingLeft: 12,
        }}
      >
        <TextInput
          accessibilityLabel={label}
          accessibilityState={{ busy: loading || pending, disabled: inactive }}
          editable={!inactive}
          onBlur={() => setFocused(false)}
          onChangeText={onValueChange}
          onFocus={() => setFocused(true)}
          onSubmitEditing={() => void submit()}
          placeholder={placeholder}
          placeholderTextColor={theme.color.semantic.fg.tertiary}
          returnKeyType="search"
          style={[
            theme.typography.role.body,
            { color: theme.color.semantic.fg.primary, flex: 1, minWidth: 0 },
          ]}
          value={value}
        />
        <Pressable
          accessibilityLabel="검색어 지우기"
          accessibilityRole="button"
          accessibilityState={{ disabled: inactive || !value }}
          disabled={inactive || !value}
          onPress={() => onValueChange("")}
          style={{
            justifyContent: "center",
            minHeight: 44,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={[
              theme.typography.role.label,
              { color: theme.color.semantic.fg.secondary },
            ]}
          >
            {value ? "지우기" : ""}
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel={loading || pending ? "검색 중" : "검색"}
          accessibilityRole="button"
          accessibilityState={{
            busy: loading || pending,
            disabled: inactive || !value.trim(),
          }}
          disabled={inactive || !value.trim()}
          onPress={() => void submit()}
          style={{
            justifyContent: "center",
            minHeight: 44,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={[
              theme.typography.role.label,
              {
                color: inactive
                  ? theme.color.semantic.fg.disabled
                  : theme.color.semantic.fg.primary,
              },
            ]}
          >
            {loading || pending ? "검색 중" : "검색"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function NativeSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  labels,
  valueLabel = String,
  showValue = false,
  onValueChange,
}: SliderContract) {
  assertSliderContract({
    label,
    value,
    min,
    max,
    step,
    disabled,
    labels,
    valueLabel,
    showValue,
    onValueChange,
  });
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const percent = (value - min) / (max - min);
  const renderedValue = valueLabel(value);
  const change = (next: number) => {
    if (!disabled) onValueChange(normalizeSliderValue(next, min, max, step));
  };
  const rangeHint = labels
    ? `범위 ${labels.min}${labels.mid ? `, 중간 ${labels.mid}` : ""}, ${labels.max}. 좌우로 밀거나 위아래로 쓸어 조절합니다.`
    : "좌우로 밀거나 위아래로 쓸어 조절합니다.";
  const changeAt = (locationX: number) => {
    if (width) change(min + (locationX / width) * (max - min));
  };
  return (
    <View style={{ gap: 4, maxWidth: 480, width: "100%" }}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          accessible={false}
          style={[
            theme.typography.role.label,
            { color: theme.color.semantic.fg.primary },
          ]}
        >
          {label}
        </Text>
        {showValue ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[
              theme.typography.role.label,
              {
                color: disabled
                  ? theme.color.semantic.fg.disabled
                  : theme.color.semantic.fg.secondary,
              },
            ]}
          >
            {renderedValue}
          </Text>
        ) : null}
      </View>
      <Pressable
        accessibilityActions={[
          { name: "increment", label: "값 늘리기" },
          { name: "decrement", label: "값 줄이기" },
        ]}
        accessibilityHint={rangeHint}
        accessibilityLabel={label}
        accessibilityRole="adjustable"
        accessibilityState={{ disabled }}
        accessibilityValue={{ max, min, now: value, text: renderedValue }}
        disabled={disabled}
        onAccessibilityAction={(event) =>
          change(
            value +
              (event.nativeEvent.actionName === "increment" ? step : -step),
          )
        }
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        onMoveShouldSetResponder={() => !disabled}
        onPress={(event) => changeAt(event.nativeEvent.locationX)}
        onResponderGrant={(event) => changeAt(event.nativeEvent.locationX)}
        onResponderMove={(event) => changeAt(event.nativeEvent.locationX)}
        onStartShouldSetResponder={() => !disabled}
        style={{
          justifyContent: "center",
          minHeight: 44,
          opacity: disabled ? 0.45 : 1,
        }}
      >
        <View
          accessible={false}
          style={{
            backgroundColor: theme.color.semantic.selection.trackOff,
            borderRadius: 999,
            height: 4,
            overflow: "visible",
          }}
        >
          <View
            style={{
              backgroundColor: theme.color.semantic.action.primary.bg,
              borderRadius: 999,
              height: 4,
              width: `${percent * 100}%`,
            }}
          />
          <View
            style={[
              theme.foundation.elevation["1"],
              {
                backgroundColor: theme.color.semantic.bg.raised,
                borderColor: theme.color.semantic.action.primary.bg,
                borderRadius: 12,
                borderWidth: 2,
                height: 24,
                left: `${percent * 100}%`,
                marginLeft: -12,
                marginTop: -14,
                position: "absolute",
                width: 24,
              },
            ]}
          />
        </View>
      </Pressable>
      {labels ? (
        <View
          accessible={false}
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Text
            style={[
              theme.typography.role.label,
              { color: theme.color.semantic.fg.secondary },
            ]}
          >
            {labels.min}
          </Text>
          {labels.mid ? (
            <Text
              style={[
                theme.typography.role.label,
                { color: theme.color.semantic.fg.secondary },
              ]}
            >
              {labels.mid}
            </Text>
          ) : null}
          <Text
            style={[
              theme.typography.role.label,
              { color: theme.color.semantic.fg.secondary },
            ]}
          >
            {labels.max}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export interface NativeDateTimePickerApi {
  open: boolean;
  kind: DateTimeFieldContract["kind"];
  value: string;
  min?: string;
  max?: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
}
export type NativeDateTimeFieldProps = DateTimeFieldContract & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatValue?: (value: string) => string;
  renderPicker: (api: NativeDateTimePickerApi) => ReactNode;
};
export function NativeDateTimeField({
  label,
  kind,
  value,
  onValueChange,
  min,
  max,
  disabled = false,
  required = false,
  helpText,
  errorMessage,
  open,
  onOpenChange,
  formatValue = (next) => next,
  renderPicker,
}: NativeDateTimeFieldProps) {
  assertDateTimeFieldContract({
    label,
    kind,
    value,
    onValueChange,
    min,
    max,
    disabled,
    required,
    helpText,
    errorMessage,
  });
  if (
    typeof open !== "boolean" ||
    typeof onOpenChange !== "function" ||
    typeof formatValue !== "function" ||
    typeof renderPicker !== "function"
  )
    throw new Error("NativeDateTimeField requires picker lifecycle callbacks.");
  const theme = useTheme();
  const message = errorMessage ?? helpText;
  const displayValue = value ? formatValue(value) : "선택하세요";
  const effectiveOpen = open && !disabled;
  const token = useMemo(() => ({}), [effectiveOpen]);
  const activeSession = useRef<object | null>(null);
  useLayoutEffect(() => {
    activeSession.current = effectiveOpen ? token : null;
    return () => { activeSession.current = null; };
  }, [effectiveOpen, token]);
  const select = (next: string) => {
    if (!effectiveOpen || activeSession.current !== token) return;
    assertDateTimeFieldContract({
      label,
      kind,
      value: next,
      onValueChange,
      min,
      max,
      disabled,
      required,
      helpText,
      errorMessage,
    });
    onValueChange(next);
    onOpenChange(false);
  };
  useEffect(() => {
    if (disabled && open) onOpenChange(false);
  }, [disabled, onOpenChange, open]);
  useEffect(() => {
    if (Platform.OS === "ios" && errorMessage)
      void AccessibilityInfo.announceForAccessibility(
        `${label}, ${errorMessage}`,
      );
  }, [errorMessage, label]);
  return (
    <View style={{ gap: 8 }}>
      <Text
        accessible={false}
        style={[
          theme.typography.role.label,
          { color: theme.color.semantic.fg.primary },
        ]}
      >
        {label}
        {required ? " (필수)" : ""}
      </Text>
      <Pressable
        accessibilityHint={
          helpText ? `선택기를 엽니다. ${helpText}` : "선택기를 엽니다"
        }
        accessibilityLabel={`${label}, ${displayValue}`}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: effectiveOpen }}
        disabled={disabled}
        onPress={() => onOpenChange(true)}
        style={{
          backgroundColor: theme.color.semantic.bg.canvas,
          borderColor: errorMessage
            ? theme.color.semantic.status.negative.border
            : theme.color.semantic.border.strong,
          borderRadius: theme.foundation.radius.md,
          borderWidth: 1,
          justifyContent: "center",
          minHeight: 48,
          padding: 12,
        }}
      >
        <Text
          accessible={false}
          style={[
            theme.typography.role.body,
            {
              color: value
                ? theme.color.semantic.fg.primary
                : theme.color.semantic.fg.tertiary,
            },
          ]}
        >
          {displayValue}
        </Text>
      </Pressable>
      {message ? (
        <Text
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
          {message}
        </Text>
      ) : null}
      {effectiveOpen
        ? renderPicker({
            open: effectiveOpen,
            kind,
            value,
            min,
            max,
            onSelect: select,
            onCancel: () => { if (activeSession.current === token) onOpenChange(false); },
          })
        : null}
    </View>
  );
}
