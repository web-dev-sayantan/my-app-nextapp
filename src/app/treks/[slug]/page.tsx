/**
 * Server wrapper for the dynamic trek page.
 * Fetches trek data and delegates rendering to the client component.
 */

import { notFound } from "next/navigation";
import { TrekService } from "@/lib/services/trekService";
import TrekPageClient from "./trek-page-client";
import { isDatabaseConfigured } from "@/lib/databaseAvailability";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    const { treks } = await TrekService.listTreks({ page: 1, limit: 50 });
    return treks.map((trek) => ({ slug: trek.slug }));
  } catch (error) {
    console.warn(
      "Skipping generateStaticParams – DB unreachable during build:",
      error,
    );
    return [];
  }
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  if (!isDatabaseConfigured()) {
    return { title: "Trail Makers" };
  }

  try {
    const trek = await TrekService.getTrekBySlug(params.slug);
    return {
      title: `${trek.name} Trek | Trail Makers`,
      description: trek.description,
      openGraph: {
        title: trek.name,
        description: trek.description,
        images: trek.imageUrl ? [trek.imageUrl] : [],
      },
    };
  } catch (error) {
    return { title: "Trek Not Found | Trail Makers" };
  }
}

export default async function TrekPage(props: PageProps) {
  const params = await props.params;
  if (!isDatabaseConfigured()) {
    notFound();
  }

  const trek = await TrekService.getTrekBySlug(params.slug).catch(() => null);

  if (!trek) {
    notFound();
  }

  return <TrekPageClient trek={trek} />;
}
