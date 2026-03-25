export default function LoadingExpeditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="h-12 w-80 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-4 h-6 w-full max-w-3xl animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800"
            >
              <div className="h-48 animate-pulse bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-4 p-4">
                <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, statIndex) => (
                    <div
                      key={statIndex}
                      className="h-10 animate-pulse rounded bg-gray-100 dark:bg-gray-700"
                    />
                  ))}
                </div>
                <div className="h-16 animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
                <div className="h-10 animate-pulse rounded bg-blue-600/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
