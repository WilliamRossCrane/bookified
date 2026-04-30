"use client";

import { useEffect, useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface LibrarySearchProps {
  initialQuery: string;
  className?: string;
}

const LibrarySearch = ({ initialQuery, className }: LibrarySearchProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedValue = value.trim();

    if (trimmedValue) {
      params.set("search", trimmedValue);
    } else {
      params.delete("search");
    }

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  return (
    <div
      className={cn(className ?? "library-search-wrapper", {
        "library-search-active": Boolean(query),
      })}
    >
      <Search className="library-search-icon" />
      <input
        type="text"
        value={query}
        onChange={(event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          updateSearch(nextValue);
        }}
        placeholder="Search title or author"
        aria-label="Search books by title or author"
        className="library-search-input"
      />

      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            updateSearch("");
          }}
          className="library-search-clear"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default LibrarySearch;
