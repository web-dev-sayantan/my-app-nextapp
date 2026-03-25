export default function LoadingAllTreksPage() {
  return (
    <div className="min-h-screen bg-brand-warmwhite px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-12 w-80 animate-pulse rounded bg-stone-200" />
        <div className="mt-4 h-6 w-full max-w-2xl animate-pulse rounded bg-stone-200" />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="rounded-3xl bg-white p-4 shadow-warm">
              <div className="h-48 animate-pulse rounded-2xl bg-stone-200" />
              <div className="mt-4 h-6 w-2/3 animate-pulse rounded bg-stone-200" />
              <div className="mt-3 h-16 animate-pulse rounded bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
