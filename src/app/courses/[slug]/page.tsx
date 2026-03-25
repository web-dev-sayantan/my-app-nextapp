"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

async function getCourse(slug: string) {
  try {
    const response = await fetch(`/api/courses/${slug}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.course;
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

interface PagesProps {
  params: Promise<{ slug: string }>;
}

export default function CourseDetailPage({ params }: PagesProps) {
  const { slug } = use(params);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCourse(slug);
      setCourse(data);
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Course Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The course you're looking for doesn't exist.
          </p>
          <Link
            href="/courses"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Courses
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
            course.imageUrl ||
            course.thumbnailUrl ||
            "https://res.cloudinary.com/thetrail/image/upload/v1714107209/default_trek_image.jpg"
          }
          alt={course.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://res.cloudinary.com/thetrail/image/upload/v1714107209/default_trek_image.jpg";
          }}
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="w-full p-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {course.name}
            </h1>
            <p className="text-white text-lg opacity-90">
              {course.description}
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
                Course Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Duration
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {course.duration} days
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Difficulty
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {course.difficulty.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Location
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {course.location}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Price
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{(course.price / 100).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {course.longDescription && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About This Course
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {course.longDescription}
                </p>
              </div>
            )}

            {/* Curriculum */}
            {course.curriculum && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Curriculum
                </h2>
                <div className="space-y-3 whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {course.curriculum}
                </div>
              </div>
            )}

            {/* Inclusions */}
            {course.inclusions && course.inclusions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What's Included
                </h2>
                <ul className="space-y-2">
                  {course.inclusions.map((item: string, idx: number) => (
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
            {course.exclusions && course.exclusions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What's Not Included
                </h2>
                <ul className="space-y-2">
                  {course.exclusions.map((item: string, idx: number) => (
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
            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {course.requirements.map((item: string, idx: number) => (
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
                  Course Price
                </p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₹{(course.price / 100).toLocaleString("en-IN")}
                </p>
                {course.instructor && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    <strong>Instructor:</strong> {course.instructor}
                  </p>
                )}
              </div>

              {/* Available Sessions */}
              {course.sessions && course.sessions.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                    Available Batches
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {course.sessions.map((session: any) => (
                      <div
                        key={session.id}
                        className="border border-gray-200 dark:border-gray-700 rounded p-3"
                      >
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {new Date(session.startDate).toLocaleDateString(
                            "en-IN",
                          )}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {session.seatsAvailable} spots left
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3">
                Register Now
              </button>

              <Link
                href="/courses"
                className="w-full inline-block text-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold py-2"
              >
                ← Back to Courses
              </Link>

              {/* Additional Info */}
              <div className="mt-6 pb-0 border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  📍 <strong>Location:</strong> {course.location}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ⏱️ <strong>Duration:</strong> {course.duration} days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
