"use client";

import { Show, UserButton } from "@clerk/nextjs";
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
          <Show when="signed-out">
            <Button
              as={Link}
              className="hidden border-slate-300 bg-white/70 px-4 font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 sm:inline-flex"
              href="/sign-in"
              radius="full"
              size="sm"
              variant="bordered"
            >
              Sign in
            </Button>
            <Button
              as={Link}
              className="hidden bg-slate-950 px-5 font-semibold text-white dark:bg-white dark:text-slate-950 sm:inline-flex"
              href="/sign-up"
              radius="full"
              size="sm"
            >
              Sign up
            </Button>
          </Show>
          <Show when="signed-in">
            <Button
              as={Link}
              className="hidden bg-slate-950 px-5 font-semibold text-white dark:bg-white dark:text-slate-950 sm:inline-flex"
              href="/dashboard"
              radius="full"
              size="sm"
            >
              Dashboard
            </Button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-9",
                },
              }}
            />
          </Show>
        </div>
      </nav>
    </header>
  );
}
