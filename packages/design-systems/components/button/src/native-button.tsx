import { useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { getNativeTheme, type ActionVariant, type NativePlatform } from '@kimgseok/design-tokens/native';
import { assertActionAreaContract, buttonSize, type ActionAreaContract, type ButtonSize, type SharedButtonProps } from './contracts';
import { NativeIcon } from '@kimgseok/design-icons/native';

export interface NativeButtonProps extends SharedButtonProps {
  mode?: 'light' | 'dark';
  accessibilityLabel?: string;
}

export function NativeButton({ children, variant = 'primary', size = 'md', loading = false, disabled = false, leadingIcon, trailingIcon, onAction, onActionError, mode, accessibilityLabel }: NativeButtonProps) {
  const systemMode = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = getNativeTheme(mode ?? systemMode, Platform.OS === 'android' ? 'android' : 'ios');
  const action = theme.color.semantic.action[variant as ActionVariant];
  const metrics = buttonSize[size as ButtonSize];
  const [pending, setPending] = useState(false);
  const inactive = loading || disabled || pending;
  const actionLock = useRef(false);
  async function activate() {
    if (inactive) return;
    if (actionLock.current) return;
    actionLock.current = true;
    setPending(true);
    try { await onAction?.(); } catch (error) { onActionError?.(error); } finally { actionLock.current = false; setPending(false); }
  }
  return <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" accessibilityState={{ busy: loading || pending, disabled: inactive }} disabled={inactive} onPress={activate} style={({ pressed }) => [styles.root, { backgroundColor: inactive ? action.bgDisabled : pressed ? action.bgPressed : action.bg, borderRadius: theme.foundation.radius.lg, maxWidth: '100%', minHeight: metrics.minHeight, minWidth: metrics.minHeight, paddingHorizontal: metrics.horizontalPadding }]}>
    {leadingIcon ? <NativeIcon color={inactive ? action.fgDisabled : action.fg} name={leadingIcon} size={20} /> : null}{loading || pending ? <ActivityIndicator accessibilityLabel="처리 중" color={action.fgDisabled} /> : null}<Text ellipsizeMode="tail" numberOfLines={1} style={[theme.typography.role.label, { color: inactive ? action.fgDisabled : action.fg, flexShrink: 1 }]}>{children}</Text>{!loading && !pending && trailingIcon ? <NativeIcon color={inactive ? action.fgDisabled : action.fg} name={trailingIcon} size={20} /> : null}
  </Pressable>;
}

export function NativeActionArea({ accessibilityLabel, primary, secondary, sticky = true }: ActionAreaContract) { assertActionAreaContract({ accessibilityLabel, primary, secondary, sticky }); const theme = getNativeTheme(useColorScheme() === 'dark' ? 'dark' : 'light', Platform.OS === 'android' ? 'android' : 'ios'); return <View accessibilityLabel={accessibilityLabel} style={{ backgroundColor: theme.color.semantic.bg.canvas, borderTopColor: theme.color.semantic.border.subtle, borderTopWidth: 1, flexDirection: 'row', gap: 8, padding: 16 }}>{secondary ? <View style={{ flex: 1 }}><NativeButton disabled={secondary.disabled} loading={secondary.loading} onAction={secondary.onAction} onActionError={secondary.onActionError} variant="secondary">{secondary.label}</NativeButton></View> : null}<View style={{ flex: 1 }}><NativeButton disabled={primary.disabled} loading={primary.loading} onAction={primary.onAction} onActionError={primary.onActionError}>{primary.label}</NativeButton></View></View>; }

const styles = StyleSheet.create({ root: { alignItems: 'center', flexDirection: 'row', gap: 8, justifyContent: 'center' } });
