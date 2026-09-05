import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [homePage, homeSearch, componentPreview, globals] = await Promise.all([
  readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/HomeSearch.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/ComponentPreview.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
]);

assert.match(homePage, /<HomeSearch\s*\/>/);
assert.doesNotMatch(homePage, /<(?:form|input|button)\b/);

assert.match(homeSearch, /@kimgseok\/design-forms\/web/);
assert.match(homeSearch, /<SearchField\b/);
assert.match(
  homeSearch,
  /router\.push\(`\/components\?q=\$\{encodeURIComponent\(value\)\}`\)/,
);

assert.match(componentPreview, /textStyle="title-l-semibold"/);
assert.match(componentPreview, /textStyle="text-s-regular"/);
assert.match(componentPreview, /size="sm"/);

const requiredDensityContracts = [
  "--docs-type-page-title-size: 28px;",
  "--docs-type-page-title-line-height: 36px;",
  "--docs-type-section-title-size: 20px;",
  "--docs-type-section-title-line-height: 28px;",
  "--docs-type-card-title-size: 18px;",
  "--docs-type-card-title-line-height: 26px;",
  "--docs-type-body-size: 15px;",
  "--docs-type-body-line-height: 22px;",
  "--docs-type-nav-size: 13px;",
  "--docs-type-nav-line-height: 20px;",
  "--docs-control-height: 44px;",
  "--kg-foundation-focus-ring-width: 2px;",
];

for (const contract of requiredDensityContracts) {
  assert.ok(globals.includes(contract), `Missing docs density contract: ${contract}`);
}

assert.doesNotMatch(globals, /font-weight:\s*700\b/);
assert.doesNotMatch(globals, /min-height:\s*52px\b/);
assert.doesNotMatch(globals, /\.preview-heading h2\s*\{[^}]*margin-top:/s);
assert.match(globals, /text-wrap:\s*pretty;/);
assert.match(globals, /word-break:\s*keep-all;/);

console.log("Design Docs density contract checks passed.");
