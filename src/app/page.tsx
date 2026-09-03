import Link from "next/link";
import BillversLeadForm from "./billvers-lead-form";
import { getServices,getSiteSettings } from "@/lib/content-store";
import { BillversFooter, BillversHeader } from "./site-chrome";

const featured = ["website-design", "website-development", "seo", "custom-web-applications", "ecommerce-websites", "web-hosting"];

export const dynamic = "force-dynamic";

export default async function Home() {
  const allServices = await getServices();
  const settings = await getSiteSettings();
  const featuredServices = featured.map((slug) => allServices.find((service) => service.slug === slug)).filter((service) => service !== undefined);
  return (
    <main className="bh-site">
      <BillversHeader services={allServices}/>

      <section className="bh-hero">
        <div className="bh-hero-copy bh-reveal">
          <span className="bh-kicker">WEB • MOBILE • MARKETING • HOSTING</span>
          <h1>Your business deserves a website that <em>works.</em></h1>
          <p>We design, develop and grow digital experiences that help businesses look credible, reach the right people and turn attention into enquiries.</p>
          <div className="bh-actions"><Link className="bh-button bh-button-dark" href="/contact">Discuss your project <span>↗</span></Link><Link className="bh-text-link" href="/services">Explore all services <span>↗</span></Link></div>
          <div className="bh-proof"><span>Custom, not templated</span><span>Responsive by default</span><span>Support after launch</span></div>
        </div>
        <div className="bh-hero-art bh-reveal" aria-label="BillversTech digital services">
          <div className="bh-window"><div className="bh-window-bar"><i /><i /><i /><span>yourbusiness.com</span></div><strong>Designed to be<br /><em>remembered.</em></strong><p>Strategy / Design / Development</p><b>↘</b></div>
          <div className="bh-art-card"><span>FULL-SERVICE DIGITAL PARTNER</span><strong>05</strong><small>connected service areas</small></div>
        </div>
      </section>

      <div className="bh-ticker"><div>Website Design <b>✦</b> Web Development <b>✦</b> SEO & Marketing <b>✦</b> Custom Applications <b>✦</b> Domains & Hosting <b>✦</b> Website Design <b>✦</b></div></div>

      <section className="bh-section bh-home-services" id="services"><div className="bh-heading"><span>01 / CHOOSE YOUR STARTING POINT</span><h2>Turn a business need into a clear <i>next step.</i></h2><p>Pick the outcome closest to where you are now. We&apos;ll connect it to the right service and a transparent starting price.</p></div><div className="bh-start-grid"><Link href="/services#design-development"><span>01 / LAUNCH OR REDESIGN</span><h3>Build a credible digital home.</h3><p>Brand, website and conversion-focused development for a confident first impression.</p><b>Explore web services ↗</b></Link><Link href="/services#internet-marketing"><span>02 / FIND MORE CUSTOMERS</span><h3>Grow useful attention.</h3><p>Search, paid and social campaigns connected to measurable business goals.</p><b>Explore growth services ↗</b></Link><Link href="/services#application-development"><span>03 / IMPROVE A PROCESS</span><h3>Turn manual work into a system.</h3><p>Custom applications, commerce and management tools shaped around real workflows.</p><b>Explore application services ↗</b></Link></div><Link className="bh-button bh-button-dark" href="/services">Compare every service <span>↗</span></Link></section>

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

      <section className="bh-contact" id="contact"><div className="bh-section bh-contact-grid"><div className="bh-heading"><span>05 / LET&apos;S BUILD SOMETHING USEFUL</span><h2>Tell us what you want to <i>make possible.</i></h2><p>A rough idea is enough. We&apos;ll help turn it into the right service, a clear scope and a practical next step.</p><div className="bh-direct"><a href={`tel:${settings.phone.replace(/\s/g,"")}`}><small>CALL / WHATSAPP</small><strong>{settings.phone}</strong></a><a href={`mailto:${settings.email}`}><small>EMAIL</small><strong>{settings.email}</strong></a></div></div><BillversLeadForm whatsapp={settings.whatsapp}/></div></section>

      <BillversFooter/>
    </main>
  );
}
