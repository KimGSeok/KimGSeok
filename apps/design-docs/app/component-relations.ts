import type { CatalogEntry } from "@kimgseok/design-catalog";

export function getRelatedComponentEntries(
  entry: CatalogEntry,
  entries: readonly CatalogEntry[],
  limit = 4,
) {
  return entries
    .filter(
      (candidate) =>
        candidate.slug !== entry.slug &&
        candidate.role === entry.role &&
        candidate.maturity === "stable",
    )
    .slice(0, limit);
}
