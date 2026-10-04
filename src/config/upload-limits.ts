/*
 A file over these limits is refused before any AI call: a 30-page PDF once
 * cost two full reads (135K input tokens) and was then rejected anyway.
 */

/** A whole number above zero, else the fallback. Same rules as the API's intFromEnv (marketing/src/config/ai.ts). */
export function positiveIntOr(value: string | undefined, fallback: number): number {
  const parsed = Number((value ?? "").replace(/[_,\s]/g, ""));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

// `?.`: outside Vite (the Node test runner) there is no import.meta.env.
export const UPLOAD_LIMITS = {
  maxFileMb: positiveIntOr(import.meta.env?.VITE_MAX_FILE_MB, 2),
  maxPages: positiveIntOr(import.meta.env?.VITE_MAX_PAGES, 3),
} as const;
