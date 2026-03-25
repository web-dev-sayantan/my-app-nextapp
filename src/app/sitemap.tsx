export const dynamic = "force-dynamic";
import { listTreks } from "@/lib/services/trekService";

export default async function sitemap() {
  const base = "https://thetrailmakers.in";
  const lastModified = new Date();

  // Fetch treks from database - wrapped in try/catch to prevent build failure when DB is unreachable
  let trekUrls: Array<{ url: string; lastModified: Date }> = [];
  try {
    const { treks } = await listTreks({ page: 1, limit: 100 }, 0);
    trekUrls = treks.map((trek: { slug: string }) => ({
      url: `${base}/treks/${trek.slug}`,
      lastModified,
    }));
  } catch (error) {
    console.warn(
      "Skipping trek URLs in sitemap – DB unreachable during build:",
      error,
    );
  }

  return [
    { url: base, lastModified },
    { url: `${base}/all`, lastModified },
    { url: `${base}/contact`, lastModified },
    ...trekUrls,
    {
      url: `${base}/blog/The-Only-Difference-Between-Trekking-And-Hiking`,
      lastModified,
    },
    { url: `${base}/blog/Understanding-The-Layering-System`, lastModified },
    { url: `${base}/blog/10-Best-Treks-in-Himachal-Pradesh`, lastModified },
  ];
}
