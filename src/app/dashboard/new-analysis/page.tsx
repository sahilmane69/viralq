import { Button, Link } from "@heroui/react";
import { NewAnalysisForm } from "./new-analysis-form";

export default function NewAnalysisPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-600">New analysis</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              Analyze a new video
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Add the video context ViralIQ needs to evaluate your content for the right audience,
              platform, niche, and campaign goal.
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

        <NewAnalysisForm />
      </div>
    </main>
  );
}
