import { createHash } from "node:crypto";

export type AirpayConfig = {
  merchantId: string;
  username: string;
  password: string;
  secretKey: string;
  mode: "sandbox" | "production";
  endpoint: string;
};

export type OrderCustomer = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
};

export type AirpayPaymentParams = {
  orderId: string;
  amount: number;
  customer: OrderCustomer;
  customVar?: string;
};

export type AirpayFormField = {
  name: string;
  value: string;
};

export function isAirpayConfigured(): boolean {
  return Boolean(
    process.env.AIRPAY_MERCHANT_ID &&
    process.env.AIRPAY_USERNAME &&
    process.env.AIRPAY_PASSWORD &&
    process.env.AIRPAY_SECRET_KEY
  );
}

export function getAirpayConfig(): AirpayConfig {
  const mode = process.env.AIRPAY_MODE === "production" ? "production" : "sandbox";
  const endpoint =
    process.env.AIRPAY_ENDPOINT?.trim() || "https://payments.airpay.co.in/pay/index.php";

  return {
    merchantId: (process.env.AIRPAY_MERCHANT_ID ?? "").trim(),
    username: (process.env.AIRPAY_USERNAME ?? "").trim(),
    password: (process.env.AIRPAY_PASSWORD ?? "").trim(),
    secretKey: (process.env.AIRPAY_SECRET_KEY ?? "").trim(),
    mode,
    endpoint,
  };
}

/**
 * Calculates Airpay private key using SHA-256 of credentials.
 * Standard format: sha256(secret + "@" + username + ":|:" + password)
 */
export function generatePrivateKey(secret: string, username: string, password: string): string {
  const payload = `${secret}@${username}:|:${password}`;
  return createHash("sha256").update(payload).digest("hex");
}

/**
 * Generates today's date in YYYY-MM-DD format in Asia/Kolkata timezone.
 */
export function getIndiaDateString(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date()); // Outputs YYYY-MM-DD
}

/**
 * Prepares the payload and calculates checksum for Airpay hosted checkout.
 */
export function prepareAirpayTransaction(params: AirpayPaymentParams) {
  const config = getAirpayConfig();
  const privateKey = generatePrivateKey(config.secretKey, config.username, config.password);

  const names = params.customer.name.trim().split(/\s+/);
  const buyerFirstName = names[0] || "Customer";
  const buyerLastName = names.slice(1).join(" ") || "BillversTech";

  const buyerEmail = params.customer.email.trim();
  const buyerPhone = params.customer.phone.replace(/[^0-9]/g, "").slice(-10) || "9999999999";
  const buyerAddress = (params.customer.address || "Digital Delivery").trim();
  const buyerCity = (params.customer.city || "New Delhi").trim();
  const buyerState = (params.customer.state || "Delhi").trim();
  const buyerPinCode = (params.customer.pinCode || "110001").trim();
  const buyerCountry = (params.customer.country || "India").trim();

  const formattedAmount = params.amount.toFixed(2);
  const dateStr = getIndiaDateString();

  // Airpay standard alldata concatenation
  const alldata = `${buyerEmail}${buyerFirstName}${buyerLastName}${buyerAddress}${buyerCity}${buyerState}${buyerPinCode}${buyerCountry}${formattedAmount}${params.orderId}${dateStr}`;
  const checksum = createHash("sha256").update(alldata + privateKey).digest("hex");

  const fields: AirpayFormField[] = [
    { name: "buyerEmail", value: buyerEmail },
    { name: "buyerFirstName", value: buyerFirstName },
    { name: "buyerLastName", value: buyerLastName },
    { name: "buyerAddress", value: buyerAddress },
    { name: "buyerCity", value: buyerCity },
    { name: "buyerState", value: buyerState },
    { name: "buyerPinCode", value: buyerPinCode },
    { name: "buyerCountry", value: buyerCountry },
    { name: "buyerPhone", value: buyerPhone },
    { name: "orderid", value: params.orderId },
    { name: "amount", value: formattedAmount },
    { name: "currency", value: "356" },
    { name: "isocurrency", value: "INR" },
    { name: "chmod", value: "" }, // Allows all channels (UPI, Cards, NetBanking, Wallets)
    { name: "merchant_id", value: config.merchantId },
    { name: "mercid", value: config.merchantId },
    { name: "mid", value: config.merchantId },
    { name: "privatekey", value: privateKey },
    { name: "checksum", value: checksum },
  ];

  const clientId = process.env.AIRPAY_CLIENT_ID?.trim() || "zJQsJ3";
  fields.push(
    { name: "client_id", value: clientId },
    { name: "clientid", value: clientId },
  );

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.billverstech.com").replace(/\/$/, "");
  const returnUrl = `${siteUrl}/api/payment/airpay/response`;
  fields.push({ name: "successurl", value: returnUrl });
  fields.push({ name: "failedurl", value: returnUrl });
  fields.push({ name: "returnurl", value: returnUrl });

  if (params.customVar) {
    fields.push({ name: "customvar", value: params.customVar });
  }

  return {
    endpoint: config.endpoint,
    mode: config.mode,
    fields,
  };
}

/**
 * Validates the return response checksum from Airpay.
 */
export function verifyAirpayResponse(data: {
  transactionId?: string;
  airpayTxnId?: string;
  amount?: string;
  status?: string;
  message?: string;
  checksum?: string;
}): boolean {
  if (!isAirpayConfigured()) return true; // In mock/test mode without credentials
  if (!data.checksum) return false;

  const config = getAirpayConfig();
  const privateKey = generatePrivateKey(config.secretKey, config.username, config.password);

  // Response string check
  const responseData = `${data.transactionId ?? ""}:${data.airpayTxnId ?? ""}:${data.amount ?? ""}:${data.status ?? ""}:${data.message ?? ""}:${config.merchantId}:${config.username}`;
  const expectedHash = createHash("sha256").update(`${responseData}:${privateKey}`).digest("hex");

  return expectedHash.toLowerCase() === data.checksum.toLowerCase();
}
