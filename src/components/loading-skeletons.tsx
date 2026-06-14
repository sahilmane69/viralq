function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />;
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">{children}</div>
    </main>
  );
}

function HeaderSkeleton() {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="w-full max-w-2xl">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="mt-4 h-10 w-80 max-w-full" />
        <SkeletonBlock className="mt-4 h-4 w-full max-w-xl" />
      </div>
      <SkeletonBlock className="h-11 w-40" />
    </div>
  );
}

export function UploadLoadingSkeleton() {
  return (
    <PageShell>
      <HeaderSkeleton />
      <div className="grid gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="grid min-h-64 place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10">
            <div className="grid justify-items-center">
              <SkeletonBlock className="size-16 rounded-2xl" />
              <SkeletonBlock className="mt-6 h-6 w-64" />
              <SkeletonBlock className="mt-4 h-4 w-96 max-w-full" />
              <SkeletonBlock className="mt-7 h-12 w-36" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <SkeletonBlock className="h-16" />
            <SkeletonBlock className="h-16" />
            <SkeletonBlock className="h-16" />
            <SkeletonBlock className="h-16" />
          </div>
          <SkeletonBlock className="mt-5 h-40" />
          <div className="mt-5 flex justify-end gap-3">
            <SkeletonBlock className="h-11 w-28" />
            <SkeletonBlock className="h-11 w-36" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="lg:pl-64">
        <div className="h-16 border-b border-slate-200 bg-white" />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="mt-4 h-9 w-80 max-w-full" />
                <SkeletonBlock className="mt-4 h-4 w-72" />
              </div>
              <SkeletonBlock className="h-12 w-40" />
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <SkeletonBlock className="h-32" />
              <SkeletonBlock className="h-32" />
              <SkeletonBlock className="h-32" />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.75fr]">
              <SkeletonBlock className="h-96" />
              <SkeletonBlock className="h-80" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function HistoryLoadingSkeleton() {
  return (
    <PageShell>
      <HeaderSkeleton />
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.5fr] gap-4 border-b border-slate-200 px-5 py-4">
          <SkeletonBlock className="h-4" />
          <SkeletonBlock className="h-4" />
          <SkeletonBlock className="h-4" />
          <SkeletonBlock className="h-4" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.5fr] items-center gap-4 px-5 py-4"
              key={index}
            >
              <div>
                <SkeletonBlock className="h-5 w-52 max-w-full" />
                <SkeletonBlock className="mt-3 h-6 w-20" />
              </div>
              <SkeletonBlock className="h-5 w-28" />
              <SkeletonBlock className="h-5 w-24" />
              <SkeletonBlock className="ml-auto h-7 w-10" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export function ReportLoadingSkeleton() {
  return (
    <PageShell>
      <HeaderSkeleton />
      <div className="grid gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <SkeletonBlock className="mx-auto size-40 rounded-full lg:mx-0" />
            <div className="w-full max-w-xl">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="mt-4 h-8 w-48" />
              <SkeletonBlock className="mt-4 h-4 w-full" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SkeletonBlock className="h-36" />
          <SkeletonBlock className="h-36" />
          <SkeletonBlock className="h-36" />
          <SkeletonBlock className="h-36" />
        </div>

        <SkeletonBlock className="h-56" />
        <SkeletonBlock className="h-40" />
        <SkeletonBlock className="h-48" />
      </div>
    </PageShell>
  );
}
