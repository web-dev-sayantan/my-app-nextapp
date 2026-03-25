import { TrekService } from "@/lib/services/trekService";
import AllTreksPageClient from "@/components/allTreksClient";
import { isDatabaseConfigured } from "@/lib/databaseAvailability";

export const revalidate = 60;

type ListedTrek = Awaited<
  ReturnType<typeof TrekService.listTreks>
>["treks"][number];
type AllTreksPageItem = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string | null | undefined;
  state: string;
  difficulty: string;
  duration: number;
  distance: number | null;
  description: string;
  departuresCount: number;
  earliestDate: string;
};

export default async function All() {
  let trekData: AllTreksPageItem[] = [];
  if (!isDatabaseConfigured()) {
    return <AllTreksPageClient initialTreks={trekData} />;
  }

  try {
    const { treks } = await TrekService.listTreks({ page: 1, limit: 100 }, 50);

    // Transform treks data into format needed by client component
    trekData = treks.map((trek: ListedTrek) => {
      const earliestDate =
        trek.departures && trek.departures.length > 0
          ? trek.departures[0].startDate
          : null;

      return {
        id: trek.id,
        name: trek.name,
        slug: trek.slug,
        thumbnail: trek.thumbnailUrl,
        state: trek.state,
        difficulty: trek.difficulty,
        duration: trek.duration,
        distance: trek.distance,
        description: trek.description,
        departuresCount: trek.departures?.length || 0,
        earliestDate: earliestDate
          ? new Date(earliestDate).toISOString()
          : "2099-12-31",
      };
    });
  } catch (error) {
    console.warn(
      "Skipping /all page treks – DB unreachable during build:",
      error,
    );
  }

  return <AllTreksPageClient initialTreks={trekData} />;
}
