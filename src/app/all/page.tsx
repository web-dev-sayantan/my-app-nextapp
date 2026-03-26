import { getAvailableStates, listTreks } from "@/lib/services/trekService";
import AllTreksPageClient from "@/components/allTreksClient";
import { isDatabaseConfigured } from "@/lib/databaseAvailability";
import { listTreksQuerySchema } from "@/lib/validations";

export const revalidate = 60;

type ListedTrek = Awaited<ReturnType<typeof listTreks>>["treks"][number];
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

type AllPageProps = {
  searchParams: Promise<{
    sort?: string;
    order?: string;
    state?: string;
  }>;
};

export default async function All({ searchParams }: AllPageProps) {
  let trekData: AllTreksPageItem[] = [];
  let availableStates: string[] = [];

  const params = await searchParams;
  const parsedQuery = listTreksQuerySchema.safeParse({
    state: params.state || undefined,
    sortBy: params.sort || "popular",
    sortOrder: params.order || "desc",
    page: 1,
    limit: 100,
  });
  const validatedQuery = parsedQuery.success
    ? parsedQuery.data
    : {
        sortBy: "popular" as const,
        sortOrder: "desc" as const,
        page: 1,
        limit: 100,
      };

  if (!isDatabaseConfigured()) {
    return (
      <AllTreksPageClient
        initialTreks={trekData}
        availableStates={availableStates}
        currentSort={validatedQuery.sortBy || "popular"}
        currentOrder={validatedQuery.sortOrder || "desc"}
        currentState={validatedQuery.state}
      />
    );
  }

  try {
    const [{ treks }, states] = await Promise.all([
      listTreks(validatedQuery, 50),
      getAvailableStates(),
    ]);

    availableStates = states;

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
        departuresCount: trek._count?.departures || 0,
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

  return (
    <AllTreksPageClient
      initialTreks={trekData}
      availableStates={availableStates}
      currentSort={validatedQuery.sortBy || "popular"}
      currentOrder={validatedQuery.sortOrder || "desc"}
      currentState={validatedQuery.state}
    />
  );
}
