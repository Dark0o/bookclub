import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserInfo } from "@/components/dashboard/UserInfo";
import { AuthorBookSearch } from "@/components/dashboard/AuthorBookSearch";
import { CountryAuthorMap } from "@/components/dashboard/CountryAuthorMap";

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <UserInfo user={user} />
        </div>
        <div className="lg:col-span-2">
          <AuthorBookSearch />
        </div>
      </div>

      <div className="mb-8">
        <CountryAuthorMap />
      </div>
    </div>
  );
}
