import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/databaseAvailability";
import { NotFoundError } from "@/lib/errors";

export interface CourseSessionCard {
  id: string;
  startDate: Date;
  seatsAvailable: number;
}

export interface CourseDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string | null;
  location: string;
  price: number;
  duration: number;
  difficulty: string;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  curriculum: string;
  inclusions: string[];
  exclusions: string[];
  requirements: string[];
  instructor: string | null;
  sessions: CourseSessionCard[];
}

export async function getCourseBySlug(
  slug: string,
): Promise<CourseDetail | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        longDescription: true,
        location: true,
        price: true,
        duration: true,
        difficulty: true,
        imageUrl: true,
        thumbnailUrl: true,
        curriculum: true,
        inclusions: true,
        exclusions: true,
        requirements: true,
        instructor: true,
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

    if (!course) {
      throw new NotFoundError(`Course "${slug}" not found`);
    }

    return course;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    console.warn("Skipping course detail during prerender:", error);
    return null;
  }
}
