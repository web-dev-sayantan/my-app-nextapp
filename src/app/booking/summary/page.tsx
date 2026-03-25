import BookingSummaryClient from "./booking-summary-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type BookingSummaryPageProps = {
  searchParams: Promise<{
    departureId?: string;
    trekName?: string;
    trekSlug?: string;
    startDate?: string;
    endDate?: string;
    price?: string;
    seats?: string;
  }>;
};

export default async function BookingSummaryPage({
  searchParams,
}: BookingSummaryPageProps) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

  return (
    <BookingSummaryClient
      departureId={params.departureId ?? null}
      trekName={params.trekName ?? null}
      trekSlug={params.trekSlug ?? null}
      startDate={params.startDate ?? null}
      endDate={params.endDate ?? null}
      pricePerPerson={params.price ?? null}
      availableSeats={params.seats ?? null}
      initialContactName={session?.user?.name ?? ""}
      initialContactEmail={session?.user?.email ?? ""}
    />
  );
}
