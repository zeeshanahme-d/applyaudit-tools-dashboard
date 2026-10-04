import { QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/routes";
import { queryClient } from "./lib/queryClient";

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppRoutes />
        </QueryClientProvider>
    );
}
