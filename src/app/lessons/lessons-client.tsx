'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';

export interface LessonCardData {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image: string;
  likes: number;
  comments: number;
  date: string;
}

function LessonCard({ lesson }: { lesson: LessonCardData }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Link href={`/blog/${lesson.slug}`}>
      <div className="h-full cursor-pointer overflow-hidden rounded-lg border border-gray-700 bg-gray-800 transition duration-300 hover:border-blue-400">
        <div className="relative h-40 w-full overflow-hidden bg-gray-900">
          <Image
            src={lesson.image}
            alt={lesson.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-300 hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
              {lesson.category}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white">
            {lesson.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-gray-300">
            {lesson.excerpt}
          </p>
          <p className="mb-4 text-xs text-gray-500">{lesson.date}</p>

          <div className="flex items-center gap-4 border-t border-gray-700 pt-4">
            <button
              onClick={(event) => {
                event.preventDefault();
                setIsLiked((current) => !current);
              }}
              className="flex items-center gap-2 text-gray-400 transition hover:text-red-400"
            >
              <FiHeart className={`h-4 w-4 ${isLiked ? 'fill-red-400 text-red-400' : ''}`} />
              <span className="text-xs">{lesson.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-400">
              <FiMessageCircle className="h-4 w-4" />
              <span className="text-xs">{lesson.comments}</span>
            </div>
            <button
              onClick={(event) => {
                event.preventDefault();
              }}
              className="ml-auto flex items-center gap-2 text-gray-400 transition hover:text-blue-400"
            >
              <FiShare2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function LessonsClient({ lessons }: { lessons: LessonCardData[] }) {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Trekking 101', 'Gear Guide', 'Destination Guide', 'Experiences'];
  const filteredLessons = filter === 'All'
    ? lessons
    : lessons.filter((lesson) => lesson.category === filter);

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-400">No lessons found in this category.</p>
        </div>
      )}
    </>
  );
}