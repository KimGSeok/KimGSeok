import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { catalog } from "../src/registry.ts";
const names = catalog.map(({ name }) => name);
assert.equal(new Set(names).size, names.length, "catalog component names must be unique");
for (const required of ["Tokens", "Icon", "Button", "TextField", "Calendar", "DatePicker", "DateRangePicker", "SearchField", "FilterBar", "ConfirmationDialog", "Table"]) assert.ok(names.includes(required), `${required} must be catalogued`);
assert.ok(catalog.every(({ slug, packageName, platforms }) => slug && packageName && platforms.length));
assert.ok(catalog.every(({ importPaths, authority, cataloguePresence, gap, packageName, platforms }) => (packageName === "consumer-owned" || platforms.every((platform) => importPaths[platform])) && authority && typeof cataloguePresence.toss === "boolean" && gap));
assert.equal(catalog.find(({ name }) => name === "Calendar")?.layer, "primitive");
assert.equal(catalog.find(({ name }) => name === "DatePicker")?.layer, "composite");
assert.equal(catalog.find(({ name }) => name === "DateRangePicker")?.tossAnalogue, "none");
assert.deepEqual(catalog.find(({ name }) => name === "Table")?.cataloguePresence, { toss: false, seed: true, montage: true });
assert.deepEqual(catalog.find(({ name }) => name === "ActionArea")?.cataloguePresence, { toss: true, seed: false, montage: true });
const primitiveWeb = readFileSync(new URL("../../primitives/src/web.tsx", import.meta.url), "utf8");
const feedbackWeb = readFileSync(new URL("../../feedback/src/web.tsx", import.meta.url), "utf8");
assert.match(primitiveWeb, /export function EmptyState/);
assert.doesNotMatch(feedbackWeb, /export function EmptyState/);
assert.equal(catalog.find(({ name }) => name === "EmptyState")?.packageName, "@kimgseok/design-primitives");
const webSources = [
  "../../button/src/web-button.tsx",
  "../../icons/src/web.tsx",
  "../../primitives/src/web.tsx",
  "../../forms/src/web.tsx",
  "../../feedback/src/web.tsx",
  "../../overlays/src/web.tsx",
  "../../navigation/src/web.tsx",
  "../../date-picker/src/web.tsx",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));
const publicWebFunctions = webSources.flatMap((source) => [...source.matchAll(/export function ([A-Za-z]+)/g)].map((match) => match[1])).sort();
const registeredWebFunctions = catalog.filter(({ maturity, packageName, platforms }) => maturity === "stable" && packageName !== "@kimgseok/design-tokens" && packageName !== "consumer-owned" && platforms.includes("web")).map(({ name }) => name).sort();
assert.deepEqual(registeredWebFunctions, publicWebFunctions, "every public Web component export must have exactly one registry entry");
const nativeSources = [
  "../../button/src/native-button.tsx",
  "../../icons/src/native.tsx",
  "../../primitives/src/native.tsx",
  "../../forms/src/native.tsx",
  "../../feedback/src/native.tsx",
  "../../overlays/src/native.tsx",
  "../../navigation/src/native.tsx",
  "../../date-picker/src/native.tsx",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));
const nativeAliases = { NativeToastHost: "ToastViewport" };
const publicNativeFunctions = nativeSources.flatMap((source) => [...source.matchAll(/export function (Native[A-Za-z]+)/g)].map((match) => nativeAliases[match[1]] ?? match[1].slice("Native".length))).sort();
const registeredNativeFunctions = catalog.filter(({ maturity, packageName, platforms }) => maturity === "stable" && packageName !== "@kimgseok/design-tokens" && packageName !== "consumer-owned" && platforms.includes("native")).map(({ name }) => name).sort();
assert.deepEqual(registeredNativeFunctions, publicNativeFunctions, "every public Native component export must have exactly one registry entry");
console.log(`catalog checks passed (${names.length} entries)`);
