import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RevealObserver } from "@/components/reveal";
import { getNavPages, getPrograms, getSettings } from "@/lib/cms";
import { mainNav, site } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, programs, pages] = await Promise.all([getSettings(), getPrograms(), getNavPages()]);
  const customPages = pages
    .filter((page) => page.showInNav)
    .map((page) => ({ href: `/${page.slug}`, label: page.navLabel || page.title }));
  const nav = [...mainNav.slice(0, -1), ...customPages, ...mainNav.slice(-1)];
  const { contact } = settings;

  const organization = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: site.name,
    url: site.url,
    description: site.description,
    email: contact.email,
    telephone: contact.phone,
    foundingDate: settings.about.founded,
    address: { "@type": "PostalAddress", addressLocality: "Montréal", addressRegion: "QC", addressCountry: "CA" },
    sameAs: Object.values(settings.links).filter(Boolean),
  };

  return (
    <>
      <Header nav={nav} phone={contact.phone} phoneDisplay={contact.phoneDisplay} email={contact.email} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} programs={programs} pages={customPages} />
      <RevealObserver />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
