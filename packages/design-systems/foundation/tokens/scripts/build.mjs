import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(await readFile(resolve(root, 'src/tokens.json'), 'utf8'));
const dist = resolve(root, 'dist');
const textSizes = Object.keys(tokens.typography.size);
const textWeights = Object.keys(tokens.typography.weight);
const textStyleKinds = Object.keys(tokens.typography.tracking);
const textStyles = textStyleKinds.flatMap((kind) => textSizes.flatMap((size) => textWeights.map((weight) => `${kind}-${size}-${weight}`)));
const paletteEntries = Object.entries(tokens.color.palette).flatMap(([family, value]) => typeof value === 'string'
  ? [{ token: family, value }]
  : Object.entries(value).map(([step, hex]) => ({ token: `${family}-${step}`, value: hex })));
const paletteColorTokens = paletteEntries.map(({ token }) => token);
const semanticTextColorTokens = Object.keys(tokens.color.semantic.light.fg).map((name) => `fg-${toKebab(name)}`);
const textColorTokens = [...semanticTextColorTokens, ...paletteColorTokens];
const colors = Object.fromEntries(textColorTokens.map((token) => [toCamel(token), token]));

function getAtPath(path) {
  return path.split('.').reduce((value, key) => value[key], tokens);
}

function resolveValue(value) {
  if (typeof value !== 'string') return value;
  const match = value.match(/^\{(.+)\}$/);
  return match ? resolveValue(getAtPath(match[1])) : value;
}

function flatten(value, prefix = []) {
  if (typeof value !== 'object' || value === null) return [[prefix.join('-'), resolveValue(value)]];
  return Object.entries(value).flatMap(([key, child]) => flatten(child, [...prefix, key]));
}

function serializeCss(name, value) {
  if (typeof value !== 'number') return value;
  if (name.includes('typography-weight') || name.endsWith('fontWeight')) return String(value);
  if (name.includes('foundation-motion-distance')) return `${value}px`;
  if (name.includes('foundation-motion')) return `${value}ms`;
  return `${value}px`;
}

function cssVariables(theme) {
  const lines = [
    ...flatten(tokens.color.palette, ['color', 'palette']),
    ...flatten(tokens.color.semantic[theme], ['color']),
    ...flatten(tokens.typography, ['typography']),
    ...flatten(tokens.foundation.space, ['foundation', 'space']),
    ...flatten(tokens.foundation.radius, ['foundation', 'radius']),
    ...flatten(tokens.foundation.motion, ['foundation', 'motion']),
    ...flatten(tokens.foundation.target, ['foundation', 'target']),
    ...flatten(tokens.foundation.focus, ['foundation', 'focus'])
  ].filter(([name]) => !name.startsWith('typography-family-native'))
    .map(([name, value]) => `  --kg-${toKebab(name)}: ${serializeCss(name, value)};`);
  lines.push(`  --kg-foundation-elevation-0: ${tokens.foundation.elevation['0'].web};`);
  lines.push(`  --kg-foundation-elevation-1: ${tokens.foundation.elevation['1'].web};`);
  lines.push(`  --kg-foundation-elevation-2: ${tokens.foundation.elevation['2'].web};`);
  return lines.join('\n');
}

function toKebab(name) {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function toCamel(name) {
  return name.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}

function readonlyTuple(values) {
  return `readonly [${values.map((value) => JSON.stringify(value)).join(', ')}]`;
}

const css = `/* Generated from src/tokens.json. Do not edit. */\n:root {\n${cssVariables('light')}\n}\n\n[data-theme="dark"] {\n${cssVariables('dark')}\n}\n`;
const native = `// Generated from src/tokens.json. Do not edit.\nexport const tokens = ${JSON.stringify(tokens, null, 2)};\nexport const nativeTheme = ${JSON.stringify(resolveNativeThemes(), null, 2)};\nexport function getNativeTheme(mode, platform) {\n  return nativeTheme[mode][platform];\n}\n`;
const nativeTypes = `// Generated from src/tokens.json. Do not edit.\nexport type ColorMode = 'light' | 'dark';\nexport type NativePlatform = 'ios' | 'android';\nexport type NativeFontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';\nexport type ActionVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';\nexport interface NativeElevation { shadowColor?: string; shadowOpacity?: number; shadowRadius?: number; shadowOffset?: { width: number; height: number }; elevation?: number; }\nexport interface NativeTextStyle { fontSize: number; lineHeight: number; fontWeight: NativeFontWeight; letterSpacing: number; fontFamily: string; }\nexport interface NativeTheme { color: { palette: Record<string, string | Record<string, string>>; semantic: Record<string, any> }; typography: { family: string; size: Record<string, { fontSize: number; lineHeight: number }>; weight: Record<string, number>; tracking: Record<string, Record<string, number>>; role: Record<string, NativeTextStyle>; textStyle: Record<string, NativeTextStyle> }; foundation: { elevation: Record<string, NativeElevation>; [key: string]: any }; }\nexport declare const tokens: Record<string, unknown>;\nexport declare const nativeTheme: Record<ColorMode, Record<NativePlatform, NativeTheme>>;\nexport declare function getNativeTheme(mode: ColorMode, platform: NativePlatform): NativeTheme;\n`;
const colorsModule = `// Generated from src/tokens.json. Do not edit.\nexport const colors = Object.freeze(${JSON.stringify(colors, null, 2)});\nexport const paletteEntries = Object.freeze(${JSON.stringify(paletteEntries, null, 2)});\nexport const semanticTextColors = Object.freeze(${JSON.stringify(semanticTextColorTokens)});\n`;
const colorsTypes = [
  '// Generated from src/tokens.json. Do not edit.',
  `export type PaletteColorToken = ${paletteColorTokens.map(JSON.stringify).join(' | ')};`,
  `export type SemanticTextColorToken = ${semanticTextColorTokens.map(JSON.stringify).join(' | ')};`,
  'export type TextColorToken = SemanticTextColorToken | PaletteColorToken;',
  'export declare const colors: {',
  ...Object.entries(colors).map(([name, token]) => `  readonly ${name}: ${JSON.stringify(token)};`),
  '};',
  'export interface PaletteEntry { readonly token: PaletteColorToken; readonly value: string; }',
  'export declare const paletteEntries: readonly PaletteEntry[];',
  `export declare const semanticTextColors: ${readonlyTuple(semanticTextColorTokens)};`,
  ''
].join('\n');
const typographyModule = `// Generated from src/tokens.json. Do not edit.\nexport const textSizes = Object.freeze(${JSON.stringify(textSizes)});\nexport const textWeights = Object.freeze(${JSON.stringify(textWeights)});\nexport const textStyleKinds = Object.freeze(${JSON.stringify(textStyleKinds)});\nexport const textStyles = Object.freeze(${JSON.stringify(textStyles)});\nexport const typographyScale = Object.freeze(${JSON.stringify({ sizes: tokens.typography.size, weights: tokens.typography.weight, tracking: tokens.typography.tracking }, null, 2)});\n`;
const typographyTypes = [
  '// Generated from src/tokens.json. Do not edit.',
  `export declare const textSizes: ${readonlyTuple(textSizes)};`,
  `export declare const textWeights: ${readonlyTuple(textWeights)};`,
  `export declare const textStyleKinds: ${readonlyTuple(textStyleKinds)};`,
  'export type TextSize = typeof textSizes[number];',
  'export type TextWeight = typeof textWeights[number];',
  'export type TextStyleKind = typeof textStyleKinds[number];',
  'export type TextStyle = `${TextStyleKind}-${TextSize}-${TextWeight}`;',
  'export type TitleTextStyle = `title-${TextSize}-${TextWeight}`;',
  'export type BodyTextStyle = `text-${TextSize}-${TextWeight}`;',
  'export declare const textStyles: readonly TextStyle[];',
  'export interface TypographySize { readonly fontSize: number; readonly lineHeight: number; }',
  'export declare const typographyScale: { readonly sizes: Readonly<Record<TextSize, TypographySize>>; readonly weights: Readonly<Record<TextWeight, number>>; readonly tracking: Readonly<Record<TextStyleKind, Readonly<Record<TextSize, number>>>>; };',
  ''
].join('\n');

function resolveTheme(theme) {
  return {
    color: { palette: tokens.color.palette, semantic: resolveObject(tokens.color.semantic[theme]) },
    typography: resolveObject(tokens.typography),
    foundation: tokens.foundation
  };
}

function resolveNativeThemes() {
  return Object.fromEntries(['light', 'dark'].map((mode) => [mode, Object.fromEntries(
    ['ios', 'android'].map((platform) => [platform, resolveNativeTheme(mode, platform)])
  )]));
}

function resolveNativeTheme(mode, platform) {
  const resolved = resolveTheme(mode);
  const fontFamily = tokens.typography.family.native[platform] ?? tokens.typography.family.native.default;
  return {
    ...resolved,
    typography: {
      ...resolved.typography,
      family: fontFamily,
      role: Object.fromEntries(Object.entries(resolved.typography.role).map(([name, role]) => [name, { ...role, fontFamily, fontWeight: String(role.fontWeight) }])),
      textStyle: resolveNativeTextStyles(resolved.typography, fontFamily)
    },
    foundation: {
      ...resolved.foundation,
      elevation: Object.fromEntries(Object.entries(tokens.foundation.elevation).map(([level, value]) => [level, {
        ...(platform === 'ios'
          ? { shadowColor: value.ios.shadowColor, shadowOpacity: value.ios.shadowOpacity, shadowRadius: value.ios.shadowRadius, shadowOffset: { width: 0, height: value.ios.shadowOffsetY } }
          : value[platform])
      }]))
    }
  };
}

function resolveNativeTextStyles(typography, fontFamily) {
  return Object.fromEntries(textStyles.map((textStyle) => {
    const [kind, size, weight] = textStyle.split('-');
    return [textStyle, {
      ...typography.size[size],
      fontFamily,
      fontWeight: String(typography.weight[weight]),
      letterSpacing: typography.tracking[kind][size]
    }];
  }));
}

function resolveObject(value) {
  if (typeof value !== 'object' || value === null) return resolveValue(value);
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, resolveObject(child)]));
}

await mkdir(resolve(dist, 'css'), { recursive: true });
await mkdir(resolve(dist, 'native'), { recursive: true });
await mkdir(resolve(dist, 'colors'), { recursive: true });
await mkdir(resolve(dist, 'typography'), { recursive: true });
await writeFile(resolve(dist, 'css/variables.css'), css);
await writeFile(resolve(dist, 'native/index.js'), native);
await writeFile(resolve(dist, 'native/index.d.ts'), nativeTypes);
await writeFile(resolve(dist, 'colors/index.js'), colorsModule);
await writeFile(resolve(dist, 'colors/index.d.ts'), colorsTypes);
await writeFile(resolve(dist, 'typography/index.js'), typographyModule);
await writeFile(resolve(dist, 'typography/index.d.ts'), typographyTypes);
await writeFile(resolve(dist, 'tokens.json'), `${JSON.stringify(tokens, null, 2)}\n`);
