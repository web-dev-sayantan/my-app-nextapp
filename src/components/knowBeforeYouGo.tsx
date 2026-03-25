"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Article {
  Index: number;
  ImageLink: string;
  ImageAlt: string;
  Title: string;
  Brief: string;
  Author: string;
  CreatedOn: string;
  Likes: number;
}

export function KnowBeforeYouGo({ articles }: { articles: Article[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, articles.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  return (
    <section className="py-20 px-6 bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-2 text-white">
              Know Before You Go
            </h2>
            <p className="text-gray-400">
              Expert tips and insights for your next adventure
            </p>
          </div>
          <Link href="/lessons">
            <button className="mt-6 md:mt-0 border-2 border-blue-600 bg-blue-600/10 text-blue-400 hover:text-blue-300 font-bold py-3 px-8 rounded-lg transition duration-300 inline-flex items-center gap-2 group">
              Read All Lessons
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </Link>
        </div>

        <div className="relative">
          {/* Articles Container */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {articles.map((article, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-full md:w-1/3 bg-gray-800/40 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-400 transition duration-300 group cursor-pointer flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.ImageLink}
                      alt={article.ImageAlt}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-blue-400 font-semibold mb-2 uppercase">
                      {article.CreatedOn}
                    </p>
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition">
                      {article.Title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 flex-1 line-clamp-2">
                      {article.Brief}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>By {article.Author}</span>
                      <span>❤️ {article.Likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {articles.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-12 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-12 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Indicators */}
          {articles.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === currentIndex ? "bg-blue-400 w-6" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
