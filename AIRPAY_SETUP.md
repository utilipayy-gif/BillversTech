# Airpay Payment Gateway Integration Guide

This guide explains how to configure and activate the **Airpay Payment Gateway** on **BillversTech** for both local testing and production deployment on Vercel.

---

## 1. What Credentials You Need from Airpay

Log in to your [Airpay Merchant Dashboard](https://www.airpay.co.in/) (or Sandbox Portal) and navigate to **Settings / API Credentials**. You will find:

1. **Merchant ID** (`AIRPAY_MERCHANT_ID`)
2. **Username** (`AIRPAY_USERNAME`)
3. **Password** (`AIRPAY_PASSWORD`)
4. **Secret Key** (`AIRPAY_SECRET_KEY`)

---

## 2. Local Setup (`.env.local`)

Your `.env.local` file has been created at the root of the project. Fill in your Airpay keys:

```env
# Mode: "sandbox" for test payments, "production" for real transactions
AIRPAY_MODE=sandbox

AIRPAY_MERCHANT_ID=your_merchant_id
AIRPAY_USERNAME=your_airpay_username
AIRPAY_PASSWORD=your_airpay_password
AIRPAY_SECRET_KEY=your_airpay_secret_key

# Local site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

> **Note:** If you leave the Airpay keys blank in `.env.local`, the site automatically runs in **simulation test mode** so you can test the UI and checkout flow without crashing.

---

## 3. Production Setup on Vercel

Since your project is already connected to GitHub and Vercel with your custom domain (`https://www.billverstech.com`):

1. Go to **Vercel Dashboard** → Select your **BillversTech** project.
2. Go to **Settings** → **Environment Variables**.
3. Add the following variables:

| Variable Key | Recommended Value | Environment |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | `https://www.billverstech.com` | Production, Preview |
| `AIRPAY_MODE` | `production` (or `sandbox` during initial testing) | Production |
| `AIRPAY_MERCHANT_ID` | *Your live Airpay Merchant ID* | Production |
| `AIRPAY_USERNAME` | *Your live Airpay Username* | Production |
| `AIRPAY_PASSWORD` | *Your live Airpay Password* | Production |
| `AIRPAY_SECRET_KEY` | *Your live Airpay Secret Key* | Production |

4. Trigger a **Redeploy** on Vercel so the environment variables take effect.

---

## 4. Airpay Dashboard Webhook & Return URL Configuration

In your Airpay Merchant Dashboard under **Technical Settings** or **URL Configuration**, set your callback URLs:

- **Return URL / Callback URL**:
  `https://www.billverstech.com/api/payment/airpay/response`
- **Allowed Payment Modes**:
  UPI, Net Banking, Credit Cards, Debit Cards, and Wallets are enabled by default.

---

## 5. How the Flow Works

1. **Customer builds order**: Selects services or packages on `/checkout` and provides their details.
2. **Session Initiation**: The client calls `/api/payment/airpay/initiate`.
3. **Checksum Generation**: The server calculates the secure SHA-256 private key and checksum using `crypto`:
   - `privatekey` = `SHA-256(secretKey + "@" + username + ":|:" + password)`
   - `checksum` = `SHA-256(alldata + privatekey)`
4. **Airpay Redirection**: The browser auto-posts the signed request to Airpay's secure checkout page:
   - Sandbox: `https://kraken.airpay.co.in/airpay/pay/index.php`
   - Production: `https://payments.airpay.co.in/pay/index.php`
5. **Payment Completion**: Airpay returns the customer to `/api/payment/airpay/response`.
6. **Verification & Result**: The server verifies the response hash and redirects to `/checkout/result` showing the confirmed Order ID, Airpay Ref ID, and payment status.
