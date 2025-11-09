"use client";
import Button from "@/components/button";

export default function PaypalFailPage() {
  return (
    <div className="text-text">
      <h2 className="text-text text-lg font-bold mb-4">Payment Failed</h2>
      There was an issue with your payment. Please try again or contact support
      if the problem persists.
      <Button
        className="mt-6"
        onClick={() => (window.location.href = "/dashboard/go-premium")}
        caption="Go back to payment page
"
      />
    </div>
  );
}
