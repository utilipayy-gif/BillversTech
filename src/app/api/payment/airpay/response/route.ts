import { NextResponse } from "next/server";
import { verifyAirpayResponse } from "@/lib/airpay";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    const transactionId = data.TRANSACTIONID || data.orderid || data.orderId || "";
    const airpayTxnId = data.APTRANSACTIONID || data.aptransactionid || "";
    const amount = data.AMOUNT || data.amount || "";
    const status = data.TRANSACTIONSTATUS || data.status || "";
    const message = data.MESSAGE || data.message || "Payment processed";
    const checksum = data.CHKSUM || data.checksum || data.ap_SecureHash || "";

    const isValid = verifyAirpayResponse({
      transactionId,
      airpayTxnId,
      amount,
      status,
      message,
      checksum,
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    const isSuccess = isValid && (status === "200" || status === "SUCCESS" || status === "success");

    const targetUrl = new URL("/checkout/result", siteUrl || "http://localhost:3001");
    targetUrl.searchParams.set("status", isSuccess ? "success" : "failed");
    targetUrl.searchParams.set("orderId", transactionId);
    targetUrl.searchParams.set("airpayTxnId", airpayTxnId);
    targetUrl.searchParams.set("amount", amount);
    targetUrl.searchParams.set("message", message);

    return NextResponse.redirect(targetUrl.toString(), 303);
  } catch (error) {
    console.error("Airpay callback processing failed:", error);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    return NextResponse.redirect(new URL("/checkout/result?status=failed&message=Server+callback+error", siteUrl || "http://localhost:3001"), 303);
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const transactionId = searchParams.get("TRANSACTIONID") || searchParams.get("orderId") || "";
  const airpayTxnId = searchParams.get("APTRANSACTIONID") || "";
  const amount = searchParams.get("AMOUNT") || "";
  const status = searchParams.get("TRANSACTIONSTATUS") || "";
  const message = searchParams.get("MESSAGE") || "";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const isSuccess = status === "200" || status === "SUCCESS" || status === "success";

  const targetUrl = new URL("/checkout/result", siteUrl || "http://localhost:3001");
  targetUrl.searchParams.set("status", isSuccess ? "success" : "failed");
  targetUrl.searchParams.set("orderId", transactionId);
  targetUrl.searchParams.set("airpayTxnId", airpayTxnId);
  targetUrl.searchParams.set("amount", amount);
  targetUrl.searchParams.set("message", message);

  return NextResponse.redirect(targetUrl.toString(), 303);
}
