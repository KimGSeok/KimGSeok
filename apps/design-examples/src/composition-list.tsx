"use client";

import { useState } from "react";
import { SearchField } from "@kimgseok/design-forms/web";
import { FilterBar, Pagination } from "@kimgseok/design-navigation/web";
import { EmptyState, Table } from "@kimgseok/design-primitives/web";
import { Callout } from "@kimgseok/design-feedback/web";

const records = [
  { id: "1", title: "브랜드 소개", status: "published" },
  { id: "2", title: "가을 소식", status: "draft" },
  { id: "3", title: "이용 안내", status: "published" },
  { id: "4", title: "업데이트", status: "draft" },
  { id: "5", title: "자주 묻는 질문", status: "published" },
];
const filters = [
  { value: "published", label: "공개" },
  { value: "draft", label: "초안" },
];
const pageSize = 2;

export default function CompositionListExample() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const filtered = records.filter(
    (record) =>
      record.title.includes(search.trim()) &&
      (!selected.length || selected.includes(record.status))
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const reset = () => {
    setQuery("");
    setSearch("");
    setSelected([]);
    setPage(1);
    setError(false);
  };

  return (
    <section
      aria-label="콘텐츠 목록"
      style={{
        display: "grid",
        gap: "var(--kg-foundation-space-4)",
        width: "100%",
      }}
    >
      <SearchField
        label="콘텐츠 검색"
        value={query}
        onValueChange={setQuery}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
          setError(false);
        }}
        onSearchError={() => setError(true)}
      />
      <FilterBar
        accessibilityLabel="공개 상태"
        items={filters}
        selectedValues={selected}
        onSelectedValuesChange={(values) => {
          setSelected(values);
          setPage(1);
        }}
      />
      {error ? (
        <Callout
          tone="negative"
          title="검색하지 못했습니다"
          description="검색어를 확인한 뒤 다시 검색해 주세요."
          announce
        />
      ) : null}
      {filtered.length ? (
        <>
          <Table
            caption={`검색 결과 ${filtered.length}개`}
            columns={[
              { id: "title", label: "제목" },
              { id: "status", label: "상태" },
            ]}
            rows={filtered
              .slice((page - 1) * pageSize, page * pageSize)
              .map((record) => ({
                id: record.id,
                cells: {
                  title: record.title,
                  status: record.status === "published" ? "공개" : "초안",
                },
              }))}
          />
          {totalPages > 1 ? (
            <Pagination
              accessibilityLabel="검색 결과 페이지"
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : null}
        </>
      ) : (
        <EmptyState
          title="검색 결과가 없습니다"
          description="검색어나 공개 상태를 바꿔 다시 찾아보세요."
          action={{
            label: "검색 조건 초기화",
            onAction: reset,
            onActionError: () => setError(true),
          }}
        />
      )}
    </section>
  );
}
