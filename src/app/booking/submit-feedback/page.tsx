import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function SubmitFeedbackPage() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Submit Feedback</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Your experiences shape us. Share your thoughts, suggestions, and feedback about your trek adventures with our community. 
              Help us create better experiences for every trekker.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Share Your Story</h3>
                  <p className="text-gray-400">Tell us about your trek experience and what made it special</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Suggest Improvements</h3>
                  <p className="text-gray-400">Help us enhance our guides, logistics, and overall experience</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Community Impact</h3>
                  <p className="text-gray-400">Your feedback directly influences future trek experiences</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=600&h=400&fit=crop"
              alt="Trekkers sharing feedback around campfire"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 mb-20">
          <h2 className="text-2xl font-bold mb-6">Why Your Feedback Matters</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">📝 Continuous Improvement</h3>
              <p className="text-gray-300">
                Every piece of feedback helps us refine our routes, improve camp facilities, and train our guides better.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">🏆 Quality Assurance</h3>
              <p className="text-gray-300">
                We maintain the highest standards by listening to our trekkers and addressing their concerns promptly.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">🤝 Community Building</h3>
              <p className="text-gray-300">
                Your stories and experiences create an inspiring community of adventure seekers and nature lovers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">🌟 Recognition</h3>
              <p className="text-gray-300">
                Featured feedback gets highlighted on our platforms, and exceptional reviews get rewarded with exciting offers.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pb-10">
          <Link href="/contact">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition duration-300 text-lg">
              Share Your Feedback
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
