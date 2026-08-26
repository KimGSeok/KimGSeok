import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  catalog,
  componentCategoryDefinitions,
  componentCategoryPolicy,
} from "@kimgseok/design-catalog";
import {
  componentNavigation,
  componentNavigationGroups,
  docsNavigation,
} from "../app/docs-navigation.ts";

assert.deepEqual(
  docsNavigation.map(({ label }) => label),
  ["소개", "시작하기", "파운데이션", "컴포넌트", "유틸리티", "마이그레이션"],
  "top-level documentation navigation order must remain stable",
);

const foundation = docsNavigation.find(({ label }) => label === "파운데이션");
assert.deepEqual(
  foundation?.children?.map(({ label }) => label),
  ["Colors", "Typography"],
  "foundation navigation must expose Colors and Typography",
);

const stableComponentEntries = catalog
  .filter(
    ({ layer, maturity, name }) =>
      maturity === "stable" && layer !== "pattern" && name !== "Tokens",
  );
const stableComponents = stableComponentEntries
  .map(({ name }) => name)
  .toSorted((left, right) => left.localeCompare(right, "en"));

assert.deepEqual(
  componentNavigation.map(({ label }) => label),
  stableComponents,
  "the all-components index must remain one flat A-Z projection of the registry",
);
assert.equal(
  new Set(componentNavigation.map(({ href }) => href)).size,
  componentNavigation.length,
  "component documentation URLs must be unique",
);

const componentSection = docsNavigation.find(({ label }) => label === "컴포넌트");
assert.equal(componentSection?.children, undefined, "component links must be rendered through groups");
assert.deepEqual(
  componentNavigationGroups.map(({ label }) => label),
  componentCategoryDefinitions.map(({ category }) => category),
  "component groups must follow the single registry-owned category order",
);
assert.deepEqual(
  componentSection?.groups,
  componentNavigationGroups,
  "the component navigation section must expose the generated groups",
);

const groupedNavigation = componentNavigationGroups.flatMap(({ children }) => children);
assert.deepEqual(
  groupedNavigation.map(({ label }) => label).toSorted((left, right) => left.localeCompare(right, "en")),
  stableComponents,
  "every documented component must appear in a group",
);
assert.equal(
  new Set(groupedNavigation.map(({ href }) => href)).size,
  stableComponents.length,
  "every documented component must appear in exactly one group",
);
for (const group of componentNavigationGroups) {
  assert.ok(group.children.length > 0, `${group.label} must not render as an empty group`);
  assert.ok(group.description.trim(), `${group.label} must explain its classification boundary`);
  for (const item of group.children) {
    const entry = stableComponentEntries.find(({ name }) => name === item.label);
    assert.equal(entry?.category, group.label, `${item.label} must render under its registry category`);
  }
}
assert.ok(componentCategoryPolicy.principle.trim(), "component category policy must state its basis");
assert.ok(componentCategoryPolicy.rules.length >= 3, "component category policy must define tie-break rules");

for (const implementationCategory of componentCategoryDefinitions.map(({ category }) => category)) {
  assert.ok(
    docsNavigation.every(({ label }) => label !== implementationCategory),
    `${implementationCategory} must not become a top-level documentation group`,
  );
}

for (const routeFile of [
  "../app/page.tsx",
  "../app/getting-started/page.tsx",
  "../app/foundation/page.tsx",
  "../app/foundation/colors/page.tsx",
  "../app/foundation/typography/page.tsx",
  "../app/components/page.tsx",
  "../app/utilities/page.tsx",
  "../app/migration/page.tsx",
]) {
  assert.ok(existsSync(new URL(routeFile, import.meta.url)), `${routeFile} must exist`);
}

const layoutSource = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const catalogSource = readFileSync(new URL("../app/components/page.tsx", import.meta.url), "utf8");
const globalStyles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

assert.match(layoutSource, /site-header-sidebar/, "header must preserve the sidebar alignment track");
assert.match(layoutSource, /site-header-main/, "header navigation must share the documentation content track");
assert.doesNotMatch(homeSource, /<br\s*\/>/, "home headings must wrap naturally");
assert.doesNotMatch(catalogSource, /<br\s*\/>/, "catalog headings must wrap naturally");
assert.match(globalStyles, /--docs-content-max:\s*960px/, "documentation pages must share a focused maximum width");
assert.match(globalStyles, /--docs-frame-max:\s*1280px/, "sidebar and content must share one centered page frame");
assert.match(globalStyles, /margin-inline:\s*auto/, "documentation content must center within the main rail");
assert.match(globalStyles, /var\(--kg-color-fg-link\)/, "text links must use a foreground semantic token");
assert.match(globalStyles, /var\(--kg-color-accent-default\)/, "decorative emphasis must use an accent semantic token");
assert.doesNotMatch(globalStyles, /grid-template-columns:\s*1fr auto 1fr/, "header must not use viewport-centered navigation");

console.log(`Design Docs IA checks passed (${componentNavigation.length} components in ${componentNavigationGroups.length} groups)`);
