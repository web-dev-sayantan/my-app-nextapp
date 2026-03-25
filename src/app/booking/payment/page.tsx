import PaymentPageClient from "./payment-page-client";

type PaymentPageProps = {
  searchParams: Promise<{
    bookingId?: string;
    amount?: string;
  }>;
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const params = await searchParams;

  return (
    <PaymentPageClient
      bookingId={params.bookingId ?? null}
      amount={params.amount ?? null}
    />
  );
}
