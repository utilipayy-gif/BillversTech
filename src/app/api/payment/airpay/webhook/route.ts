import { NextResponse } from "next/server";
import { parseAirpayResponsePayload } from "@/lib/airpay";

export const dynamic = "force-dynamic";

/**
 * Airpay IPN (Instant Payment Notification) Webhook Endpoint.
 * Receives asynchronous server-to-server transaction status updates from Airpay.
 */
export async function POST(request: Request) {
  try {
    const rawData: Record<string, string> = {};

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        const json = await request.json();
        for (const [k, v] of Object.entries(json)) {
          if (v !== undefined && v !== null) rawData[k] = String(v);
        }
      } catch (e) {
        console.error("Failed to parse JSON IPN body:", e);
      }
    } else {
      try {
        const formData = await request.formData();
        formData.forEach((value, key) => {
          rawData[key] = String(value);
        });
      } catch {
        try {
          const text = await request.text();
          const params = new URLSearchParams(text);
          params.forEach((value, key) => {
            rawData[key] = value;
          });
        } catch {
          // ignore
        }
      }
    }

    const parsed = parseAirpayResponsePayload(rawData);

    console.log("[Airpay Webhook/IPN received & parsed]:", {
      orderId: parsed.transactionId,
      airpayTxnId: parsed.airpayTxnId,
      amount: parsed.amount,
      status: parsed.status,
      isSuccess: parsed.isSuccess,
    });

    return NextResponse.json(
      {
        status: "success",
        received: true,
        transactionId: parsed.transactionId,
        airpayTxnId: parsed.airpayTxnId,
        verified: parsed.isSuccess,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Airpay Webhook/IPN Error]:", error);
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
