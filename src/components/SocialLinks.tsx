import { socialLinks } from "@/data/social";

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.2h2.7V21h3.4z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.6 12.23c0-.68-.06-1.32-.17-1.95H12v3.9h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.2c1.9-1.75 2.99-4.32 2.99-7.47z" opacity=".9" />
      <path d="M12 22c2.7 0 4.96-.9 6.6-2.4l-3.2-2.5c-.9.6-2.05.95-3.4.95-2.6 0-4.8-1.75-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" opacity=".75" />
      <path d="M6.4 13.95a5.97 5.97 0 0 1 0-3.9V7.45H3.1a10 10 0 0 0 0 9.1l3.3-2.6z" opacity=".6" />
      <path d="M12 6c1.47 0 2.79.5 3.83 1.5l2.86-2.86C16.95 2.9 14.7 2 12 2A10 10 0 0 0 3.1 7.45l3.3 2.6C7.2 7.7 9.4 6 12 6z" opacity=".9" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 3c.3 1.9 1.5 3.4 3.5 3.7v2.7c-1.3.1-2.5-.3-3.5-1v6.4a5.1 5.1 0 1 1-4.4-5v2.8a2.3 2.3 0 1 0 1.6 2.2V3h2.8z" />
    </svg>
  );
}

const icons: Record<string, () => React.ReactElement> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  YouTube: YoutubeIcon,
  Google: GoogleIcon,
  TikTok: TikTokIcon,
};

export default function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center ${compact ? "gap-1" : "justify-center gap-3"}`}>
      {socialLinks.map((social) => {
        const Icon = icons[social.name];
        // Compact drops the button chrome and inherits its colour, so the same
        // icons work on the footer's dark panel and on the blue utility bar
        // without a second copy of the set.
        const className = compact
          ? "w-7 h-7 flex items-center justify-center rounded [&>svg]:w-[15px] [&>svg]:h-[15px] transition-opacity opacity-80 hover:opacity-100"
          : "w-11 h-11 flex items-center justify-center rounded-lg border border-border bg-surface-2 text-muted transition-colors hover:text-foreground hover:border-muted";

        return social.url ? (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className={className}
          >
            <Icon />
          </a>
        ) : (
          <span key={social.name} aria-label={social.name} className={className}>
            <Icon />
          </span>
        );
      })}
    </div>
  );
}
