"use client";

import Link from "next/link";

export default function ExpeditionsErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Expeditions unavailable
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          The expeditions section could not be loaded right now. Please retry or
          return to the homepage.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-900 transition hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
