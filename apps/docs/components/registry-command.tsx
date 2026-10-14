"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * The `shadcn add` command for a component, with this site's own origin. The
 * site is fully static (LDS-159), so the origin is read from the browser
 * rather than from a request: the static HTML carries a placeholder and the
 * real origin replaces it right after hydration — right on localhost, right on
 * the hosted site, right on a preview URL.
 */
export function RegistryCommand({ name }: { name: string }) {
  const origin = useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => "https://<this-site>",
  );
  return `npx shadcn@latest add ${origin}/r/${name}.json`;
}
