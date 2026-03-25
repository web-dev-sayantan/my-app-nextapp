import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/databaseAvailability";
import { NotFoundError } from "@/lib/errors";

export interface ExpeditionSessionCard {
  id: string;
  startDate: Date;
  seatsAvailable: number;
}

export interface ExpeditionDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string | null;
  state: string;
  basePrice: number;
  difficulty: string;
  duration: number;
  maxAltitude: number | null;
  distance: number | null;
  bestSeason: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  itinerary: string;
  inclusions: string[];
  exclusions: string[];
  requirements: string[];
  sessions: ExpeditionSessionCard[];
}

export async function getExpeditionBySlug(
  slug: string,
): Promise<ExpeditionDetail | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    const expedition = await prisma.expedition.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        longDescription: true,
        state: true,
        basePrice: true,
        difficulty: true,
        duration: true,
        maxAltitude: true,
        distance: true,
        bestSeason: true,
        imageUrl: true,
        thumbnailUrl: true,
        itinerary: true,
        inclusions: true,
        exclusions: true,
        requirements: true,
        sessions: {
          where: {
            startDate: { gte: new Date() },
            isCancelled: false,
          },
          orderBy: { startDate: "asc" },
          select: {
            id: true,
            startDate: true,
            seatsAvailable: true,
          },
        },
      },
    });

    if (!expedition) {
      throw new NotFoundError(`Expedition "${slug}" not found`);
    }

    return expedition;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    console.warn("Skipping expedition detail during prerender:", error);
    return null;
  }
}
