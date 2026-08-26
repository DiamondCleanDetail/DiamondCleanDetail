/** Reskins Clerk's prebuilt components to match the site's dark chrome
 * theme (see src/app/globals.css for the source tokens) — keeps every bit
 * of Clerk's built-in functionality (OAuth, password reset, account
 * management, MFA, etc.), just restyled. Typed structurally against
 * ClerkProvider's `appearance` prop where it's used, rather than importing
 * the Appearance type directly (its export path varies across @clerk/*
 * packages/versions). */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#d8dbe0",
    colorPrimaryForeground: "#0a0a0b",
    colorDanger: "#f87171",
    colorNeutral: "#f5f6f7",
    colorForeground: "#f5f6f7",
    colorMuted: "#1a1c1f",
    colorMutedForeground: "#9a9ca2",
    colorBackground: "#121315",
    colorInput: "#1a1c1f",
    colorInputForeground: "#f5f6f7",
    colorBorder: "#26282c",
    colorShadow: "#000000",
    fontFamily: "var(--font-geist-sans), sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "border border-border shadow-2xl",
    headerTitle: "text-foreground",
    headerSubtitle: "text-muted",
    socialButtonsBlockButton: "border border-border hover:bg-surface-2 transition-colors",
    dividerLine: "bg-border",
    dividerText: "text-muted",
    formFieldLabel: "text-foreground",
    formFieldInput: "focus:border-accent",
    formButtonPrimary: "chrome-btn font-semibold normal-case shadow-none",
    footerActionText: "text-muted",
    footerActionLink: "text-foreground hover:text-accent font-medium",
    identityPreviewText: "text-foreground",
    identityPreviewEditButton: "text-accent",
    userButtonPopoverCard: "border border-border shadow-2xl",
    userButtonPopoverActionButton: "hover:bg-surface-2 transition-colors",
    userButtonPopoverActionButtonText: "text-foreground",
    userButtonPopoverFooter: "border-t border-border",
  },
};
