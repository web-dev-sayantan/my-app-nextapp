/**
 * Server wrapper for the dynamic trek page.
 * Fetches trek data and delegates rendering to the client component.
 */

import { notFound } from "next/navigation";
import { TrekService } from "@/lib/services/trekService";
import TrekPageClient from "./trek-page-client";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const { treks } = await TrekService.listTreks({ page: 1, limit: 50 });
    return treks.map((trek: any) => ({ slug: trek.slug }));
  } catch (error) {
    console.warn("Skipping generateStaticParams – DB unreachable during build:", error);
    return [];
  }
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  try {
    const trek = await TrekService.getTrekBySlug(params.slug);
    return {
      title: `${trek.name} Trek | Trail Makers`,
      description: trek.description,
      openGraph: { title: trek.name, description: trek.description, images: trek.imageUrl ? [trek.imageUrl] : [] },
    };
  } catch (error) {
    return { title: "Trek Not Found | Trail Makers" };
  }
}

export default async function TrekPage(props: PageProps) {
  const params = await props.params;
  try {
    const trek = await TrekService.getTrekBySlug(params.slug);
    return <TrekPageClient trek={trek} />;
  } catch (error) {
    notFound();
  }
}
