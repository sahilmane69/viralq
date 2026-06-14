import { Button, Link } from "@heroui/react";
import { ThemeToggle } from "./theme-toggle";

const navigationItems = [
  { label: "Product", href: "#product" },
  { label: "Workflow", href: "#workflow" },
  { label: "Insights", href: "#insights" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/72">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link className="flex items-center gap-3 text-slate-950 dark:text-white" href="/">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-soft-xl">
            VI
          </span>
          <span className="text-base font-semibold tracking-normal">ViralIQ</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            as={Link}
            className="hidden bg-slate-950 px-5 font-semibold text-white dark:bg-white dark:text-slate-950 sm:inline-flex"
            href="#upload"
            radius="full"
            size="sm"
          >
            Start analysis
          </Button>
        </div>
      </nav>
    </header>
  );
}
