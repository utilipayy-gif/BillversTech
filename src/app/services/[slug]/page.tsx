import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, getServices } from "@/lib/content-store";
import { formatPrice } from "@/app/service-data";
import { BillversFooter, BillversHeader } from "@/app/site-chrome";
import { ServicePackages } from "@/app/service-packages";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const service = await getService((await params).slug);
  return service ? { title: `${service.title} | BillversTech`, description: service.short } : {};
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const allServices = await getServices();
  const { slug } = await params;
  const service = allServices.find((item) => item.slug === slug);
  if (!service) notFound();
  const hasPackages = Boolean(service.packages?.length);
  const related = allServices.filter((item) => item.category === service.category && item.slug !== service.slug).slice(0, 3);

  return <main className="bh-site">
    <BillversHeader services={allServices} />
    <section className="bh-service-hero">
      <div>
        <span className="bh-kicker">SERVICES / {service.category.toUpperCase()}</span>
        <h1>{service.title}</h1>
        <p>{service.short}</p>
        <div className="service-price">
          <span>{hasPackages ? "Packages from" : "Starting at"}</span>
          <strong>{formatPrice(service)}</strong>
          <small>{hasPackages ? `${service.packages?.length} packages available.` : "Final price depends on confirmed scope."}</small>
        </div>
        <div className="bh-actions">
          <Link className="bh-button bh-button-dark" href={hasPackages ? "#packages" : `/checkout?service=${service.slug}`}>
            {hasPackages ? "Compare packages" : "Order this service"} <span>→</span>
          </Link>
          <Link className="bh-text-link" href="/contact">Ask a question ↗</Link>
        </div>
      </div>
      <div className="bh-service-poster">
        <span>{service.category}</span>
        <strong>{service.title.split(" ").map((word) => <i key={word}>{word}</i>)}</strong>
        <b>BUILT FOR<br />REAL BUSINESS</b>
      </div>
    </section>
    <section className="bh-section bh-service-intro">
      <div className="bh-heading"><span>01 / THE SERVICE</span><h2>A useful digital presence starts with <i>purpose.</i></h2></div>
      <div><p>{service.intro}</p><h3>What this helps you achieve</h3><ul>{service.benefits.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </section>
    <ServicePackages service={service} />
    <section className="bh-dark-section">
      <div className="bh-section bh-deliverables">
        <div className="bh-heading bh-heading-light"><span>{hasPackages ? "03" : "02"} / WHAT&apos;S INCLUDED</span><h2>From direction to <i>delivery.</i></h2></div>
        <div>{service.deliverables.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><p>Planned and delivered around your goals, audience and existing setup.</p></article>)}</div>
      </div>
    </section>
    <section className="bh-section">
      <div className="bh-heading"><span>{hasPackages ? "04" : "03"} / RELATED SERVICES</span><h2>Bring the right pieces <i>together.</i></h2></div>
      <div className="bh-related">{related.map((item) => <Link href={`/services/${item.slug}`} key={item.slug}><span>{item.category}</span><h3>{item.title}</h3><p>{item.short}</p><b>Explore ↗</b></Link>)}</div>
    </section>
    <section className="bh-conversion">
      <div>
        <span>READY WHEN YOU ARE</span>
        <h2>{hasPackages ? "Build your package and review the total." : "Ready to order this service?"}</h2>
        <p>{hasPackages ? "Select the exact package you need, combine other services and continue to the payment-ready checkout." : "Add this service to your order, share your details and review the total before payment."}</p>
      </div>
      <Link className="bh-button bh-button-dark" href={`/checkout?service=${service.slug}`}>{hasPackages ? "Start your order" : "Order this service"} →</Link>
    </section>
    <BillversFooter />
  </main>;
}
