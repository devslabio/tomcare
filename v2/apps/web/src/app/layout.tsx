import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin", "latin-ext"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "TOMCARE Foundation — Support for newcomers and families in Montréal",
    template: "%s | TOMCARE Foundation",
  },
  description: site.description,
  keywords: [
    "TOMCARE Foundation",
    "newcomers Montréal",
    "aide aux nouveaux arrivants",
    "asylum seekers Quebec",
    "immigrant support Montreal",
    "non-profit Montréal",
    "volunteer Montréal",
    "donate clothes Montréal",
  ],
  openGraph: {
    title: "TOMCARE Foundation — No one should have to start over alone",
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_CA",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b1537",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${jakarta.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
