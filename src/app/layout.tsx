import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerkAppearance";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import UtilityBar from "@/components/UtilityBar";
import Navbar from "@/components/Navbar";
import MotionProvider from "@/components/MotionProvider";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mayonice = localFont({
  src: "../fonts/Mayonice.otf",
  variable: "--font-mayonice",
  display: "swap",
});

const siteUrl = "https://diamondcleandetail.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Diamond Clean Detail",
    template: "%s | Diamond Clean Detail",
  },
  description:
    "Premium mobile car detailing, ceramic coatings, paint protection film, and window tinting across the Denver Metro Area. Book online in minutes.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Diamond Clean Detail",
    title: "Diamond Clean Detail",
    description:
      "Premium mobile car detailing, ceramic coatings, paint protection film, and window tinting across the Denver Metro Area.",
    images: ["/services/social-share.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diamond Clean Detail",
    description:
      "Premium mobile car detailing, ceramic coatings, paint protection film, and window tinting across the Denver Metro Area.",
    images: ["/services/social-share.jpg"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoDetailing",
  name: "Diamond Clean Detail",
  image: `${siteUrl}/brand/logo.png`,
  url: siteUrl,
  telephone: "+1-720-703-2795",
  email: "info@diamondcleandetail.com",
  areaServed: "Denver Metro Area",
  sameAs: ["https://www.facebook.com/Diamondcleandetailingdenver"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Denver",
    addressRegion: "CO",
    addressCountry: "US",
  },
  // Both, because they are genuinely different: the phone is answered on
  // weekdays, but the only days that take appointments are Saturday and
  // Sunday. Publishing the weekday line alone told Google we were open for
  // business Mon–Fri, which is the opposite of when we can actually detail
  // a car — a search result promising weekday service is a wasted trip.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "19:00",
      description: "Phone and enquiries only — appointments are Saturday and Sunday.",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${mayonice.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Dead-man's switch for the animations.
         *
         * Everything wrapped in FadeIn is server-rendered with an inline
         * opacity:0 that only framer-motion clears. So if the JS bundle dies
         * — a syntax error on an older browser, a chunk that 404s, anything —
         * the header and footer survive and every single thing between them
         * is invisible. The site looks empty rather than broken, which is
         * worse: nobody reports it, they just leave.
         *
         * This arms a timer that forces all of it visible. A successful
         * hydration disarms it (see MotionProvider), so the animations still
         * run normally; only a failure ever trips it. Written in ES5 on
         * purpose — it has to survive exactly the old engines that would
         * choke on the bundle. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.__dcdMotion=setTimeout(function(){" +
              "document.documentElement.className+=' motion-failed'},2500)",
          }}
        />
        <ClerkProvider appearance={clerkAppearance}>
          <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
          />
          <MotionProvider>
            <UtilityBar />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </MotionProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}