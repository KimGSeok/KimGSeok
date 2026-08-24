import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const tokens = JSON.parse(await readFile(resolve(root, 'src/tokens.json'), 'utf8'));
const css = await readFile(resolve(root, 'dist/css/variables.css'), 'utf8');
const native = await readFile(resolve(root, 'dist/native/index.js'), 'utf8');
const nativeModule = await import(new URL('../dist/native/index.js', import.meta.url));
const iosTheme = nativeModule.getNativeTheme('light', 'ios');
const androidTheme = nativeModule.getNativeTheme('light', 'android');
const iosElevation = iosTheme.foundation.elevation['2'];

function getAtPath(path) {
  return path.split('.').reduce((value, key) => value[key], tokens);
}

function resolveValue(value) {
  if (typeof value !== 'string') return value;
  const match = value.match(/^\{(.+)\}$/);
  return match ? resolveValue(getAtPath(match[1])) : value;
}

function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((value) => Number.parseInt(value, 16) / 255);
  return channels.map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

function contrast(first, second) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

function actionPair(theme, variant) {
  const action = tokens.color.semantic[theme].action[variant];
  const background = resolveValue(action.bg);
  return [background === 'transparent' ? resolveValue(tokens.color.semantic[theme].bg.canvas) : background, resolveValue(action.fg)];
}

function statusPair(theme, status) {
  const value = tokens.color.semantic[theme].status[status];
  return [resolveValue(value.bg), resolveValue(value.fg)];
}

function actionContrast(theme, variant, state) {
  const action = tokens.color.semantic[theme].action[variant];
  return contrast(resolveValue(action[state]), resolveValue(action.fg));
}

const required = [
  ['Toss blue500 baseline', tokens.color.palette.blue['500'] === '#3182f6'],
  ['light semantic brand', tokens.color.semantic.light.bg.brand === '{color.palette.blue.700}'],
  ['dark semantic focus', tokens.color.semantic.dark.border.focus === '{color.palette.blue.200}'],
  ['minimum touch target', tokens.foundation.target.minTouch >= 44],
  ['CSS light token output', css.includes('--kg-color-bg-brand: #1b64da;')],
  ['CSS dark token output', css.includes('[data-theme="dark"]')],
  ['font-weight is unitless', css.includes('--kg-typography-role-label-font-weight: 600;') && !css.includes('font-weight: 600px')],
  ['motion uses milliseconds', css.includes('--kg-foundation-motion-fast: 120ms;')],
  ['Web elevation output', css.includes('--kg-foundation-elevation-2: 0 8px 20px rgba(0, 23, 51, 0.16);')],
  ['native platform adapter output', native.includes('export function getNativeTheme(mode, platform)') && native.includes('"android": "sans-serif"') && native.includes('"fontWeight": "600"') && native.includes('"fontFamily": "System"')],
  ['focus contract', tokens.foundation.focus.ringWidth === 3 && tokens.foundation.focus.ringOffset === 2],
  ...['light', 'dark'].flatMap((theme) => [
    ...['primary', 'secondary', 'tertiary', 'danger'].map((variant) => [`${theme} ${variant} base contrast`, contrast(...actionPair(theme, variant)) >= 4.5]),
    ...['primary', 'secondary', 'tertiary', 'danger'].flatMap((variant) => ['bgHover', 'bgPressed'].map((state) => [`${theme} ${variant} ${state} contrast`, actionContrast(theme, variant, state) >= 4.5])),
    ...['positive', 'caution', 'negative', 'info'].map((status) => [`${theme} ${status} status contrast`, contrast(...statusPair(theme, status)) >= 4.5]),
    [`${theme} brand pair contrast`, contrast(resolveValue(tokens.color.semantic[theme].bg.brand), resolveValue(tokens.color.semantic[theme].fg.onBrand)) >= 4.5],
    [`${theme} focus on canvas contrast`, contrast(resolveValue(tokens.color.semantic[theme].border.focus), resolveValue(tokens.color.semantic[theme].bg.canvas)) >= 3],
    [`${theme} focus on raised contrast`, contrast(resolveValue(tokens.color.semantic[theme].border.focus), resolveValue(tokens.color.semantic[theme].bg.raised)) >= 3]
    ,[` ${theme} selected control contrast`, contrast(resolveValue(tokens.color.semantic[theme].selection.selectedBg), resolveValue(tokens.color.semantic[theme].selection.selectedFg)) >= 4.5]
  ]),
  ['iOS elevation adapter', iosElevation.shadowOffset?.width === 0 && iosElevation.shadowOffset?.height === 4 && !('shadowOffsetY' in iosElevation)]
  ,['Android platform adapter', androidTheme.typography.family === 'sans-serif' && androidTheme.foundation.elevation['1'].elevation === 2]
];

const failed = required.filter(([, result]) => !result).map(([name]) => name);
if (failed.length) throw new Error(`Token contract failed: ${failed.join(', ')}`);
