import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  catalog,
  componentCategoryDefinitions,
  componentCategoryPolicy,
} from "../src/registry.ts";
const names = catalog.map(({ name }) => name);
assert.equal(new Set(names).size, names.length, "catalog component names must be unique");
const componentCategories = componentCategoryDefinitions.map(({ category }) => category);
assert.equal(new Set(componentCategories).size, componentCategories.length, "component category names must be unique");
assert.ok(componentCategoryDefinitions.every(({ description, examples }) => description.trim() && examples.length > 0), "every component category must define a boundary and examples");
assert.ok(componentCategoryPolicy.principle.trim() && componentCategoryPolicy.rules.length >= 3, "component category policy must define its basis and tie-break rules");
for (const entry of catalog.filter(({ layer, maturity, name }) => maturity === "stable" && layer !== "pattern" && name !== "Tokens")) {
  assert.ok(componentCategories.includes(entry.category), `${entry.name} must use one documented component category`);
}
for (const required of ["Tokens", "Icon", "Button", "TextField", "Calendar", "DatePicker", "DateRangePicker", "SearchField", "FilterBar", "ConfirmationDialog", "Table"]) assert.ok(names.includes(required), `${required} must be catalogued`);
assert.ok(catalog.every(({ slug, packageName, platforms }) => slug && packageName && platforms.length));
assert.ok(catalog.every(({ importPaths, sourcePaths, authority, cataloguePresence, gap, packageName, platforms }) => (packageName === "consumer-owned" || platforms.every((platform) => importPaths[platform] && sourcePaths[platform])) && authority && typeof cataloguePresence.toss === "boolean" && gap));
for (const entry of catalog) {
  for (const sourcePath of Object.values(entry.sourcePaths)) {
    assert.ok(
      existsSync(new URL(`../../../../${sourcePath}`, import.meta.url)),
      `${entry.name} sourcePath must resolve: ${sourcePath}`,
    );
  }
}
assert.ok(catalog.filter(({ maturity, packageName }) => maturity === "stable" && !["@kimgseok/design-tokens", "consumer-owned"].includes(packageName)).every(({ exportNames, platforms, storyId }) => platforms.every((platform) => exportNames[platform]) && storyId), "stable components must expose accurate export and story metadata");
assert.equal(catalog.find(({ name }) => name === "Calendar")?.layer, "primitive");
assert.equal(catalog.find(({ name }) => name === "DatePicker")?.layer, "composite");
assert.equal(catalog.find(({ name }) => name === "Calendar")?.category, "Forms & Inputs");
assert.equal(catalog.find(({ name }) => name === "DatePicker")?.category, "Forms & Inputs", "composition must not create a separate documentation group");
assert.equal(catalog.find(({ name }) => name === "Button")?.category, "Actions");
assert.equal(catalog.find(({ name }) => name === "ActionArea")?.category, "Actions", "primitive and composed components must share the role-based group");
assert.equal(catalog.find(({ name }) => name === "DateRangePicker")?.tossAnalogue, "none");
assert.deepEqual(catalog.find(({ name }) => name === "Table")?.cataloguePresence, { toss: false, seed: true, montage: true });
assert.deepEqual(catalog.find(({ name }) => name === "ActionArea")?.cataloguePresence, { toss: true, seed: false, montage: true });
const primitiveWeb = readFileSync(new URL("../../primitives/src/web.tsx", import.meta.url), "utf8");
const feedbackWeb = readFileSync(new URL("../../components/feedback/src/web.tsx", import.meta.url), "utf8");
assert.match(primitiveWeb, /export function EmptyState/);
assert.doesNotMatch(feedbackWeb, /export function EmptyState/);
assert.equal(catalog.find(({ name }) => name === "EmptyState")?.packageName, "@kimgseok/design-primitives");
assert.equal(catalog.find(({ name }) => name === "Button")?.exportNames.native, "NativeButton");
assert.equal(catalog.find(({ name }) => name === "ToastViewport")?.exportNames.native, "NativeToastHost");
const storySources = ["Button", "Primitives", "Forms", "Feedback", "Overlays", "Navigation"].map((name) => readFileSync(new URL(`../../../../apps/storybook/stories/${name}.stories.tsx`, import.meta.url), "utf8"));
const storyIds = new Set(storySources.flatMap((source) => {
  const title = source.match(/title:\s*["']([^"']+)["']/)?.[1];
  assert.ok(title, "every story file must expose a title");
  const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return [...source.matchAll(/export const ([A-Za-z0-9]+)/g)].map((match) => `${titleSlug}--${match[1].replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`);
}));
for (const entry of catalog.filter(({ storyId }) => storyId)) assert.ok(storyIds.has(entry.storyId), `${entry.name} storyId must resolve to an existing story`);
const webSources = [
  "../../components/button/src/web-button.tsx",
  "../../foundation/icons/src/web.tsx",
  "../../primitives/src/web.tsx",
  "../../components/forms/src/web.tsx",
  "../../components/feedback/src/web.tsx",
  "../../components/overlays/src/web.tsx",
  "../../components/navigation/src/web.tsx",
  "../../components/date-picker/src/web.tsx",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));
const publicWebFunctions = webSources.flatMap((source) => [...source.matchAll(/export function ([A-Za-z]+)/g)].map((match) => match[1])).sort();
const registeredWebFunctions = catalog.filter(({ maturity, packageName, platforms }) => maturity === "stable" && packageName !== "@kimgseok/design-tokens" && packageName !== "consumer-owned" && platforms.includes("web")).map(({ name }) => name).sort();
assert.deepEqual(registeredWebFunctions, publicWebFunctions, "every public Web component export must have exactly one registry entry");
const registeredWebExports = catalog.filter(({ maturity, packageName, platforms }) => maturity === "stable" && packageName !== "@kimgseok/design-tokens" && packageName !== "consumer-owned" && platforms.includes("web")).map(({ exportNames }) => exportNames.web).sort();
assert.deepEqual(registeredWebExports, publicWebFunctions, "catalog Web export names must match package exports");
const nativeSources = [
  "../../components/button/src/native-button.tsx",
  "../../foundation/icons/src/native.tsx",
  "../../primitives/src/native.tsx",
  "../../components/forms/src/native.tsx",
  "../../components/feedback/src/native.tsx",
  "../../components/overlays/src/native.tsx",
  "../../components/navigation/src/native.tsx",
  "../../components/date-picker/src/native.tsx",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));
const nativeAliases = { NativeToastHost: "ToastViewport" };
const publicNativeExports = nativeSources.flatMap((source) => [...source.matchAll(/export function (Native[A-Za-z]+)/g)].map((match) => match[1])).sort();
const publicNativeFunctions = publicNativeExports.map((name) => nativeAliases[name] ?? name.slice("Native".length)).sort();
const registeredNativeFunctions = catalog.filter(({ maturity, packageName, platforms }) => maturity === "stable" && packageName !== "@kimgseok/design-tokens" && packageName !== "consumer-owned" && platforms.includes("native")).map(({ name }) => name).sort();
assert.deepEqual(registeredNativeFunctions, publicNativeFunctions, "every public Native component export must have exactly one registry entry");
const registeredNativeExports = catalog.filter(({ maturity, packageName, platforms }) => maturity === "stable" && packageName !== "@kimgseok/design-tokens" && packageName !== "consumer-owned" && platforms.includes("native")).map(({ exportNames }) => exportNames.native).sort();
assert.deepEqual(registeredNativeExports, publicNativeExports, "catalog Native export names must match package exports");
console.log(`catalog checks passed (${names.length} entries)`);
