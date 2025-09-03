import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50">
      <div className="flex items-center justify-center mb-6">
        <div className="h-16 w-16 bg-gray-400 rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl font-bold">404</span>
        </div>
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">
        Page Not Found
      </h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. Please check the URL or return to the homepage.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <span>←</span>
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
