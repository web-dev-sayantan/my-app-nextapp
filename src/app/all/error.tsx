"use client";

import Link from "next/link";

export default function AllTreksErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-warmwhite px-4">
      <div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-warm">
        <h1 className="text-3xl font-bold text-text-primary">
          Treks unavailable
        </h1>
        <p className="mt-4 text-text-secondary">
          The trek catalog could not be loaded right now. Please retry or
          contact the team.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-pill bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="rounded-pill border border-border px-5 py-3 font-semibold text-text-primary transition hover:bg-bg-soft"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
