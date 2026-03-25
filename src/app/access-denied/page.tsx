import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          You don't have permission to access this page. Contact an
          administrator if you believe this is a mistake.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
