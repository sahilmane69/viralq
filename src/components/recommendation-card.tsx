import { Card, CardBody, Chip } from "@heroui/react";

export type RecommendationCardProps = {
  recommendation: string;
  whyItMatters: string;
  expectedImpact: string;
};

export function RecommendationCard({
  recommendation,
  whyItMatters,
  expectedImpact,
}: RecommendationCardProps) {
  return (
    <Card className="border border-slate-200 shadow-none">
      <CardBody className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Recommendation
            </p>
            <h3 className="mt-1 text-base font-semibold text-slate-950">{recommendation}</h3>
          </div>
          <Chip color="primary" radius="sm" size="sm" variant="flat">
            {expectedImpact}
          </Chip>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Why it matters
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{whyItMatters}</p>
        </div>
      </CardBody>
    </Card>
  );
}
