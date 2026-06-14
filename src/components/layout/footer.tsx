import { Link } from "@heroui/react";

const footerLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/60 dark:border-slate-800/80 dark:bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-400">
        <p>© 2026 ViralIQ. AI video intelligence for modern content teams.</p>
        <div className="flex items-center gap-5">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              className="text-sm text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
