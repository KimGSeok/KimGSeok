"use client";

import type { CatalogEntry, CatalogPlatform } from "@kimgseok/design-catalog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type PlatformFilter = CatalogPlatform | "all";

function normalize(value: string) {
  return value.toLocaleLowerCase("ko").replace(/[\s_-]+/g, "");
}

function validPlatform(value?: string): PlatformFilter {
  return value === "web" || value === "native" ? value : "all";
}

function searchableText(entry: CatalogEntry) {
  return normalize([
    entry.name,
    entry.description,
    entry.packageName,
    ...entry.aliases,
    ...Object.values(entry.exportNames),
  ].filter(Boolean).join(" "));
}

export function ComponentCatalog({
  entries,
  initialPlatform,
  initialQuery,
}: {
  entries: readonly CatalogEntry[];
  initialPlatform?: string;
  initialQuery?: string;
}) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const firstResultRef = useRef<HTMLAnchorElement>(null);
  const [query, setQuery] = useState(initialQuery ?? "");
  const [platform, setPlatform] = useState<PlatformFilter>(
    validPlatform(initialPlatform),
  );
  const results = useMemo(() => {
    const needle = normalize(query);
    return entries.filter((entry) => {
      const matchesQuery = !needle || searchableText(entry).includes(needle);
      const matchesPlatform = platform === "all" || entry.platforms.includes(platform);
      return matchesQuery && matchesPlatform;
    });
  }, [entries, platform, query]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (platform !== "all") params.set("platform", platform);
    const nextUrl = `/components${params.size ? `?${params}` : ""}`;
    const timeout = window.setTimeout(() => {
      window.history.replaceState(null, "", nextUrl);
    }, 120);
    return () => window.clearTimeout(timeout);
  }, [platform, query]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  function reset() {
    setQuery("");
    setPlatform("all");
    searchRef.current?.focus();
  }

  return (
    <section className="catalog-workspace" aria-labelledby="catalog-results-title">
      <div className="catalog-controls">
        <label className="catalog-search">
          <span>컴포넌트 검색</span>
          <span className="search-input-shell">
            <input
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  if (query) setQuery("");
                  else event.currentTarget.blur();
                }
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  firstResultRef.current?.focus();
                }
                if (event.key === "Enter" && results[0]) {
                  event.preventDefault();
                  router.push(`/components/${results[0].slug}`);
                }
              }}
              placeholder="Button, 토스트, 날짜…"
              ref={searchRef}
              type="search"
              value={query}
            />
            <kbd aria-label="Command 또는 Control K">⌘ K</kbd>
          </span>
        </label>

        <div className="filter-row">
          <fieldset className="platform-filter">
            <legend>플랫폼</legend>
            {(["all", "web", "native"] as const).map((value) => (
              <button
                aria-pressed={platform === value}
                key={value}
                onClick={() => setPlatform(value)}
                type="button"
              >
                {value === "all" ? "전체" : value === "web" ? "Web" : "Native"}
              </button>
            ))}
          </fieldset>
        </div>
      </div>

      <div className="results-heading">
        <div>
          <p className="eyebrow">A–Z</p>
          <h2 id="catalog-results-title">컴포넌트</h2>
        </div>
        <p aria-live="polite"><strong>{results.length}</strong>개 결과</p>
      </div>

      {results.length ? (
        <ol className="component-results">
          {results.map((entry, index) => (
            <li key={entry.slug}>
              <Link
                className="result-link"
                href={`/components/${entry.slug}`}
                ref={index === 0 ? firstResultRef : undefined}
              >
                <span className="result-main">
                  <strong>{entry.name}</strong>
                  <span>{entry.description}</span>
                </span>
                <span className="result-meta">
                  <span>{entry.platforms.map((item) => item === "web" ? "Web" : "Native").join(" + ")}</span>
                  <span className="result-arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className="empty-results">
          <h3>조건에 맞는 컴포넌트가 없어요.</h3>
          <p>검색어를 줄이거나 플랫폼 필터를 초기화해 보세요.</p>
          <button onClick={reset} type="button">필터 초기화</button>
        </div>
      )}
    </section>
  );
}
