import { notFound } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The /dev routes are the test and review surface (example stages for the
 * e2e suite, the compare tool, the token dumps), not documentation. On a
 * Vercel deploy `VERCEL` is set, and they 404 so the hosted site carries only
 * the docs; locally and in CI (`next start`) they stay, since the e2e suite
 * drives them (LDS-159).
 */
export default function DevLayout({ children }: { children: ReactNode }) {
  if (process.env.VERCEL) notFound();
  return children;
}
