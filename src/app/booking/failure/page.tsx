"use client"

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiXCircle, FiArrowLeft } from 'react-icons/fi';

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get('bookingId');
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black text-white flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-8 text-center">
          <FiXCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
          <p className="text-red-200 mb-4">We could not complete your payment.</p>

          {bookingId && (
            <p className="text-sm text-gray-300 mb-4">Booking reference: <span className="font-mono">{bookingId}</span></p>
          )}

          {error && (
            <p className="text-sm text-gray-300 mb-6">Reason: {decodeURIComponent(error)}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-sm text-white"
            >
              Try Again
            </button>

            <Link
              href="/booking/summary"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-sm text-white text-center"
            >
              Edit Booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
