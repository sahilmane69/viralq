import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@heroui/react";
import Link from "next/link";

const dashboardStats = [
  { label: "Videos analyzed", value: "0" },
  { label: "Reports generated", value: "0" },
  { label: "Saved recommendations", value: "0" },
];

export default async function DashboardPage() {
  const user = await currentUser();
  const displayName = user?.firstName ?? user?.username ?? "there";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
            Welcome back, {displayName}.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            Your protected ViralIQ workspace is ready for uploads, AI reports, and creative
            performance insights.
          </p>
        </div>
        <Button
          as={Link}
          className="w-fit bg-primary font-semibold text-primary-foreground"
          href="/#product"
          radius="full"
        >
          Upload video
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {dashboardStats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-slate-200 bg-white/82 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70"
          >
            <p className="text-3xl font-semibold text-slate-950 dark:text-white">{stat.value}</p>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white/66 p-8 dark:border-slate-700 dark:bg-slate-950/50">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          Start your first analysis
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Upload workflows, Supabase storage, and OpenAI report generation will connect here as the
          product evolves.
        </p>
      </div>
    </section>
  );
}
