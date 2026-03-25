import React from "react";
import Link from "next/link";

import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

function Contact() {
  return (
    <div className="bg-linear-to-b from-black via-sky-900 to-neutral-800 min-h-screen text-white text-center pt-40">
      <div className="font-bold text-5xl mb-4 mx-1 uppercase below-xs:text-2xl">
        Contact Us
      </div>
      <div className="mx-20 text-gray-300 mb-8">
        {" "}
        Get in touch with us for any trek details, bookings, or inquiries
      </div>

      <div className="py-8 flex justify-center gap-2">
        <Link
          href="https://wa.me/7980426832"
          className="flex flex-col items-center"
        >
          <div className="bg-amber-400 p-4 rounded-xl mb-3">
            <FaWhatsapp className="size-10 mx-auto" />
          </div>
          <p className="text-sm font-semibold text-gray-300">WhatsApp</p>
          <p className="text-xs text-gray-400">+91 7980426832</p>
        </Link>

        <div className="w-[3px] bg-white"></div>

        <Link
          href="https://www.instagram.com/the_trail_makers"
          className="flex flex-col items-center"
        >
          <div className="bg-red-500 p-4 rounded-xl mb-3">
            <FaInstagram className="size-10" />
          </div>
          <p className="text-sm font-semibold text-gray-300">Instagram</p>
          <p className="text-xs text-gray-400">@the_trail_makers</p>
        </Link>
      </div>

      {/* Contact Details */}
      <div className="mt-16 px-4">
        <h3 className="text-2xl font-bold mb-6">Quick Contacts</h3>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md mx-auto space-y-4">
          <div>
            <p className="text-gray-400 text-sm">Phone / WhatsApp</p>
            <a
              href="tel:+917980426832"
              className="text-blue-400 font-semibold hover:text-blue-300"
            >
              +91 7980426832
            </a>
          </div>
          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-sm">Follow Us On</p>
            <a
              href="https://www.instagram.com/the_trail_makers"
              className="text-blue-400 font-semibold hover:text-blue-300"
            >
              Instagram - @the_trail_makers
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
