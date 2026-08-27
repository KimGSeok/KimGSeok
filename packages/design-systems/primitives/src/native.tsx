import { ActivityIndicator, Animated, Image, Platform, Pressable, Text as RNText, useColorScheme, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { getNativeTheme, type NativeTheme } from '@kimgseok/design-tokens/native';
import type { SharedIconButtonProps, SharedSurfaceProps, SharedTextProps, TextColorToken, TextRole, TitleTextStyle } from './contracts';
import { controlSize, textColorByTone, textStyleByRole } from './contracts';
import { NativeIcon } from '@kimgseok/design-icons/native';
import { assertBadgeContract, assertListItemContract, assertNativeCardContract, getListItemAccessibleName, type SharedBadgeProps, type SharedCardProps, type SharedListItemProps } from './contracts';
import { assertAvatarContract, avatarSize, getAvatarInitials, type SharedAvatarProps } from './contracts';
import { assertEmptyStateContract, type SharedEmptyStateProps } from './contracts';
import { assertSkeletonContract, type SharedSkeletonProps } from './contracts';
import { assertSkeletonRegionContract, getSkeletonRecipeCount, type SharedSkeletonRegionProps, type SkeletonRecipe } from './contracts';
import { motionDuration, useReducedMotion } from '@kimgseok/design-motion/native';
import { NativeButton } from '@kimgseok/design-button/native';

function useTheme(mode?: 'light' | 'dark') {
  const system = useColorScheme() === 'dark' ? 'dark' : 'light';
  return getNativeTheme(mode ?? system, Platform.OS === 'android' ? 'android' : 'ios');
}

function nativeTextColor(theme: NativeTheme, color: TextColorToken) {
  if (color.startsWith('fg-')) {
    const semanticName = color.slice(3).replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    return theme.color.semantic.fg[semanticName] as string;
  }
  const [family, step] = color.split('-');
  const palette = theme.color.palette[family];
  return typeof palette === 'string' ? palette : palette[step];
}

function NativeIconButtonLoadingIndicator({ color }: { color: string }) {
  const reduced = useReducedMotion();
  return reduced
    ? <View accessible={false} style={{ borderColor: color, borderRadius: 8, borderRightColor: 'transparent', borderWidth: 2, height: 16, width: 16 }} />
    : <ActivityIndicator accessible={false} color={color} size={16} />;
}

export type NativeTextProps = SharedTextProps & { mode?: 'light' | 'dark' };
export function NativeText({ children, textStyle, color, role, tone, numberOfLines, mode }: NativeTextProps) {
  const theme = useTheme(mode);
  const resolvedTextStyle = textStyle ?? textStyleByRole[role ?? 'body'];
  const resolvedColor = color ?? textColorByTone[tone ?? 'primary'];
  return <RNText numberOfLines={numberOfLines} style={[theme.typography.textStyle[resolvedTextStyle], { color: nativeTextColor(theme, resolvedColor) }]}>{children}</RNText>;
}

export type NativeHeadingProps = Omit<SharedTextProps, 'role' | 'textStyle'> & { role?: Extract<TextRole, 'display' | 'title' | 'heading'>; textStyle?: TitleTextStyle; mode?: 'light' | 'dark'; accessibilityRole?: 'header' | 'text' };
export function NativeHeading({ children, textStyle, color, role, tone, numberOfLines, mode, accessibilityRole = 'header' }: NativeHeadingProps) {
  const theme = useTheme(mode);
  const resolvedTextStyle = textStyle ?? textStyleByRole[role ?? 'heading'];
  const resolvedColor = color ?? textColorByTone[tone ?? 'primary'];
  return <RNText accessibilityRole={accessibilityRole} numberOfLines={numberOfLines} style={[theme.typography.textStyle[resolvedTextStyle], { color: nativeTextColor(theme, resolvedColor) }]}>{children}</RNText>;
}

export function NativeSurface({ children, level = 'surface', elevation, mode }: SharedSurfaceProps & { mode?: 'light' | 'dark' }) {
  const theme = useTheme(mode);
  const resolvedElevation = elevation ?? (level === 'raised' ? 1 : 0);
  return <View style={[{ backgroundColor: theme.color.semantic.bg[level], borderColor: theme.color.semantic.border.subtle, borderRadius: theme.foundation.radius.lg, borderWidth: 1, padding: theme.foundation.space[4] }, theme.foundation.elevation[String(resolvedElevation)]]}>{children}</View>;
}

export function NativeDivider({ mode }: { mode?: 'light' | 'dark' }) {
  const theme = useTheme(mode);
  return <View accessibilityElementsHidden accessible={false} importantForAccessibility="no-hide-descendants" style={{ backgroundColor: theme.color.semantic.border.strong, height: 1, width: '100%' }} />;
}

export function NativeIconButton({ accessibilityLabel, icon, variant = 'tertiary', size = 'md', disabled = false, loading = false, onAction, onActionError, mode }: SharedIconButtonProps & { mode?: 'light' | 'dark' }) {
  const theme = useTheme(mode);
  const palette = theme.color.semantic.action[variant];
  const inactive = disabled || loading;
  const actionLock = useRef(false);
  async function activate() { if (inactive || actionLock.current) return; actionLock.current = true; try { await onAction?.(); } catch (error) { onActionError?.(error); } finally { actionLock.current = false; } }
  return <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" accessibilityState={{ busy: loading, disabled: inactive }} disabled={inactive} onPress={activate} style={({ pressed }) => ({ alignItems: 'center', backgroundColor: inactive ? palette.bgDisabled : pressed ? palette.bgPressed : palette.bg, borderRadius: theme.foundation.radius.full, height: controlSize[size], justifyContent: 'center', width: controlSize[size] })}>{loading ? <NativeIconButtonLoadingIndicator color={palette.fgDisabled} /> : <NativeIcon color={inactive ? palette.fgDisabled : palette.fg} name={icon} size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />}</Pressable>;
}

export function NativeBadge({ label, tone = 'neutral', size = 'md', mode }: SharedBadgeProps & { mode?: 'light' | 'dark' }) { assertBadgeContract({ label, tone, size }); const theme = useTheme(mode); const status = tone === 'neutral' ? null : theme.color.semantic.status[tone]; return <View style={{ alignSelf: 'flex-start', backgroundColor: status?.bg ?? theme.color.semantic.bg.surface, borderColor: status?.border ?? theme.color.semantic.border.subtle, borderRadius: theme.foundation.radius.full, borderWidth: 1, maxWidth: '100%', paddingHorizontal: size === 'sm' ? 8 : 10, paddingVertical: size === 'sm' ? 2 : 4 }}><RNText ellipsizeMode="tail" numberOfLines={1} style={[size === 'sm' ? theme.typography.role.caption : theme.typography.role.label, { color: status?.fg ?? theme.color.semantic.fg.secondary, fontWeight: '600' }]}>{label}</RNText></View>; }

export function NativeCard({ children, variant = 'outlined', accessibilityLabel, mode }: Omit<SharedCardProps, 'accessibilityLabel'> & { accessibilityLabel?: never; mode?: 'light' | 'dark' }) { assertNativeCardContract({ children, variant, accessibilityLabel }); const theme = useTheme(mode); const raised = variant === 'raised'; return <View accessible={false} style={[{ backgroundColor: raised ? theme.color.semantic.bg.raised : theme.color.semantic.bg.surface, borderColor: theme.color.semantic.border.subtle, borderRadius: theme.foundation.radius.lg, borderWidth: 1, minWidth: 0, padding: theme.foundation.space[4], width: '100%' }, raised ? theme.foundation.elevation['1'] : theme.foundation.elevation['0']]}>{children}</View>; }

export function NativeListItem({ title, description, metadata, leadingIcon, trailing = 'none', action: itemAction, disabled = false, loading = false, mode }: SharedListItemProps & { mode?: 'light' | 'dark' }) { const props = { title, description, metadata, leadingIcon, trailing, action: itemAction, disabled, loading }; assertListItemContract(props); const theme = useTheme(mode); const interactive = itemAction !== undefined; const actionLock = useRef(false); const [pending, setPending] = useState(false); const inactive = disabled || loading || pending; const secondary = inactive ? theme.color.semantic.fg.disabled : theme.color.semantic.fg.secondary; async function activate() { if (!itemAction || inactive || actionLock.current) return; actionLock.current = true; setPending(true); try { await itemAction.onAction(); } catch (error) { try { itemAction.onActionError(error); } catch {} } finally { actionLock.current = false; setPending(false); } } const content = <><View accessible={false} style={{ alignItems: 'center', height: 24, justifyContent: 'center', width: 24 }}>{leadingIcon ? <NativeIcon color={secondary} name={leadingIcon} size={20} /> : null}</View><View accessible={false} style={{ flex: 1, gap: 2, minWidth: 0 }}><RNText numberOfLines={1} style={[theme.typography.role.body, { color: inactive ? theme.color.semantic.fg.disabled : theme.color.semantic.fg.primary }]}>{title}</RNText>{description ? <RNText numberOfLines={1} style={[theme.typography.role.caption, { color: secondary }]}>{description}</RNText> : null}</View>{pending || loading ? <RNText accessibilityElementsHidden={true} ellipsizeMode="tail" numberOfLines={1} style={[theme.typography.role.caption, { color: secondary, flexShrink: 1, maxWidth: '35%' }]}>처리 중</RNText> : metadata ? <RNText ellipsizeMode="tail" numberOfLines={1} style={[theme.typography.role.caption, { color: secondary, flexShrink: 1, maxWidth: '35%' }]}>{metadata}</RNText> : null}{trailing === 'chevron' ? <NativeIcon color={secondary} name="chevron-right" size={20} /> : null}</>; const style = ({ pressed }: { pressed: boolean }) => ({ alignItems: 'center' as const, backgroundColor: interactive && pressed && !inactive ? theme.color.semantic.bg.raised : theme.color.semantic.bg.surface, borderBottomColor: theme.color.semantic.border.subtle, borderBottomWidth: 1, flexDirection: 'row' as const, gap: theme.foundation.space[3], minHeight: 56, paddingHorizontal: theme.foundation.space[4], paddingVertical: theme.foundation.space[3], width: '100%' as const }); return interactive ? <Pressable accessibilityLabel={getListItemAccessibleName(props)} accessibilityRole="button" accessibilityState={{ busy: pending || loading, disabled: inactive }} disabled={inactive} onPress={activate} style={style}>{content}</Pressable> : <View accessible={false} style={style({ pressed: false })}>{content}</View>; }

export function NativeEmptyState({ title, description, icon, action, mode }: SharedEmptyStateProps & { mode?: 'light' | 'dark' }) { assertEmptyStateContract({ title, description, icon, action }); const theme = useTheme(mode); return <View accessible={false} style={{ alignItems: 'center', backgroundColor: theme.color.semantic.bg.surface, gap: theme.foundation.space[3], maxWidth: 480, padding: theme.foundation.space[6], width: '100%' }}><View accessible={false}>{icon ? <NativeIcon color={theme.color.semantic.fg.tertiary} name={icon} size={24} /> : null}</View><RNText accessibilityRole="header" style={[theme.typography.role.title, { alignSelf: 'stretch', color: theme.color.semantic.fg.primary, maxWidth: '100%', textAlign: 'center' }]}>{title}</RNText><RNText style={[theme.typography.role.body, { alignSelf: 'stretch', color: theme.color.semantic.fg.secondary, maxWidth: '100%', textAlign: 'center' }]}>{description}</RNText>{action ? <NativeButton mode={mode} onAction={action.onAction} onActionError={action.onActionError} size="sm" variant="secondary">{action.label}</NativeButton> : null}</View>; }

function NativeSkeleton({ shape = 'text', size = 'md', mode }: SharedSkeletonProps & { mode?: 'light' | 'dark' }) { assertSkeletonContract({ shape, size }); const theme = useTheme(mode); const reduced = useReducedMotion(); const opacity = useRef(new Animated.Value(1)).current; useEffect(() => { if (reduced) { opacity.setValue(1); return; } const halfCycle = motionDuration.skeletonPulse / 2; const pulse = Animated.loop(Animated.sequence([Animated.timing(opacity, { duration: halfCycle, toValue: 0.58, useNativeDriver: true }), Animated.timing(opacity, { duration: halfCycle, toValue: 1, useNativeDriver: true })])); pulse.start(); return () => pulse.stop(); }, [opacity, reduced]); const width = size === 'sm' ? 72 : size === 'md' ? 144 : size === 'lg' ? 240 : '100%'; const height = shape === 'text' ? size === 'sm' ? 12 : size === 'md' ? 16 : 20 : size === 'sm' ? 32 : size === 'md' ? 48 : 72; const circle = shape === 'circle'; return <Animated.View accessible={false} style={{ backgroundColor: theme.color.semantic.bg.raised, borderRadius: circle ? height / 2 : theme.foundation.radius.md, height, maxWidth: '100%', opacity, width: circle ? height : width }} />; }
function NativeSkeletonLines({ sizes = ['full', 'lg'], mode }: { sizes?: readonly SharedSkeletonProps['size'][]; mode?: 'light' | 'dark' }) { return <View accessible={false} style={{ gap: 8, minWidth: 0 }}>{sizes.map((size, index) => <NativeSkeleton key={`${size}-${index}`} mode={mode} size={size} />)}</View>; }
function NativeSkeletonRecipeGroup({ recipe, mode }: { recipe: SkeletonRecipe; mode?: 'light' | 'dark' }) { if (recipe === 'text-block') return <NativeSkeletonLines mode={mode} sizes={['full', 'full', 'lg']} />; if (recipe === 'list-item' || recipe === 'avatar-row') return <View accessible={false} style={{ alignItems: 'center', flexDirection: 'row', gap: 12, width: '100%' }}><NativeSkeleton mode={mode} shape="circle" size="md" /><View style={{ flex: 1, minWidth: 0 }}><NativeSkeletonLines mode={mode} sizes={recipe === 'list-item' ? ['lg', 'md'] : ['md', 'sm']} /></View></View>; if (recipe === 'card') return <View accessible={false} style={{ gap: 12, width: '100%' }}><NativeSkeleton mode={mode} shape="block" size="full" /><NativeSkeletonLines mode={mode} sizes={['lg', 'full', 'md']} /></View>; if (recipe === 'table-row') return <View accessible={false} style={{ flexDirection: 'row', gap: 12, width: '100%' }}><View style={{ flex: 1 }}><NativeSkeleton mode={mode} size="full" /></View><View style={{ flex: 1 }}><NativeSkeleton mode={mode} size="full" /></View><View style={{ flex: 1 }}><NativeSkeleton mode={mode} size="full" /></View></View>; return <View accessible={false} style={{ gap: 8, width: '100%' }}><NativeSkeleton mode={mode} size="sm" /><NativeSkeleton mode={mode} shape="block" size="full" /></View>; }
export function NativeSkeletonRegion({ accessibilityLabel, items, recipe, count, mode }: SharedSkeletonRegionProps & { mode?: 'light' | 'dark' }) { const props = { accessibilityLabel, items, recipe, count }; assertSkeletonRegionContract(props); return <View accessible accessibilityLabel={accessibilityLabel} accessibilityRole="summary" accessibilityState={{ busy: true }} style={{ gap: 16, width: '100%' }}>{items ? items.map((item, index) => <NativeSkeleton {...item} key={`${item.shape ?? 'text'}-${item.size ?? 'md'}-${index}`} mode={mode} />) : Array.from({ length: getSkeletonRecipeCount(recipe!, count) }, (_, index) => <NativeSkeletonRecipeGroup key={`${recipe}-${index}`} mode={mode} recipe={recipe!} />)}</View>; }

export function NativeAvatar({ name, sourceUri, size = 'md', accessibility, mode }: SharedAvatarProps & { mode?: 'light' | 'dark' }) { assertAvatarContract({ name, sourceUri, size, accessibility }); const theme = useTheme(mode); const [loadedSourceUri, setLoadedSourceUri] = useState<string>(); const loaded = sourceUri !== undefined && loadedSourceUri === sourceUri; const pixels = avatarSize[size]; const labelled = accessibility.kind === 'labelled'; return <View accessibilityElementsHidden={!labelled} accessibilityLabel={labelled ? accessibility.label : undefined} accessibilityRole={labelled ? 'image' : undefined} accessible={labelled} importantForAccessibility={labelled ? 'yes' : 'no-hide-descendants'} style={{ alignItems: 'center', backgroundColor: theme.color.semantic.bg.surface, borderColor: theme.color.semantic.border.subtle, borderRadius: pixels / 2, borderWidth: 1, height: pixels, justifyContent: 'center', overflow: 'hidden', width: pixels }}><RNText accessible={false} style={[theme.typography.role.label, { color: theme.color.semantic.fg.secondary, fontSize: size === 'sm' ? 12 : size === 'md' ? 14 : 18, fontWeight: '600' }]}>{getAvatarInitials(name)}</RNText>{sourceUri ? <Image accessible={false} onError={() => setLoadedSourceUri((current) => current === sourceUri ? undefined : current)} onLoad={() => setLoadedSourceUri(sourceUri)} source={{ uri: sourceUri }} style={{ height: '100%', left: 0, opacity: loaded ? 1 : 0, position: 'absolute', top: 0, width: '100%' }} /> : null}</View>; }
