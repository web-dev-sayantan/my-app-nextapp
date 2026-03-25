import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function UniversePage() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">The Universe in the Mountains</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Standing atop a mountain peak at night, surrounded by millions of stars, you realize something profound: 
              you're part of something cosmic and eternal. The mountains are a gateway to understanding our place in the universe.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Cosmic Perspective</h3>
                  <p className="text-gray-400">Experience the night sky as it was meant to be seen: pristine and endless</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Spiritual Connection</h3>
                  <p className="text-gray-400">Mountains as spaces for contemplation, reflection, and inner transformation</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Wonder & Discovery</h3>
                  <p className="text-gray-400">Rekindling that sense of awe that connects us to something greater</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop"
              alt="Mountain night sky"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 mb-20">
          <h2 className="text-2xl font-bold mb-6">Our Cosmic Mission</h2>
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
              In a world increasingly disconnected from nature and cosmos, the mountains serve as a portal to remembering what matters. 
              Trail Makers believes that every adventure is also a spiritual journey—a chance to re-establish our connection with the universe.
            </p>
            <p>
              From watching sunrise paint the peaks golden to lying under a blanket of stars at 13,000 feet, 
              our treks are designed to awaken that sense of cosmic wonder that makes us appreciate life's infinite beauty.
            </p>
            <p>
              We're not just preserving mountains; we're preserving the human spirit's capacity for awe, wonder, and connection to something greater than ourselves.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-linear-to-br from-purple-900/40 to-indigo-900/40 border border-purple-600 rounded-lg p-8">
            <h3 className="text-xl font-bold text-purple-400 mb-4">🌌 Astronomical Experiences</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-purple-400 font-bold">•</span>
                <span>Stargazing sessions with astrophysics experts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 font-bold">•</span>
                <span>Dark sky reserves for pristine night sky viewing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 font-bold">•</span>
                <span>Sunrise to sunset photographic expeditions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 font-bold">•</span>
                <span>Meditation and contemplation guided walks</span>
              </li>
            </ul>
          </div>

          <div className="bg-linear-to-br from-blue-900/40 to-cyan-900/40 border border-blue-600 rounded-lg p-8">
            <h3 className="text-xl font-bold text-blue-400 mb-4">🧘 Spiritual Growth</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">•</span>
                <span>Mindfulness and yoga sessions at mountain camps</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">•</span>
                <span>Journaling and reflection ceremonies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">•</span>
                <span>Connection with local spiritual traditions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">•</span>
                <span>Personal transformation programs</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-linear-to-r from-indigo-900 to-purple-900 border border-indigo-600 rounded-lg p-8 mb-20 text-center">
          <p className="text-xl text-gray-200 italic mb-6">
            "In the quiet moments atop a mountain peak, watching the sun merge with the horizon, 
            you understand that you are part of something eternal, vast, and infinitely beautiful."
          </p>
          <p className="text-gray-400">— Every Trail Maker's Trekker</p>
        </div>

        <div className="text-center pb-10">
          <Link href="/all">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition duration-300 text-lg">
              Experience the Universe
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
