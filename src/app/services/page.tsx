import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/content-store";
import { formatPrice } from "../service-data";
import { BillversFooter, BillversHeader, categoryId, groupServices } from "../site-chrome";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Digital Services | BillversTech", description: "Explore BillversTech website, application, marketing, creative, domain and hosting services." };

export default async function ServicesPage() { const services = await getServices(); const groups = groupServices(services); return <main className="bh-site"><BillversHeader services={services}/><section className="bh-page-hero bh-page-hero-short"><span className="bh-kicker">SERVICES / WHAT WE DO</span><h1>The right service for your next <em>move.</em></h1><p>Browse by business need, compare starting prices and open any service for its outcomes and deliverables.</p></section><section className="bh-section bh-services-page"><div className="bh-category-list">{groups.map(group=><article className="bh-category" id={categoryId(group.title)} key={group.title}><span className="bh-category-number">{group.number}</span><div><h2>{group.title}</h2><p>{group.description}</p></div><div className="bh-service-links">{group.services.map(service=><Link href={`/services/${service.slug}`} key={service.slug}><span><strong>{service.title}</strong><small>Starting at {formatPrice(service)}</small></span><b>↗</b></Link>)}</div></article>)}</div></section><section className="bh-conversion"><div><span>NOT SURE WHICH FITS?</span><h2>Start with your goal, not a technical brief.</h2><p>Tell us what needs to change and we&apos;ll point you to the smallest useful package.</p></div><div><Link className="bh-button bh-button-dark" href="/checkout">Build your package <span>→</span></Link><Link className="bh-text-link" href="/contact">Ask for guidance <span>↗</span></Link></div></section><BillversFooter/></main>; }
