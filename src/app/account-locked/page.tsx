import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Account Locked
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
          Your account has been locked due to too many failed login attempts.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          The account will automatically unlock after 30 minutes, or you can
          contact support to unlock it immediately.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Go to Home
          </Link>
          <Link
            href="/contact"
            className="inline-block bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
