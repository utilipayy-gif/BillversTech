import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "BillversTech",
  legalName: "BILLVERSE TECHNOLOGIES (OPC) PRIVATE LIMITED",
  url: "https://www.billverstech.com",
  email: "support@billverstech.com",
  telephone: "+91-70826-88288",
  foundingDate: "2026-07-20",
  taxID: "06AAOCB9584D1ZA",
  identifier: "U82990HR2026OPC148111",
  address: {
    "@type": "PostalAddress",
    streetAddress: "C/O Rajesh Kumari, 1st Floor, Patiala Chowk",
    addressLocality: "Jind",
    addressRegion: "Haryana",
    postalCode: "126102",
    addressCountry: "IN",
  },
  areaServed: "IN",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.billverstech.com",
  ),
  title: "BillversTech — Web Design, Development & Digital Marketing",
  description:
    "Website design, development, digital marketing, custom applications, domains and hosting for growing businesses.",
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/logo-mark.svg", type: "image/svg+xml" }] },
  robots: { index: true, follow: true },
  openGraph: {
    title: "BillversTech",
    description: "Web design, development and digital growth services.",
    url: "/",
    siteName: "BillversTech",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "BillversTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BillversTech",
    description: "Web design, development and digital growth services.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
