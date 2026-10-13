import { createHash, createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export type AirpayConfig = {
  merchantId: string;
  clientId: string;
  username: string;
  password: string;
  secretKey: string;
  apiKey: string;
  mode: "sandbox" | "production";
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

  return {
    merchantId: (process.env.AIRPAY_MERCHANT_ID ?? "").trim(),
    clientId: (process.env.AIRPAY_CLIENT_ID ?? "zJQsJ3").trim(),
    username: (process.env.AIRPAY_USERNAME ?? "").trim(),
    password: (process.env.AIRPAY_PASSWORD ?? "").trim(),
    secretKey: (process.env.AIRPAY_SECRET_KEY ?? "").trim(),
    apiKey: (process.env.AIRPAY_API_KEY ?? "4ffexkEMCycVGznb").trim(),
    mode,
  };
}

/**
 * Calculates symmetric encryption key derived from merchant credentials.
 * Formula: md5(username + "~:~" + password)
 */
export function getAirpayEncryptionKey(username: string, password: string): string {
  return createHash("md5").update(`${username}~:~${password}`).digest("hex");
}

/**
 * Calculates Airpay private key using SHA-256 of credentials.
 * Standard format: sha256(apiKey + "@" + username + ":|:" + password)
 */
export function generatePrivateKey(keyOrSecret: string, username: string, password: string): string {
  const payload = `${keyOrSecret}@${username}:|:${password}`;
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
 * Encrypts data using AES-256-CBC with PKCS5 padding as specified by Airpay.
 */
export function encryptAirpayPayload(dataStr: string, key: string): string {
  const ivStr = randomBytes(8).toString("hex"); // 16 hex characters
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(key, "utf8"), Buffer.from(ivStr, "utf8"));
  let enc = cipher.update(dataStr, "utf8", "base64");
  enc += cipher.final("base64");
  return ivStr + enc;
}

/**
 * Decrypts AES-256-CBC encrypted response from Airpay APIs.
 */
export function decryptAirpayPayload(responseStr: string, key: string): string {
  const ivStr = responseStr.substring(0, 16);
  const encBase64 = responseStr.substring(16);
  const decipher = createDecipheriv("aes-256-cbc", Buffer.from(key, "utf8"), Buffer.from(ivStr, "utf8"));
  let dec = decipher.update(encBase64, "base64", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

/**
 * Calculates SHA-256 checksum across alphabetically sorted key-value pairs appended with current date.
 */
export function calculateAirpayChecksum(dataObj: Record<string, string>): string {
  const keys = Object.keys(dataObj).sort();
  let concat = "";
  for (const k of keys) {
    concat += String(dataObj[k]);
  }
  const today = getIndiaDateString();
  return createHash("sha256").update(concat + today).digest("hex");
}

/**
 * Obtains an OAuth2 access token from Airpay Kraken API.
 */
export async function getAirpayOAuthToken(config: AirpayConfig): Promise<string | null> {
  try {
    const encKey = getAirpayEncryptionKey(config.username, config.password);
    const oauthData: Record<string, string> = {
      client_id: config.clientId,
      client_secret: config.secretKey,
      merchant_id: config.merchantId,
      grant_type: "client_credentials",
    };

    const encdata = encryptAirpayPayload(JSON.stringify(oauthData), encKey);
    const checksum = calculateAirpayChecksum(oauthData);

    const formData = new FormData();
    formData.append("merchant_id", config.merchantId);
    formData.append("encdata", encdata);
    formData.append("checksum", checksum);

    const response = await fetch("https://kraken.airpay.co.in/airpay/pay/v4/api/oauth2/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) return null;

    const resJson = await response.json();
    if (!resJson?.response) return null;

    const decrypted = JSON.parse(decryptAirpayPayload(resJson.response, encKey));
    if (decrypted?.status === "success" && decrypted?.data?.access_token) {
      return decrypted.data.access_token as string;
    }

    return null;
  } catch (err) {
    console.error("Airpay OAuth Token fetch error:", err);
    return null;
  }
}

/**
 * Prepares the payload and calculates checksum for Airpay hosted checkout.
 * Supports modern Airpay v4 hosted flow with fallback to standard flow.
 */
export async function prepareAirpayTransaction(params: AirpayPaymentParams) {
  const config = getAirpayConfig();
  const encKey = getAirpayEncryptionKey(config.username, config.password);
  const privateKey = generatePrivateKey(config.apiKey || config.secretKey, config.username, config.password);

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

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.billverstech.com").replace(/\/$/, "");
  const returnUrl = `${siteUrl}/api/payment/airpay/response`;

  // Attempt to acquire Airpay v4 OAuth2 access token
  const token = await getAirpayOAuthToken(config);

  if (token) {
    // Airpay v4 Hosted Payment Flow
    const txData: Record<string, string> = {
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone,
      buyer_firstname: buyerFirstName,
      buyer_lastname: buyerLastName,
      buyer_address: buyerAddress,
      buyer_city: buyerCity,
      buyer_state: buyerState,
      buyer_pincode: buyerPinCode,
      buyer_country: buyerCountry,
      amount: formattedAmount,
      orderid: params.orderId,
      currency_code: "356",
      iso_currency: "inr",
      return_url: returnUrl,
    };

    if (params.customVar) {
      txData.customvar = params.customVar;
    }

    const encdata = encryptAirpayPayload(JSON.stringify(txData), encKey);
    const checksum = calculateAirpayChecksum(txData);

    const fields: AirpayFormField[] = [
      { name: "privatekey", value: privateKey },
      { name: "merchant_id", value: config.merchantId },
      { name: "encdata", value: encdata },
      { name: "checksum", value: checksum },
    ];

    return {
      endpoint: `https://payments.airpay.co.in/pay/v4/?token=${token}`,
      mode: config.mode,
      fields,
    };
  }

  // Classic Airpay hosted fallback
  const dateStr = getIndiaDateString();
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
    { name: "chmod", value: "" },
    { name: "merchant_id", value: config.merchantId },
    { name: "mercid", value: config.merchantId },
    { name: "mid", value: config.merchantId },
    { name: "client_id", value: config.clientId },
    { name: "privatekey", value: privateKey },
    { name: "checksum", value: checksum },
    { name: "successurl", value: returnUrl },
    { name: "failedurl", value: returnUrl },
    { name: "returnurl", value: returnUrl },
  ];

  return {
    endpoint: "https://payments.airpay.co.in/pay/index.php",
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
  if (!isAirpayConfigured()) return true;
  if (!data.checksum) return false;

  const config = getAirpayConfig();
  const privateKey = generatePrivateKey(config.apiKey || config.secretKey, config.username, config.password);

  const responseData = `${data.transactionId ?? ""}:${data.airpayTxnId ?? ""}:${data.amount ?? ""}:${data.status ?? ""}:${data.message ?? ""}:${config.merchantId}:${config.username}`;
  const expectedHash = createHash("sha256").update(`${responseData}:${privateKey}`).digest("hex");

  return expectedHash.toLowerCase() === data.checksum.toLowerCase();
}

/**
 * Safely decrypts an encrypted Airpay response payload using configured merchant keys.
 */
export function safeDecryptAirpayResponse(
  encryptedStr: string,
  config?: AirpayConfig
): Record<string, any> | null {
  if (!encryptedStr || typeof encryptedStr !== "string" || encryptedStr.length < 17) {
    return null;
  }

  const activeConfig = config || getAirpayConfig();
  const encKey = getAirpayEncryptionKey(activeConfig.username, activeConfig.password);
  const keysToTry = [encKey, activeConfig.secretKey, activeConfig.apiKey];

  for (const k of keysToTry) {
    if (!k) continue;
    try {
      const ivStr = encryptedStr.substring(0, 16);
      const encBase64 = encryptedStr.substring(16);
      const decipher = createDecipheriv("aes-256-cbc", Buffer.from(k, "utf8"), Buffer.from(ivStr, "utf8"));
      let dec = decipher.update(encBase64, "base64", "utf8");
      dec += decipher.final("utf8");

      try {
        const parsed = JSON.parse(dec);
        if (parsed && typeof parsed === "object") return parsed;
      } catch {
        const params = new URLSearchParams(dec);
        const obj: Record<string, string> = {};
        params.forEach((v, key) => {
          obj[key] = v;
        });
        if (Object.keys(obj).length > 0) return obj;
      }
    } catch {
      // continue to next candidate key
    }
  }

  return null;
}

export type ParsedAirpayResponse = {
  transactionId: string;
  airpayTxnId: string;
  amount: string;
  status: string;
  isSuccess: boolean;
  message: string;
  paymentMode: string;
  transactionDate: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customVar?: string;
  raw: Record<string, string>;
};

/**
 * Parses, decrypts (if encrypted), and normalizes incoming Airpay callback / response parameters.
 */
export function parseAirpayResponsePayload(
  rawInput: Record<string, any>,
  config?: AirpayConfig
): ParsedAirpayResponse {
  const activeConfig = config || getAirpayConfig();
  const merged: Record<string, string> = {};

  for (const [key, val] of Object.entries(rawInput)) {
    if (val !== undefined && val !== null) {
      merged[key] = String(val);
    }
  }

  const encCandidate =
    merged.encdata ||
    merged.encData ||
    merged.ENCDATA ||
    merged.response ||
    merged.RESPONSE ||
    merged.data ||
    merged.data_value;

  if (encCandidate && typeof encCandidate === "string" && encCandidate.length > 20) {
    const decrypted = safeDecryptAirpayResponse(encCandidate, activeConfig);
    if (decrypted) {
      for (const [k, v] of Object.entries(decrypted)) {
        if (v !== undefined && v !== null) {
          merged[k] = String(v);
        }
      }
    }
  }

  const findVal = (...keys: string[]): string => {
    for (const k of keys) {
      if (merged[k] !== undefined && merged[k] !== "") return merged[k];
      const lower = k.toLowerCase();
      for (const [mk, mv] of Object.entries(merged)) {
        if (mk.toLowerCase() === lower && mv !== "") return mv;
      }
    }
    return "";
  };

  const transactionId = findVal("TRANSACTIONID", "orderid", "orderId", "mer_txn", "ORDERID", "txn_id");
  const airpayTxnId = findVal("APTRANSACTIONID", "aptransactionid", "airpay_txn_id", "ap_txn_id", "airpaytxnid");
  const amount = findVal("AMOUNT", "amount", "amt", "billed_amount");
  const rawStatus = findVal("TRANSACTIONSTATUS", "status", "transactionstatus", "TRANSACTION_STATUS", "STATUS", "response_code");
  const message = findVal("MESSAGE", "message", "status_desc", "msg", "desc");
  const paymentMode = findVal("CHMOD", "chmod", "payment_mode", "pay_mode");
  const transactionDate = findVal("TRANSACTIONDATE", "transactiondate", "date", "datetime") || getIndiaDateString();
  const customVar = findVal("customvar", "customVar", "CUSTOMVAR");

  const customerName = (
    findVal("buyerFirstName", "buyer_firstname", "customer_name", "buyerName") +
    (findVal("buyerLastName", "buyer_lastname") ? " " + findVal("buyerLastName", "buyer_lastname") : "")
  ).trim();
  const customerEmail = findVal("buyerEmail", "buyer_email", "email");
  const customerPhone = findVal("buyerPhone", "buyer_phone", "phone");

  const statusLower = rawStatus.toLowerCase();
  const msgLower = message.toLowerCase();

  const isSuccess =
    rawStatus === "200" ||
    statusLower === "success" ||
    statusLower === "paid" ||
    rawStatus === "00" ||
    msgLower.includes("success") ||
    msgLower.includes("approved");

  return {
    transactionId,
    airpayTxnId,
    amount,
    status: rawStatus || (isSuccess ? "200" : "400"),
    isSuccess,
    message: message || (isSuccess ? "Payment received successfully" : "Payment incomplete or cancelled"),
    paymentMode: paymentMode || "Online (UPI / Cards / NetBanking)",
    transactionDate,
    customerName: customerName || undefined,
    customerEmail: customerEmail || undefined,
    customerPhone: customerPhone || undefined,
    customVar: customVar || undefined,
    raw: merged,
  };
}
