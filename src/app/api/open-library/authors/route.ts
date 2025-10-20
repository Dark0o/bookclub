import { NextRequest, NextResponse } from "next/server";

interface OpenLibraryAuthor {
  key: string;
  name: string;
  work_count?: number;
  top_work?: string;
  bio?: string;
  birth_date?: string;
  top_subjects?: string[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // Call Open Library API to search for authors
    const response = await fetch(
      `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(
        query
      )}`
    );

    if (!response.ok) {
      throw new Error(
        `Open Library API responded with status: ${response.status}`
      );
    }

    const data = await response.json();

    // Filter and format the author data
    const authors =
      data.docs?.map((author: OpenLibraryAuthor) => ({
        key: author.key,
        name: author.name,
        workCount: author.work_count || 0,
        topWork: author.top_work || null,
        bio: author.bio || null,
        birthDate: author.birth_date || null,
        topSubjects: author.top_subjects?.slice(0, 3) || [],
      })) || [];

    return NextResponse.json({
      numFound: data.numFound || 0,
      authors,
    });
  } catch (error) {
    console.error("Error searching authors:", error);
    return NextResponse.json(
      { error: "Failed to search authors" },
      { status: 500 }
    );
  }
}
