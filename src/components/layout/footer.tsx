import { Link } from "@heroui/react";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-semibold text-slate-900">ViralIQ</p>
          <p className="mt-1">© 2026 ViralIQ. Creative intelligence for modern teams.</p>
        </div>
        <div className="flex items-center gap-5">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              className="text-sm text-slate-500 hover:text-slate-950"
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
