"use client";

import { useState } from "react";
import Link from "next/link";

type InvoiceActionsProps = {
  orderId: string;
  airpayTxnId?: string;
  amount?: string;
  customerName?: string;
  isSuccess: boolean;
};

export default function InvoiceActions({
  orderId,
  airpayTxnId,
  amount,
  isSuccess,
}: InvoiceActionsProps) {
  const [copied, setCopied] = useState(false);

  function handlePrint() {
    window.print();
  }

  function handleCopyDetails() {
    const text = `BillversTech Order Details:\nOrder ID: ${orderId}\nAirpay Ref: ${airpayTxnId || "N/A"}\nAmount: ₹${amount || "N/A"}\nStatus: ${isSuccess ? "PAID" : "UNPAID"}\nWebsite: https://www.billverstech.com`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (!isSuccess) {
    return (
      <div className="no-print" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
        <Link
          className="bh-button bh-button-dark"
          href="/checkout"
          style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 700 }}
        >
          Retry Payment <span>→</span>
        </Link>
        <Link
          className="bh-button"
          href="/contact"
          style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 600 }}
        >
          Contact Support <span>↗</span>
        </Link>
        <a
          href="https://wa.me/917082688288?text=Hello%20BillversTech%20team,%20I%20have%20an%20issue%20with%20my%20payment."
          target="_blank"
          rel="noopener noreferrer"
          className="bh-button"
          style={{
            padding: "12px 20px",
            fontSize: "14px",
            background: "#25D366",
            color: "#ffffff",
            borderColor: "#25D366",
            fontWeight: 700,
          }}
        >
          WhatsApp Support <span>💬</span>
        </a>
      </div>
    );
  }

  return (
    <div className="no-print" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
      <button
        type="button"
        onClick={handlePrint}
        className="bh-button bh-button-dark"
        style={{
          padding: "12px 26px",
          fontSize: "14px",
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download Tax Invoice (PDF)
      </button>

      <button
        type="button"
        onClick={handleCopyDetails}
        className="bh-button"
        style={{
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {copied ? "✓ Details Copied!" : "Copy Order Ref"}
      </button>

      <a
        href={`https://wa.me/917082688288?text=Hello%20BillversTech,%20I%20have%20completed%20payment%20for%20Order%20ID:%20${encodeURIComponent(orderId)}.`}
        target="_blank"
        rel="noopener noreferrer"
        className="bh-button"
        style={{
          padding: "12px 20px",
          fontSize: "14px",
          background: "#25D366",
          color: "#ffffff",
          borderColor: "#25D366",
          fontWeight: 700,
        }}
      >
        Notify on WhatsApp <span>💬</span>
      </a>

      <Link
        className="bh-button"
        href="/"
        style={{ padding: "12px 20px", fontSize: "14px", fontWeight: 600 }}
      >
        Back to Home <span>↗</span>
      </Link>
    </div>
  );
}
