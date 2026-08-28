export default function StatCallouts({
  stats,
  light = false,
}: {
  stats: { value: string; label: string }[];
  /** Set true when rendering on a light-themed page (e.g. window tinting). */
  light?: boolean;
}) {
  return (
    <div className={`grid gap-4 sm:gap-5 ${stats.length === 1 ? "" : "sm:grid-cols-2"}`}>
      {stats.map((s) => (
        <div
          key={s.label}
          className={`text-center rounded-xl border-2 p-6 sm:p-8 ${
            light ? "bg-neutral-50 border-neutral-300" : "bg-surface border-border"
          }`}
        >
          <p className={light ? "chrome-text-dark text-4xl sm:text-5xl font-black" : "chrome-text text-4xl sm:text-5xl font-black"}>
            {s.value}
          </p>
          <p className={`mt-2 text-sm ${light ? "text-neutral-500" : "text-muted"}`}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
