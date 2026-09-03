import Image from "next/image";
import Link from "next/link";
import BillversLeadForm from "./billvers-lead-form";
import { serviceGroups } from "./service-data";
import { getServices } from "@/lib/content-store";

const featured = ["website-design", "website-development", "seo", "custom-web-applications", "ecommerce-websites", "web-hosting"];

export const dynamic = "force-dynamic";

export default async function Home() {
  const allServices = await getServices();
  const knownCategories = new Set<string>(serviceGroups.map((group) => group.title));
  const groups = [
    ...serviceGroups.map((group) => ({ ...group, services: allServices.filter((service) => service.category === group.title) })),
    ...Array.from(new Set(allServices.filter((service) => !knownCategories.has(service.category)).map((service) => service.category))).map((category, index) => ({ number: String(serviceGroups.length + index + 1).padStart(2,"0"), title: category, description: "Additional specialist services configured for your business.", services: allServices.filter((service) => service.category === category) })),
  ].filter((group) => group.services.length);
  const featuredServices = featured.map((slug) => allServices.find((service) => service.slug === slug)).filter((service) => service !== undefined);
  return (
    <main className="bh-site">
      <header className="bh-header" id="top">
        <Link className="mw-brand" href="/" aria-label="BillversTech home"><Image className="mw-logo" src="/logo-mark.svg" alt="" width={34} height={34} priority /><span>BillversTech</span></Link>
        <nav className="bh-nav" aria-label="Primary navigation"><a href="#services">Services</a><a href="#process">How we work</a><a href="#about">Why us</a><a href="#contact">Contact</a></nav>
        <details className="bh-mobile-menu"><summary aria-label="Open navigation">Menu <span>＋</span></summary><nav><a href="#services">Services</a><a href="#process">How we work</a><a href="#about">Why us</a><a href="#contact">Contact</a></nav></details>
        <a className="bh-header-cta" href="#contact">Request a quote <span>↗</span></a>
      </header>

      <section className="bh-hero">
        <div className="bh-hero-copy bh-reveal">
          <span className="bh-kicker">WEB • MOBILE • MARKETING • HOSTING</span>
          <h1>Your business deserves a website that <em>works.</em></h1>
          <p>We design, develop and grow digital experiences that help businesses look credible, reach the right people and turn attention into enquiries.</p>
          <div className="bh-actions"><a className="bh-button bh-button-dark" href="#contact">Discuss your project <span>↗</span></a><a className="bh-text-link" href="#services">Explore all services <span>↓</span></a></div>
          <div className="bh-proof"><span>Custom, not templated</span><span>Responsive by default</span><span>Support after launch</span></div>
        </div>
        <div className="bh-hero-art bh-reveal" aria-label="BillversTech digital services">
          <div className="bh-window"><div className="bh-window-bar"><i /><i /><i /><span>yourbusiness.com</span></div><strong>Designed to be<br /><em>remembered.</em></strong><p>Strategy / Design / Development</p><b>↘</b></div>
          <div className="bh-art-card"><span>FULL-SERVICE DIGITAL PARTNER</span><strong>05</strong><small>connected service areas</small></div>
        </div>
      </section>

      <div className="bh-ticker"><div>Website Design <b>✦</b> Web Development <b>✦</b> SEO & Marketing <b>✦</b> Custom Applications <b>✦</b> Domains & Hosting <b>✦</b> Website Design <b>✦</b></div></div>

      <section className="bh-section" id="services">
        <div className="bh-heading"><span>01 / EVERYTHING YOUR BUSINESS NEEDS ONLINE</span><h2>One partner.<br /><i>Every digital need.</i></h2><p>Choose one focused service or bring the whole journey together—from the first brand idea to launch, visibility and ongoing care.</p></div>
        <div className="bh-category-list">
          {groups.map((group) => (
            <article className="bh-category" key={group.title}>
              <span className="bh-category-number">{group.number}</span>
              <div><h3>{group.title}</h3><p>{group.description}</p></div>
              <div className="bh-service-links">{group.services.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}>{service.title}<span>↗</span></Link>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="bh-dark-section">
        <div className="bh-section">
          <div className="bh-heading bh-heading-light"><span>02 / POPULAR SERVICES</span><h2>Start where the opportunity is <i>clearest.</i></h2></div>
          <div className="bh-featured-grid">{featuredServices.map((service, index) => <Link className="bh-feature-card" href={`/services/${service.slug}`} key={service.slug}><span>{String(index + 1).padStart(2,"0")} / {service.category}</span><h3>{service.title}</h3><p>{service.short}</p><b>Explore service ↗</b></Link>)}</div>
        </div>
      </section>

      <section className="bh-section bh-process" id="process">
        <div className="bh-heading"><span>03 / HOW WE WORK</span><h2>Clear from first conversation to <i>delivery.</i></h2></div>
        <div className="bh-steps"><article><span>01</span><h3>Meet & understand</h3><p>We learn about your business, audience, goals and what needs to improve.</p></article><article><span>02</span><h3>Plan & sketch</h3><p>We define the pages, features, content direction, scope and milestones.</p></article><article><span>03</span><h3>Design & develop</h3><p>You review visible progress while we shape the experience and build.</p></article><article><span>04</span><h3>Test & deliver</h3><p>We verify devices, speed and details, launch carefully and hand over access.</p></article></div>
      </section>

      <section className="bh-about" id="about"><div className="bh-section bh-about-grid"><div className="bh-heading"><span>04 / WHY BILLVERSTECH</span><h2>Good digital work should create <i>confidence.</i></h2></div><div className="bh-reasons"><p><span>A</span><strong>Built around your business</strong>Every design and feature has a reason connected to your customer.</p><p><span>B</span><strong>One accountable team</strong>Strategy, design, development and launch stay connected.</p><p><span>C</span><strong>Ready for what comes next</strong>Scalable foundations make future content, services and payments easier.</p><p><span>D</span><strong>Ownership stays clear</strong>Your domain, accounts, website and business data remain yours.</p></div></div></section>

      <section className="bh-contact" id="contact"><div className="bh-section bh-contact-grid"><div className="bh-heading"><span>05 / LET&apos;S BUILD SOMETHING USEFUL</span><h2>Tell us what you want to <i>make possible.</i></h2><p>A rough idea is enough. We&apos;ll help turn it into the right service, a clear scope and a practical next step.</p><div className="bh-direct"><a href="tel:+917082688288"><small>CALL / WHATSAPP</small><strong>+91 70826 88288</strong></a><a href="mailto:support@billverstech.com"><small>EMAIL</small><strong>support@billverstech.com</strong></a></div></div><BillversLeadForm /></div></section>

      <footer className="bh-footer"><div><Link className="mw-brand" href="#top"><Image className="mw-logo" src="/logo-mark.svg" alt="" width={34} height={34} /><span>BillversTech</span></Link><p>Design, development and digital growth for ambitious businesses.</p></div><div><strong>Explore</strong><a href="#services">All services</a><a href="#process">How we work</a><a href="#contact">Request a quote</a></div><div><strong>Legal</strong><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms & conditions</Link></div><small>© 2026 BillversTech · billverstech.com</small></footer>
      <a className="bh-whatsapp" href="https://wa.me/917082688288?text=Hello%20BillversTech%2C%20I%27d%20like%20to%20discuss%20a%20digital%20project." target="_blank" rel="noopener noreferrer">WhatsApp us <span>↗</span></a>
    </main>
  );
}
