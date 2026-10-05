import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
// Self-hosted: no request to a font CDN. Newsreader with its optical-size axis,
// upright and italic: the paper, headlines and the score.
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "./globals.css";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
