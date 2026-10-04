/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  /** The existing Next.js app that serves the analysis API, e.g. http://localhost:3000. */
  readonly VITE_API_URL?: string;
  readonly VITE_APP_NAME?: string;
  /** Upload limits for the browser check (src/config/upload-limits.ts). */
  readonly VITE_MAX_FILE_MB?: string;
  readonly VITE_MAX_PAGES?: string;
}
