"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface RegionStats {
  count: number;
  image?: string;
}

interface TrekByRegionClientProps {
  regions: string[];
  regionStats: Record<string, RegionStats>;
}

export function TrekByRegionClient({ regions, regionStats }: TrekByRegionClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, regions.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const visibleRegions = regions.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="py-10 md:py-16 lg:py-20 px-4 md:px-6 lg:px-12 bg-brand-warmwhite border-t border-white/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-text-primary">
            Explore by Region
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-sm md:text-base">
            Discover amazing treks across India's most spectacular mountain regions
          </p>
        </div>

        {/* Cards Container with Arrow Navigation */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-bg-card hover:bg-bg-soft text-text-primary p-3 rounded-full shadow-warm transition hidden md:flex items-center justify-center"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          {/* Cards */}
          <div className="flex gap-4 md:gap-6 justify-center px-4 md:px-8">
            {visibleRegions.map((region) => {
              const stats = regionStats[region];
              return (
                <Link key={region} href={`/treks?region=${region}`}>
                  <div className="relative w-48 md:w-56 lg:w-60 h-64 md:h-75 lg:h-80 rounded-card-lg overflow-hidden group cursor-pointer shrink-0 shadow-warm hover:shadow-warm-md transition-all duration-300">
                    {stats.image && (
                      <Image
                        src={stats.image}
                        alt={region}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-text-primary via-text-primary/40 to-transparent group-hover:via-text-primary/50 transition duration-300"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-4 md:p-6 text-center">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3 group-hover:text-primary-light transition">
                        {region}
                      </h3>
                      <p className="text-primary font-semibold text-sm md:text-base mb-2 md:mb-3">
                        {stats.count} Trek{stats.count !== 1 ? "s" : ""}
                      </p>
                      <button className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 md:px-6 md:py-2 rounded-pill text-xs md:text-sm font-semibold transition opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                        Explore →
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-bg-card hover:bg-bg-soft text-text-primary p-3 rounded-full shadow-warm transition hidden md:flex items-center justify-center"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition ${
                idx === currentIndex ? "bg-primary w-6" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
