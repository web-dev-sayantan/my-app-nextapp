"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";

type BookingSummaryClientProps = {
  departureId: string | null;
  trekName: string | null;
  trekSlug: string | null;
  startDate: string | null;
  endDate: string | null;
  pricePerPerson: string | null;
  availableSeats: string | null;
  initialContactName: string;
  initialContactEmail: string;
};

export default function BookingSummaryClient({
  departureId,
  trekName,
  trekSlug,
  startDate,
  endDate,
  pricePerPerson,
  availableSeats,
  initialContactName,
  initialContactEmail,
}: BookingSummaryClientProps) {
  const router = useRouter();
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [contactName, setContactName] = useState(initialContactName);
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState(initialContactEmail);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPrice =
    (Number.parseInt(pricePerPerson || "0", 10) / 100) * numberOfPeople;

  const handleProceed = async () => {
    if (!departureId) {
      setError("Missing departure details");
      return;
    }

    if (!contactName || !contactPhone || !contactEmail) {
      setError("Please fill all contact details");
      return;
    }

    if (!agreed) {
      setError("Please agree to terms and conditions");
      return;
    }

    setLoading(true);
    setError("");

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
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href={trekSlug ? `/treks/${trekSlug}` : "/all"}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <FiArrowLeft /> Back to Trek
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Confirm Your Booking</h1>
        <p className="text-gray-400 mb-12">Complete your trek reservation</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {trekName || "Selected Trek"}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Departure Dates:</span>
                  <span className="font-semibold">
                    {startDate || "TBD"} to {endDate || "TBD"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price per Person:</span>
                  <span className="font-semibold">
                    ₹
                    {(
                      Number.parseInt(pricePerPerson || "0", 10) / 100
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Number of Participants</h3>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setNumberOfPeople((current) => Math.max(1, current - 1))
                  }
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-sm"
                >
                  −
                </button>

                <input
                  type="number"
                  value={numberOfPeople}
                  onChange={(event) =>
                    setNumberOfPeople(
                      Number.parseInt(event.target.value, 10) || 1,
                    )
                  }
                  min="1"
                  max={Number.parseInt(availableSeats || "0", 10)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-sm text-center w-20"
                />

                <button
                  onClick={() =>
                    setNumberOfPeople((current) =>
                      Math.min(
                        Number.parseInt(availableSeats || "15", 10),
                        current + 1,
                      ),
                    )
                  }
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-sm"
                >
                  +
                </button>

                <span className="text-gray-400 text-sm">
                  (Max: {availableSeats || "0"} available)
                </span>
              </div>
            </div>

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
                    onChange={(event) => setContactName(event.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-gray-700 border border-gray-600 rounded-sm px-4 py-2 text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(event) => setContactPhone(event.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-700 border border-gray-600 rounded-sm px-4 py-2 text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(event) => setContactEmail(event.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded-sm px-4 py-2 text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <span className="text-sm text-gray-400">
                  I agree to the trek terms, conditions, and cancellation
                  policy. I confirm that I am in good health and fit for
                  trekking.
                </span>
              </label>
            </div>

            {error && (
              <div className="mt-6 bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
                {error}
              </div>
            )}
          </div>

          <div className="h-fit">
            <div className="bg-linear-to-br from-blue-900 to-blue-800 rounded-lg p-6 sticky top-20">
              <h3 className="text-lg font-bold mb-6">Price Breakdown</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-blue-700">
                <div className="flex justify-between text-sm">
                  <span>Price per person</span>
                  <span>
                    ₹
                    {(
                      Number.parseInt(pricePerPerson || "0", 10) / 100
                    ).toLocaleString()}
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
