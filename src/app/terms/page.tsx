import type { Metadata } from "next";
import LegalShell from "../legal-shell";

export const metadata: Metadata = {
  title: "Terms & Conditions — BillversTech",
  description: "Terms governing use of the BillversTech website and service enquiries.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms & Conditions — BillversTech", description: "Website and enquiry terms for BillversTech.", url: "/terms", images: [] },
  twitter: { title: "Terms & Conditions — BillversTech", description: "Website and enquiry terms for BillversTech.", images: [] },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms & Conditions" intro="These terms cover use of www.billverstech.com and enquiries made through it. The final commercial terms for a project will appear in a written proposal or service agreement.">
      <section><h2>01 — Agreement to these terms</h2><p>By accessing <a href="https://www.billverstech.com">www.billverstech.com</a>, you agree to these Terms &amp; Conditions and the <a href="/privacy">Privacy Policy</a>. This website is operated by BILLVERSE TECHNOLOGIES (OPC) PRIVATE LIMITED, CIN U82990HR2026OPC148111 and GSTIN 06AAOCB9584D1ZA. If you do not accept these terms, do not use the website.</p></section>
      <section><h2>02 — Website purpose</h2><p>The website provides general information about BillversTech&apos;s design, website and business-system services. Content may be corrected, changed or removed without notice and is not legal, tax, accounting, financial or other professional advice.</p></section>
      <section><h2>03 — Enquiries do not form a contract</h2><p>A form submission, message, call or initial response does not create a client relationship or obligation to proceed. A project starts only after both sides confirm scope, fees, responsibilities, timing and payment terms in writing and any required advance is received.</p></section>
      <section><h2>04 — Project documents</h2><p>A proposal, statement of work, invoice or service agreement may govern each engagement. If an accepted project document conflicts with these general website terms, the project document controls for that engagement.</p></section>
      <section><h2>05 — Pricing and external costs</h2><p>Displayed prices apply only to their stated package and may change before acceptance. Confirmed scope determines the final quote. Taxes, hosting, domain registration, paid software, gateways, stock assets, messaging and other third-party costs are excluded unless expressly included in writing.</p></section>
      <section><h2>06 — Payments</h2><p>Applicable payment methods, milestones, due dates, cancellation or refund terms are stated in the proposal or invoice. BillversTech may pause work or withhold launch, handover or licence rights while an undisputed payment is overdue. This website does not currently operate a payment gateway.</p></section>
      <section><h2>07 — Your responsibilities</h2><p>Clients must provide accurate requirements, lawful material, necessary access and timely decisions. You confirm you own or are authorised to use all supplied logos, photographs, copy, customer data and trademarks. Late inputs or approvals may require a revised schedule.</p></section>
      <section><h2>08 — Intellectual property</h2><p>BillversTech and its licensors retain rights in this website, its identity, working methods, know-how, reusable tools, pre-existing code and third-party material. Client-deliverable ownership and licences will be defined in the project agreement. Unless stated otherwise, agreed custom rights transfer after full payment, while third-party and reusable components remain governed by their own licences.</p></section>
      <section><h2>09 — Third-party platforms</h2><p>Hosting, domains, social platforms, messaging, analytics, payment providers, APIs and other external services have independent terms, charges and service levels. We may assist with configuration but cannot control their uptime, policy changes, account decisions, prices or privacy practices.</p></section>
      <section><h2>10 — Responsible website use</h2><p>You must not probe or compromise security, interfere with operation, introduce harmful code, access restricted systems, scrape the website unreasonably, impersonate another person, infringe rights or use the site for unlawful, misleading or abusive conduct.</p></section>
      <section><h2>11 — Results are not guaranteed</h2><p>BillversTech does not promise a particular search ranking, visitor count, sales level, revenue figure, regulatory approval or other commercial outcome. Illustrations, estimates and case-study results depend on their circumstances and may not be typical.</p></section>
      <section><h2>12 — Availability and warranties</h2><p>The public website is supplied on an “as available” basis. To the fullest extent permitted by law, we disclaim implied warranties of uninterrupted access, error-free operation or fitness for a purpose not expressly agreed in a project contract. Rights that cannot legally be excluded remain unaffected.</p></section>
      <section><h2>13 — Liability</h2><p>To the maximum extent permitted by law, BillversTech is not liable for indirect, incidental, special or consequential loss arising from use of this public website or reliance on its general content. Liability for paid work is governed by the relevant project agreement. Nothing excludes liability that law does not allow us to exclude.</p></section>
      <section><h2>14 — Indian law and disputes</h2><p>Indian law governs these website terms. We encourage good-faith discussion before formal proceedings. Unless an accepted project agreement provides otherwise, disputes will be submitted to courts of competent jurisdiction at Jind, Haryana, India.</p></section>
      <section><h2>15 — Changes and contact</h2><p>We may publish revised terms on this page as our website, services or obligations evolve. The effective date identifies the current version. Questions may be sent to <a href="mailto:support@billverstech.com">support@billverstech.com</a>, raised at <a href="tel:+917082688288">+91 70826 88288</a> or <a href="tel:+911681460068">01681-460068</a>, or mailed to our registered office at C/O Rajesh Kumari, 1st Floor, Patiala Chowk, Jind, Haryana 126102, India.</p></section>
    </LegalShell>
  );
}
