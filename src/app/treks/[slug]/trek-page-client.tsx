"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  FiMapPin,
  FiClock,
  FiUsers,
  FiArrowLeft,
  FiChevronRight,
  FiChevronDown,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiPackage,
} from "react-icons/fi";
import { GiMountainClimbing, GiBed, GiSunrise } from "react-icons/gi";

type TrekDeparture = {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  seatsAvailable: number;
  totalSeats: number;
  pricePerPerson: number;
};

type TrekPageData = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string | null;
  imageUrl: string | null;
  difficulty: string;
  duration: number;
  state: string;
  bestSeason: string | null;
  itinerary: string;
  inclusions: string[];
  exclusions: string[];
  departures: TrekDeparture[];
};

type ItineraryDayData = {
  title: string;
  content: string;
  index: number;
};

// Compact date selection card for sticky booking
function CompactDateCard({
  departure,
  isSelected,
  onSelect,
}: {
  departure: TrekDeparture;
  isSelected: boolean;
  onSelect: (departure: TrekDeparture) => void;
}) {
  const startDate = new Date(departure.startDate);
  const endDate = new Date(departure.endDate);

  return (
    <label
      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
        isSelected
          ? "border-blue-400 bg-blue-950/30"
          : "border-gray-700 hover:border-blue-400"
      } ${departure.seatsAvailable === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        type="radio"
        checked={isSelected}
        onChange={() => onSelect(departure)}
        disabled={departure.seatsAvailable === 0}
        className="w-4 h-4 cursor-pointer accent-blue-400"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-300 truncate">
          {formatDate(startDate)}
        </p>
        <p className="text-xs text-gray-500">
          {departure.seatsAvailable} seats
        </p>
      </div>
    </label>
  );
}

function DepartureCard({
  departure,
  trekName,
  isSelected,
  onSelect,
}: {
  departure: TrekDeparture;
  trekName: string;
  isSelected: boolean;
  onSelect: (departure: TrekDeparture, trekName: string) => void;
}) {
  const availabilityPercent = (
    ((departure.totalSeats - departure.seatsAvailable) / departure.totalSeats) *
    100
  ).toFixed(0);

  const startDate = new Date(departure.startDate);
  const endDate = new Date(departure.endDate);

  return (
    <label
      className={`border rounded-lg p-4 cursor-pointer transition ${
        isSelected
          ? "border-blue-400 bg-blue-950/40"
          : "border-gray-700 hover:border-blue-400"
      } ${departure.seatsAvailable === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-start gap-4">
        <input
          type="radio"
          checked={isSelected}
          onChange={() => onSelect(departure, trekName)}
          disabled={departure.seatsAvailable === 0}
          className="w-5 h-5 mt-1 cursor-pointer accent-blue-400"
        />

        <div className="flex-1">
          <div className="mb-3">
            <p className="text-sm text-gray-400">
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-2xl font-bold text-blue-400">
              ₹{formatPrice(departure.pricePerPerson)}
            </p>
            <p className="text-xs text-gray-500">per person</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">
                <FiUsers className="w-4 h-4 inline mr-1" />
                {departure.seatsAvailable} seats available
              </span>
              <span className="text-xs text-gray-500">
                {availabilityPercent}% full
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-400 h-2 rounded-full transition-all"
                style={{ width: `${availabilityPercent}%` }}
              />
            </div>
          </div>

          {departure.seatsAvailable === 0 && (
            <p className="text-sm text-red-400 font-semibold">Sold Out</p>
          )}
        </div>
      </div>
    </label>
  );
}

// Expandable itinerary day component
function ItineraryDay({ day, content }: { day: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition text-left"
      >
        <span className="font-semibold text-gray-100">{day}</span>
        <FiChevronDown
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-gray-700 px-4 py-3 bg-gray-900/50">
          <p className="text-gray-300 text-sm whitespace-pre-line">{content}</p>
        </div>
      )}
    </div>
  );
}

// Image carousel component
function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedIndexes, setFailedIndexes] = useState<Record<number, boolean>>(
    {},
  );
  const defaultImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=500&fit=crop",
  ];

  const displayImages = images && images.length > 0 ? images : defaultImages;
  const imageSrc = failedIndexes[currentIndex]
    ? defaultImages[currentIndex % defaultImages.length]
    : displayImages[currentIndex];

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-900 h-64">
      <Image
        src={imageSrc}
        alt={`${title} - Image ${currentIndex + 1}`}
        fill
        className="object-cover"
        onError={() => {
          setFailedIndexes((current) => ({
            ...current,
            [currentIndex]: true,
          }));
        }}
      />
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          onClick={() =>
            setCurrentIndex(
              (currentIndex - 1 + displayImages.length) % displayImages.length,
            )
          }
          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
        >
          <FiChevronRight className="w-5 h-5 transform rotate-180" />
        </button>
        <button
          onClick={() =>
            setCurrentIndex((currentIndex + 1) % displayImages.length)
          }
          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {displayImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition ${
              idx === currentIndex ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function TrekPageClient({
  trek,
  isAuthenticated,
}: {
  trek: TrekPageData;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [selectedDeparture, setSelectedDeparture] = useState<string | null>(
    null,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateSelect = (departure: TrekDeparture) => {
    const startDate = new Date(departure.startDate);
    const endDate = new Date(departure.endDate);

    const params = new URLSearchParams({
      departureId: departure.id,
      trekName: trek.name,
      trekSlug: trek.slug,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      price: departure.pricePerPerson.toString(),
      seats: departure.seatsAvailable.toString(),
    });

    const bookingUrl = `/booking/summary?${params.toString()}`;

    if (!isAuthenticated) {
      const loginUrl = `/login?next=${encodeURIComponent(bookingUrl)}`;
      router.push(loginUrl);
      return;
    }

    router.push(bookingUrl);
  };

  // Parse itinerary into days
  const itineraryDays: ItineraryDayData[] = trek.itinerary
    ? trek.itinerary
        .split(/(?=Day\s+\d+)/i)
        .filter((day: string) => day.trim())
        .map((day: string, idx: number) => {
          const lines = day.split("\n");
          const dayTitle = lines[0];
          const dayContent = lines.slice(1).join("\n");
          return { title: dayTitle, content: dayContent, index: idx };
        })
    : [];

  const selectedDepartureRecord = selectedDeparture
    ? (trek.departures.find(
        (departure) => departure.id === selectedDeparture,
      ) ?? null)
    : null;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/all"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Treks
          </Link>
        </div>
      </header>

      {/* 1. HERO BANNER */}
      <section className="relative h-96 w-full overflow-hidden bg-gray-900">
        {trek.imageUrl ? (
          <Image
            src={trek.imageUrl}
            alt={trek.name}
            fill
            className="object-cover brightness-60"
            priority
          />
        ) : (
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=500&fit=crop"
            alt={trek.name}
            fill
            className="object-cover brightness-60"
            priority
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{trek.name}</h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              {trek.description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. TREK DATA WITH ICONS */}
        <section className="py-8 border-b border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="flex flex-col items-center text-center">
              <GiMountainClimbing className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-xs text-gray-400">Difficulty</p>
              <p className="text-sm font-semibold text-gray-100 truncate">
                {trek.difficulty}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FiClock className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-xs text-gray-400">Duration</p>
              <p className="text-sm font-semibold text-gray-100">
                {trek.duration} Days
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FiMapPin className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-xs text-gray-400">Location</p>
              <p className="text-sm font-semibold text-gray-100 truncate">
                {trek.state}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <GiSunrise className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-xs text-gray-400">Best Months</p>
              <p className="text-sm font-semibold text-gray-100">
                {trek.bestSeason || "N/A"}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FiUsers className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-xs text-gray-400">Best For</p>
              <p className="text-sm font-semibold text-gray-100">All Ages</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <GiBed className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-xs text-gray-400">Accommodation</p>
              <p className="text-sm font-semibold text-gray-100">Tent</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <GiSunrise className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-xs text-gray-400">Pickup Time</p>
              <p className="text-sm font-semibold text-gray-100">6:00 AM</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <GiSunrise className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-xs text-gray-400">Dropoff Time</p>
              <p className="text-sm font-semibold text-gray-100">6:00 PM</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* 3. BRIEF DESCRIPTION */}
            <section>
              <h2 className="text-3xl font-bold mb-4">About This Trek</h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-4">
                {trek.description}
              </p>
              {trek.longDescription && (
                <p className="text-gray-300 leading-relaxed">
                  {trek.longDescription}
                </p>
              )}
            </section>

            {/* 4. SAFETY STANDARDS */}
            <section className="bg-yellow-950/30 border border-yellow-700/40 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <FiAlertCircle className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-200 mb-3">
                    Safety Standards
                  </h3>
                  <ul className="text-gray-200 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                      <span>Experienced guides and trained support staff</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                      <span>First aid and emergency medical support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                      <span>Comprehensive travel insurance included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                      <span>Weather-appropriate equipment provided</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. IMAGE CAROUSEL FOR DAYS */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Trek Story</h3>
              <ImageCarousel images={[]} title={trek.name} />
            </section>

            {/* 6. ITINERARY (EXPANDABLE) */}
            <section>
              <h3 className="text-2xl font-bold mb-6">Detailed Itinerary</h3>
              <div className="space-y-3">
                {itineraryDays.length > 0 ? (
                  itineraryDays.map((day, idx) => (
                    <ItineraryDay
                      key={idx}
                      day={day.title}
                      content={day.content}
                    />
                  ))
                ) : (
                  <div className="border border-gray-700 rounded-lg p-4 text-gray-400">
                    {trek.itinerary}
                  </div>
                )}
              </div>
            </section>

            {/* 7. WHAT TO PACK */}
            <section>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FiPackage className="w-6 h-6 text-blue-400" />
                What to Pack
              </h3>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-3">
                      Essential Gear
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>
                        <span>Trekking shoes (broken in)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>
                        <span>Weather-appropriate clothing layers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>
                        <span>Backpack (50-60L recommended)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>
                        <span>Sun protection (hat, sunscreen, glasses)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-100 mb-3">
                      Personal Items
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>
                        <span>Toiletries and medications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>
                        <span>Water bottle or hydration system</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>
                        <span>Energy snacks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>
                        <span>Headlamp or flashlight</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. HOW TO PREPARE */}
            <section>
              <h3 className="text-2xl font-bold mb-6">How to Prepare</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Physical Training",
                    desc: "Start with cardio and leg strength exercises 6-8 weeks before the trek.",
                  },
                  {
                    title: "Acclimatization",
                    desc: "Arrive a day or two early to acclimatize to the altitude.",
                  },
                  {
                    title: "Gear Test",
                    desc: "Test your backpack and shoes on practice hikes before the trek.",
                  },
                  {
                    title: "Mental Preparation",
                    desc: "Research the trek, watch videos, and mentally prepare for challenges.",
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-800 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-100 mb-2 flex items-center gap-2">
                      <span className="bg-blue-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      {step.title}
                    </h4>
                    <p className="text-gray-300 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. TREK IN EACH SEASON */}
            <section>
              <h3 className="text-2xl font-bold mb-6">
                Trek in Different Seasons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    season: "Spring",
                    desc: "Mild weather, blooming flowers, perfect visibility for trekking.",
                    icon: "🌸",
                  },
                  {
                    season: "Summer",
                    desc: "Warm days, busy season, all routes open and well-maintained.",
                    icon: "☀️",
                  },
                  {
                    season: "Autumn",
                    desc: "Clear skies, cool temperatures, stunning mountain views.",
                    icon: "🍂",
                  },
                  {
                    season: "Winter",
                    desc: "Snow-covered peaks, challenging conditions for experienced trekkers.",
                    icon: "❄️",
                  },
                ].map((season, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-800 rounded-lg p-4 hover:border-blue-400/30 transition"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{season.icon}</span>
                      <h4 className="font-semibold text-gray-100">
                        {season.season}
                      </h4>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{season.desc}</p>
                    <Link
                      href="/blog"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Read full article →
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* 10. FAQ SECTION */}
            <section>
              <h3 className="text-2xl font-bold mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {[
                  {
                    q: "What is the fitness level required?",
                    a: "Details coming soon",
                  },
                  {
                    q: "Is altitude sickness a concern?",
                    a: "Details coming soon",
                  },
                  {
                    q: "Can beginners join this trek?",
                    a: "Details coming soon",
                  },
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="border border-gray-800 rounded-lg p-4 group cursor-pointer"
                  >
                    <summary className="font-semibold text-gray-100 flex items-center justify-between">
                      {faq.q}
                      <FiChevronDown className="w-4 h-4 transition group-open:rotate-180" />
                    </summary>
                    <p className="text-gray-300 mt-3 pt-3 border-t border-gray-800 text-sm">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {/* Inclusions/Exclusions - moved down */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiCheck className="text-green-400" />
                  What's Included
                </h3>
                <ul className="space-y-2">
                  {trek.inclusions && trek.inclusions.length > 0 ? (
                    trek.inclusions.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-gray-300"
                      >
                        <span className="text-green-400 mt-1">✓</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 text-sm">
                      Standard inclusions apply
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiX className="text-red-400" />
                  What's Not Included
                </h3>
                <ul className="space-y-2">
                  {trek.exclusions && trek.exclusions.length > 0 ? (
                    trek.exclusions.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-gray-300"
                      >
                        <span className="text-red-400 mt-1">✕</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 text-sm">
                      Standard exclusions apply
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* 11. BOOKING SECTION */}
          {/* Desktop Sticky Booking */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-gray-900 border border-gray-800 rounded-lg p-6">
              {trek.departures && trek.departures.length > 0 ? (
                <div className="space-y-4">
                  {/* Selected Date Display */}
                  {selectedDepartureRecord && (
                    <div className="bg-blue-950/40 border border-blue-400 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">
                        Selected Date
                      </p>
                      <p className="text-lg font-bold text-blue-400 mb-2">
                        ₹{formatPrice(selectedDepartureRecord.pricePerPerson)}
                      </p>
                      <p className="text-sm text-gray-300">
                        {formatDate(
                          new Date(selectedDepartureRecord.startDate),
                        )}
                      </p>
                    </div>
                  )}

                  {/* Date Selection */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-3">
                      CHOOSE DATE
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {trek.departures.map((departure) => (
                        <CompactDateCard
                          key={departure.id}
                          departure={departure}
                          isSelected={selectedDeparture === departure.id}
                          onSelect={(dep) => setSelectedDeparture(dep.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => {
                      if (selectedDepartureRecord)
                        handleDateSelect(selectedDepartureRecord);
                    }}
                    disabled={!selectedDeparture}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition mt-4"
                  >
                    Book Now
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-200 mb-4 font-semibold">
                    Price on Request
                  </p>
                  <Link
                    href="/contact"
                    className="block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-semibold transition"
                  >
                    Request Price
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Sticky Booking */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-3 z-30">
            {trek.departures && trek.departures.length > 0 ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
                >
                  {selectedDepartureRecord
                    ? formatDate(new Date(selectedDepartureRecord.startDate))
                    : "Select Date"}
                </button>
                <button
                  onClick={() => {
                    if (selectedDepartureRecord)
                      handleDateSelect(selectedDepartureRecord);
                  }}
                  disabled={!selectedDeparture}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Book
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/contact")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold transition"
              >
                Request Price
              </button>
            )}
          </div>

          {/* Mobile Date Picker Overlay */}
          {showDatePicker && (
            <div className="lg:hidden fixed inset-0 bg-black/95 z-40 flex flex-col">
              <div className="border-b border-gray-800 p-4 flex justify-between items-center">
                <h3 className="text-2xl font-bold">Available Dates</h3>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {trek.departures && trek.departures.length > 0 ? (
                  trek.departures.map((departure) => (
                    <DepartureCard
                      key={departure.id}
                      departure={departure}
                      trekName={trek.name}
                      isSelected={selectedDeparture === departure.id}
                      onSelect={(dep) => {
                        setSelectedDeparture(dep.id);
                        handleDateSelect(dep);
                        setShowDatePicker(false);
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-200 mb-4">
                      No scheduled departures
                    </p>
                    <Link
                      href="/contact"
                      className="block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-semibold transition"
                    >
                      Request Price
                    </Link>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-800 p-4">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom padding for mobile */}
        <div className="lg:hidden h-32" />
      </div>
    </main>
  );
}
