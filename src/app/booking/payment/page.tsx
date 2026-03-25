/**
 * Payment Page
 * Razorpay payment integration
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => Promise<void>;
  prefill: {
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");
  const amount = searchParams.get("amount");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!bookingId || !amount) {
      setError("Invalid booking details");
      return;
    }

    setLoading(true);
    setProcessing(true);

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount: parseInt(amount),
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order");
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.data.razorpayOrderId;

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseInt(amount),
        currency: "INR",
        name: "The Trail Makers",
        description: "Trek Booking Payment",
        order_id: orderId,
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bookingId,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            // Redirect to success page
            router.push(`/booking/confirmation?bookingId=${bookingId}`);
          } catch (err) {
            // Redirect to a failure page with a short error message
            const msg = err instanceof Error ? err.message : "payment_failed";
            router.push(
              `/booking/failure?bookingId=${bookingId}&error=${encodeURIComponent(msg)}`,
            );
            setProcessing(false);
          }
        },
        prefill: {
          email: "",
          contact: "",
        },
        theme: {
          color: "#3b82f6",
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setProcessing(false);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingId || !amount) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Invalid booking details</p>
          <Link href="/all" className="text-blue-400 hover:text-blue-300">
            Back to Treks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <FiArrowLeft /> Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Payment Info */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-2">Complete Payment</h1>
            <p className="text-gray-400 mb-12">Secure payment via Razorpay</p>

            {/* Payment Methods */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-blue-500 rounded-lg bg-blue-900/20 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="w-4 h-4"
                  />
                  <span className="ml-3 font-semibold">Credit/Debit Card</span>
                </label>

                <label className="flex items-center p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-gray-500">
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    className="w-4 h-4"
                  />
                  <span className="ml-3 font-semibold text-gray-400">
                    UPI/Wallet{" "}
                    <span className="text-xs text-gray-500">(Coming soon)</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Test Card Info */}
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-8">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <FiCheckCircle className="text-yellow-500" />
                Test Mode - Use Test Card
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Card Number:</strong> 4111 1111 1111 1111
                </p>
                <p>
                  <strong>Expiry:</strong> Any future date (MM/YY)
                </p>
                <p>
                  <strong>CVV:</strong> Any 3 digits
                </p>
                <p>
                  <strong>OTP:</strong> 123456
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300 mb-6">
                {error}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="h-fit">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 sticky top-20">
              <h3 className="text-lg font-bold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-blue-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Booking ID</span>
                  <span className="font-mono text-xs">
                    {bookingId.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount</span>
                  <span className="font-bold">
                    ₹{(parseInt(amount) / 100).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || processing}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-bold py-3 rounded-lg transition"
              >
                {processing
                  ? "Processing..."
                  : `Pay ₹${(parseInt(amount) / 100).toLocaleString()}`}
              </button>

              <p className="text-xs text-gray-300 text-center mt-4">
                Powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
