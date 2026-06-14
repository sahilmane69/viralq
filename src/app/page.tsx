import { currentUser } from "@clerk/nextjs/server";
import { Button, Card, CardBody, Chip, Link } from "@heroui/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { getReportByAnalysis, listAnalyses } from "@/lib/supabase/database";
import type { Analysis } from "@/lib/supabase/database";
import type { VideoAnalysisScore } from "@/lib/openai/service";
import type { Json } from "@/types/database";

const features = [
  {
    icon: (
      <path d="M4 19V9m5 10V5m5 14v-7m5 7V3" />
    ),
    title: "Performance scoring",
    description:
      "Get a clear, consistent score for every video across hook strength, pacing, clarity, and share potential.",
  },
  {
    icon: (
      <>
        <path d="M12 3a6 6 0 0 0-3.8 10.65c.5.4.8.96.8 1.6V16h6v-.75c0-.64.3-1.2.8-1.6A6 6 0 0 0 12 3Z" />
        <path d="M9 20h6M10 16v1h4v-1" />
      </>
    ),
    title: "Actionable insights",
    description:
      "Move beyond raw metrics with focused recommendations your team can apply to the next edit.",
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="m12 8 4 4-4 4M8 12h8" />
      </>
    ),
    title: "Faster review cycles",
    description:
      "Give editors, strategists, and clients a shared language for creative feedback without another meeting.",
  },
  {
    icon: (
      <>
        <path d="M5 20V10m7 10V4m7 16v-7" />
        <path d="M3 20h18" />
      </>
    ),
    title: "Content benchmarks",
    description:
      "Compare creative patterns across your library and see what consistently works for your audience.",
  },
  {
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 9h4M7 13h7M17 9h.01" />
      </>
    ),
    title: "Structured reports",
    description:
      "Turn every analysis into a polished, easy-to-share report that keeps decisions documented.",
  },
  {
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    title: "Built for teams",
    description:
      "Keep creative standards aligned across in-house teams, agencies, and distributed collaborators.",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload your video",
    description: "Add any short-form video from your desktop in a few clicks.",
  },
  {
    number: "02",
    title: "ViralIQ analyzes it",
    description: "We evaluate the creative signals that shape viewer attention and response.",
  },
  {
    number: "03",
    title: "Improve with confidence",
    description: "Review a prioritized report and turn specific insights into stronger content.",
  },
];

function Icon({ children }: { children: ReactNode }) {
  return (
    <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
      <svg
        aria-hidden="true"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        {children}
      </svg>
    </div>
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function getNumber(value: unknown) {
  return typeof value === "number" ? Math.round(value) : null;
}

function parseReport(rawReport: Json): VideoAnalysisScore | null {
  if (!rawReport || typeof rawReport !== "object" || Array.isArray(rawReport)) {
    return null;
  }

  const report = rawReport as Record<string, unknown>;

  return {
    overallScore: getNumber(report.overallScore) ?? 0,
    hookScore: getNumber(report.hookScore) ?? 0,
    engagementScore: getNumber(report.engagementScore) ?? 0,
    retentionScore: getNumber(report.retentionScore) ?? 0,
    contentQualityScore: getNumber(report.contentQualityScore) ?? 0,
    strengths: isStringArray(report.strengths) ? report.strengths : [],
    weaknesses: isStringArray(report.weaknesses) ? report.weaknesses : [],
    recommendations: isStringArray(report.recommendations) ? report.recommendations : [],
    missingElements: isStringArray(report.missingElements) ? report.missingElements : [],
    improvedScorePrediction: getNumber(report.improvedScorePrediction) ?? 0,
  };
}

function getAnalysisSubtitle(analysis: Analysis | null) {
  if (!analysis?.metadata || typeof analysis.metadata !== "object" || Array.isArray(analysis.metadata)) {
    return "Upload a video to begin";
  }

  const fileName = analysis.metadata.original_filename;

  return typeof fileName === "string" && fileName.trim() ? fileName : "Latest analysis";
}

function getStatusColor(status: Analysis["status"] | null) {
  if (status === "completed") {
    return "success";
  }

  if (status === "failed") {
    return "danger";
  }

  return "primary";
}

function getScoreLabel(score: number | null) {
  if (score === null) {
    return "Pending";
  }

  if (score >= 85) {
    return "Excellent";
  }

  if (score >= 70) {
    return "Good";
  }

  if (score >= 50) {
    return "Fair";
  }

  return "Needs work";
}

export default async function Home() {
  const user = await currentUser();
  const [latestAnalysis] = user ? await listAnalyses(user.id, 1) : [];
  const latestReport = user && latestAnalysis ? await getReportByAnalysis(user.id, latestAnalysis.id) : null;
  const report = latestReport ? parseReport(latestReport.raw_report) : null;
  const currentScore = getNumber(latestAnalysis?.score) ?? (report ? Math.round(report.overallScore) : null);
  const metricRows = [
    ["Hook strength", report?.hookScore ?? null],
    ["Retention", report?.retentionScore ?? null],
    ["Content quality", report?.contentQualityScore ?? null],
  ] as const;
  const topOpportunity =
    report?.recommendations[0] ??
    report?.missingElements[0] ??
    "Your first report will appear after analysis.";

  return (
    <div className="overflow-hidden">
      <section
        id="product"
        className="relative mx-auto grid min-h-[700px] w-full max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24"
      >
        <div className="relative z-10 max-w-2xl">
          <Chip
            classNames={{
              base: "border border-blue-200 bg-blue-50/80 px-1",
              content: "font-semibold text-blue-700",
            }}
            radius="full"
            variant="flat"
          >
            Creative intelligence for content teams
          </Chip>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[4rem]">
            Know what makes your content{" "}
            <span className="text-blue-600">perform.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            ViralIQ turns short-form videos into clear, actionable insights so your team can create
            stronger content, faster.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              as={Link}
              className="h-12 bg-blue-600 px-7 font-semibold text-white shadow-lg shadow-blue-600/20"
              href="/dashboard/new-analysis"
              radius="lg"
              size="lg"
            >
              Analyze your first video
            </Button>
            <Button
              as={Link}
              className="h-12 border-slate-300 bg-white px-7 font-semibold text-slate-800"
              href="#how-it-works"
              radius="lg"
              size="lg"
              variant="bordered"
            >
              See how it works
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            {["No credit card required", "First analysis free"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  className="size-4 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-12 -z-10 rounded-full bg-blue-100/60 blur-3xl" />
          <Card className="border border-slate-200 bg-white shadow-[0_28px_80px_-32px_rgba(15,23,42,0.35)]">
            <CardBody className="p-0">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center overflow-hidden rounded-lg bg-blue-600">
                    <Image alt="" className="size-full object-cover" height={36} src="/viralq-logo.png" width={36} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {latestAnalysis?.title ?? "New analysis"}
                    </p>
                    <p className="text-xs text-slate-500">{getAnalysisSubtitle(latestAnalysis ?? null)}</p>
                  </div>
                </div>
                <Chip color={getStatusColor(latestAnalysis?.status ?? null)} size="sm" variant="flat">
                  {latestAnalysis?.status ?? "Ready"}
                </Chip>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="flex min-h-64 flex-col justify-between rounded-2xl bg-slate-900 p-5 text-white">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>00:08 / 00:24</span>
                    <span>9:16</span>
                  </div>
                  <div>
                    <div className="mb-5 grid size-12 place-items-center rounded-full bg-white/15 backdrop-blur">
                      <svg className="ml-0.5 size-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="m8 5 11 7-11 7V5Z" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold leading-snug">
                      {latestAnalysis?.title ?? "Your video preview appears here"}
                    </p>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${currentScore ?? 33}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                          ViralIQ score
                        </p>
                        <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-950">
                          {currentScore ?? "--"}<span className="text-base text-slate-400">/100</span>
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-slate-500">
                        {getScoreLabel(currentScore)}
                      </span>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${currentScore ?? 0}%` }}
                      />
                    </div>
                  </div>

                  {metricRows.map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-1.5 flex justify-between text-xs font-medium">
                        <span className="text-slate-600">{label}</span>
                        <span className="text-slate-900">{value === null ? "--" : `${Math.round(value)}%`}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${value ?? 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-5 mb-5 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <svg
                  className="mt-0.5 size-5 shrink-0 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
                <p className="text-sm leading-6 text-emerald-900">
                  <strong>Top opportunity:</strong> {topOpportunity}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      <section id="features" className="border-y border-slate-200/80 bg-white py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Everything you need
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Better creative decisions, backed by data
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Understand what is working, what is not, and what to improve before your next post.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border border-slate-200 bg-white shadow-none transition-transform duration-200 hover:-translate-y-1"
              >
                <CardBody className="p-6">
                  <Icon>{feature.icon}</Icon>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              From upload to insight in minutes
            </h2>
          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-3">
            <div className="absolute left-[16.6%] right-[16.6%] top-7 hidden border-t border-dashed border-slate-300 md:block" />
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <span className="relative z-10 mx-auto grid size-14 place-items-center rounded-2xl border border-blue-200 bg-white text-sm font-bold text-blue-600 shadow-sm">
                  {step.number}
                </span>
                <h3 className="mt-6 text-lg font-semibold text-slate-950">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-center sm:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Make every video a smarter creative decision.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">
            Join modern content teams using ViralIQ to learn faster and publish with confidence.
          </p>
          <Button
            className="mt-8 h-12 bg-white px-7 font-semibold text-slate-950"
            radius="lg"
            size="lg"
          >
            Start analyzing for free
          </Button>
          <p className="mt-4 text-xs text-slate-400">No credit card required</p>
        </div>
      </section>
    </div>
  );
}
