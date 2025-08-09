// CheckoutButton.tsx
import React, { useState } from "react";
import axiosInstance from "../lib/axios";

export default function CheckoutButton({
  orderId,
}: {
  orderId: number | string;
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // 🔴 Make sure this path EXACTLY matches your backend route (often needs trailing slash)
      const url = `/customer/create-checkout-session/${orderId}/`;

      const res = await axiosInstance.post(url);
      console.log("dfdsafa", res);
      if (!res?.data?.url) throw new Error("No checkout URL returned");
      window.location.href = res.data.url;
    } catch (err: any) {
      // ✅ Show real server details
      const status = err?.response?.status;
      const data = err?.response?.data;
      const text = typeof data === "string" ? data : JSON.stringify(data);
      console.error("Create session failed:", status, text);

      // nicer message per status
      if (status === 401) {
        alert(
          "You’re not logged in or token is invalid. Please sign in again."
        );
      } else if (status === 403) {
        alert("Forbidden. Your account may not have access.");
      } else if (status === 404) {
        alert("Endpoint not found. Check the URL/path or trailing slash.");
      } else {
        alert(
          `Failed to create checkout session (${status ?? "unknown"}): ${
            text || err.message
          }`
        );
      }
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
