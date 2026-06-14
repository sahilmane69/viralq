type ScoreCircleProps = {
  score: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

function clampScore(score: number) {
  return Math.min(Math.max(Math.round(score), 0), 100);
}

function getScoreLabel(score: number) {
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

export function ScoreCircle({
  score,
  label,
  size = 160,
  strokeWidth = 12,
  className = "",
}: ScoreCircleProps) {
  const normalizedScore = clampScore(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (normalizedScore / 100) * circumference;
  const statusLabel = label ?? getScoreLabel(normalizedScore);

  return (
    <div
      className={`relative grid place-items-center text-slate-950 ${className}`}
      style={{ height: size, width: size }}
    >
      <svg
        aria-hidden="true"
        className="-rotate-90"
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <circle
          className="stroke-slate-100"
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="stroke-blue-600 transition-[stroke-dashoffset] duration-500"
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-4xl font-semibold leading-none tracking-tight">{normalizedScore}</p>
          <p className="mt-2 text-sm font-medium text-slate-500">{statusLabel}</p>
        </div>
      </div>
    </div>
  );
}
