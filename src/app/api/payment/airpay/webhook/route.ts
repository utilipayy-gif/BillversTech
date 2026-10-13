import { NextResponse } from "next/server";
import { verifyAirpayResponse } from "@/lib/airpay";

export const dynamic = "force-dynamic";

/**
 * Airpay IPN (Instant Payment Notification) Webhook Endpoint.
 * Receives asynchronous server-to-server transaction status updates from Airpay.
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const data: Record<string, string> = {};

    if (contentType.includes("application/json")) {
      const json = await request.json();
      for (const [key, val] of Object.entries(json)) {
        data[key] = String(val);
      }
    } else {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        data[key] = String(value);
      });
    }

    const transactionId = data.TRANSACTIONID || data.orderid || data.orderId || "";
    const airpayTxnId = data.APTRANSACTIONID || data.aptransactionid || "";
    const amount = data.AMOUNT || data.amount || "";
    const status = data.TRANSACTIONSTATUS || data.status || "";
    const message = data.MESSAGE || data.message || "IPN received";
    const checksum = data.CHKSUM || data.checksum || data.ap_SecureHash || data.ap_securehash || "";

    const isValid = verifyAirpayResponse({
      transactionId,
      airpayTxnId,
      amount,
      status,
      message,
      checksum,
    });

    console.log("[Airpay Webhook/IPN received]:", {
      transactionId,
      airpayTxnId,
      amount,
      status,
      isValid,
    });

    // Return 200 OK to acknowledge receipt to Airpay
    return NextResponse.json(
      {
        status: "success",
        received: true,
        transactionId,
        verified: isValid,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Airpay Webhook/IPN Error]:", error);
    // Still return 200 to prevent retries hanging if payload was received
    return NextResponse.json(
      { status: "error", message: "Failed to process webhook" },
      { status: 200 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "BillversTech Airpay IPN Webhook endpoint is healthy and ready.",
    timestamp: new Date().toISOString(),
  });
}
