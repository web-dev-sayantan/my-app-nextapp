import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function Next10YearsPage() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Vision for the Next 10 Years</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Over the next decade, we're committed to transforming mountain trekking into the world's most sustainable and 
              accessible adventure experience. We're not just building a business—we're building a movement.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Expand to 100+ Treks</h3>
                  <p className="text-gray-400">Reach every major mountain region across India and Asia</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">1 Million Happy Adventurers</h3>
                  <p className="text-gray-400">Empower 1 million people to experience mountains safely and sustainably</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">1 Million Trees</h3>
                  <p className="text-gray-400">Plant and protect 1 million trees across mountain regions</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
              alt="Future vision of mountain conservation"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-8 mb-20">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Our 10-Year Roadmap</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-bold text-lg text-blue-400 mb-1">Years 1-3: Foundation & Scale</h3>
                <p className="text-gray-300">
                  Build infrastructure for 50 treks, train 500+ guides, plant 500,000 trees, reach 250,000 trekkers
                </p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-bold text-lg text-blue-400 mb-1">Years 4-7: Innovation & Impact</h3>
                <p className="text-gray-300">
                  Expand to 80+ treks, establish 10 conservation regions, reach 500,000 trekkers with sustainability focus
                </p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-bold text-lg text-blue-400 mb-1">Years 8-10: Global Leadership</h3>
                <p className="text-gray-300">
                  100+ treks across Asia, 1 million adventurers, 1 million trees planted, climate-positive operations
                </p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-blue-900/30 to-purple-900/30 border border-blue-600 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Key Initiatives</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-blue-400 mb-2">Tech Innovation</h3>
                <p className="text-gray-300">
                  AI-driven safety systems, real-time monitoring, and immersive virtual trek experiences
                </p>
              </div>
              <div>
                <h3 className="font-bold text-blue-400 mb-2">Community Empowerment</h3>
                <p className="text-gray-300">
                  Support 1000+ local mountain families through employment and skill development
                </p>
              </div>
              <div>
                <h3 className="font-bold text-blue-400 mb-2">Education Programs</h3>
                <p className="text-gray-300">
                  Scholarships for mountain youth and mountain conservation awareness campaigns
                </p>
              </div>
              <div>
                <h3 className="font-bold text-blue-400 mb-2">Climate Action</h3>
                <p className="text-gray-300">
                  Carbon-neutral operations and climate adaptation research in mountain ecosystems
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pb-10">
          <Link href="/contact">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition duration-300 text-lg">
              Be Part of Our Mission
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
