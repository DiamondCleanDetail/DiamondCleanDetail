export type SocialLink = {
  name: string;
  url: string | null;
};

// Add the real profile URL for each once Farhan has them set up.
export const socialLinks: SocialLink[] = [
  // Was https://www.facebook.com/Diamondcleandetailingdenver — that URL now
  // returns Facebook's "content isn't available" page, meaning the page was
  // deleted, renamed, or made non-public. Nulled rather than left pointing at
  // a dead end: an icon that goes nowhere is worse than no icon, and this one
  // sits in the header of every page. Restore it the moment we have the
  // working URL.
  { name: "Facebook", url: null },
  { name: "Instagram", url: "https://www.instagram.com/diamondcleandetail/" },
  { name: "YouTube", url: null },
  // The search rather than a Maps place URL: the listing is still under the
  // old "Diamond Clean Detailing" name, and a search survives the rename.
  { name: "Google", url: "https://www.google.com/search?q=diamond+clean+detailing" },
  { name: "TikTok", url: null },
];
