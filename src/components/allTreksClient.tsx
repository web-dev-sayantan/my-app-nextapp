"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiChevronDown,
  FiArrowRight,
  FiArrowDown,
  FiArrowUp,
} from "react-icons/fi";
import { ImageWithFallback as Image } from "@/components/imageWithFallback";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type SortOptionValue =
  | "popular"
  | "name"
  | "difficulty"
  | "duration"
  | "state"
  | "distance"
  | "earliest";

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

const sortOptions: { value: SortOptionValue; label: string }[] = [
  { value: "popular", label: "Most Departures" },
  { value: "name", label: "Trek Name" },
  { value: "difficulty", label: "Difficulty" },
  { value: "duration", label: "Duration" },
  { value: "state", label: "State/Region" },
  { value: "distance", label: "Distance" },
  { value: "earliest", label: "Earliest Departure" },
];

function formatDifficulty(difficulty: string) {
  const difficultyLabels: Record<string, string> = {
    EASY: "Easy",
    EASY_MODERATE: "Easy-Moderate",
    MODERATE: "Moderate",
    HARD: "Hard",
    VERY_HARD: "Very Hard",
  };

  return difficultyLabels[difficulty] || difficulty.replace(/_/g, " ");
}

const TrekCardEditorial = ({ trek }: { trek: TrekCardProps }) => {
  const defaultImage =
    "https://images.unsplash.com/photo-1544198365-f5d60b6d819c?q=80&w=800";

  return (
    <Link
      href={`/treks/${trek.slug}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-8 focus-visible:ring-offset-background rounded-xl"
    >
      <div className="flex flex-col h-full">
        <div className="relative w-full aspect-4/5 overflow-hidden rounded-xl bg-muted mb-6">
          <Image
            src={trek.thumbnail || defaultImage}
            alt={trek.name}
            fill
            className="object-cover transition-transform duration-[1.5s] ease-out-expo group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="flex flex-col grow px-2 md:px-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl md:text-3xl font-display text-foreground group-hover:text-primary transition-colors duration-500 line-clamp-2">
              {trek.name}
            </h3>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-6 max-w-sm">
            {trek.description}
          </p>

          <div className="mt-auto border-t border-border pt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground/80">
            <div className="flex items-center gap-3">
              <span className="text-foreground whitespace-nowrap">
                {trek.duration} Days
              </span>
              <span className="hidden sm:inline shrink-0 opacity-50">|</span>
              <span className="hidden sm:inline whitespace-nowrap">
                {formatDifficulty(trek.difficulty)}
              </span>
            </div>

            <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
              <span className="text-[10px] tracking-widest whitespace-nowrap">
                {trek.state}
              </span>
              <FiArrowRight className="w-3 h-3 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface AllTreksPageProps {
  initialTreks: TrekCardProps[];
  availableStates: string[];
  currentSort: SortOptionValue;
  currentOrder: "asc" | "desc";
  currentState?: string;
}

export default function AllTreksPageClient({
  initialTreks,
  availableStates,
  currentSort,
  currentOrder,
  currentState,
}: AllTreksPageProps) {
  const router = useRouter();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const sortRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (
        stateRef.current &&
        !stateRef.current.contains(event.target as Node)
      ) {
        setIsStateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateWithParams = (overrides: {
    sort?: SortOptionValue;
    order?: "asc" | "desc";
    state?: string | null;
  }) => {
    const params = new URLSearchParams();
    const nextSort = overrides.sort ?? currentSort;
    const nextOrder = overrides.order ?? currentOrder;
    const nextState =
      overrides.state === undefined ? currentState : overrides.state;

    params.set("sort", nextSort);
    params.set("order", nextOrder);

    if (nextState) {
      params.set("state", nextState);
    }

    const queryString = params.toString();

    startTransition(() => {
      router.push(queryString ? `/all?${queryString}` : "/all");
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted text-foreground selection:bg-primary/20 pb-24">
      {/* Header Section */}
      <section className="relative px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
          <ScrollReveal animation="fade-up" offset={["start 95%", "start 80%"]}>
            <span className="text-primary uppercase tracking-[0.2em] text-xs font-sans font-semibold mb-6 block">
              The Collection
            </span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" offset={["start 95%", "start 70%"]}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display leading-[1.1] tracking-tight max-w-4xl text-balance">
              Explore the Wild.
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" offset={["start 90%", "start 70%"]}>
            <p className="mt-8 text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
              Explore our complete collection of treks, expeditions, and
              adventures across India's most stunning landscapes. Curated for
              those who seek the extraordinary.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter and Sort Bar */}
      <div className="sticky top-0 z-40 bg-linear-to-b from-background to-muted backdrop-blur-md border-y border-border/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground order-2 md:order-1">
            <span className="text-foreground">{initialTreks.length}</span>{" "}
            Expeditions
            {currentState ? ` in ${currentState}` : ""}
          </p>

          <div className="flex items-center gap-4 md:gap-8 flex-wrap md:flex-nowrap order-1 md:order-2">
            {/* Custom State Dropdown */}
            <div className="relative" ref={stateRef}>
              <button
                onClick={() => setIsStateOpen(!isStateOpen)}
                disabled={isPending}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] font-semibold text-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                <span className="text-muted-foreground/60 hidden sm:inline">
                  Region:
                </span>
                {currentState || "All States"}
                <FiChevronDown
                  className={`w-3 h-3 transition-transform ${isStateOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isStateOpen && (
                <div className="absolute top-full left-0 md:right-0 mt-4 w-56 bg-white dark:bg-[#1A1A1A] border border-border/50 shadow-2xl z-50 py-2 origin-top animate-in fade-in slide-in-from-top-2">
                  <button
                    onClick={() => {
                      navigateWithParams({ state: null });
                      setIsStateOpen(false);
                    }}
                    className={`block w-full text-left px-5 py-3 text-sm transition-colors ${
                      !currentState
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    All States
                  </button>
                  {availableStates.map((state) => (
                    <button
                      key={state}
                      onClick={() => {
                        navigateWithParams({ state });
                        setIsStateOpen(false);
                      }}
                      className={`block w-full text-left px-5 py-3 text-sm transition-colors ${
                        currentState === state
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                disabled={isPending}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] font-semibold text-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                <span className="text-muted-foreground/60 hidden sm:inline">
                  Sort:
                </span>
                {sortOptions.find((o) => o.value === currentSort)?.label}
                <FiChevronDown
                  className={`w-3 h-3 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isSortOpen && (
                <div className="absolute top-full left-0 md:right-0 mt-4 w-56 bg-white dark:bg-[#1A1A1A] border border-border/50 shadow-2xl z-50 py-2 origin-top animate-in fade-in slide-in-from-top-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        navigateWithParams({ sort: option.value });
                        setIsSortOpen(false);
                      }}
                      className={`block w-full text-left px-5 py-3 text-sm transition-colors ${
                        currentSort === option.value
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Order Toggle */}
            <button
              onClick={() =>
                navigateWithParams({
                  order: currentOrder === "asc" ? "desc" : "asc",
                })
              }
              disabled={isPending}
              className="group flex items-center gap-2 text-xs uppercase tracking-[0.1em] font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 border-l border-border/50 pl-4 md:pl-8"
              title={`Switch to ${currentOrder === "asc" ? "descending" : "ascending"}`}
            >
              <span className="hidden sm:inline">
                {currentOrder === "asc" ? "Asc" : "Desc"}
              </span>
              <span className="flex bg-muted/50 p-1.5 rounded-sm group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors">
                {currentOrder === "asc" ? (
                  <FiArrowUp className="w-3 h-3 text-primary" />
                ) : (
                  <FiArrowDown className="w-3 h-3 text-primary" />
                )}
              </span>
            </button>
          </div>

          {currentState && (
            <button
              onClick={() => navigateWithParams({ state: null })}
              disabled={isPending}
              className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:border-gray-500 hover:text-foreground"
            >
              Clear State
            </button>
          )}
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div
          className={`transition-opacity duration-300 ${isPending ? "opacity-60" : "opacity-100"}`}
        >
          {initialTreks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 md:gap-x-12 md:gap-y-24">
              {initialTreks.map((trek) => (
                <ScrollReveal
                  key={trek.id}
                  animation="fade-up"
                  offset={["start 95%", "start 75%"]}
                >
                  <TrekCardEditorial trek={trek} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <span className="text-4xl mb-4" aria-hidden="true">
                🏔️
              </span>
              <h3 className="text-2xl font-display text-foreground mb-4">
                No Expeditions Found
              </h3>
              <p className="text-muted-foreground max-w-sm">
                We couldn't find any treks matching your current filters. Try
                adjusting your state or sorting choices.
              </p>
              {currentState && (
                <button
                  onClick={() => navigateWithParams({ state: null })}
                  className="mt-8 text-xs uppercase tracking-[0.2em] font-semibold text-primary hover:text-foreground pb-1 border-b border-primary hover:border-foreground transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
