import Link from "next/link";
import { FiXCircle } from "react-icons/fi";

type PaymentFailurePageProps = {
  searchParams: Promise<{
    bookingId?: string;
    amount?: string;
    error?: string;
  }>;
};

export default async function PaymentFailurePage({
  searchParams,
}: PaymentFailurePageProps) {
  const params = await searchParams;
  const bookingId = params.bookingId;
  const amount = params.amount;
  const error = params.error;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black text-white flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-8 text-center">
          <FiXCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
          <p className="text-red-200 mb-4">
            We could not complete your payment.
          </p>

          {bookingId && (
            <p className="text-sm text-gray-300 mb-4">
              Booking reference: <span className="font-mono">{bookingId}</span>
            </p>
          )}

          {error && (
            <p className="text-sm text-gray-300 mb-6">Reason: {error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={
                bookingId && amount
                  ? `/booking/payment?bookingId=${bookingId}&amount=${amount}`
                  : "/all"
              }
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-sm text-white"
            >
              Try Again
            </Link>

            <Link
              href="/all"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-sm text-white text-center"
            >
              Browse Treks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
