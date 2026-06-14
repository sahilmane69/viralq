import { currentUser } from "@clerk/nextjs/server";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await currentUser();
  const displayName = user?.firstName ?? user?.username ?? "there";
  const initials =
    user?.firstName || user?.lastName
      ? `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase()
      : (user?.username?.[0] ?? "U").toUpperCase();

  return <DashboardClient displayName={displayName} initials={initials} />;
}
