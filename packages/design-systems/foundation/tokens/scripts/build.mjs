import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(await readFile(resolve(root, 'src/tokens.json'), 'utf8'));
const dist = resolve(root, 'dist');

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

const css = `/* Generated from src/tokens.json. Do not edit. */\n:root {\n${cssVariables('light')}\n}\n\n[data-theme="dark"] {\n${cssVariables('dark')}\n}\n`;
const native = `// Generated from src/tokens.json. Do not edit.\nexport const tokens = ${JSON.stringify(tokens, null, 2)};\nexport const nativeTheme = ${JSON.stringify(resolveNativeThemes(), null, 2)};\nexport function getNativeTheme(mode, platform) {\n  return nativeTheme[mode][platform];\n}\n`;
const nativeTypes = `// Generated from src/tokens.json. Do not edit.\nexport type ColorMode = 'light' | 'dark';\nexport type NativePlatform = 'ios' | 'android';\nexport type NativeFontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';\nexport type ActionVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';\nexport interface NativeElevation { shadowColor?: string; shadowOpacity?: number; shadowRadius?: number; shadowOffset?: { width: number; height: number }; elevation?: number; }\nexport interface NativeTheme { color: { palette: Record<string, unknown>; semantic: Record<string, any> }; typography: { family: string; weight: Record<string, number>; role: Record<string, { fontSize: number; lineHeight: number; fontWeight: NativeFontWeight; letterSpacing: number; fontFamily: string }> }; foundation: { elevation: Record<string, NativeElevation>; [key: string]: any }; }\nexport declare const tokens: Record<string, unknown>;\nexport declare const nativeTheme: Record<ColorMode, Record<NativePlatform, NativeTheme>>;\nexport declare function getNativeTheme(mode: ColorMode, platform: NativePlatform): NativeTheme;\n`;

function resolveTheme(theme) {
  return {
    color: { palette: tokens.color.palette, semantic: resolveObject(tokens.color.semantic[theme]) },
    typography: tokens.typography,
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
  return {
    ...resolved,
    typography: {
      ...resolved.typography,
      family: tokens.typography.family.native[platform] ?? tokens.typography.family.native.default,
      role: Object.fromEntries(Object.entries(resolved.typography.role).map(([name, role]) => [name, { ...role, fontFamily: tokens.typography.family.native[platform] ?? tokens.typography.family.native.default, fontWeight: String(role.fontWeight) }]))
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

function resolveObject(value) {
  if (typeof value !== 'object' || value === null) return resolveValue(value);
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, resolveObject(child)]));
}

await mkdir(resolve(dist, 'css'), { recursive: true });
await mkdir(resolve(dist, 'native'), { recursive: true });
await writeFile(resolve(dist, 'css/variables.css'), css);
await writeFile(resolve(dist, 'native/index.js'), native);
await writeFile(resolve(dist, 'native/index.d.ts'), nativeTypes);
await writeFile(resolve(dist, 'tokens.json'), `${JSON.stringify(tokens, null, 2)}\n`);
