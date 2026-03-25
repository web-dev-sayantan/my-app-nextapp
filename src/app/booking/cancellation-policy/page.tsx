import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function CancellationPolicyPage() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Cancellation Policy</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              We understand that plans can change. Our flexible cancellation policy ensures you have peace of mind when booking your adventure. 
              Here's everything you need to know about how we handle cancellations and refunds.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Flexible Terms</h3>
                  <p className="text-gray-400">Cancel up to 30 days before your trek for full refund</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Easy Process</h3>
                  <p className="text-gray-400">No hassles, no hidden conditions - straightforward refund procedure</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Reschedule Option</h3>
                  <p className="text-gray-400">Free rebooking on any future trek within 12 months</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"
              alt="Flexible trek scheduling"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-8 mb-20">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Cancellation Timeline & Refunds</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-bold text-lg text-blue-400 mb-1">More than 30 days before trek</h3>
                <p className="text-gray-300">100% refund of booking amount</p>
              </div>
              <div className="border-l-4 border-yellow-400 pl-4">
                <h3 className="font-bold text-lg text-yellow-400 mb-1">15-30 days before trek</h3>
                <p className="text-gray-300">75% refund of booking amount</p>
              </div>
              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-bold text-lg text-orange-400 mb-1">7-14 days before trek</h3>
                <p className="text-gray-300">50% refund of booking amount</p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <h3 className="font-bold text-lg text-red-400 mb-1">Less than 7 days before trek</h3>
                <p className="text-gray-300">No refund, but can reschedule to another trek</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">How We Process Refunds</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                <span className="font-bold text-blue-400">1. Submit Request:</span> Contact us with your booking details and reason for cancellation
              </p>
              <p className="text-gray-300">
                <span className="font-bold text-blue-400">2. Verification:</span> We verify your booking status and eligibility within 24 hours
              </p>
              <p className="text-gray-300">
                <span className="font-bold text-blue-400">3. Processing:</span> Refunds are processed within 7-10 business days to your original payment method
              </p>
              <p className="text-gray-300">
                <span className="font-bold text-blue-400">4. Confirmation:</span> You'll receive email confirmation with refund details and tracking
              </p>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-8">
            <p className="text-gray-200">
              <span className="font-bold">Note:</span> Refund processing times may vary based on your bank or payment provider. 
              If your trek is cancelled by us due to weather or safety reasons, you'll receive a 100% refund regardless of the timeline.
            </p>
          </div>
        </div>

        <div className="text-center pb-10">
          <Link href="/contact">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition duration-300 text-lg">
              Ask About Cancellation
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
