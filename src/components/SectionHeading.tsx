/** Standard section heading across the site: an optional eyebrow, a large
 * title with an optional chrome-gradient accent on the trailing words, and an
 * optional subtitle. Keeps every page on the same typographic scale instead of
 * each section inventing its own heading size. */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  subtitle,
  align = "center",
  as = "h2",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  /** Trailing words rendered in the chrome gradient, e.g. title="Why It's" accent="Worth It". */
  accent?: string;
  subtitle?: string;
  align?: "center" | "left";
  /** Use "h1" for the single page-level heading; sections stay "h2". */
  as?: "h1" | "h2";
  className?: string;
}) {
  const centered = align === "center";
  const Tag = as;

  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <span className="block text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted mb-3">
          {eyebrow}
        </span>
      )}
      <Tag
        className={`font-bold tracking-tight text-balance ${
          as === "h1" ? "text-3xl sm:text-5xl" : "text-2xl sm:text-4xl"
        }`}
      >
        {title}
        {accent && (
          <>
            {" "}
            <span className="chrome-text">{accent}</span>
          </>
        )}
      </Tag>
      {subtitle && (
        <p
          className={`text-sm sm:text-base text-muted mt-3 max-w-2xl ${
            centered ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
