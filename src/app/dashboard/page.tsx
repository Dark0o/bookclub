import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  console.log(user);

  // This shouldn't happen due to middleware, but as a safety check
  if (!user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

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
    </div>
  );
}
