"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronDown } from "react-icons/fi";

interface TrekCardProps {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string | null;
  state: string;
  difficulty: string;
  duration: number;
  distance: number | null;
  description: string;
  departuresCount: number;
  earliestDate?: string;
}

const TrekCardSmall = ({ trek }: { trek: TrekCardProps }) => {
  const defaultImage =
    "https://res.cloudinary.com/thetrail/image/upload/v1714107209/default_trek_image.jpg";
  const [imgSrc, setImgSrc] = useState<string>(trek.thumbnail || defaultImage);

  const difficultyColors: Record<string, string> = {
    easy: "bg-green-600/80",
    moderate: "bg-yellow-600/80",
    hard: "bg-orange-600/80",
    expert: "bg-red-600/80",
  };

  const stateAbbr: Record<string, string> = {
    "Himachal Pradesh": "HP",
    Uttarakhand: "UK",
    "West Bengal": "WB",
    Sikkim: "SK",
    "Arunachal Pradesh": "AP",
    Ladakh: "LA",
    "Jammu & Kashmir": "JK",
    "Jammu and Kashmir": "JK",
  };

  const shortState = stateAbbr[trek.state] || trek.state;

  return (
    <Link href={`/treks/${trek.slug}`}>
      <div className="group cursor-pointer h-full bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300">
        {/* Image Container - Smaller */}
        <div className="relative h-32 overflow-hidden bg-gray-800">
          <Image
            src={imgSrc}
            alt={trek.name}
            fill
            onError={() => setImgSrc(defaultImage)}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

          {/* State Badge - smaller; show short on small screens, full on larger */}
          <div className="absolute top-2 right-2 bg-blue-600/90 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white">
            <span className="inline sm:hidden">{shortState}</span>
            <span className="hidden sm:inline">{trek.state}</span>
          </div>

          {/* Difficulty Badge */}
          <div
            className={`absolute bottom-2 left-2 ${difficultyColors[trek.difficulty.toLowerCase()] || "bg-gray-600/80"} px-2 py-0.5 rounded-full text-[10px] font-semibold text-white capitalize`}
          >
            {trek.difficulty}
          </div>
        </div>

        {/* Content - Compact */}
        <div className="p-3">
          {/* Title */}
          <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition line-clamp-2">
            {trek.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-400 mb-2 line-clamp-1">
            {trek.description}
          </p>

          {/* Stats Grid - Smaller */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <p className="text-[9px] text-gray-500 uppercase font-semibold">
                Duration
              </p>
              <p className="text-xs font-bold text-blue-400">
                {trek.duration}d
              </p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 uppercase font-semibold">
                Distance
              </p>
              <p className="text-xs font-bold text-blue-400">
                {trek.distance ? `${trek.distance}km` : "N/A"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 uppercase font-semibold">
                Departures
              </p>
              <p className="text-xs font-bold text-blue-400">
                {trek.departuresCount}
              </p>
            </div>
          </div>

          {/* Explore Button - Smaller */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 text-sm rounded-lg transition">
            Explore
          </button>
        </div>
      </div>
    </Link>
  );
};

interface AllTreksPageProps {
  initialTreks: TrekCardProps[];
}

export default function AllTreksPageClient({
  initialTreks,
}: AllTreksPageProps) {
  const [sortBy, setSortBy] = useState<string>("popular");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortedTreks = useMemo(() => {
    const treksCopy = [...initialTreks];
    let sorted;

    switch (sortBy) {
      case "popular":
        sorted = treksCopy.sort(
          (a, b) => b.departuresCount - a.departuresCount,
        );
        break;

      case "name":
        sorted = treksCopy.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "difficulty":
        const difficultyRank = { easy: 1, moderate: 2, hard: 3, expert: 4 };
        sorted = treksCopy.sort(
          (a, b) =>
            (difficultyRank[
              a.difficulty.toLowerCase() as keyof typeof difficultyRank
            ] || 0) -
            (difficultyRank[
              b.difficulty.toLowerCase() as keyof typeof difficultyRank
            ] || 0),
        );
        break;

      case "duration":
        sorted = treksCopy.sort((a, b) => a.duration - b.duration);
        break;

      case "state":
        sorted = treksCopy.sort((a, b) => a.state.localeCompare(b.state));
        break;

      case "distance":
        sorted = treksCopy.sort(
          (a, b) => (a.distance ?? 0) - (b.distance ?? 0),
        );
        break;

      case "earliest":
        sorted = treksCopy.sort(
          (a, b) =>
            new Date(a.earliestDate || "2099-12-31").getTime() -
            new Date(b.earliestDate || "2099-12-31").getTime(),
        );
        break;

      default:
        sorted = treksCopy;
    }

    // Apply sort order (ascending or descending)
    if (sortOrder === "asc") {
      return sorted;
    } else {
      return sorted.reverse();
    }
  }, [sortBy, sortOrder, initialTreks]);

  const sortOptions = [
    { value: "popular", label: "Most Departures" },
    { value: "name", label: "Trek Name" },
    { value: "difficulty", label: "Difficulty" },
    { value: "duration", label: "Duration" },
    { value: "state", label: "State/Region" },
    { value: "distance", label: "Distance" },
    { value: "earliest", label: "Earliest Departure" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="px-6 md:px-12 lg:px-20 pt-12 pb-8">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">All Treks</h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Explore our complete collection of treks, expeditions, and adventures
          across India's most stunning landscapes.
        </p>
      </div>

      {/* Sort Bar */}
      <div className="px-6 md:px-12 lg:px-20 pb-8 flex items-center justify-between border-b border-gray-700 flex-wrap gap-4">
        <p className="text-gray-400 text-sm">
          Showing{" "}
          <span className="text-white font-semibold">{sortedTreks.length}</span>{" "}
          treks
        </p>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-gray-900 border border-gray-700 hover:border-blue-600 px-3 py-2 rounded-lg transition text-sm font-semibold whitespace-nowrap"
            >
              Sort:{" "}
              <span className="text-blue-400">
                {sortOptions.find((o) => o.value === sortBy)?.label}
              </span>
              <FiChevronDown
                className={`w-4 h-4 transition ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm transition ${
                      sortBy === option.value
                        ? "bg-blue-600/20 text-blue-400 font-semibold"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    } first:rounded-t-lg last:rounded-b-lg`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ascending/Descending Toggle */}
          <div className="flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setSortOrder("asc")}
              className={`px-3 py-2 text-sm font-semibold transition ${
                sortOrder === "asc"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-white"
              }`}
              title="Ascending Order"
            >
              ↑ ASC
            </button>
            <button
              onClick={() => setSortOrder("desc")}
              className={`px-3 py-2 text-sm font-semibold transition ${
                sortOrder === "desc"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-white"
              }`}
              title="Descending Order"
            >
              ↓ DESC
            </button>
          </div>
        </div>
      </div>

      {/* Trek Cards Grid */}
      <div className="px-6 md:px-12 lg:px-20 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedTreks.map((trek) => (
            <TrekCardSmall key={trek.id} trek={trek} />
          ))}
        </div>

        {/* Empty State */}
        {sortedTreks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No treks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
