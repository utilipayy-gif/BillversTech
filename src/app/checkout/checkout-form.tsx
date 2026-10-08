"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Service } from "../service-data";
import { servicePrice } from "../service-data";

type OrderOption = {
  key: string;
  serviceSlug: string;
  serviceTitle: string;
  category: string;
  packageId?: string;
  packageName?: string;
  heading?: string;
  price: number;
};

type CheckoutFieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  pattern?: string;
  multiline?: boolean;
  rows?: number;
};

function CheckoutField({ label, name, type = "text", autoComplete, required, minLength, pattern, multiline, rows = 3 }: CheckoutFieldProps) {
  const [error, setError] = useState("");
  const id = `checkout-${name}`;
  const errorId = `${id}-error`;
  const validate = (field: HTMLInputElement | HTMLTextAreaElement) => {
    if (field.validity.valid) return setError("");
    if (field.validity.valueMissing) return setError(`${label} is required.`);
    if (field.validity.typeMismatch) return setError("Enter a valid email address.");
    if (field.validity.tooShort) return setError(`Use at least ${minLength} characters.`);
    if (field.validity.patternMismatch) return setError("Enter a valid phone number.");
    setError(field.validationMessage || "Check this field.");
  };
  const shared = {
    id,
    name,
    required,
    minLength,
    pattern,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => validate(event.currentTarget),
    onInvalid: (event: React.InvalidEvent<HTMLInputElement | HTMLTextAreaElement>) => validate(event.currentTarget),
    onInput: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (error && event.currentTarget.validity.valid) setError("");
    },
  };

  return <label htmlFor={id}>
    {label}{required && <span className="field-required"> *</span>}
    {multiline
      ? <textarea {...shared} rows={rows} />
      : <input {...shared} type={type} autoComplete={autoComplete} />}
    {error && <small id={errorId} className="field-error" role="alert">{error}</small>}
  </label>;
}

export default function CheckoutForm({ services, initialService, initialPackage }: {
  services: Service[];
  initialService?: string;
  initialPackage?: string;
}) {
  const options = useMemo<OrderOption[]>(() => services.flatMap((service) =>
    service.packages?.length
      ? service.packages.map((item) => ({
          key: `${service.slug}::${item.id}`,
          serviceSlug: service.slug,
          serviceTitle: service.title,
          category: service.category,
          packageId: item.id,
          packageName: item.name,
          heading: item.heading,
          price: item.price,
        }))
      : [{
          key: service.slug,
          serviceSlug: service.slug,
          serviceTitle: service.title,
          category: service.category,
          price: servicePrice(service),
        }],
  ), [services]);
  const requested = useMemo(() =>
    options.find((item) => item.serviceSlug === initialService && (!initialPackage || item.packageId === initialPackage))
      ?? options.find((item) => item.serviceSlug === initialService),
  [initialPackage, initialService, options]);
  const [items, setItems] = useState<Record<string, number>>(requested ? { [requested.key]: 1 } : {});
  const [choice, setChoice] = useState(options[0]?.key ?? "");
  const [ready, setReady] = useState(false);
  const [restored, setRestored] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let next: Record<string, number> = {};
      try {
        const saved = JSON.parse(localStorage.getItem("billverstech-order-v1") ?? "{}") as Record<string, number>;
        const validKeys = new Set(options.map((item) => item.key));
        next = Object.fromEntries(Object.entries(saved).filter(([key, quantity]) => validKeys.has(key) && Number.isInteger(quantity) && quantity > 0));
      } catch {
        next = {};
      }
      if (requested) next[requested.key] = Math.max(1, next[requested.key] ?? 0);
      setItems(next);
      setRestored(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [options, requested]);

  useEffect(() => {
    if (restored) localStorage.setItem("billverstech-order-v1", JSON.stringify(items));
  }, [items, restored]);

  const selected = options.filter((item) => items[item.key]);
  const total = selected.reduce((sum, item) => sum + item.price * (items[item.key] ?? 0), 0);
  const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
  const update = (key: string, amount: number) => {
    setReady(false);
    setSubmitError("");
    setItems((current) => {
      const next = { ...current, [key]: Math.max(0, (current[key] ?? 0) + amount) };
      if (!next[key]) delete next[key];
      return next;
    });
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const name = String(formData.get("name") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const phone = String(formData.get("phone") ?? "").trim();
      const business = String(formData.get("business") ?? "").trim();
      const notes = String(formData.get("notes") ?? "").trim();

      const response = await fetch("/api/payment/airpay/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone, business, notes },
          items: selected.map((item) => ({
            key: item.key,
            title: item.serviceTitle,
            packageName: item.packageName,
            quantity: items[item.key] ?? 1,
            price: item.price,
          })),
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.error || "Unable to proceed with payment gateway.");
        setIsSubmitting(false);
        return;
      }

      if (data.isConfigured && data.endpoint && data.fields) {
        // Construct and submit the Airpay form
        const airpayForm = document.createElement("form");
        airpayForm.method = "POST";
        airpayForm.action = data.endpoint;

        for (const field of data.fields) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = field.name;
          input.value = field.value;
          airpayForm.appendChild(input);
        }

        document.body.appendChild(airpayForm);
        airpayForm.submit();
      } else if (data.testRedirectUrl) {
        // Test/Demo mode fallback
        window.location.href = data.testRedirectUrl;
      } else {
        setReady(true);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to communicate with payment processor. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="order-builder" onSubmit={submit}>
      <div className="order-catalog">
        <div className="order-add">
          <label>
            Add a service or package
            <select value={choice} onChange={(event) => setChoice(event.target.value)}>
              {options.map((item) => <option value={item.key} key={item.key}>
                {item.serviceTitle}{item.packageName ? ` — ${item.packageName}` : ""} — {money(item.price)}
              </option>)}
            </select>
          </label>
          <button type="button" onClick={() => update(choice, 1)}>Add to order +</button>
        </div>
        {selected.length ? <div className="order-items">
          {selected.map((item) => <article key={item.key}>
            <div>
              <span>{item.category}</span>
              <h3>{item.serviceTitle}</h3>
              {item.packageName && <strong className="order-package-name">{item.packageName}</strong>}
              <p>{item.heading ?? `${money(item.price)} each`}</p>
            </div>
            <div className="order-quantity">
              <button type="button" aria-label={`Remove one ${item.packageName ?? item.serviceTitle}`} onClick={() => update(item.key, -1)}>−</button>
              <strong>{items[item.key]}</strong>
              <button type="button" aria-label={`Add one ${item.packageName ?? item.serviceTitle}`} onClick={() => update(item.key, 1)}>+</button>
            </div>
            <b>{money(item.price * (items[item.key] ?? 0))}</b>
          </article>)}
        </div> : <div className="order-empty"><strong>Your order is empty.</strong><p>Select a service or package above to start building it.</p></div>}
      </div>

      <aside className="order-summary" id="project-details">
        <span>YOUR ORDER</span>
        <h2>Project details</h2>
        <CheckoutField label="Full name" name="name" autoComplete="name" minLength={2} required />
        <CheckoutField label="Email" name="email" type="email" autoComplete="email" required />
        <CheckoutField label="Phone / WhatsApp" name="phone" type="tel" autoComplete="tel" pattern="[0-9+() -]{7,20}" required />
        <CheckoutField label="Business name" name="business" autoComplete="organization" />
        <CheckoutField label="Anything we should know?" name="notes" multiline rows={3} />
        <div className="order-total">
          <span>Estimated total</span>
          <strong>{money(total)}</strong>
          <small>Final scope and applicable taxes are confirmed before payment.</small>
        </div>
        {restored && selected.length > 0 && <p className="order-saved">✓ Your selection is saved on this device.</p>}
        {submitError && (
          <p className="field-error" style={{ color: "#cf222e", margin: "8px 0", fontSize: "12px" }}>
            ✕ {submitError}
          </p>
        )}
        <button
          className="bh-button bh-button-dark"
          disabled={!selected.length || isSubmitting}
          style={{ width: "100%", cursor: isSubmitting ? "wait" : "pointer" }}
        >
          {isSubmitting ? "Connecting to Airpay Gateway..." : "Proceed to payment →"}
        </button>
        {ready && (
          <p className="order-ready" role="status">
            <strong>Order prepared.</strong> Initiating secure checkout with Airpay...
          </p>
        )}
      </aside>

      {selected.length > 0 && <div className="order-mobile-total" aria-live="polite">
        <span><small>Order total</small><strong>{money(total)}</strong></span>
        <button type="button" onClick={() => document.getElementById("project-details")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Review order →</button>
      </div>}
    </form>
  );
}
