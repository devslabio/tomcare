import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { I18nProvider } from "@/components/i18n-provider";
import { RevealObserver } from "@/components/reveal";
import { getNavPages, getPrograms, getSettings } from "@/lib/cms";
import { getI18n } from "@/lib/i18n/server";
import { mainNav, site } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, programs, pages, { locale, t }] = await Promise.all([getSettings(), getPrograms(), getNavPages(), getI18n()]);
  const customPages = pages
    .filter((page) => page.showInNav)
    .map((page) => ({ href: `/${page.slug}`, label: page.navLabel || page.title }));
  const main = mainNav.map((item) => ({ href: item.href, label: t.nav[item.key] }));
  const nav = [...main.slice(0, -1), ...customPages, ...main.slice(-1)];
  const { contact } = settings;

  const organization = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: site.name,
    alternateName: "Fondation TOMCARE",
    url: site.url,
    description: t.meta.description,
    email: contact.email,
    telephone: contact.phone,
    foundingDate: settings.about.founded,
    address: { "@type": "PostalAddress", addressLocality: "Montréal", addressRegion: "QC", addressCountry: "CA" },
    sameAs: Object.values(settings.links).filter(Boolean),
  };

  return (
    <I18nProvider locale={locale}>
      <Header nav={nav} phone={contact.phone} phoneDisplay={contact.phoneDisplay} email={contact.email} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} programs={programs} pages={customPages} />
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
      />
    </I18nProvider>
  );
}
