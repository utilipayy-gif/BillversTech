import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getSiteSettings } from "@/lib/content-store";

type LegalShellProps = { title: string; intro: string; children: ReactNode };

export default async function LegalShell({ title, intro, children }: LegalShellProps) {
  const settings=await getSiteSettings();
  return (
    <main className="bw-legal-page">
      <header className="bw-legal-header">
        <Link className="mw-brand" href="/" aria-label="BillversTech home">
          <Image className="mw-logo" src="/logo-mark.svg" alt="" width={34} height={34} priority />
          <span>BillversTech</span>
        </Link>
        <Link className="bw-back" href="/">Return to website ↗</Link>
      </header>

      <section className="bw-legal-hero">
        <span>LEGAL / BILLVERSTECH.COM</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        <div><span>Effective 1 September 2026</span><span>Last updated 1 September 2026</span></div>
      </section>

      <div className="bw-legal-layout">
        <aside className="bw-legal-nav" aria-label="Legal pages">
          <span>DOCUMENTS</span>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/refund">Refund &amp; Cancellation Policy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/shipping">Shipping Policy</Link>
          <a href={`mailto:${settings.email}`}>Email us ↗</a>
        </aside>
        <article className="bw-legal-content">{children}</article>
      </div>

      <footer className="bw-legal-footer">
        <div><strong>Address</strong><span>{settings.address}</span></div>
        <div><a href={`mailto:${settings.email}`}>{settings.email}</a><Link href="/privacy">Privacy</Link><Link href="/refund">Refunds</Link><Link href="/terms">Terms</Link><Link href="/shipping">Shipping</Link></div>
      </footer>
    </main>
  );
}
