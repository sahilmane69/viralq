import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ViralIQ | AI Video Intelligence",
  description: "Analyze short-form videos with AI and turn creative signals into action.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans antialiased">
          <Providers>
            <SiteShell>{children}</SiteShell>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
