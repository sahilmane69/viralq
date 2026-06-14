import { currentUser } from "@clerk/nextjs/server";
import { DashboardClient } from "./dashboard-client";
import { listAnalyses } from "@/lib/supabase/database";

function getStartOfMonth() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export default async function DashboardPage() {
  const user = await currentUser();
  const displayName = user?.firstName ?? user?.username ?? "there";
  const analyses = user ? await listAnalyses(user.id, 50) : [];
  const completedAnalyses = analyses.filter((analysis) => analysis.status === "completed");
  const scoredAnalyses = analyses.filter((analysis) => typeof analysis.score === "number");
  const analysesThisMonth = analyses.filter(
    (analysis) => new Date(analysis.created_at) >= getStartOfMonth(),
  );
  const averageScore = scoredAnalyses.length
    ? Math.round(
        scoredAnalyses.reduce((total, analysis) => total + (analysis.score ?? 0), 0) /
          scoredAnalyses.length,
      )
    : null;
  const monthlyLimit = 50;

  return (
    <DashboardClient
      analyses={analyses.map((analysis) => ({
        id: analysis.id,
        title: analysis.title,
        createdAt: analysis.created_at,
        score: analysis.score,
        status: analysis.status,
      }))}
      averageScore={averageScore}
      completedCount={completedAnalyses.length}
      displayName={displayName}
      monthlyLimit={monthlyLimit}
      totalAnalyses={analyses.length}
      usedThisMonth={analysesThisMonth.length}
    />
  );
}
