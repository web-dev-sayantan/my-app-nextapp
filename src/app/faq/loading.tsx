export default function LoadingFaqPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-16 dark:from-gray-900 dark:to-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mx-auto h-12 w-96 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mx-auto mt-4 h-6 w-full max-w-2xl animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>

      <div className="mx-auto mt-12 max-w-4xl space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-lg bg-white shadow dark:bg-gray-800"
          />
        ))}
      </div>
    </div>
  );
}
