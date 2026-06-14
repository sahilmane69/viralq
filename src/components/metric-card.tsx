import { Card, CardBody } from "@heroui/react";
import type { ReactNode } from "react";

export type MetricCardProps = {
  label: string;
  score: number;
  description?: string;
  icon?: ReactNode;
};

export const reportMetricLabels = {
  hookScore: "Hook Score",
  engagementScore: "Engagement Score",
  retentionScore: "Retention Score",
  contentQualityScore: "Content Quality Score",
} as const;

function clampScore(score: number) {
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function MetricCard({ label, score, description, icon }: MetricCardProps) {
  const normalizedScore = clampScore(score);

  return (
    <Card className="border border-slate-200 shadow-none">
      <CardBody className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {normalizedScore}
            </p>
          </div>
          {icon ? (
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
              {icon}
            </span>
          ) : null}
        </div>

        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${normalizedScore}%` }}
          />
        </div>

        {description ? (
          <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
        ) : null}
      </CardBody>
    </Card>
  );
}
