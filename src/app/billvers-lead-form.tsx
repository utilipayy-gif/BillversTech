"use client";

import { FormEvent, useState } from "react";

export default function BillversLeadForm({whatsapp="917082688288"}:{whatsapp?:string}) {
  const [prepared, setPrepared] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      `Hello BillversTech — I’m ${String(data.get("name") ?? "").trim()}.`,
      `My business is ${String(data.get("business") ?? "").trim() || "still taking shape"}.`,
      `I’d like help with ${String(data.get("need") ?? "a digital project")}.`,
      String(data.get("note") ?? "").trim(),
    ].filter(Boolean);
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
    setPrepared(true);
  }

  return (
    <form className="mw-form" onSubmit={submit}>
      <div className="mw-field-pair">
        <label><span>01</span>Your name<input name="name" minLength={2} required autoComplete="name" /></label>
        <label><span>02</span>Business name<input name="business" autoComplete="organization" /></label>
      </div>
      <label><span>03</span>What would you like to build?
        <select name="need" defaultValue="website design and development">
          <option value="website design and development">Website design &amp; development</option>
          <option value="SEO or digital marketing">SEO &amp; digital marketing</option>
          <option value="a custom web or mobile application">Web / mobile application</option>
          <option value="e-commerce">E-commerce website</option>
          <option value="domain, hosting or maintenance">Domain, hosting or maintenance</option>
          <option value="help choosing the right service">Help me decide</option>
        </select>
      </label>
      <label><span>04</span>A quick note<textarea name="note" rows={3} placeholder="What are you building, improving or trying to achieve?" /></label>
      <button className="mw-button mw-button-dark" type="submit">Prepare my WhatsApp note <span>↗</span></button>
      <p aria-live="polite">{prepared ? "Your note is open in WhatsApp. Nothing is sent until you press send." : "The form prepares a private draft for you to review in WhatsApp."}</p>
    </form>
  );
}
