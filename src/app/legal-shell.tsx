import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type LegalShellProps = { title: string; intro: string; children: ReactNode };

export default function LegalShell({ title, intro, children }: LegalShellProps) {
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
          <Link href="/terms">Terms &amp; Conditions</Link>
          <a href="mailto:support@billverstech.com">Email us ↗</a>
        </aside>
        <article className="bw-legal-content">{children}</article>
      </div>

      <footer className="bw-legal-footer">
        <div><strong>BILLVERSE TECHNOLOGIES (OPC) PRIVATE LIMITED</strong><span>CIN U82990HR2026OPC148111 · GSTIN 06AAOCB9584D1ZA</span><span>C/O Rajesh Kumari, 1st Floor, Patiala Chowk, Jind, Haryana 126102, India</span></div>
        <div><a href="mailto:support@billverstech.com">support@billverstech.com</a><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </footer>
    </main>
  );
}
