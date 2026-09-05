import {
  catalog,
  componentCategoryDefinitions,
  type CatalogEntry,
} from "@kimgseok/design-catalog";

export interface DocsNavigationGroup {
  readonly label: string;
  readonly description: string;
  readonly children: readonly DocsNavigationItem[];
}

export interface DocsNavigationItem {
  readonly href: string;
  readonly label: string;
  readonly children?: readonly DocsNavigationItem[];
  readonly groups?: readonly DocsNavigationGroup[];
}

export const documentedComponents: readonly CatalogEntry[] = catalog.filter(
  ({ layer, maturity, name }) =>
    maturity === "stable" && layer !== "pattern" && name !== "Tokens",
);

export const componentNavigation = documentedComponents
  .map(({ name, slug }) => ({ href: `/components/${slug}`, label: name }))
  .toSorted((left, right) => left.label.localeCompare(right.label, "en"));

export const componentNavigationGroups: readonly DocsNavigationGroup[] =
  componentCategoryDefinitions
    .map(({ category, description }) => ({
      label: category,
      description,
      children: documentedComponents
        .filter((entry) => entry.role === category)
        .map(({ name, slug }) => ({ href: `/components/${slug}`, label: name }))
        .toSorted((left, right) => left.label.localeCompare(right.label, "en")),
    }))
    .filter(({ children }) => children.length > 0);

export const docsNavigation: readonly DocsNavigationItem[] = [
  { href: "/", label: "소개" },
  { href: "/getting-started", label: "시작하기" },
  {
    href: "/foundation",
    label: "파운데이션",
    children: [
      { href: "/foundation/colors", label: "Colors" },
      { href: "/foundation/typography", label: "Typography" },
    ],
  },
  {
    href: "/components",
    label: "컴포넌트",
    groups: componentNavigationGroups,
  },
];
