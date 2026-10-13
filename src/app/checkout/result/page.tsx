import type { Metadata } from "next";
import { getServices } from "@/lib/content-store";
import { BillversFooter, BillversHeader } from "../../site-chrome";
import InvoiceView from "./invoice-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tax Invoice & Payment Receipt | BillversTech",
  description: "Official tax invoice and payment confirmation for Billverse Technologies (OPC) Private Limited.",
};

export default async function CheckoutResultPage({
  searchParams,
}: PageProps<"/checkout/result">) {
  const query = await searchParams;
  const services = await getServices();

  const status = typeof query.status === "string" ? query.status.toLowerCase() : "unknown";
  const orderId = typeof query.orderId === "string" && query.orderId.trim() ? query.orderId : "N/A";
  const airpayTxnId = typeof query.airpayTxnId === "string" ? query.airpayTxnId : "";
  const rawAmount = typeof query.amount === "string" ? query.amount : "";
  const message = typeof query.message === "string" ? query.message : "";
  const mode = typeof query.mode === "string" ? query.mode : "Airpay Online Gateway";
  const dateStr = typeof query.date === "string" ? query.date : new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const customerName = typeof query.customerName === "string" ? query.customerName : "Valued Client";
  const customerEmail = typeof query.customerEmail === "string" ? query.customerEmail : "";
  const customerPhone = typeof query.customerPhone === "string" ? query.customerPhone : "";

  const isSuccess =
    status === "success" ||
    status === "200" ||
    status === "paid" ||
    message.toLowerCase().includes("success") ||
    message.toLowerCase().includes("approved");

  return (
    <main className="bh-site">
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, footer, .no-print, .bh-page-hero, .bh-kicker {
            display: none !important;
          }
          .bh-section {
            padding: 0 !important;
            margin: 0 !important;
          }
          .invoice-box {
            box-shadow: none !important;
            border: 1px solid #333333 !important;
            padding: 20px !important;
            background: #ffffff !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <BillversHeader services={services} />

      <section className="bh-page-hero bh-page-hero-short no-print">
        <span className="bh-kicker">
          {isSuccess ? "TRANSACTION CONFIRMED" : "PAYMENT NOTICE"}
        </span>
        <h1>
          {isSuccess ? (
            <>Payment <em>Successful.</em></>
          ) : (
            <>Payment <em>Incomplete or Failed.</em></>
          )}
        </h1>
        <p>
          {isSuccess
            ? "Your payment has been received and verified by Airpay. Your official tax invoice has been generated below."
            : "Your transaction could not be completed by the bank. If amount was debited, it will be refunded within 3-5 business days."}
        </p>
      </section>

      <section className="bh-section" style={{ paddingTop: "20px", paddingBottom: "80px" }}>
        <InvoiceView
          serverOrderId={orderId}
          serverAirpayTxnId={airpayTxnId}
          serverAmount={rawAmount}
          serverStatus={status}
          serverMessage={message}
          serverMode={mode}
          serverDate={dateStr}
          serverCustomerName={customerName}
          serverCustomerEmail={customerEmail}
          serverCustomerPhone={customerPhone}
          isSuccess={isSuccess}
        />
      </section>

      <BillversFooter />
    </main>
  );
}
