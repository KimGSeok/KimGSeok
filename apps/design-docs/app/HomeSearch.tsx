"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchField } from "@kimgseok/design-forms/web";

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <div className="home-search">
      <SearchField
        label="컴포넌트 바로 찾기"
        onSearch={(value) => router.push(`/components?q=${encodeURIComponent(value)}`)}
        onSearchError={() => {}}
        onValueChange={setQuery}
        placeholder="Button, 토스트, 날짜…"
        value={query}
      />
    </div>
  );
}
