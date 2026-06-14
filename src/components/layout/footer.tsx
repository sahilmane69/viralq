import { Link } from "@heroui/react";
import Image from "next/image";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Start analysis", href: "/dashboard/new-analysis" },
];

const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Security", href: "#" },
];

const signalTimes = [
  { time: "24/7", city: "Realtime", region: "Analysis" },
  { time: "< 5m", city: "Reports", region: "Delivery" },
  { time: "100", city: "Score", region: "Scale" },
  { time: "AI", city: "Creative", region: "Insight" },
];

function FooterLinkGroup({
  label,
  links,
}: {
  label: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
        {label}
      </p>
      <div className="mt-8 grid gap-4">
        {links.map((link) => (
          <Link
            className="w-fit text-sm font-medium text-slate-600 hover:text-slate-950"
            href={link.href}
            key={link.label}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-[#f4f4f0] text-slate-700">
      <div className="pointer-events-none absolute inset-x-0 top-0 grid h-24 grid-cols-6 border-b border-slate-200/60 opacity-70">
        {Array.from({ length: 6 }).map((_, index) => (
          <span className="border-r border-slate-200/70" key={index} />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-56 pt-24 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Link className="flex w-fit items-center gap-3 text-slate-950" href="/">
              <span className="grid size-10 place-items-center overflow-hidden rounded-xl bg-blue-600">
                <Image
                  alt=""
                  className="size-full object-cover"
                  height={40}
                  src="/viralq-logo.png"
                  width={40}
                />
              </span>
              <span className="text-2xl font-semibold tracking-tight">ViralIQ</span>
            </Link>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              AI video intelligence for short-form teams. Upload a video, understand the creative
              signals, and turn every report into a sharper next edit.
            </p>

            <div className="mt-7 grid max-w-xl grid-cols-2 gap-5 sm:grid-cols-4">
              {signalTimes.map((signal) => (
                <div key={signal.city}>
                  <p className="font-mono text-sm tracking-wider text-slate-950">{signal.time}</p>
                  <p className="mt-1 text-xs font-medium text-slate-600">{signal.city}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-slate-400">
                    {signal.region}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:justify-end">
            <FooterLinkGroup label="Product" links={productLinks} />
            <FooterLinkGroup label="Legal" links={legalLinks} />
          </div>
        </div>

        <div className="relative z-10 mt-20 flex flex-col items-start justify-between gap-4 border-t border-slate-300/70 pt-6 text-[11px] uppercase tracking-[0.2em] text-slate-500 lg:flex-row lg:items-center">
          <p>© 2026 ViralIQ</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <span>ViralIQ.app</span>
            <span>hello@viraliq.app</span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              All systems operational
            </span>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 opacity-70"
      >
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.36)_1px,transparent_0)] bg-[length:7px_7px] [clip-path:polygon(0_60%,12%_30%,25%_56%,37%_25%,50%_58%,62%_18%,74%_56%,86%_32%,100%_62%,100%_100%,0_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.45)_1px,transparent_0)] bg-[length:6px_6px] [clip-path:polygon(0_45%,8%_20%,16%_56%,25%_22%,34%_58%,43%_18%,52%_60%,61%_28%,70%_62%,79%_20%,88%_58%,100%_24%,100%_100%,0_100%)]" />
        <div className="absolute bottom-24 right-36 size-28 rounded-full bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.38)_1px,transparent_0)] bg-[length:6px_6px]" />
        <div className="absolute bottom-40 left-28 h-8 w-28 rounded-full bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.24)_1px,transparent_0)] bg-[length:6px_6px]" />
      </div>
    </footer>
  );
}
