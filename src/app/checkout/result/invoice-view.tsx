"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type OrderItemSnapshot = {
  title: string;
  price: number;
  quantity: number;
};

export type InvoiceViewProps = {
  serverOrderId: string;
  serverAirpayTxnId: string;
  serverAmount: string;
  serverStatus: string;
  serverMessage: string;
  serverMode: string;
  serverDate: string;
  serverCustomerName: string;
  serverCustomerEmail: string;
  serverCustomerPhone: string;
  isSuccess: boolean;
};

export default function InvoiceView({
  serverOrderId,
  serverAirpayTxnId,
  serverAmount,
  serverStatus,
  serverMessage,
  serverMode,
  serverDate,
  serverCustomerName,
  serverCustomerEmail,
  serverCustomerPhone,
  isSuccess,
}: InvoiceViewProps) {
  const [orderId, setOrderId] = useState(serverOrderId !== "N/A" ? serverOrderId : "");
  const [airpayTxnId, setAirpayTxnId] = useState(serverAirpayTxnId);
  const [amount, setAmount] = useState(serverAmount);
  const [customerName, setCustomerName] = useState(serverCustomerName !== "Valued Client" ? serverCustomerName : "");
  const [customerEmail, setCustomerEmail] = useState(serverCustomerEmail);
  const [customerPhone, setCustomerPhone] = useState(serverCustomerPhone);
  const [items, setItems] = useState<OrderItemSnapshot[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const savedRaw = sessionStorage.getItem("billverstech_order") || localStorage.getItem("billverstech_order");
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        if (!amount && saved.amount) {
          setAmount(String(saved.amount));
        }
        if (!orderId && saved.orderId) {
          setOrderId(String(saved.orderId));
        }
        if (!customerName && saved.customerName) {
          setCustomerName(String(saved.customerName));
        }
        if (!customerEmail && saved.customerEmail) {
          setCustomerEmail(String(saved.customerEmail));
        }
        if (!customerPhone && saved.customerPhone) {
          setCustomerPhone(String(saved.customerPhone));
        }
        if (Array.isArray(saved.items) && saved.items.length > 0) {
          setItems(saved.items);
        }
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    }
  }, [amount, customerEmail, customerName, customerPhone, orderId]);

  // Numeric amount calculation
  const numAmount = Number(amount) || 0;
  const displayAmount = numAmount > 0 ? numAmount.toFixed(2) : "10.00";
  const displayTotal = `₹${displayAmount}`;

  // GST 18% inclusive reverse calculation
  const totalVal = Number(displayAmount);
  const taxableVal = (totalVal / 1.18).toFixed(2);
  const gstVal = (totalVal - Number(taxableVal)).toFixed(2);

  const displayOrderId = orderId || (typeof window !== "undefined" ? "BILLVERS_TXN_" + Date.now().toString().slice(-6) : "BILLVERS_PAID");
  const displayCustomer = customerName || "Customer";

  function handlePrint() {
    window.print();
  }

  function handleCopyDetails() {
    const text = `BillversTech Tax Invoice\nOrder ID: ${displayOrderId}\nAirpay Ref: ${airpayTxnId || "Verified"}\nAmount Paid: ${displayTotal}\nCustomer: ${displayCustomer}\nStatus: PAID (VERIFIED)\nWebsite: https://www.billverstech.com`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div
      className="invoice-box"
      style={{
        maxWidth: "820px",
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
            {`INV-${displayOrderId.slice(-10)}`}
          </div>
          <div style={{ fontSize: "12px", color: "#666666", marginTop: "6px" }}>Date:</div>
          <div style={{ fontSize: "13px", fontWeight: 700 }}>{serverDate}</div>
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
          <div style={{ fontWeight: 700, fontSize: "15px", marginTop: "4px" }}>{displayCustomer}</div>
          {customerEmail && <div style={{ color: "#555555" }}>{customerEmail}</div>}
          {customerPhone && <div style={{ color: "#555555" }}>Tel: {customerPhone}</div>}
          <div style={{ color: "#555555", marginTop: "2px" }}>Place of Supply: India</div>
        </div>

        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#666666", textTransform: "uppercase" }}>
            Payment Gateway Details:
          </span>
          <div style={{ marginTop: "4px" }}>
            Order ID: <strong style={{ fontFamily: "monospace" }}>{displayOrderId}</strong>
          </div>
          {airpayTxnId && (
            <div>
              Airpay Ref ID: <strong style={{ fontFamily: "monospace" }}>{airpayTxnId}</strong>
            </div>
          )}
          <div>Payment Mode: <strong>{serverMode || "Airpay Online Gateway"}</strong></div>
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
            {items.length > 0 ? (
              items.map((item, idx) => {
                const itemTotal = Number(item.price) * (item.quantity || 1);
                const itemTaxable = (itemTotal / 1.18).toFixed(2);
                return (
                  <tr key={idx} style={{ borderBottom: "1px solid #eaecef" }}>
                    <td style={{ padding: "12px 10px" }}>{idx + 1}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <strong>{item.title}</strong>
                      <div style={{ fontSize: "11px", color: "#666666", marginTop: "2px" }}>
                        Qty: {item.quantity || 1} — Deliverables as per scope
                      </div>
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "center", fontFamily: "monospace" }}>998314</td>
                    <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: 600 }}>₹{itemTaxable}</td>
                  </tr>
                );
              })
            ) : (
              <tr style={{ borderBottom: "1px solid #eaecef" }}>
                <td style={{ padding: "12px 10px" }}>1</td>
                <td style={{ padding: "12px 10px" }}>
                  <strong>Professional IT &amp; Digital Services Package</strong>
                  <div style={{ fontSize: "11px", color: "#666666", marginTop: "2px" }}>
                    Custom software development, IT consulting &amp; digital deliverables
                  </div>
                </td>
                <td style={{ padding: "12px 10px", textAlign: "center", fontFamily: "monospace" }}>998314</td>
                <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: 600 }}>₹{taxableVal}</td>
              </tr>
            )}
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
        <div style={{ width: "320px", fontSize: "13px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
            <span style={{ color: "#666666" }}>Taxable Amount:</span>
            <span>₹{taxableVal}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
            <span style={{ color: "#666666" }}>IGST / GST (18%):</span>
            <span>₹{gstVal}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0 4px",
              borderTop: "2px solid #1a1a1a",
              fontSize: "17px",
              fontWeight: 800,
            }}
          >
            <span>Total Amount Paid:</span>
            <span style={{ color: isSuccess ? "#1a7f37" : "#cf222e" }}>
              {displayTotal}
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

      {/* Client Action Buttons */}
      <div className="no-print" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
        {isSuccess ? (
          <>
            <button
              type="button"
              onClick={handlePrint}
              className="bh-button bh-button-dark"
              style={{
                padding: "12px 24px",
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
              style={{ padding: "12px 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
            >
              {copied ? "✓ Copied!" : "Copy Details"}
            </button>

            <a
              href={`https://wa.me/917082688288?text=Hello%20BillversTech,%20I%20have%20paid%20${encodeURIComponent(displayTotal)}%20for%20Order%20ID:%20${encodeURIComponent(displayOrderId)}.`}
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
              WhatsApp Receipt <span>💬</span>
            </a>

            <Link className="bh-button" href="/" style={{ padding: "12px 20px", fontSize: "14px", fontWeight: 600 }}>
              Back to Home <span>↗</span>
            </Link>
          </>
        ) : (
          <>
            <Link className="bh-button bh-button-dark" href="/checkout" style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 700 }}>
              Retry Payment <span>→</span>
            </Link>
            <Link className="bh-button" href="/contact" style={{ padding: "12px 20px", fontSize: "14px", fontWeight: 600 }}>
              Contact Support <span>↗</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
