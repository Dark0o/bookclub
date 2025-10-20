import { NextRequest, NextResponse } from "next/server";

interface OpenLibraryWork {
  key: string;
  title: string;
  first_publish_year?: number;
  covers?: number[];
  subjects?: string[];
  description?: string | { value: string };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const authorKey = searchParams.get("authorKey");

    if (!authorKey) {
      return NextResponse.json(
        { error: "Query parameter 'authorKey' is required" },
        { status: 400 }
      );
    }

    // Call Open Library API to get author's works
    const response = await fetch(
      `https://openlibrary.org/authors/${authorKey}/works.json`
    );

    if (!response.ok) {
      throw new Error(
        `Open Library API responded with status: ${response.status}`
      );
    }

    const data = await response.json();

    // Filter and format the books data
    const books =
      data.entries?.map((work: OpenLibraryWork) => ({
        key: work.key,
        title: work.title,
        firstPublishYear: work.first_publish_year || null,
        coverId: work.covers?.[0] || null,
        subjects: work.subjects?.slice(0, 5) || [],
        description:
          typeof work.description === "string"
            ? work.description
            : work.description?.value || null,
      })) || [];

    return NextResponse.json({
      books,
      size: data.size || 0,
    });
  } catch (error) {
    console.error("Error fetching author books:", error);
    return NextResponse.json(
      { error: "Failed to fetch author books" },
      { status: 500 }
    );
  }
}
