import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
// Self-hosted, like next/font on the marketing site: no request to a font CDN.
import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
