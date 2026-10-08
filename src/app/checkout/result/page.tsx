import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/content-store";
import { BillversFooter, BillversHeader } from "../../site-chrome";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order & Payment Status | BillversTech",
  description: "View the status of your BillversTech order and payment.",
};

export default async function CheckoutResultPage({
  searchParams,
}: PageProps<"/checkout/result">) {
  const query = await searchParams;
  const services = await getServices();

  const status = typeof query.status === "string" ? query.status.toLowerCase() : "unknown";
  const orderId = typeof query.orderId === "string" ? query.orderId : "N/A";
  const airpayTxnId = typeof query.airpayTxnId === "string" ? query.airpayTxnId : "";
  const amount = typeof query.amount === "string" ? query.amount : "";
  const message = typeof query.message === "string" ? query.message : "";
  const isTestMode = query.testMode === "true";

  const isSuccess = status === "success" || status === "200";

  const formattedAmount = amount
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(amount))
    : null;

  return (
    <main className="bh-site">
      <BillversHeader services={services} />

      <section className="bh-page-hero bh-page-hero-short">
        <span className="bh-kicker">PAYMENT CONFIRMATION</span>
        <h1>
          {isSuccess ? (
            <>Payment <em>Successful.</em></>
          ) : (
            <>Payment <em>Incomplete or Failed.</em></>
          )}
        </h1>
        <p>
          {isSuccess
            ? "Your payment has been received and verified. Our technical team is preparing your project kickoff."
            : "We could not complete your transaction. No funds were debited, or your bank is still processing the request."}
        </p>
      </section>

      <section className="bh-section" style={{ paddingTop: "40px", paddingBottom: "100px" }}>
        <div
          style={{
            maxWidth: "740px",
            margin: "0 auto",
            border: "1px solid var(--ink)",
            background: "rgba(255, 255, 255, 0.5)",
            padding: "40px",
            boxShadow: "10px 10px 0 var(--ink)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <span
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                backgroundColor: isSuccess ? "#2da44e" : "#cf222e",
                color: "#ffffff",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              {isSuccess ? "✓" : "✕"}
            </span>
            <div>
              <span style={{ fontSize: "11px", letterSpacing: "0.1em", fontWeight: 800, opacity: 0.7 }}>
                {isTestMode ? "DEMO / TEST TRANSACTION" : "AIRPAY SECURE TRANSACTION"}
              </span>
              <h2 style={{ margin: "2px 0 0", fontFamily: "Georgia, serif", fontSize: "28px" }}>
                {isSuccess ? "Order Confirmed" : "Payment Failed or Cancelled"}
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "14px",
              borderTop: "1px solid var(--line)",
              borderBottom: "1px solid var(--line)",
              padding: "24px 0",
              margin: "24px 0",
              fontSize: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.7 }}>Order ID</span>
              <strong style={{ fontFamily: "monospace" }}>{orderId}</strong>
            </div>

            {airpayTxnId && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ opacity: 0.7 }}>Airpay Ref ID</span>
                <strong style={{ fontFamily: "monospace" }}>{airpayTxnId}</strong>
              </div>
            )}

            {formattedAmount && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ opacity: 0.7 }}>Amount</span>
                <strong>{formattedAmount}</strong>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.7 }}>Gateway Message</span>
              <span>{message || (isSuccess ? "Payment received successfully" : "Transaction could not be completed")}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.7 }}>Status</span>
              <strong style={{ color: isSuccess ? "#2da44e" : "#cf222e" }}>
                {isSuccess ? "PAID" : "UNPAID"}
              </strong>
            </div>
          </div>

          {isSuccess ? (
            <div>
              <p style={{ margin: "0 0 20px", fontSize: "14px", lineHeight: "1.6" }}>
                Thank you for trusting <strong>BILLVERSE TECHNOLOGIES (OPC) PRIVATE LIMITED</strong>.
                Our team will reach out via WhatsApp and email to schedule your onboarding call and project roadmap review.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link className="bh-button bh-button-dark" href="/">
                  Back to homepage <span>↗</span>
                </Link>
                <Link className="bh-button" href="/services">
                  Browse more services <span>↗</span>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ margin: "0 0 20px", fontSize: "14px", lineHeight: "1.6" }}>
                Your payment attempt did not go through. You can retry with a different payment mode or contact our team directly for bank transfer details or custom invoicing.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link className="bh-button bh-button-dark" href="/checkout">
                  Retry payment <span>→</span>
                </Link>
                <Link className="bh-button" href="/contact">
                  Contact support <span>↗</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <BillversFooter />
    </main>
  );
}
