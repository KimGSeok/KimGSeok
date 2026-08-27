import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const tokens = JSON.parse(await readFile(resolve(root, 'src/tokens.json'), 'utf8'));
const css = await readFile(resolve(root, 'dist/css/variables.css'), 'utf8');
const native = await readFile(resolve(root, 'dist/native/index.js'), 'utf8');
const nativeModule = await import(new URL('../dist/native/index.js', import.meta.url));
const colorsModule = await import(new URL('../dist/colors/index.js', import.meta.url));
const typographyModule = await import(new URL('../dist/typography/index.js', import.meta.url));
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
  ['seven-step typography scale', JSON.stringify(Object.keys(tokens.typography.size)) === JSON.stringify(['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl']) && tokens.typography.size.xxs.fontSize === 10 && tokens.typography.size.xxl.lineHeight === 40],
  ['Pretendard weight contract', JSON.stringify(tokens.typography.weight) === JSON.stringify({ regular: 400, medium: 500, semibold: 600, bold: 700 })],
  ['CSS light token output', css.includes('--kg-color-bg-brand: #1b64da;')],
  ['CSS semantic emphasis output', css.includes('--kg-color-fg-link: #1b64da;') && css.includes('--kg-color-accent-default: #3182f6;')],
  ['CSS dark token output', css.includes('[data-theme="dark"]')],
  ['CSS composed typography inputs', css.includes('--kg-typography-size-l-font-size: 20px;') && css.includes('--kg-typography-weight-medium: 500;') && css.includes('--kg-typography-tracking-title-xxl: -0.6px;')],
  ['font-weight is unitless', css.includes('--kg-typography-role-label-font-weight: 600;') && !css.includes('font-weight: 600px')],
  ['typed color object output', colorsModule.colors.red500 === 'red-500' && colorsModule.colors.fgPrimary === 'fg-primary' && colorsModule.colors.fgLink === 'fg-link' && colorsModule.paletteEntries.some(({ token, value }) => token === 'red-500' && value === '#f04452')],
  ['typed text-style output', typographyModule.textStyles.includes('text-l-medium') && typographyModule.textStyles.includes('title-xxl-bold') && typographyModule.textStyles.length === 56],
  ['motion uses semantic recipes', css.includes('--kg-foundation-motion-fast: 120ms;') && css.includes('--kg-foundation-motion-duration-skeleton-pulse: 1600ms;') && css.includes('--kg-foundation-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);') && css.includes('--kg-foundation-motion-distance-overlay: 16px;')],
  ['Web elevation output', css.includes('--kg-foundation-elevation-2: 0 8px 20px rgba(0, 23, 51, 0.16);')],
  ['native platform adapter output', native.includes('export function getNativeTheme(mode, platform)') && native.includes('"android": "sans-serif"') && native.includes('"fontWeight": "600"') && native.includes('"fontFamily": "System"')],
  ['native composed text style', JSON.stringify(iosTheme.typography.textStyle['text-l-medium']) === JSON.stringify({ fontSize: 20, lineHeight: 28, fontFamily: 'System', fontWeight: '500', letterSpacing: 0 })],
  ['focus contract', tokens.foundation.focus.ringWidth === 3 && tokens.foundation.focus.ringOffset === 2],
  ...['light', 'dark'].flatMap((theme) => [
    ...['primary', 'secondary', 'tertiary', 'danger'].map((variant) => [`${theme} ${variant} base contrast`, contrast(...actionPair(theme, variant)) >= 4.5]),
    ...['primary', 'secondary', 'tertiary', 'danger'].flatMap((variant) => ['bgHover', 'bgPressed'].map((state) => [`${theme} ${variant} ${state} contrast`, actionContrast(theme, variant, state) >= 4.5])),
    ...['positive', 'caution', 'negative', 'info'].map((status) => [`${theme} ${status} status contrast`, contrast(...statusPair(theme, status)) >= 4.5]),
    [`${theme} brand pair contrast`, contrast(resolveValue(tokens.color.semantic[theme].bg.brand), resolveValue(tokens.color.semantic[theme].fg.onBrand)) >= 4.5],
    [`${theme} focus on canvas contrast`, contrast(resolveValue(tokens.color.semantic[theme].border.focus), resolveValue(tokens.color.semantic[theme].bg.canvas)) >= 3],
    [`${theme} focus on raised contrast`, contrast(resolveValue(tokens.color.semantic[theme].border.focus), resolveValue(tokens.color.semantic[theme].bg.raised)) >= 3],
    [`${theme} link on canvas contrast`, contrast(resolveValue(tokens.color.semantic[theme].fg.link), resolveValue(tokens.color.semantic[theme].bg.canvas)) >= 4.5],
    [`${theme} selected control contrast`, contrast(resolveValue(tokens.color.semantic[theme].selection.selectedBg), resolveValue(tokens.color.semantic[theme].selection.selectedFg)) >= 4.5]
  ]),
  ['iOS elevation adapter', iosElevation.shadowOffset?.width === 0 && iosElevation.shadowOffset?.height === 4 && !('shadowOffsetY' in iosElevation)]
  ,['Android platform adapter', androidTheme.typography.family === 'sans-serif' && androidTheme.foundation.elevation['1'].elevation === 2]
];

const failed = required.filter(([, result]) => !result).map(([name]) => name);
if (failed.length) throw new Error(`Token contract failed: ${failed.join(', ')}`);
