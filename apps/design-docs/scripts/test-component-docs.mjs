import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { writeClipboardWithTimeout } from "../app/components/[slug]/clipboard.ts";

const repo = new URL("../../../", import.meta.url);
const docsSource = readFileSync(new URL("../app/component-docs.tsx", import.meta.url), "utf8");
const detailSource = readFileSync(new URL("../app/components/[slug]/ComponentDocumentation.tsx", import.meta.url), "utf8");
const showcaseSource = readFileSync(new URL("../app/components/[slug]/ComponentShowcase.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const examplePackage = JSON.parse(readFileSync(new URL("../../design-examples/package.json", import.meta.url), "utf8"));

for (const slug of ["text", "button", "text-field", "dialog", "tabs", "progress", "skeleton-region"]) {
  assert.match(docsSource, new RegExp(`(?:^|\\n)  ["']?${slug}["']?: \\{`), `${slug} must have a rich documentation contract`);
}

const examplePaths = [...docsSource.matchAll(/sourcePath: string|"(apps\/design-examples\/src\/[^"]+\.tsx)"/g)]
  .map((match) => match[1])
  .filter(Boolean);
const compositionNames = ["composition-list", "composition-form", "composition-detail"];
const compositionPage = readFileSync(new URL("../app/compositions/page.tsx", import.meta.url), "utf8");
for (const name of compositionNames) {
  assert.ok(compositionPage.includes(`@kimgseok/design-examples/${name}`));
  examplePaths.push(`apps/design-examples/src/${name}.tsx`);
}
assert.equal(new Set(examplePaths).size, examplePaths.length, "each example source must be unique");
for (const path of examplePaths) {
  assert.ok(existsSync(new URL(path, repo)), `${path} must exist`);
  const source = readFileSync(new URL(path, repo), "utf8");
  assert.match(source, /export default function/, `${path} must export one runnable example`);
  assert.match(source, /from "@kimgseok\/design-[^"]+\/web"|from "@kimgseok\/design-tokens\/colors"/, `${path} must consume a public design-system entrypoint`);
  assert.doesNotMatch(source, /packages\/design-systems|\.\.\/\.\.\/packages/, `${path} must not import package internals`);
}
assert.equal(Object.keys(examplePackage.exports).length, examplePaths.length, "every example must be an explicit package export");

for (const section of ["examples", "installation", "usage", "api-reference", "accessibility", "platforms"]) {
  assert.match(detailSource, new RegExp(`id=["']${section}["']`), `rich detail must expose ${section}`);
}
const decisionOrder = ["examples", "usage", "installation", "accessibility", "api-reference", "platforms"]
  .map((section) => detailSource.indexOf(`id="${section}"`));
assert.ok(decisionOrder.every((position) => position >= 0), "every decision-flow section must be present");
assert.ok(decisionOrder.every((position, index) => index === 0 || decisionOrder[index - 1] < position), "rich detail must present preview, judgment, adoption, and supporting detail in order");
assert.match(detailSource, /Native는 import와 타입 계약/, "Native evidence must not be presented as a live Web preview");
assert.doesNotMatch(detailSource, /entry\.maturity/, "default maturity must remain internal metadata");
assert.match(detailSource, /mobile-on-this-page/, "narrow screens must retain a reachable page outline");
assert.match(showcaseSource, /role="tablist"/);
assert.match(showcaseSource, /role="tabpanel"/);
assert.match(showcaseSource, /tabIndex=\{item\.id === selected\.id \? 0 : -1\}/, "example tabs must expose one roving tab stop");
assert.match(showcaseSource, /copyRequest\.current === request/, "stale clipboard results must not overwrite the current example status");
assert.match(showcaseSource, /writeClipboardWithTimeout\([^\n]+selected\.code\)/, "the visible source must be the copied source");
assert.match(showcaseSource, /aria-live="polite"/, "copy outcomes must be announced");
assert.match(showcaseSource, /copyStatus === "copying"/, "copy must expose and guard its pending state");
assert.match(showcaseSource, /role="group"/, "showcase controls must expose their accessible group name");
assert.match(styles, /\.on-this-page/);
assert.match(styles, /scroll-margin-top:\s*96px/, "section anchors must clear the sticky header");

let written = "";
await writeClipboardWithTimeout(async (text) => { written = text; }, "example");
assert.equal(written, "example", "clipboard helper must pass the exact visible source");
await assert.rejects(
  writeClipboardWithTimeout(async () => { throw new Error("denied"); }, "example"),
  /denied/,
  "clipboard failures must remain retryable errors",
);
await assert.rejects(
  writeClipboardWithTimeout(() => new Promise(() => {}), "example", 5),
  /timed out/,
  "a stalled clipboard boundary must time out",
);

for (const storyFile of ["Button", "Feedback", "Forms", "Navigation", "Overlays", "Primitives", "Compositions"]) {
  const source = readFileSync(new URL(`../../storybook/stories/${storyFile}.stories.tsx`, import.meta.url), "utf8");
  assert.match(source, /@kimgseok\/design-examples\//, `${storyFile} stories must reuse the Docs example source`);
}

console.log(`Component Docs checks passed (${examplePaths.length} shared examples including 3 product compositions)`);
