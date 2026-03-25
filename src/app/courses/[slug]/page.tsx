import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/databaseAvailability";

const fallbackCourseImage =
  "https://res.cloudinary.com/thetrail/image/upload/v1714107209/default_trek_image.jpg";

interface CourseSessionCard {
  id: string;
  startDate: Date;
  seatsAvailable: number;
}

interface CourseDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string | null;
  location: string;
  price: number;
  duration: number;
  difficulty: string;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  curriculum: string;
  inclusions: string[];
  exclusions: string[];
  requirements: string[];
  instructor: string | null;
  sessions: CourseSessionCard[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

function formatDifficulty(difficulty: string) {
  return difficulty.replace(/_/g, " ");
}

async function getCourse(slug: string): Promise<CourseDetail | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    return await prisma.course.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        longDescription: true,
        location: true,
        price: true,
        duration: true,
        difficulty: true,
        imageUrl: true,
        thumbnailUrl: true,
        curriculum: true,
        inclusions: true,
        exclusions: true,
        requirements: true,
        instructor: true,
        sessions: {
          where: {
            startDate: { gte: new Date() },
            isCancelled: false,
          },
          orderBy: { startDate: "asc" },
          select: {
            id: true,
            startDate: true,
            seatsAvailable: true,
          },
        },
      },
    });
  } catch (error) {
    console.warn("Skipping course detail during prerender:", error);
    return null;
  }
}

export async function generateStaticParams() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    const courses = await prisma.course.findMany({
      select: { slug: true },
      orderBy: { createdAt: "desc" },
    });

    return courses.map((course) => ({ slug: course.slug }));
  } catch (error) {
    console.warn("Skipping course static params during build:", error);
    return [];
  }
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const course = await getCourse(params.slug);

  if (!course) {
    return { title: "Course Not Found | Trail Makers" };
  }

  return {
    title: `${course.name} Course | Trail Makers`,
    description: course.description,
    openGraph: {
      title: course.name,
      description: course.description,
      images: course.imageUrl ? [course.imageUrl] : [],
    },
  };
}

export default async function CourseDetailPage(props: PageProps) {
  const params = await props.params;
  const course = await getCourse(params.slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <Image
          src={course.imageUrl || course.thumbnailUrl || fallbackCourseImage}
          alt={course.name}
          fill
          sizes="100vw"
          className="object-cover"
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
                    {formatDifficulty(course.difficulty)}
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
                      key={`${item}-${idx}`}
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
                      key={`${item}-${idx}`}
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
                      key={`${item}-${idx}`}
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
                    {course.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="border border-gray-200 dark:border-gray-700 rounded p-3"
                      >
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {session.startDate.toLocaleDateString("en-IN")}
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
