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
    images: ["/services/ceramic-coating-hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diamond Clean Detail",
    description:
      "Premium mobile car detailing, ceramic coatings, paint protection film, and window tinting across the Denver Metro Area.",
    images: ["/services/ceramic-coating-hero.jpg"],
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