import React, { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Read publishable key & backend base from Vite env
const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787";

// Initialize Stripe once
const stripePromise = loadStripe(PUBLISHABLE_KEY);

// Helper to format cents
function dollars(cents) { return `$${(cents / 100).toFixed(2)}`; }

// Payment form component
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [priceCents] = useState(999);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handlePay = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!stripe || !elements) return;
    try {
      setLoading(true);

      // Create PaymentIntent on backend
      const res = await fetch(`${API_BASE}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: priceCents, currency: "aud", plan: "premium" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create intent");

      // Confirm on client
      const card = elements.getElement(CardElement);
      const confirm = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });

      if (confirm.error) setMsg(`❌ ${confirm.error.message}`);
      else if (confirm.paymentIntent?.status === "succeeded")
        setMsg("✅ Payment succeeded! Premium unlocked (test mode).");
      else setMsg("⚠️ Payment status: " + confirm.paymentIntent?.status);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handlePay}>
      <h2>Premium Checkout</h2>
      <p className="small">
        This is a test integration. Use Stripe test card, e.g. <strong>4242 4242 4242 4242</strong>.
      </p>

      <div style={{ background: "transparent", padding: 12, borderRadius: 10, border: "1px solid var(--border)", marginBottom: 12 }}>
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <button className="btn" disabled={!stripe || loading}>
        {loading ? "Processing..." : `Pay ${dollars(priceCents)} (Test)`}
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
