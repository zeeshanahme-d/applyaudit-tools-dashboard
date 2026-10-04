import { QueryClient } from "@tanstack/react-query";

// The marketing app's settings (marketing/src/app/providers.tsx): an analysis is never retried silently.
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 60_000, retry: false },
        mutations: { retry: false },
    },
});
