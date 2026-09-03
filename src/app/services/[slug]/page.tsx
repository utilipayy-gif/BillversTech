import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServices } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const service = await getService((await params).slug);
  return service ? { title: `${service.title} | BillversTech`, description: service.short } : {};
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const service = await getService((await params).slug);
  if (!service) notFound();
  const related = (await getServices()).filter((item) => item.category === service.category && item.slug !== service.slug).slice(0, 3);
  return <main className="bh-site">
    <header className="bh-header"><Link className="mw-brand" href="/"><Image className="mw-logo" src="/logo-mark.svg" alt="" width={34} height={34} priority /><span>BillversTech</span></Link><nav className="bh-nav"><Link href="/#services">Services</Link><Link href="/#process">How we work</Link><Link href="/#about">Why us</Link><Link href="/#contact">Contact</Link></nav><details className="bh-mobile-menu"><summary aria-label="Open navigation">Menu <span>＋</span></summary><nav><Link href="/#services">Services</Link><Link href="/#process">How we work</Link><Link href="/#about">Why us</Link><Link href="/#contact">Contact</Link></nav></details><Link className="bh-header-cta" href="/#contact">Request a quote <span>↗</span></Link></header>
    <section className="bh-service-hero"><div><span className="bh-kicker">HOME / SERVICES / {service.category.toUpperCase()}</span><h1>{service.title}</h1><p>{service.short}</p><Link className="bh-button bh-button-dark" href="/#contact">Talk about this service <span>↗</span></Link></div><div className="bh-service-poster"><span>{service.category}</span><strong>{service.title.split(" ").map((word) => <i key={word}>{word}</i>)}</strong><b>BUILT FOR<br />REAL BUSINESS</b></div></section>
    <section className="bh-section bh-service-intro"><div className="bh-heading"><span>01 / THE SERVICE</span><h2>A useful digital presence starts with <i>purpose.</i></h2></div><div><p>{service.intro}</p><h3>What this helps you achieve</h3><ul>{service.benefits.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
    <section className="bh-dark-section"><div className="bh-section bh-deliverables"><div className="bh-heading bh-heading-light"><span>02 / WHAT&apos;S INCLUDED</span><h2>From direction to <i>delivery.</i></h2></div><div>{service.deliverables.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2,"0")}</span><h3>{item}</h3><p>Planned and delivered around your goals, audience and existing setup.</p></article>)}</div></div></section>
    <section className="bh-section"><div className="bh-heading"><span>03 / RELATED SERVICES</span><h2>Bring the right pieces <i>together.</i></h2></div><div className="bh-related">{related.map((item) => <Link href={`/services/${item.slug}`} key={item.slug}><span>{item.category}</span><h3>{item.title}</h3><p>{item.short}</p><b>Explore ↗</b></Link>)}</div></section>
    <section className="bh-service-cta"><span>READY WHEN YOU ARE</span><h2>Let&apos;s turn the idea into a clear plan.</h2><Link className="bh-button" href="/#contact">Request a proposal <span>↗</span></Link></section>
    <footer className="bh-footer"><div><Link className="mw-brand" href="/"><Image className="mw-logo" src="/logo-mark.svg" alt="" width={34} height={34} /><span>BillversTech</span></Link><p>Design, development and digital growth for ambitious businesses.</p></div><div><strong>Explore</strong><Link href="/#services">All services</Link><Link href="/#process">How we work</Link></div><div><strong>Contact</strong><a href="tel:+917082688288">+91 70826 88288</a><a href="mailto:support@billverstech.com">support@billverstech.com</a></div><small>© 2026 BillversTech</small></footer>
  </main>;
}
