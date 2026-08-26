const repositoryUrl = process.env.NEXT_PUBLIC_REPOSITORY_URL ??
  "https://github.com/KimGSeok/KimGSeok";

export const storybookUrl = process.env.NEXT_PUBLIC_STORYBOOK_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:6006" : null);

export function sourceUrl(path: string) {
  return `${repositoryUrl}/blob/main/${path}`;
}

export function storyUrl(storyId: string) {
  return storybookUrl ? `${storybookUrl}/?path=/story/${storyId}` : null;
}
