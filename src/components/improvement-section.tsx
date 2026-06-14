import { Card, CardBody } from "@heroui/react";

export type ImprovementSectionProps = {
  currentScore: number;
  potentialScore: number;
  title?: string;
};

function clampScore(score: number) {
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function ImprovementSection({
  currentScore,
  potentialScore,
  title = "Improvement potential",
}: ImprovementSectionProps) {
  const current = clampScore(currentScore);
  const potential = clampScore(potentialScore);
  const lift = Math.max(potential - current, 0);

  return (
    <Card className="border border-slate-200 shadow-none">
      <CardBody className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">{title}</p>
            <p className="mt-1 text-sm text-slate-500">
              Compare today&apos;s score with the projected score after improvements.
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
            +{lift} points
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Current Score
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
                  {current}
                </p>
              </div>
              <span className="text-xs font-medium text-slate-400">/100</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-400"
                style={{ width: `${current}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Potential Score
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
                  {potential}
                </p>
              </div>
              <span className="text-xs font-medium text-slate-400">/100</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${potential}%` }}
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
