import React, { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

/**
 * Read Stripe publishable key from Vite env
 * NOTE: never hardcode secret keys in client.
 */
const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;


const API_BASE = import.meta.env.VITE_API_BASE || "/api";

/** Initialize Stripe once */
const stripePromise = loadStripe(PUBLISHABLE_KEY);

/** Small helper to format dollars to cents safely */
function toCents(aud) {
  const n = Number(aud);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState("9.99"); // default plan price
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onPay(e) {
    e.preventDefault();
    setMsg("");

    if (!stripe || !elements) {
      setMsg("Stripe not ready. Please try again.");
      return;
    }

    const priceCents = toCents(amount);
    if (!priceCents) {
      setMsg("Please enter a valid amount.");
      return;
    }

    try {
      setBusy(true);

      // Create PaymentIntent on server (Netlify will proxy /api to Render)
      const res = await fetch(`${API_BASE}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: priceCents, currency: "aud", plan: "premium" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.clientSecret) {
        throw new Error(data?.error || "Failed to create PaymentIntent");
      }

      // Confirm card payment on client
      const card = elements.getElement(CardElement);
      const confirm = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });

      if (confirm.error) {
        setMsg(`❌ ${confirm.error.message}`);
      } else if (confirm.paymentIntent?.status === "succeeded") {
        setMsg("✅ Payment succeeded!");
      } else {
        setMsg(`ℹ️ Status: ${confirm.paymentIntent?.status || "unknown"}`);
      }
    } catch (err) {
      setMsg(`❌ ${err.message || "Payment failed"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={onPay} style={{ maxWidth: 520 }}>
      <h2>Pay</h2>
      <p className="small">Test cards accepted in Stripe test mode (e.g., 4242 4242 4242 4242).</p>

      <label style={{ display: "block", margin: "12px 0 6px" }}>
        Amount (AUD)
      </label>
      <input
        className="input"
        type="number"
        step="0.01"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={busy}
      />

      <div style={{ margin: "12px 0" }}>
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <button className="btn" type="submit" disabled={busy || !stripe}>
        {busy ? "Processing..." : "Pay now"}
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </form>
  );
}

export default function Pay() {
  const options = useMemo(() => ({ appearance: { theme: "night" } }), []);
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
