"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Button, Link } from "@heroui/react";

const navigationItems = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#cta" },
];

export function Navbar() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link className="flex items-center gap-3 text-slate-950" href="/">
          <span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white">
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m5 7 4 10 3-7 3 7 4-10" />
            </svg>
          </span>
          <span className="text-base font-semibold tracking-normal">ViralIQ</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-950"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isLoaded && isSignedIn ? (
            <>
              <Button
                as={Link}
                className="hidden bg-blue-600 px-5 font-semibold text-white sm:inline-flex"
                href="/dashboard"
                radius="lg"
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
            </>
          ) : null}
          {isLoaded && !isSignedIn ? (
            <>
              <Button
                as={Link}
                className="hidden border-slate-300 bg-white/70 px-4 font-semibold text-slate-800 sm:inline-flex"
                href="/sign-in"
                radius="lg"
                size="sm"
                variant="bordered"
              >
                Sign in
              </Button>
              <Button
                as={Link}
                className="hidden bg-blue-600 px-5 font-semibold text-white sm:inline-flex"
                href="/sign-up"
                radius="lg"
                size="sm"
              >
                Sign up
              </Button>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
