import { NextResponse } from "next/server";
import { parseAirpayResponsePayload } from "@/lib/airpay";

export const dynamic = "force-dynamic";

/**
 * Handles browser redirect return from Airpay after payment attempt.
 * Decrypts encrypted payload if present, validates status, and redirects to receipt UI.
 */
export async function POST(request: Request) {
  try {
    const rawData: Record<string, string> = {};

    // 1. Collect from URL query params (if any)
    const requestUrl = new URL(request.url);
    requestUrl.searchParams.forEach((value, key) => {
      rawData[key] = value;
    });

    // 2. Collect from POST body (formData, urlencoded, or json)
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        const json = await request.json();
        for (const [k, v] of Object.entries(json)) {
          if (v !== undefined && v !== null) rawData[k] = String(v);
        }
      } catch (e) {
        console.error("Failed to parse JSON body:", e);
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      try {
        const text = await request.text();
        const params = new URLSearchParams(text);
        params.forEach((value, key) => {
          rawData[key] = value;
        });
      } catch (e) {
        console.error("Failed to parse URL-encoded body:", e);
      }
    } else {
      try {
        const formData = await request.formData();
        formData.forEach((value, key) => {
          rawData[key] = String(value);
        });
      } catch (e) {
        // Fallback to text parsing
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

    console.log("[Airpay Response POST received keys]:", Object.keys(rawData));

    // 3. Parse, decrypt (if encrypted), and normalize
    const parsed = parseAirpayResponsePayload(rawData);

    console.log("[Airpay Response Parsed]:", {
      orderId: parsed.transactionId,
      airpayTxnId: parsed.airpayTxnId,
      amount: parsed.amount,
      status: parsed.status,
      isSuccess: parsed.isSuccess,
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.url;
    const targetUrl = new URL("/checkout/result", siteUrl);

    targetUrl.searchParams.set("status", parsed.isSuccess ? "success" : "failed");
    if (parsed.transactionId) targetUrl.searchParams.set("orderId", parsed.transactionId);
    if (parsed.airpayTxnId) targetUrl.searchParams.set("airpayTxnId", parsed.airpayTxnId);
    if (parsed.amount) targetUrl.searchParams.set("amount", parsed.amount);
    if (parsed.message) targetUrl.searchParams.set("message", parsed.message);
    if (parsed.paymentMode) targetUrl.searchParams.set("mode", parsed.paymentMode);
    if (parsed.transactionDate) targetUrl.searchParams.set("date", parsed.transactionDate);
    if (parsed.customerName) targetUrl.searchParams.set("customerName", parsed.customerName);
    if (parsed.customerEmail) targetUrl.searchParams.set("customerEmail", parsed.customerEmail);
    if (parsed.customerPhone) targetUrl.searchParams.set("customerPhone", parsed.customerPhone);

    return NextResponse.redirect(targetUrl.toString(), 303);
  } catch (error) {
    console.error("Airpay callback processing failed:", error);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.url;
    return NextResponse.redirect(
      new URL("/checkout/result?status=failed&message=Server+callback+error", siteUrl),
      303
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawData: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    rawData[key] = value;
  });

  const parsed = parseAirpayResponsePayload(rawData);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.url;
  const targetUrl = new URL("/checkout/result", siteUrl);

  targetUrl.searchParams.set("status", parsed.isSuccess ? "success" : "failed");
  if (parsed.transactionId) targetUrl.searchParams.set("orderId", parsed.transactionId);
  if (parsed.airpayTxnId) targetUrl.searchParams.set("airpayTxnId", parsed.airpayTxnId);
  if (parsed.amount) targetUrl.searchParams.set("amount", parsed.amount);
  if (parsed.message) targetUrl.searchParams.set("message", parsed.message);
  if (parsed.paymentMode) targetUrl.searchParams.set("mode", parsed.paymentMode);
  if (parsed.transactionDate) targetUrl.searchParams.set("date", parsed.transactionDate);
  if (parsed.customerName) targetUrl.searchParams.set("customerName", parsed.customerName);
  if (parsed.customerEmail) targetUrl.searchParams.set("customerEmail", parsed.customerEmail);
  if (parsed.customerPhone) targetUrl.searchParams.set("customerPhone", parsed.customerPhone);

  return NextResponse.redirect(targetUrl.toString(), 303);
}
