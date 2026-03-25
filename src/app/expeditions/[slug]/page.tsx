"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

async function getExpedition(slug: string) {
  try {
    const response = await fetch(`/api/expeditions/${slug}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.expedition;
  } catch (error) {
    console.error("Failed to fetch expedition:", error);
    return null;
  }
}

interface PagesProps {
  params: Promise<{ slug: string }>;
}

export default function ExpeditionDetailPage({ params }: PagesProps) {
  const { slug } = use(params);
  const [expedition, setExpedition] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getExpedition(slug);
      setExpedition(data);
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Loading expedition...
          </p>
        </div>
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Expedition Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The expedition you're looking for doesn't exist.
          </p>
          <Link
            href="/expeditions"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Expeditions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img
          src={
            expedition.imageUrl ||
            expedition.thumbnailUrl ||
            "https://res.cloudinary.com/thetrail/image/upload/v1714107209/default_trek_image.jpg"
          }
          alt={expedition.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://res.cloudinary.com/thetrail/image/upload/v1714107209/default_trek_image.jpg";
          }}
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="w-full p-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {expedition.name}
            </h1>
            <p className="text-white text-lg opacity-90">
              {expedition.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Key Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Expedition Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Max Altitude
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {expedition.maxAltitude}m
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Duration
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {expedition.duration} days
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Difficulty
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {expedition.difficulty.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Distance
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {expedition.distance}km
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {expedition.longDescription && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {expedition.longDescription}
                </p>
              </div>
            )}

            {/* Itinerary */}
            {expedition.itinerary && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Itinerary
                </h2>
                <div className="space-y-2 whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {expedition.itinerary}
                </div>
              </div>
            )}

            {/* Inclusions */}
            {expedition.inclusions && expedition.inclusions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What's Included
                </h2>
                <ul className="space-y-2">
                  {expedition.inclusions.map((item: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-green-600 dark:text-green-400 mr-3">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exclusions */}
            {expedition.exclusions && expedition.exclusions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What's Not Included
                </h2>
                <ul className="space-y-2">
                  {expedition.exclusions.map((item: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-red-600 dark:text-red-400 mr-3">
                        ✗
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {expedition.requirements && expedition.requirements.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {expedition.requirements.map((item: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-blue-600 dark:text-blue-400 mr-3">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Price and Booking */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Starting Price
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₹{(expedition.basePrice / 100).toLocaleString("en-IN")}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Per person
                </p>
              </div>

              {/* Available Sessions */}
              {expedition.sessions && expedition.sessions.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                    Available Dates
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {expedition.sessions.map((session: any) => (
                      <div
                        key={session.id}
                        className="border border-gray-200 dark:border-gray-700 rounded p-3"
                      >
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {new Date(session.startDate).toLocaleDateString(
                            "en-IN",
                          )}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {session.seatsAvailable} seats available
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3">
                Book Now
              </button>

              <Link
                href="/expeditions"
                className="w-full inline-block text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold py-2"
              >
                ← Back to Expeditions
              </Link>

              {/* Additional Info */}
              <div className="mt-6 pb-0 border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  📍 <strong>Location:</strong> {expedition.state}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  🗓️ <strong>Best Season:</strong> {expedition.bestSeason}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
