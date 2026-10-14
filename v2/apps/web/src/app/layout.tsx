import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import { getAlternates, getI18n, getLocale } from "@/lib/i18n/server";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin", "latin-ext"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [{ t }, alternates] = await Promise.all([getI18n(), getAlternates()]);
  return {
    metadataBase: new URL(site.url),
    alternates,
    title: { default: t.meta.defaultTitle, template: `%s | ${t.meta.siteName}` },
    description: t.meta.description,
    keywords: [
      "TOMCARE Foundation",
      "Fondation TOMCARE",
      "newcomers Montréal",
      "aide aux nouveaux arrivants",
      "asylum seekers Quebec",
      "demandeurs d’asile Québec",
      "immigrant support Montreal",
      "organisme sans but lucratif Montréal",
      "volunteer Montréal",
      "bénévolat Montréal",
    ],
    openGraph: {
      title: t.meta.ogTitle,
      description: t.meta.description,
      url: site.url,
      siteName: t.meta.siteName,
      locale: t.meta.ogLocale,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b1537",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html lang={locale === "fr" ? "fr-CA" : "en-CA"} data-scroll-behavior="smooth" className={`${jakarta.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
