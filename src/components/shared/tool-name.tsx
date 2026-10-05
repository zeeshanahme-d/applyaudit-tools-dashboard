import { MoveHorizontal } from "lucide-react";

/**
 * A tool's name. In a pair ("Resume ↔ Job") the arrow is drawn rather than
 * typed, so it never falls back to another font, and is read as "and".
 */
export function ToolName({ name }: { name: string }) {
  const [first, second] = name.split(" ↔ ");
  if (second === undefined) return name;
  return (
    <>
      {first}
      <MoveHorizontal className="mx-[0.3em] inline size-[0.95em] align-[-0.14em] opacity-70" aria-hidden="true" />
      <span className="sr-only"> and </span>
      {second}
    </>
  );
}
