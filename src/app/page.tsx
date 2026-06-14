"use client";

import { Button } from "@heroui/react";
import { motion } from "framer-motion";

const metrics = [
  { label: "Hook strength", value: "92", tone: "text-emerald-500" },
  { label: "Retention risk", value: "18", tone: "text-amber-500" },
  { label: "Share triggers", value: "7", tone: "text-blue-500" },
];

const workflowSteps = [
  "Upload a short-form video",
  "Extract representative frames",
  "Analyze creative signals with OpenAI",
  "Review the structured JSON report",
  "Visualize recommendations in the dashboard",
];

const insightCards = [
  {
    title: "Opening frame clarity",
    description: "Detect whether the first impression communicates a clear visual promise.",
  },
  {
    title: "Pacing and scene shifts",
    description: "Surface moments where attention may drop before the payoff lands.",
  },
  {
    title: "Creative recommendations",
    description: "Turn analysis into prioritized edits for hooks, captions, and thumbnails.",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section
        id="product"
        className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-20"
      >
        <div className="max-w-3xl">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                Turn short-form videos into clear AI performance insights.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                ViralIQ helps creators and content teams understand hooks, pacing, visual clarity,
                and improvement opportunities before a video goes live.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-12 bg-primary px-6 text-sm font-semibold text-primary-foreground"
                radius="full"
                size="lg"
              >
                Analyze a video
              </Button>
              <Button
                className="h-12 border-slate-300 bg-white/70 px-6 text-sm font-semibold text-slate-800 backdrop-blur dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
                radius="full"
                size="lg"
                variant="bordered"
              >
                View sample report
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative"
          initial={{ opacity: 0, y: 22 }}
          transition={{ delay: 0.12, duration: 0.6, ease: "easeOut" }}
        >
          <div className="rounded-[2rem] border border-slate-200 bg-white/86 p-4 shadow-soft-xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/82">
            <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">
                    Launch report
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Creator upload analysis
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                  Ready
                </span>
              </div>

              <div className="aspect-[4/3] rounded-3xl bg-slate-950 p-4 text-white">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#1d4ed8_0%,#0f172a_54%,#111827_100%)] p-5">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>Frame 04</span>
                    <span>00:07</span>
                  </div>
                  <div>
                    <div className="mb-3 h-2 w-24 rounded-full bg-white/35" />
                    <div className="h-3 w-44 rounded-full bg-white/85" />
                    <div className="mt-2 h-3 w-32 rounded-full bg-white/50" />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <p className={`text-2xl font-semibold ${metric.tone}`}>{metric.value}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section
        id="workflow"
        className="border-y border-slate-200/80 bg-white/62 px-4 py-16 sm:px-6 lg:px-8 dark:border-slate-800/80 dark:bg-slate-950/52"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">
                A focused AI pipeline for video analysis.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                The product architecture follows the path from upload to frame extraction to OpenAI
                analysis, then stores a structured report for dashboard visualization.
              </p>
            </div>

            <div className="grid gap-3">
              {workflowSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="insights" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">
              Insight surfaces built for teams.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Reusable dashboard components will keep reports consistent as analysis features
              expand into thumbnails, trends, captions, and coaching.
            </p>
          </div>
          <Button
            className="w-fit border-slate-300 bg-white/70 font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
            radius="full"
            variant="bordered"
          >
            Explore dashboard
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {insightCards.map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-white/82 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70"
            >
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
