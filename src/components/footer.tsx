import React from "react";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-12">
        {/* Logo and Brand */}
        <div className="mb-12">
          <Image
            src="/TTM.png"
            alt="The Trail Makers Logo"
            width={100}
            height={100}
            sizes="100px"
            className="w-20 md:w-24 lg:w-32"
            priority
          />
        </div>

        {/* Footer Links Grid - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 mb-12">
          {/* Booking */}
          <div className="min-w-0">
            <h5 className="font-bold text-white mb-4 text-base md:text-lg">Booking</h5>
            <nav className="space-y-3 text-xs md:text-sm">
              <div>
                <Link
                  href="/booking/my-bookings"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  My Bookings
                </Link>
              </div>
              <div>
                <Link
                  href="/booking/submit-feedback"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  Submit Feedback
                </Link>
              </div>
              <div>
                <Link
                  href="/booking/cancellation-policy"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  Cancellation Policy
                </Link>
              </div>
              <div>
                <Link
                  href="/booking/safety-standards"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  Safety Standards
                </Link>
              </div>
            </nav>
          </div>

          {/* Company */}
          <div className="min-w-0">
            <h5 className="font-bold text-white mb-4 text-base md:text-lg">Company</h5>
            <nav className="space-y-3 text-xs md:text-sm">
              <div>
                <Link
                  href="/company/about-us"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  About Us
                </Link>
              </div>
              <div>
                <Link
                  href="/company/careers"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  Careers
                </Link>
              </div>
            </nav>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <h5 className="font-bold text-white mb-4 text-base md:text-lg">Contact</h5>
            <nav className="space-y-3 text-xs md:text-sm">
              <div>
                <Link
                  href="/footer-pages/get-in-touch"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  Get in Touch
                </Link>
              </div>
              <div>
                <Link
                  href="/footer-pages/faq"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  FAQ
                </Link>
              </div>
              <div>
                <Link
                  href="/footer-pages/reviews"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  Reviews
                </Link>
              </div>
              <div>
                <Link
                  href="/footer-pages/news-room"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  News Room
                </Link>
              </div>
            </nav>
          </div>

          {/* The Mission */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 min-w-0">
            <h5 className="font-bold text-white mb-4 text-base md:text-lg">The Mission</h5>
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
              <div>
                <Link
                  href="/mission/next-10-years"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  Next 10 Years
                </Link>
              </div>
              <div>
                <Link
                  href="/mission/next-100-years"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  Next 100 Years
                </Link>
              </div>
              <div>
                <Link
                  href="/mission/people"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  People
                </Link>
              </div>
              <div>
                <Link
                  href="/mission/living-beings"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  Living Beings
                </Link>
              </div>
              <div>
                <Link
                  href="/mission/planet"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  Planet
                </Link>
              </div>
              <div>
                <Link
                  href="/mission/universe"
                  className="hover:text-blue-400 transition wrap-break-word"
                >
                  Universe
                </Link>
              </div>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs md:text-sm text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} Trail Makers. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              <Link href="/contact" className="text-xs md:text-sm hover:text-blue-400 transition">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-xs md:text-sm hover:text-blue-400 transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 