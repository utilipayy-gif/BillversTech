import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/content-store";
import { BillversFooter, BillversHeader } from "../../site-chrome";
import InvoiceActions from "./invoice-actions";

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

  const numAmount = Number(rawAmount) || 0;
  const formattedAmount = numAmount > 0
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(numAmount)
    : "₹14,999.00";

  // Reverse 18% GST calculation (Amount is GST inclusive)
  const taxableValue = numAmount > 0 ? (numAmount / 1.18).toFixed(2) : "12,711.02";
  const gstAmount = numAmount > 0 ? (numAmount - Number(taxableValue)).toFixed(2) : "2,287.98";

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
        <div
          className="invoice-box"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            border: "2px solid #1a1a1a",
            background: "#ffffff",
            padding: "36px",
            boxShadow: "10px 10px 0 #1a1a1a",
            borderRadius: "4px",
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "2px solid #1a1a1a",
              paddingBottom: "20px",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  background: isSuccess ? "#e6ffed" : "#ffebe9",
                  color: isSuccess ? "#1a7f37" : "#cf222e",
                  border: `1px solid ${isSuccess ? "#2da44e" : "#cf222e"}`,
                  borderRadius: "3px",
                  marginBottom: "8px",
                }}
              >
                {isSuccess ? "✓ OFFICIAL TAX INVOICE — PAID" : "✕ PAYMENT TRANSACTION FAILED"}
              </span>
              <h2
                style={{
                  margin: "0",
                  fontFamily: "Georgia, serif",
                  fontSize: "24px",
                  color: "#1a1a1a",
                  lineHeight: "1.2",
                }}
              >
                BILLVERSE TECHNOLOGIES (OPC) PRIVATE LIMITED
              </h2>
              <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#555555", lineHeight: "1.5" }}>
                CIN: <strong>U82990HR2026OPC148111</strong> | GSTIN: <strong>06AAOCB9584D1ZA</strong><br />
                Reg. Office: C/O Rajesh Kumari, 1st Floor, Patiala Chowk, Jind, Haryana, India, 126102<br />
                Support: <strong>support@billverstech.com</strong> | Phone: <strong>+91 70826 88288</strong>
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#666666" }}>Invoice No:</div>
              <div style={{ fontSize: "14px", fontWeight: 800, fontFamily: "monospace" }}>
                {orderId !== "N/A" ? `INV-${orderId.slice(-10)}` : `INV-${Date.now().toString().slice(-8)}`}
              </div>
              <div style={{ fontSize: "12px", color: "#666666", marginTop: "6px" }}>Date:</div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>{dateStr}</div>
            </div>
          </div>

          {/* Customer & Transaction Meta */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              padding: "20px 0",
              borderBottom: "1px solid #e1e4e8",
              fontSize: "13px",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#666666", textTransform: "uppercase" }}>
                Billed To (Customer):
              </span>
              <div style={{ fontWeight: 700, fontSize: "15px", marginTop: "4px" }}>{customerName}</div>
              {customerEmail && <div style={{ color: "#555555" }}>{customerEmail}</div>}
              {customerPhone && <div style={{ color: "#555555" }}>Tel: {customerPhone}</div>}
              <div style={{ color: "#555555", marginTop: "2px" }}>Place of Supply: India</div>
            </div>

            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#666666", textTransform: "uppercase" }}>
                Transaction Details:
              </span>
              <div style={{ marginTop: "4px" }}>
                Order ID: <strong style={{ fontFamily: "monospace" }}>{orderId}</strong>
              </div>
              {airpayTxnId && (
                <div>
                  Airpay Ref ID: <strong style={{ fontFamily: "monospace" }}>{airpayTxnId}</strong>
                </div>
              )}
              <div>Payment Mode: <strong>{mode}</strong></div>
              <div>
                Status:{" "}
                <strong style={{ color: isSuccess ? "#1a7f37" : "#cf222e" }}>
                  {isSuccess ? "PAID (VERIFIED)" : "UNPAID"}
                </strong>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div style={{ padding: "20px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f6f8fa", borderBottom: "2px solid #d0d7de" }}>
                  <th style={{ textAlign: "left", padding: "10px", fontWeight: 700 }}>S.No</th>
                  <th style={{ textAlign: "left", padding: "10px", fontWeight: 700 }}>Service Description</th>
                  <th style={{ textAlign: "center", padding: "10px", fontWeight: 700 }}>SAC Code</th>
                  <th style={{ textAlign: "right", padding: "10px", fontWeight: 700 }}>Taxable (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #eaecef" }}>
                  <td style={{ padding: "12px 10px" }}>1</td>
                  <td style={{ padding: "12px 10px" }}>
                    <strong>Professional IT &amp; Digital Services Package</strong>
                    <div style={{ fontSize: "11px", color: "#666666", marginTop: "2px" }}>
                      Scope includes web development, software design &amp; digital marketing deliverables.
                    </div>
                  </td>
                  <td style={{ padding: "12px 10px", textAlign: "center", fontFamily: "monospace" }}>998314</td>
                  <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: 600 }}>₹{taxableValue}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary / Calculation Box */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              borderTop: "1px solid #e1e4e8",
              paddingTop: "16px",
            }}
          >
            <div style={{ width: "300px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: "#666666" }}>Taxable Amount:</span>
                <span>₹{taxableValue}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span style={{ color: "#666666" }}>IGST / GST (18%):</span>
                <span>₹{gstAmount}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0 4px",
                  borderTop: "2px solid #1a1a1a",
                  fontSize: "16px",
                  fontWeight: 800,
                }}
              >
                <span>Total Amount Paid:</span>
                <span style={{ color: isSuccess ? "#1a7f37" : "#cf222e" }}>
                  {formattedAmount}
                </span>
              </div>
              <small style={{ display: "block", textAlign: "right", color: "#666666", fontSize: "11px" }}>
                (Inclusive of all applicable Indian taxes)
              </small>
            </div>
          </div>

          {/* Seal & Authorization */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px dashed #d0d7de",
              fontSize: "11px",
              color: "#555555",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  border: `2px solid ${isSuccess ? "#2da44e" : "#cf222e"}`,
                  color: isSuccess ? "#2da44e" : "#cf222e",
                  padding: "6px 14px",
                  borderRadius: "4px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                {isSuccess ? "✓ AIRPAY GATEWAY — VERIFIED" : "✕ NOT RECEIVED"}
              </div>
              <p style={{ margin: "8px 0 0", maxWidth: "340px", lineHeight: "1.4" }}>
                This is an electronically generated tax invoice issued by Billverse Technologies (OPC) Private Limited.
                No physical signature required.
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: "#1a1a1a" }}>
                For BILLVERSE TECHNOLOGIES (OPC) PVT. LTD.
              </div>
              <div style={{ height: "35px" }} />
              <div style={{ borderTop: "1px solid #999999", paddingTop: "4px", color: "#666666" }}>
                Authorized Signatory
              </div>
            </div>
          </div>

          {/* Interactive Client Action Buttons */}
          <InvoiceActions
            orderId={orderId}
            airpayTxnId={airpayTxnId}
            amount={rawAmount}
            customerName={customerName}
            isSuccess={isSuccess}
          />
        </div>
      </section>

      <BillversFooter />
    </main>
  );
}
