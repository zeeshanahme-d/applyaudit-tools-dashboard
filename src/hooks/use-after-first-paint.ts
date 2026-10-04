import { useEffect, useState } from "react";

/**
 * Returns false on the server and on the first client render, then true.
 *
 * Two uses:
 *  - hydration safety, for values that only exist in the browser (e.g. the
 *    resolved theme), so server and client markup match on the first pass;
 *  - enter animations, where an element must first paint in its "from" state
 *    for a CSS transition to run at all.
 *
 * The flag flips inside requestAnimationFrame rather than synchronously in the
 * effect body. A synchronous setState there re-renders before the browser
 * paints, which both defeats the transition and triggers a cascading render.
 */
export function useAfterFirstPaint(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return ready;
}
