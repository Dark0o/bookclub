"use client";

import { useState } from "react";
import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Author {
  key: string;
  name: string;
  workCount: number;
  topWork: string | null;
  bio: string | null;
  birthDate: string | null;
  topSubjects: string[];
}

interface Book {
  key: string;
  title: string;
  firstPublishYear: number | null;
  coverId: number | null;
  subjects: string[];
  description: string | null;
}

export function AuthorBookSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);

  // Debounced search function
  const searchAuthors = useDebouncedCallback(async (query: string) => {
    if (!query.trim()) {
      setAuthors([]);
      setFallbackMessage(null);
      return;
    }

    setLoadingAuthors(true);
    setError(null);
    setFallbackMessage(null);

    try {
      const response = await fetch(
        `/api/open-library/authors?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to search authors");
      }

      const data = await response.json();

      // If no results and query has multiple words, try with just the first word
      if (data.authors.length === 0 && query.includes(" ")) {
        const firstWord = query.split(" ")[0];
        const fallbackResponse = await fetch(
          `/api/open-library/authors?q=${encodeURIComponent(firstWord)}`
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.authors.length > 0) {
            setAuthors(fallbackData.authors);
            setFallbackMessage(
              `No results for "${query}". Showing results for "${firstWord}" instead.`
            );
            setLoadingAuthors(false);
            return;
          }
        }
      }

      setAuthors(data.authors);
    } catch (err) {
      setError("Failed to search for authors. Please try again.");
      console.error(err);
    } finally {
      setLoadingAuthors(false);
    }
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchAuthors(value);
  };

  // Fetch books when an author is selected
  const handleAuthorSelect = async (author: Author) => {
    setSelectedAuthor(author);
    setLoadingBooks(true);
    setError(null);

    try {
      // Extract author key (e.g., "/authors/OL23919A" -> "OL23919A")
      const authorKey = author.key.split("/").pop();

      const response = await fetch(
        `/api/open-library/books?authorKey=${authorKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();
      setBooks(data.books);
    } catch (err) {
      setError("Failed to fetch books. Please try again.");
      console.error(err);
    } finally {
      setLoadingBooks(false);
    }
  };

  const handleBackToAuthors = () => {
    setSelectedAuthor(null);
    setBooks([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search for Authors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter author name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1"
            />
          </div>
          {loadingAuthors && (
            <p className="text-sm text-muted-foreground mt-2">Searching...</p>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {fallbackMessage && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-md">
          {fallbackMessage}
        </div>
      )}

      {/* Author Results */}
      {!selectedAuthor && authors.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Authors Found ({authors.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authors.map((author) => (
              <AuthorCard
                key={author.key}
                author={author}
                onSelect={() => handleAuthorSelect(author)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Selected Author's Books */}
      {selectedAuthor && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Books by {selectedAuthor.name}
            </h2>
            <Button onClick={handleBackToAuthors} variant="outline">
              Back to Authors
            </Button>
          </div>

          {loadingBooks ? (
            <p className="text-muted-foreground">Loading books...</p>
          ) : books.length === 0 ? (
            <p className="text-muted-foreground">
              No books found for this author.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <BookCard key={book.key} book={book} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!selectedAuthor &&
        authors.length === 0 &&
        searchQuery &&
        !loadingAuthors && (
          <p className="text-center text-muted-foreground py-8">
            No authors found for &quot;{searchQuery}&quot;
          </p>
        )}
    </div>
  );
}

interface AuthorCardProps {
  author: Author;
  onSelect: () => void;
}

function AuthorCard({ author, onSelect }: AuthorCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onSelect}
    >
      <CardHeader>
        <CardTitle className="text-lg">{author.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <strong>Works:</strong> {author.workCount}
        </p>
        {author.topWork && (
          <p className="text-sm text-muted-foreground">
            <strong>Top Work:</strong> {author.topWork}
          </p>
        )}
        {author.birthDate && (
          <p className="text-sm text-muted-foreground">
            <strong>Born:</strong> {author.birthDate}
          </p>
        )}
        {author.topSubjects.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {author.topSubjects.slice(0, 3).map((subject, idx) => (
              <span
                key={idx}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
              >
                {subject}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface BookCardProps {
  book: Book;
}

function BookCard({ book }: BookCardProps) {
  const coverUrl = book.coverId
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`
    : null;

  return (
    <Card>
      <CardContent className="pt-6">
        {coverUrl && (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={coverUrl}
              alt={book.title}
              fill
              className="object-cover rounded-md"
              unoptimized
            />
          </div>
        )}
        <h3 className="font-bold text-lg mb-2">{book.title}</h3>
        {book.firstPublishYear && (
          <p className="text-sm text-muted-foreground mb-2">
            Published: {book.firstPublishYear}
          </p>
        )}
        {book.subjects.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {book.subjects.slice(0, 3).map((subject, idx) => (
              <span
                key={idx}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
              >
                {subject}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
