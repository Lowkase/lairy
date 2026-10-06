import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const heading = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--ff-heading",
});

const body = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--ff-body",
});

export const metadata: Metadata = {
  title: "Lairy",
  description: "The Lairy design system.",
};

// viewportFit: "cover" lets content draw under a phone's notch and home
// indicator, so `env(safe-area-inset-*)` resolves to real insets instead of
// 0 everywhere (LDS-036, phone shell proposal §"Safe areas"). Harmless
// above phone width — tablet and desktop have no insets to cover.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
