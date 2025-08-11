/* eslint-disable no-empty */
/* src/components/CheckoutButton.tsx */
import React, { useState } from "react";
import axiosInstance from "../lib/axios";
import { loadStripe } from "@stripe/stripe-js";

export default function CheckoutButton({
  orderId,
}: {
  orderId: number | string;
}) {
  const [loading, setLoading] = useState(false);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK!);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.post(
        `/customer/create-checkout-session/${orderId}/`
      );

      const url: string | undefined = res?.data?.url;
      const sessionId: string | undefined = res?.data?.sessionId;

      if (!sessionId && !url)
        throw new Error("No checkout URL or sessionId returned");

      // (Optional) আগেই কনফার্ম হয়ে থাকলে success এ পাঠাই
      if (sessionId) {
        try {
          const probe = await axiosInstance.get(`/customer/payment/success/`, {
            params: { session_id: sessionId, order_id: String(orderId) },
          });
          if (probe?.data?.confirmed) {
            window.location.href = `/dashboard/success?session_id=${encodeURIComponent(
              sessionId
            )}&order_id=${encodeURIComponent(String(orderId))}`;
            return;
          }
        } catch (_) {}
      }

      // Checkout এ যাই
      if (url) {
        window.location.href = url;
        return;
      }
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe not loaded");
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId!,
      });
      if (error) throw error;
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      const text = typeof data === "string" ? data : JSON.stringify(data);
      console.error("Create session failed:", status, text);
      alert(
        `Failed to create checkout session (${status ?? "unknown"}): ${
          text || err.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
    >
      {loading ? "Processing..." : "Checkout"}
    </button>
  );
}
