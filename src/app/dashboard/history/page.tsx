import { currentUser } from "@clerk/nextjs/server";
import { Button, Card, CardBody, Chip, Link } from "@heroui/react";
import { listAnalysesPage } from "@/lib/supabase/database";
import type { Analysis } from "@/lib/supabase/database";
import type { Json } from "@/types/database";

const PAGE_SIZE = 10;

type HistoryPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getMetadataValue(metadata: Json, key: string) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null;
  }

  const value = metadata[key];

  return typeof value === "string" && value.trim() ? value : null;
}

function getPlatform(analysis: Analysis) {
  const platform = getMetadataValue(analysis.metadata, "platform");

  if (platform) {
    return platform;
  }

  const [titlePlatform] = analysis.title.split(" - ");

  return titlePlatform?.trim() || "Unknown";
}

function getStatusColor(status: Analysis["status"]) {
  if (status === "completed") {
    return "success";
  }

  if (status === "failed") {
    return "danger";
  }

  return "primary";
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const user = await currentUser();
  const resolvedSearchParams = await searchParams;
  const page = Math.max(Number(resolvedSearchParams.page ?? "1") || 1, 1);
  const { analyses, total } = user
    ? await listAnalysesPage(user.id, page, PAGE_SIZE)
    : { analyses: [], total: 0 };
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600">History</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              Previous analyses
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Review completed and in-progress video analyses from your workspace.
            </p>
          </div>
          <Button
            as={Link}
            className="w-fit border-slate-300 bg-white font-semibold text-slate-800"
            href="/dashboard"
            radius="lg"
            variant="bordered"
          >
            Back to dashboard
          </Button>
        </div>

        <Card className="border border-slate-200 shadow-none">
          <CardBody className="p-0">
            <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.5fr] gap-4 border-b border-slate-200 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Video</span>
              <span>Platform</span>
              <span>Date</span>
              <span className="text-right">Score</span>
            </div>

            {analyses.length ? (
              <div className="divide-y divide-slate-100">
                {analyses.map((analysis) => (
                  <Link
                    key={analysis.id}
                    className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.5fr] items-center gap-4 px-5 py-4 text-slate-950 transition hover:bg-slate-50"
                    href={`/dashboard/history/${analysis.id}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{analysis.title}</p>
                      <Chip
                        className="mt-2"
                        color={getStatusColor(analysis.status)}
                        size="sm"
                        variant="flat"
                      >
                        {analysis.status}
                      </Chip>
                    </div>
                    <p className="truncate text-sm text-slate-600">{getPlatform(analysis)}</p>
                    <p className="text-sm text-slate-600">{formatDate(analysis.created_at)}</p>
                    <p className="text-right text-lg font-semibold text-slate-950">
                      {analysis.score ?? "-"}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-14 text-center">
                <p className="text-sm font-semibold text-slate-700">No analyses yet</p>
                <p className="mt-2 text-sm text-slate-500">
                  Start a new analysis to build your history.
                </p>
                <Button
                  as={Link}
                  className="mt-5 bg-blue-600 font-semibold text-white"
                  href="/dashboard/new-analysis"
                  radius="lg"
                >
                  New analysis
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {totalPages > 1 ? (
          <div className="mt-5 flex items-center justify-between">
            <Button
              as={Link}
              className="border-slate-300 bg-white font-semibold text-slate-800"
              href={`/dashboard/history?page=${Math.max(page - 1, 1)}`}
              isDisabled={page <= 1}
              radius="lg"
              variant="bordered"
            >
              Previous
            </Button>
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <Button
              as={Link}
              className="border-slate-300 bg-white font-semibold text-slate-800"
              href={`/dashboard/history?page=${Math.min(page + 1, totalPages)}`}
              isDisabled={page >= totalPages}
              radius="lg"
              variant="bordered"
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
