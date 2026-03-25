import React from "react";
import LessonsClient, { type LessonCardData } from "./lessons-client";

const lessons: LessonCardData[] = [
  {
    id: 1,
    title: "The Only Difference Between Trekking And Hiking",
    slug: "The-Only-Difference-Between-Trekking-And-Hiking",
    category: "Trekking 101",
    excerpt:
      "Understand the key differences between trekking and hiking, and when to choose each adventure.",
    image:
      "https://images.unsplash.com/photo-1551362185-acf8f42d8e8d?w=500&h=300&fit=crop",
    likes: 342,
    comments: 28,
    date: "Feb 15, 2026",
  },
  {
    id: 2,
    title: "Understanding The Layering System",
    slug: "Understanding-The-Layering-System",
    category: "Gear Guide",
    excerpt:
      "Learn the importance of proper clothing layers to stay comfortable during treks in any weather.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    likes: 521,
    comments: 45,
    date: "Feb 10, 2026",
  },
  {
    id: 3,
    title: "10 Best Treks in Himachal Pradesh",
    slug: "10-Best-Treks-in-Himachal-Pradesh",
    category: "Destination Guide",
    excerpt:
      "Explore the most stunning treks in Himachal Pradesh with difficulty levels and best seasons.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    likes: 1205,
    comments: 89,
    date: "Feb 5, 2026",
  },
  {
    id: 4,
    title: "Why I Would Do Sandakphu Trek At Least Once",
    slug: "Why-I-would-do-Sandakphu-Trek-atleast-once",
    category: "Experiences",
    excerpt:
      "A personal journey to one of the most unforgettable treks in the Eastern Himalayas.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    likes: 892,
    comments: 67,
    date: "Jan 28, 2026",
  },
];

export default function LessonsPage() {
  return (
    <main className="bg-black text-white min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Mountain Lessons
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Learn from experienced trekkers, discover gear tips, explore
            destinations, and read real stories from the trails.
          </p>
        </section>

        <LessonsClient lessons={lessons} />
      </div>
    </main>
  );
}
