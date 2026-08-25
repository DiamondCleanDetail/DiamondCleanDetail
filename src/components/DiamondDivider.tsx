export default function DiamondDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
      <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
        <defs>
          <linearGradient id="diamond-divider-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b8e94" />
            <stop offset="50%" stopColor="#eceef0" />
            <stop offset="100%" stopColor="#8b8e94" />
          </linearGradient>
        </defs>
        <path
          d="M12 2 L18 8 L12 22 L6 8 Z"
          fill="none"
          stroke="url(#diamond-divider-grad)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M6 8 L18 8" stroke="url(#diamond-divider-grad)" strokeWidth="1" opacity="0.7" />
        <path d="M12 2 L9.5 8 L12 22" stroke="url(#diamond-divider-grad)" strokeWidth="0.7" opacity="0.5" />
        <path d="M12 2 L14.5 8 L12 22" stroke="url(#diamond-divider-grad)" strokeWidth="0.7" opacity="0.5" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
    </div>
  );
}
