import { Chip } from "@heroui/react";

export type StrengthsDetectedProps = {
  strengths?: string[];
  title?: string;
};

const defaultStrengths = ["Strong Hook", "Fast Pacing", "Good Framing", "Clear Messaging"];

export function StrengthsDetected({
  strengths = defaultStrengths,
  title = "Strengths detected",
}: StrengthsDetectedProps) {
  return (
    <section aria-label={title}>
      <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {strengths.map((strength) => (
          <Chip key={strength} color="success" radius="sm" size="sm" variant="flat">
            {strength}
          </Chip>
        ))}
      </div>
    </section>
  );
}
