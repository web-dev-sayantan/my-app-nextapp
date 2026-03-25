export const revalidate = 3600;

import Image from "next/image";
import Link from "next/link";
import { TrekService } from "@/lib/services/trekService";
import { formatPrice, formatDate } from "@/lib/utils";
import { FiMapPin, FiArrowRight } from "react-icons/fi";
import { HeroCarousel } from "@/components/heroCarousel";
import { WhatSetUsApart } from "@/components/whatSetUsApart";
import { KnowBeforeYouGo } from "@/components/knowBeforeYouGo";
import { TrekByRegionClient } from "@/components/trekByRegionClient";
import articlesData from "@/data/articles.json";
import { isDatabaseConfigured } from "@/lib/databaseAvailability";

type ListedTrek = Awaited<
  ReturnType<typeof TrekService.listTreks>
>["treks"][number];
type ListedDeparture = ListedTrek["departures"][number];
type UpcomingDepartureItem = {
  trek: ListedTrek;
  departure: ListedDeparture;
};

function formatDifficulty(difficulty: string): string {
  const map: Record<string, string> = {
    EASY: "Easy",
    EASY_MODERATE: "Easy-Moderate",
    MODERATE: "Moderate",
    HARD: "Hard",
    VERY_HARD: "Very Hard",
  };
  return map[difficulty] || difficulty.replace(/_/g, " ");
}

// Upcoming Adventures Table Component
async function UpcomingAdventuresTable() {
  let sortedDepartures: UpcomingDepartureItem[] = [];
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    const { treks: allTreks } = await TrekService.listTreks(
      { page: 1, limit: 50 },
      10,
    );

    // Flatten all departures from all treks and sort by earliest date
    const allDepartures = allTreks.flatMap((trek) =>
      (trek.departures || []).map((departure) => ({
        trek,
        departure,
      })),
    );

    // Sort by start date ascending (earliest first) and take top 8
    sortedDepartures = allDepartures
      .sort((a, b) => {
        const dateA = new Date(a.departure.startDate).getTime();
        const dateB = new Date(b.departure.startDate).getTime();
        return dateA - dateB;
      })
      .slice(0, 8);
  } catch (error) {
    console.warn(
      "Skipping UpcomingAdventuresTable – DB unreachable during build:",
      error,
    );
  }

  return (
    <section className="py-10 md:py-16 lg:py-20 px-4 md:px-6 lg:px-12 bg-brand-warmwhite border-t border-white/20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 text-text-primary">
            Upcoming Adventures
          </h2>
          <p className="text-text-secondary text-sm md:text-base">
            Explore our scheduled departures (earliest first)
          </p>
        </div>

        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto border border-border rounded-card-lg shadow-warm">
          <table className="w-full">
            <thead className="bg-bg-soft border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary whitespace-nowrap">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary whitespace-nowrap">
                  Adventure
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary whitespace-nowrap">
                  Difficulty
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary whitespace-nowrap">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary whitespace-nowrap">
                  Price
                </th>
                <th className="px-6 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-bg-card">
              {sortedDepartures.map((item, idx) => {
                const trek = item.trek;
                const departure = item.departure;
                const startDate = formatDate(new Date(departure.startDate));
                const priceValue = departure.pricePerPerson || 0;
                const formattedPrice =
                  priceValue > 0
                    ? formatPrice(priceValue).replace("₹", "").trim()
                    : "Contact";

                return (
                  <tr
                    key={`${trek.id}-${idx}`}
                    className="hover:bg-bg-soft transition"
                  >
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {startDate}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {trek.name}
                        </p>
                        <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
                          <FiMapPin className="w-3 h-3" />
                          {trek.state}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {formatDifficulty(trek.difficulty)}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {trek.duration} days
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">
                      {priceValue > 0 ? `₹${formattedPrice}` : formattedPrice}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/treks/${trek.slug}`}>
                        <button className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition font-semibold text-sm">
                          View
                          <FiArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Visible only on Mobile */}
        <div className="block md:hidden space-y-3">
          {sortedDepartures.map((item, idx) => {
            const trek = item.trek;
            const departure = item.departure;
            const startDate = formatDate(new Date(departure.startDate));
            const priceValue = departure.pricePerPerson || 0;
            const formattedPrice =
              priceValue > 0
                ? formatPrice(priceValue).replace("₹", "").trim()
                : "Contact";

            return (
              <Link key={`${trek.id}-${idx}`} href={`/treks/${trek.slug}`}>
                <div className="bg-bg-card rounded-2xl p-4 shadow-warm flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-sm truncate">
                      {trek.name}
                    </p>
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
                      <FiMapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{trek.state}</span>
                    </p>
                    <span className="inline-block mt-2 text-xs bg-brand-sage text-white px-2 py-0.5 rounded-full">
                      {formatDifficulty(trek.difficulty)}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-xs text-brand-burnt font-medium">
                      {startDate}
                    </p>
                    <p className="text-sm font-bold text-primary mt-1">
                      {priceValue > 0 ? `₹${formattedPrice}` : formattedPrice}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {trek.duration} days
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/all">
            <button className="border-2 border-primary bg-primary/10 text-primary hover:text-primary-dark font-bold py-3 px-8 rounded-pill transition duration-300 inline-flex items-center gap-2 group">
              View All Adventures
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Trek by Region Section - Server Component with Arrow Navigation
async function TrekByRegionSection() {
  let regionStats: Record<string, { count: number; image?: string }> = {};
  let sortedRegions: string[] = [];

  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    const { treks: allTreks } = await TrekService.listTreks(
      { page: 1, limit: 100 },
      1,
    );

    // Get unique states and count treks in each
    const stateImages: Record<string, string> = {
      "Himachal Pradesh":
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
      Uttarakhand:
        "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=800&fit=crop",
      "Jammu and Kashmir":
        "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=800&fit=crop",
      Sikkim:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
      "West Bengal":
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=800&fit=crop",
    };

    allTreks.forEach((trek) => {
      const state = trek.state || "Other";
      if (!regionStats[state]) {
        regionStats[state] = {
          count: 0,
          image: stateImages[state] || trek.thumbnailUrl || undefined,
        };
      }
      regionStats[state].count++;
    });

    // Sort regions alphabetically
    sortedRegions = Object.keys(regionStats).sort();
  } catch (error) {
    console.warn(
      "Skipping TrekByRegionSection – DB unreachable during build:",
      error,
    );
  }

  return (
    <TrekByRegionClient regions={sortedRegions} regionStats={regionStats} />
  );
}

// Empty function - CTA removed, replaced with Know Before You Go
function CTASection() {
  return null;
}

export default async function Home() {
  return (
    <main className="min-h-screen bg-brand-warmwhite text-text-primary">
      <HeroCarousel />
      <UpcomingAdventuresTable />
      <WhatSetUsApart />
      <TrekByRegionSection />
      <KnowBeforeYouGo articles={articlesData} />
    </main>
  );
}
