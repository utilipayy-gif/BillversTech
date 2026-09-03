import Image from "next/image";
import Link from "next/link";
import { serviceGroups, type Service } from "./service-data";
import { getSiteSettings } from "@/lib/content-store";
import MobileNav from "./mobile-nav";

export function categoryId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function groupServices(allServices: Service[]) {
  const known = new Set<string>(serviceGroups.map((group) => group.title));
  return [
    ...serviceGroups.map((group) => ({ ...group, services: allServices.filter((service) => service.category === group.title) })),
    ...Array.from(new Set(allServices.filter((service) => !known.has(service.category)).map((service) => service.category))).map((title, index) => ({
      number: String(serviceGroups.length + index + 1).padStart(2, "0"),
      title,
      description: "Additional specialist services configured for your business.",
      services: allServices.filter((service) => service.category === title),
    })),
  ].filter((group) => group.services.length);
}

export function BillversHeader({ services }: { services: Service[] }) {
  const groups = groupServices(services);
  return <header className="bh-header" id="top">
    <Link className="mw-brand" href="/" aria-label="BillversTech home"><Image className="mw-logo" src="/logo-mark.svg" alt="" width={34} height={34} priority /><span>BillversTech</span></Link>
    <nav className="bh-nav" aria-label="Primary navigation">
      <div className="bh-services-menu"><Link href="/services">Services <span className="bh-menu-toggle" aria-hidden="true">+</span></Link><div className="bh-services-dropdown">{groups.map((group) => <section key={group.title}><Link className="bh-dropdown-category" href={`/services#${categoryId(group.title)}`}>{group.title}</Link>{group.services.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}>{service.title}</Link>)}</section>)}</div></div>
      <Link href="/about">About us</Link><Link href="/contact">Contact</Link><Link className="bh-order-link" href="/checkout">Order services <span aria-hidden="true">↗</span></Link>
    </nav>
    <MobileNav groups={groups}/>
    <Link className="bh-header-cta" href="/checkout">Choose a package <span>↗</span></Link>
  </header>;
}

export async function BillversFooter() {
  const settings=await getSiteSettings();
  return <><footer className="bh-footer"><div><Link className="mw-brand" href="/"><Image className="mw-logo" src="/logo-mark.svg" alt="" width={34} height={34} /><span>BillversTech</span></Link><p>Design, development and digital growth for ambitious businesses.</p><small>{settings.address}</small></div><div><strong>Explore</strong><Link href="/services">All services</Link><Link href="/checkout">Order services</Link><Link href="/about">About us</Link><Link href="/contact">Contact</Link></div><div><strong>Legal</strong><Link href="/privacy">Privacy policy</Link><Link href="/refund">Refund &amp; cancellation</Link><Link href="/terms">Terms &amp; conditions</Link><Link href="/shipping">Shipping policy</Link></div><small>© 2026 BillversTech · billverstech.com</small></footer><a className="bh-whatsapp" href={`https://wa.me/${settings.whatsapp}?text=Hello%20BillversTech%2C%20I%27d%20like%20to%20discuss%20a%20digital%20project.`} target="_blank" rel="noopener noreferrer">WhatsApp us <span>↗</span></a></>;
}
