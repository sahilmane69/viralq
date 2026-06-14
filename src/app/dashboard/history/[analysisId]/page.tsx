import { currentUser } from "@clerk/nextjs/server";
import { Button, Card, CardBody, Link } from "@heroui/react";
import { ImprovementSection } from "@/components/improvement-section";
import { MetricCard, reportMetricLabels } from "@/components/metric-card";
import { RecommendationCard } from "@/components/recommendation-card";
import { ScoreCircle } from "@/components/score-circle";
import { StrengthsDetected } from "@/components/strengths-detected";
import { getAnalysis, getReportByAnalysis } from "@/lib/supabase/database";
import type { VideoAnalysisScore } from "@/lib/openai/service";
import type { Json } from "@/types/database";

type ReportPageProps = {
  params: Promise<{
    analysisId: string;
  }>;
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function getNumberField(value: Record<string, unknown>, field: keyof VideoAnalysisScore) {
  const fieldValue = value[field];

  return typeof fieldValue === "number" ? fieldValue : 0;
}

function parseReport(rawReport: Json): VideoAnalysisScore | null {
  if (!rawReport || typeof rawReport !== "object" || Array.isArray(rawReport)) {
    return null;
  }

  const report = rawReport as Record<string, unknown>;
  const strengths = report.strengths;
  const weaknesses = report.weaknesses;
  const recommendations = report.recommendations;
  const missingElements = report.missingElements;

  return {
    overallScore: getNumberField(report, "overallScore"),
    hookScore: getNumberField(report, "hookScore"),
    engagementScore: getNumberField(report, "engagementScore"),
    retentionScore: getNumberField(report, "retentionScore"),
    contentQualityScore: getNumberField(report, "contentQualityScore"),
    strengths: isStringArray(strengths) ? strengths : [],
    weaknesses: isStringArray(weaknesses) ? weaknesses : [],
    recommendations: isStringArray(recommendations) ? recommendations : [],
    missingElements: isStringArray(missingElements) ? missingElements : [],
    improvedScorePrediction: getNumberField(report, "improvedScorePrediction"),
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function ReportPage({ params }: ReportPageProps) {
  const user = await currentUser();
  const { analysisId } = await params;
  const analysis = user ? await getAnalysis(user.id, analysisId) : null;
  const report = user ? await getReportByAnalysis(user.id, analysisId) : null;
  const aiReport = report ? parseReport(report.raw_report) : null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600">Analysis report</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              {analysis?.title ?? "Report not found"}
            </h1>
            {analysis ? (
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Created {formatDate(analysis.created_at)}
              </p>
            ) : null}
          </div>
          <Button
            as={Link}
            className="w-fit border-slate-300 bg-white font-semibold text-slate-800"
            href="/dashboard/history"
            radius="lg"
            variant="bordered"
          >
            Back to history
          </Button>
        </div>

        {!analysis ? (
          <Card className="border border-slate-200 shadow-none">
            <CardBody className="p-8 text-center">
              <p className="font-semibold text-slate-800">Analysis not found</p>
              <p className="mt-2 text-sm text-slate-500">
                This report may not exist or may belong to another account.
              </p>
            </CardBody>
          </Card>
        ) : null}

        {analysis && !aiReport ? (
          <Card className="border border-slate-200 shadow-none">
            <CardBody className="p-8 text-center">
              <p className="font-semibold text-slate-800">Report is not ready yet</p>
              <p className="mt-2 text-sm text-slate-500">
                The analysis exists, but there is no completed AI report saved for it.
              </p>
            </CardBody>
          </Card>
        ) : null}

        {aiReport ? (
          <div className="grid gap-6">
            <Card className="border border-slate-200 shadow-none">
              <CardBody className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center">
                <ScoreCircle
                  className="mx-auto shrink-0 lg:mx-0"
                  score={aiReport.overallScore}
                />
                <div>
                  <p className="text-sm font-medium text-blue-600">Overall score</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                    {aiReport.overallScore}/100
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Full AI report saved from your video analysis.
                  </p>
                </div>
              </CardBody>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label={reportMetricLabels.hookScore} score={aiReport.hookScore} />
              <MetricCard
                label={reportMetricLabels.engagementScore}
                score={aiReport.engagementScore}
              />
              <MetricCard
                label={reportMetricLabels.retentionScore}
                score={aiReport.retentionScore}
              />
              <MetricCard
                label={reportMetricLabels.contentQualityScore}
                score={aiReport.contentQualityScore}
              />
            </div>

            <ImprovementSection
              currentScore={aiReport.overallScore}
              potentialScore={aiReport.improvedScorePrediction}
            />

            <Card className="border border-slate-200 shadow-none">
              <CardBody className="grid gap-6 p-5 sm:p-6">
                <StrengthsDetected strengths={aiReport.strengths} />
                {aiReport.weaknesses.length ? (
                  <section aria-label="Weaknesses">
                    <h2 className="text-sm font-semibold text-slate-950">Weaknesses</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {aiReport.weaknesses.map((weakness) => (
                        <span
                          className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-700"
                          key={weakness}
                        >
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}
              </CardBody>
            </Card>

            {aiReport.recommendations.length ? (
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Recommendations</h2>
                <div className="mt-3 grid gap-3">
                  {aiReport.recommendations.map((recommendation) => (
                    <RecommendationCard
                      expectedImpact={`Potential ${Math.round(
                        aiReport.improvedScorePrediction,
                      )}/100`}
                      key={recommendation}
                      recommendation={recommendation}
                      whyItMatters="This recommendation is based on the saved AI report and targets a detected improvement opportunity."
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
