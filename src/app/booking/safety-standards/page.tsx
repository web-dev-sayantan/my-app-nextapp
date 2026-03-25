import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function SafetyStandardsPage() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Safety Standards</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Your safety is our paramount concern. We've implemented comprehensive safety protocols and standards across all our treks, 
              ensuring every adventurer returns home with unforgettable memories and good health.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Expert Guides</h3>
                  <p className="text-gray-400">Certified mountaineers with 10+ years of experience</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Medical Support</h3>
                  <p className="text-gray-400">First aid trained staff and emergency medical kits on every trek</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Equipment Quality</h3>
                  <p className="text-gray-400">Regular inspection and maintenance of all safety gear</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=600&h=400&fit=crop"
              alt="Expert guides ensuring safety on mountain trails"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-8 mb-20">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Our Safety Protocols</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-blue-400 text-lg mb-3">⛑️ Pre-Trek Preparation</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Medical fitness assessment for all trekkers</li>
                  <li>• Altitude acclimatization guidance</li>
                  <li>• Weather monitoring and contingency planning</li>
                  <li>• Equipment quality assurance checks</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-blue-400 text-lg mb-3">👥 On-Trek Support</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Trained guides at all times</li>
                  <li>• Continuous health monitoring</li>
                  <li>• Regular safety briefings</li>
                  <li>• Rapid emergency response procedures</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-blue-400 text-lg mb-3">🏥 Medical Facilities</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• First aid trained staff on every trek</li>
                  <li>• Comprehensive medical kits</li>
                  <li>• Evacuation helicopters on standby</li>
                  <li>• Partnership with local hospitals</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-blue-400 text-lg mb-3">📋 Continuous Monitoring</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Daily safety briefings</li>
                  <li>• Real-time communication with headquarters</li>
                  <li>• Weather updates and adjustments</li>
                  <li>• Post-trek health follow-ups</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Guide Credentials</h2>
            <p className="text-gray-300 mb-6">
              All our guides meet stringent international standards and possess the following certifications:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span className="text-gray-300">International Mountain Guide Association (IFMGA) Certified</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span className="text-gray-300">Wilderness First Aid & CPR Certification</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span className="text-gray-300">High Altitude Rescue Training</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span className="text-gray-300">Minimum 10 years of field experience</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span className="text-gray-300">Annual safety and skill refresher courses</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pb-10">
          <Link href="/contact">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-lg transition duration-300 text-lg">
              Learn More About Safety
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
