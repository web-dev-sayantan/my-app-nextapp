/**
 * Booking Summary Page
 * User selects departure dates and passenger details
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiArrowLeft, FiChevronRight, FiCheck } from "react-icons/fi";

export default function BookingSummary() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const departureId = searchParams.get("departureId");
  const trekName = searchParams.get("trekName");
  const trekSlug = searchParams.get("trekSlug");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const pricePerPerson = searchParams.get("price");
  const availableSeats = searchParams.get("seats");

  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-fill contact details if user is logged in
  useEffect(() => {
    if (session?.user?.email) {
      setContactEmail(session.user.email);
      setContactName(session.user.name || "");
    }
  }, [session]);

  const totalPrice = (parseInt(pricePerPerson || "0") / 100) * numberOfPeople;

  const handleProceed = async () => {
    if (!contactName || !contactPhone || !contactEmail) {
      setError("Please fill all contact details");
      return;
    }

    if (!agreed) {
      setError("Please agree to terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          departureId,
          numberOfPeople,
          contactName,
          contactPhone,
          contactEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Failed to create booking");
      }

      // Redirect to payment page (Razorpay test/live)
      router.push(
        `/booking/payment?bookingId=${data.data.id}&amount=${totalPrice * 100}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href={`/treks/${trekSlug}`}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <FiArrowLeft /> Back to Trek
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Confirm Your Booking</h1>
        <p className="text-gray-400 mb-12">Complete your trek reservation</p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="md:col-span-2">
            {/* Trek Summary */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">{trekName}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Departure Dates:</span>
                  <span className="font-semibold">
                    {startDate} to {endDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price per Person:</span>
                  <span className="font-semibold">
                    ₹{(parseInt(pricePerPerson || "0") / 100).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Participant Count */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Number of Participants</h3>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setNumberOfPeople(Math.max(1, numberOfPeople - 1))
                  }
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                >
                  −
                </button>

                <input
                  type="number"
                  value={numberOfPeople}
                  onChange={(e) =>
                    setNumberOfPeople(parseInt(e.target.value) || 1)
                  }
                  min="1"
                  max={parseInt(availableSeats || "0")}
                  className="bg-gray-700 text-white px-4 py-2 rounded text-center w-20"
                />

                <button
                  onClick={() =>
                    setNumberOfPeople(
                      Math.min(
                        parseInt(availableSeats || "15"),
                        numberOfPeople + 1,
                      ),
                    )
                  }
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                >
                  +
                </button>

                <span className="text-gray-400 text-sm">
                  (Max: {availableSeats} available)
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="mt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <span className="text-sm text-gray-400">
                  I agree to the trek terms, conditions, and cancellation
                  policy. I confirm that I am in good health and fit for
                  trekking.
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
                {error}
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="h-fit">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 sticky top-20">
              <h3 className="text-lg font-bold mb-6">Price Breakdown</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-blue-700">
                <div className="flex justify-between text-sm">
                  <span>Price per person</span>
                  <span>
                    ₹{(parseInt(pricePerPerson || "0") / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    × {numberOfPeople}{" "}
                    {numberOfPeople === 1 ? "person" : "people"}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-3xl font-bold text-yellow-400">
                    ₹
                    {totalPrice.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
                <FiChevronRight />
              </button>

              <p className="text-xs text-gray-300 text-center mt-4">
                ✓ Secure payment via Razorpay (Card, UPI, Netbanking)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
