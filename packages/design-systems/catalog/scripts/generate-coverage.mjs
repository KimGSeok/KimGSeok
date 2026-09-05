import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { catalog, catalogMaturityPolicy, selectionClassDefinitions } from "../src/registry.ts";

const target = new URL("../../../../docs/goal-loop/coverage-matrix.md", import.meta.url);
const publicComponents = catalog.filter(
  ({ layer, maturity, name }) => maturity === "stable" && layer !== "pattern" && name !== "Tokens",
);
const shared = publicComponents.filter(({ platforms }) => platforms.length === 2);
const webOnly = publicComponents.filter(
  ({ platforms }) => platforms.length === 1 && platforms[0] === "web",
);
const roleCounts = Object.entries(
  publicComponents.reduce((counts, entry) => {
    if (entry.role) counts[entry.role] = (counts[entry.role] ?? 0) + 1;
    return counts;
  }, {}),
).map(([role, count]) => `${role} ${count}`).join(", ");
const label = (value) => value.slice(0, 1).toUpperCase() + value.slice(1);
const selectionCounts = Object.entries(
  catalog.reduce((counts, entry) => {
    counts[entry.selectionClass] = (counts[entry.selectionClass] ?? 0) + 1;
    return counts;
  }, {}),
).map(([selectionClass, count]) => `${label(selectionClass)} ${count}`).join(", ");
const references = ({ toss, seed, montage }) =>
  [toss, seed, montage].map((present) => present ? "Y" : "N").join("/");
const rows = catalog.map((entry) =>
  `| ${entry.name} | ${label(entry.entryKind)} | ${entry.role ?? "—"} | ${label(entry.selectionClass)} | ${entry.selectionRationale} | ${label(entry.layer)} | ${label(entry.maturity)} | ${entry.platforms.map(label).join(" + ")} | ${references(entry.cataloguePresence)} | \`${entry.packageName}\` |`,
).join("\n");
const selectionDefinitions = selectionClassDefinitions.map(
  ({ selectionClass, description }) => `- **${label(selectionClass)}:** ${description}`,
).join("\n");

const output = `# Catalog Classification Matrix

> Generated from \`packages/design-systems/catalog/src/registry.ts\` by
> \`pnpm --filter @kimgseok/design-catalog generate:coverage\`. Do not edit the
> inventory rows by hand.

## Measured inventory

- ${catalog.length} catalogue entries: ${publicComponents.length} stable public UI components,
  one foundation-only Tokens entry, and one consumer-owned Candidate pattern.
- ${shared.length} shared Web + Native components; ${webOnly.length} Web-only components:
  ${webOnly.map(({ name }) => name).join(", ")}.
- User-role totals: ${roleCounts}.
- Selection-class totals: ${selectionCounts}.
- Tokens is the single non-UI Foundation entry; SearchFilter is the single
  consumer-owned Pattern entry. Their user role is deliberately empty.
- Assessment is deliberately absent from this table. It is current-snapshot
  evidence recorded in \`evaluate.md\`, not a permanent catalogue fact.

## Independent classification axes

- **Role:** the primary job a user completes with the component.
- **Entry kind:** whether the row is a Foundation fact, a public UI component,
  or a consumer-owned Pattern.
- **Layer:** implementation/composition structure. It does not determine the Docs group.
- **Selection class:** why the system carries the item.
- **Maturity:** ${catalogMaturityPolicy.principle}
- **Platform:** where a maintained public implementation exists.

${selectionDefinitions}

## Entries

\`T/S/M\` records public catalogue presence in Toss TDS, Daangn SEED, and
Wanted Montage. Presence narrows the inventory; it does not make those systems
equal visual or behavioural authorities.

| Entry | Entry kind | User role | Selection class | Selection evidence | Layer | Release maturity | Platform | T/S/M | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows}

## Verification boundary

- The catalogue test requires every public Web and Native function export to
  have exactly one row with a real source path and Storybook owner.
- Static Web/Native wiring does not prove browser, device, or physical
  screen-reader behaviour. Missing runtime evidence remains \`UNVERIFIED\` in
  the assessment ledger.
`;

if (process.argv.includes("--check")) {
  assert.equal(readFileSync(target, "utf8"), output, "coverage matrix is stale; run generate:coverage");
  console.log(`coverage matrix checks passed (${catalog.length} entries)`);
} else {
  writeFileSync(target, output);
  console.log(`coverage matrix generated (${catalog.length} entries)`);
}
