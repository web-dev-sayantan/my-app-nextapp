import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function PeoplePage() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our People</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              At Trail Makers, our greatest asset is our people. From passionate guides to conservation experts, 
              every team member is dedicated to creating exceptional mountain experiences while protecting the ecosystems we cherish.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Expert Guides</h3>
                  <p className="text-gray-400">Certified mountaineers with passion for sharing mountain wisdom</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Support Staff</h3>
                  <p className="text-gray-400">Dedicated team ensuring comfort and logistics on every trek</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Conservation Team</h3>
                  <p className="text-gray-400">Environmental experts committed to ecosystem restoration</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
              alt="Trail Makers team"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 mb-20">
          <h2 className="text-2xl font-bold mb-6">Our Community</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-3">Local Employment</h3>
              <p className="text-gray-300">
                We employ 200+ people from mountain communities, providing sustainable livelihoods and economic opportunities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-3">Training & Development</h3>
              <p className="text-gray-300">
                Comprehensive training programs ensure our team remains skilled, certified, and updated with latest practices.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-3">Fair Wages & Benefits</h3>
              <p className="text-gray-300">
                We pay above-market wages and provide health insurance, pension, and skill development opportunities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-3">Cultural Respect</h3>
              <p className="text-gray-300">
                We honor local traditions, support cultural preservation, and celebrate the mountain way of life.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-blue-900/30 to-purple-900/30 border border-blue-600 rounded-lg p-8 mb-20">
          <h2 className="text-2xl font-bold mb-6">Team Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="text-3xl font-bold text-blue-400 mb-2">200+</h3>
              <p className="text-gray-300">Team Members</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-blue-400 mb-2">15+</h3>
              <p className="text-gray-300">Nationalities</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-blue-400 mb-2">100%</h3>
              <p className="text-gray-300">Trained Guides</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-blue-400 mb-2">50,000+</h3>
              <p className="text-gray-300">Lives Impacted</p>
            </div>
          </div>
        </div>

        <div className="text-center pb-10">
          <Link href="/company/careers">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition duration-300 text-lg">
              Join Our Team
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
