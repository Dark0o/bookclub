import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Author {
  key: string;
  name: string;
  workCount: number;
  topWork: string | null;
  bio: string | null;
  birthDate: string | null;
  topSubjects: string[];
}

interface AuthorCardProps {
  author: Author;
  onSelect?: () => void;
  className?: string;
}

export function AuthorCard({ author, onSelect, className }: AuthorCardProps) {
  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${
        onSelect ? "cursor-pointer" : ""
      } ${className || ""}`}
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
