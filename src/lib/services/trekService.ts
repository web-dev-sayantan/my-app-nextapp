/**
 * Trek Service
 * Handles all trek-related operations
 */

import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { CreateTrekInput, ListTreksQuery } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

export class TrekService {
  /**
   * Create a new trek
   */
  static async createTrek(data: CreateTrekInput) {
    const trek = await prisma.trek.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        longDescription: data.longDescription,
        state: data.state,
        basePrice: data.basePrice,
        difficulty: data.difficulty,
        duration: data.duration,
        maxAltitude: data.maxAltitude,
        distance: data.distance,
        bestSeason: data.bestSeason,
        imageUrl: data.imageUrl,
        thumbnailUrl: data.thumbnailUrl,
        tags: data.tags,
        itinerary: data.itinerary,
        inclusions: data.inclusions,
        exclusions: data.exclusions,
        requirements: data.requirements,
      },
    });

    return trek;
  }

  /**
   * Get trek by slug
   * Used for dynamic routes: /treks/[slug]
   */
  static async getTrekBySlug(slug: string) {
    const trek = await prisma.trek.findUnique({
      where: { slug },
      include: {
        departures: {
          where: { isCancelled: false },
          orderBy: { startDate: "asc" },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            seatsAvailable: true,
            totalSeats: true,
            pricePerPerson: true,
          },
        },
      },
    });

    if (!trek) {
      throw new NotFoundError(`Trek "${slug}" not found`);
    }

    return trek;
  }

  /**
   * Get trek by ID
   */
  static async getTrekById(id: string) {
    const trek = await prisma.trek.findUnique({
      where: { id },
      include: {
        departures: {
          where: { isCancelled: false },
          orderBy: { startDate: "asc" },
        },
      },
    });

    if (!trek) {
      throw new NotFoundError("Trek not found");
    }

    return trek;
  }

  /**
   * List all treks with filtering
   */
  static async listTreks(query: ListTreksQuery, departuresTake: number = 1) {
    const {
      state,
      difficulty,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.TrekWhereInput = {};

    if (state) {
      where.state = { mode: "insensitive", equals: state };
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = minPrice;
      if (maxPrice) where.basePrice.lte = maxPrice;
    }

    const [treks, total] = await Promise.all([
      prisma.trek.findMany({
        where,
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          state: true,
          basePrice: true,
          difficulty: true,
          duration: true,
          distance: true,
          thumbnailUrl: true,
          tags: true,
          departures: {
            where: { isCancelled: false },
            select: {
              id: true,
              seatsAvailable: true,
              totalSeats: true,
              startDate: true,
              endDate: true,
              pricePerPerson: true,
            },
            orderBy: { startDate: "asc" },
            take: departuresTake, // Allow caller to request multiple upcoming departures
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.trek.count({ where }),
    ]);

    return {
      treks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get trek suggestions/recommendations
   * Used for homepage "Similar Treks" section
   */
  static async getSimilarTreks(trekId: string, limit: number = 3) {
    const trek = await this.getTrekById(trekId);

    const similar = await prisma.trek.findMany({
      where: {
        AND: [
          { id: { not: trekId } },
          {
            OR: [
              { state: trek.state },
              { difficulty: trek.difficulty },
              { tags: { hasSome: trek.tags } },
            ],
          },
        ],
      },
      select: {
        id: true,
        slug: true,
        name: true,
        state: true,
        difficulty: true,
        basePrice: true,
        thumbnailUrl: true,
      },
      take: limit,
    });

    return similar;
  }

  /**
   * Search treks by name/description
   */
  static async searchTreks(searchQuery: string) {
    const treks = await prisma.trek.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        slug: true,
        name: true,
        state: true,
        difficulty: true,
        basePrice: true,
        thumbnailUrl: true,
      },
      take: 10,
    });

    return treks;
  }

  /**
   * Get all unique states (for filters)
   */
  static async getAvailableStates() {
    const states = await prisma.trek.findMany({
      select: { state: true },
      distinct: ["state"],
      orderBy: { state: "asc" },
    });

    return states.map((state) => state.state);
  }

  /**
   * Get statistics for dashboard
   */
  static async getTrekStats(trekId: string) {
    const trek = await this.getTrekById(trekId);

    const [totalBookings, averageRating] = await Promise.all([
      prisma.booking.count({
        where: {
          departure: { trekId },
          status: "CONFIRMED",
        },
      }),
      prisma.trekReview.aggregate({
        where: { trekId },
        _avg: { rating: true },
        _count: true,
      }),
    ]);

    return {
      trekId,
      trekName: trek.name,
      totalBookings,
      averageRating: averageRating._avg.rating || 0,
      reviewCount: averageRating._count || 0,
      totalDepartures: trek.departures.length,
    };
  }
}
