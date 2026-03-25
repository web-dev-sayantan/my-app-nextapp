import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function MyBookingsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-12"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">My Bookings</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Track and manage all your trek bookings in one place. View upcoming adventures, 
              modify dates, check payment status, and download your trek itineraries with ease.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Track Your Adventures</h3>
                  <p className="text-gray-400">Monitor all your registered treks and upcoming departures</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Easy Modifications</h3>
                  <p className="text-gray-400">Change dates, add friends, or update your preferences anytime</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Digital Access</h3>
                  <p className="text-gray-400">Get instant access to itineraries, documents, and guides</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1516575080604-9f574eebb66d?w=600&h=400&fit=crop"
              alt="Trekking group checking itinerary"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 mb-20">
          <h2 className="text-2xl font-bold mb-6">How to Access Your Bookings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Step 1: Log In</h3>
              <p className="text-gray-300">
                Sign in with your email and password to access your personalized dashboard where all your bookings are displayed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Step 2: View Your Bookings</h3>
              <p className="text-gray-300">
                See a complete list of your upcoming and past treks with details like dates, locations, and booking status.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Step 3: Manage & Customize</h3>
              <p className="text-gray-300">
                Modify your booking, add travel companions, download documents, or reach out to our support team for assistance.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pb-10">
          <Link href="/dashboard">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition duration-300 text-lg">
              View My Bookings
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
