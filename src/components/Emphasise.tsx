import { Fragment } from "react";

/**
 * Bolds named phrases inside a block of copy without rewriting it.
 *
 * The policy text is Farhan's own wording and is not ours to edit, but a
 * hundred-word paragraph in small grey type at the payment step gets skimmed
 * to nothing. Emphasis is the one thing that can be added without changing
 * what was said — so the phrases live beside the text in the data, and this
 * only ever wraps them.
 *
 * A phrase that no longer appears is dropped silently in production and
 * warned about in development: the wording is allowed to change, but the
 * emphasis quietly vanishing is the kind of thing nobody notices for months.
 */
export default function Emphasise({
  text,
  phrases,
  className = "",
}: {
  text: string;
  phrases?: readonly string[];
  className?: string;
}) {
  if (!phrases?.length) return <span className={className}>{text}</span>;

  // Split on every phrase at once, keeping the delimiters, so overlapping or
  // repeated phrases can't produce nested markup.
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "g"));

  if (process.env.NODE_ENV !== "production") {
    for (const p of phrases) {
      if (!text.includes(p)) {
        console.warn(`Emphasise: phrase not found in text — "${p}"`);
      }
    }
  }

  return (
    <span className={className}>
      {parts.map((part, i) =>
        phrases.includes(part) ? (
          <strong key={i} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </span>
  );
}
