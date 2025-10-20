import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserInfoProps {
  user: {
    name?: string | null;
    username: string;
    email: string;
    createdAt: Date;
  };
}

export function UserInfo({ user }: UserInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {user.name || user.username}! 👋</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Member since:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>

        <form action="/api/auth/logout" method="POST" className="pt-4">
          <Button type="submit" variant="outline">
            Log Out
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
