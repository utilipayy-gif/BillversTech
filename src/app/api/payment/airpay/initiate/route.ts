import { NextResponse } from "next/server";
import { isAirpayConfigured, prepareAirpayTransaction } from "@/lib/airpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, total } = body;

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required for checkout." },
        { status: 400 }
      );
    }

    if (!total || total <= 0) {
      return NextResponse.json(
        { error: "Cart total must be greater than zero." },
        { status: 400 }
      );
    }

    const orderId = `BILLVERS_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;

    const customData = JSON.stringify({
      orderId,
      itemsCount: Array.isArray(items) ? items.length : 0,
      notes: customer.notes || "",
    });

    if (!isAirpayConfigured()) {
      // Graceful fallback for local development or testing before live Airpay keys
      return NextResponse.json({
        success: true,
        isConfigured: false,
        orderId,
        total,
        message: "Airpay credentials not configured in .env.local. Test simulation available.",
        testRedirectUrl: `/checkout/result?status=success&orderId=${orderId}&amount=${total}&testMode=true`,
      });
    }

    const transaction = prepareAirpayTransaction({
      orderId,
      amount: Number(total),
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || "Digital Marketing & Tech Services",
        city: customer.city || "New Delhi",
        state: customer.state || "Delhi",
        pinCode: customer.pinCode || "110001",
        country: "India",
      },
      customVar: customData,
    });

    return NextResponse.json({
      success: true,
      isConfigured: true,
      orderId,
      total,
      endpoint: transaction.endpoint,
      mode: transaction.mode,
      fields: transaction.fields,
    });
  } catch (error) {
    console.error("Airpay initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment gateway session." },
      { status: 500 }
    );
  }
}
