import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
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
  address: {
    "@type": "PostalAddress",
    addressLocality: "Denver",
    addressRegion: "CO",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:30",
      closes: "18:00",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
