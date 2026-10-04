/** Brand and endpoints. The name comes from here only, never hard-coded. */
export const appConfig = {
  name: import.meta.env.VITE_APP_NAME ?? "ApplyAudit",
  description: "Privacy-first Resume, LinkedIn, ATS and Job Match analyzer.",
  tagline: "Know what's stopping your next interview.",
  /** The existing Next.js app that serves the analysis API, without a trailing slash. */
  apiUrl: (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
} as const;
