export type SocialLink = {
  name: string;
  url: string | null;
};

// Add the real profile URL for each once Farhan has them set up.
export const socialLinks: SocialLink[] = [
  { name: "Facebook", url: "https://www.facebook.com/Diamondcleandetailingdenver" },
  { name: "Instagram", url: "https://www.instagram.com/diamondcleandetail/" },
  { name: "YouTube", url: null },
  // The search rather than a Maps place URL: the listing is still under the
  // old "Diamond Clean Detailing" name, and a search survives the rename.
  { name: "Google", url: "https://www.google.com/search?q=diamond+clean+detailing" },
  { name: "TikTok", url: null },
];
