import React from "react";
import HeroSection from "@/components/HeroSection";
import BookCard from "@/components/BookCard";
import { searchBooks } from "@/lib/actions/book.actions";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

const Page = async ({ searchParams }: HomePageProps) => {
  const { search = "" } = await searchParams;
  const normalizedSearch = search.trim();
  const bookResults = await searchBooks(normalizedSearch);
  const books = bookResults.success ? (bookResults.data ?? []) : [];

  return (
    <main>
      <div className="wrapper">
        <HeroSection />

        <section className="library">
          <div className="library-filter-bar">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-[var(--text-primary)]">
                Recent Books
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {normalizedSearch
                  ? `Showing matches for "${normalizedSearch}"`
                  : "Browse your latest uploads by title or author."}
              </p>
            </div>
          </div>

          <div className="library-books-grid">
            {books.length > 0 ? (
              books.map((book) => (
                <BookCard
                  key={book._id}
                  title={book.title}
                  author={book.author}
                  coverURL={book.coverURL}
                  slug={book.slug}
                />
              ))
            ) : (
              <div className="library-empty-card col-span-full text-center">
                <h3 className="text-xl font-serif font-semibold text-[var(--text-primary)]">
                  No books found
                </h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Try a different title or author, or clear the search to see
                  all books.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Page;
