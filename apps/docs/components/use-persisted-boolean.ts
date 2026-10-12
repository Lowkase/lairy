"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
/** Last value written in this tab, for when storage is blocked (private
 * mode, cookies off): the toggle still works for the page's lifetime. */
const memory = new Map<string, boolean>();

function read(key: string): boolean {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored !== null) return stored === "1";
  } catch {
    // Storage unavailable — fall through to memory.
  }
  return memory.get(key) ?? false;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Another tab changing the same key.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * A boolean that survives navigation. The shell's rail links are plain
 * `<a href>`s, so every section change is a full page load and React state
 * alone resets (LDS-157). The server snapshot is always `false`, so the HTML
 * is the same every time; a stored `true` is applied right after hydration.
 */
export function usePersistedBoolean(key: string): [boolean, (next: boolean) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => false,
  );
  const set = useCallback(
    (next: boolean) => {
      memory.set(key, next);
      try {
        window.localStorage.setItem(key, next ? "1" : "0");
      } catch {
        // Not persisted; the in-memory value above still drives this page.
      }
      listeners.forEach((listener) => listener());
    },
    [key],
  );
  return [value, set];
}
