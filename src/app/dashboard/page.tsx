import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">
            Welcome to the Curio Dashboard
          </p>
          <p className="text-sm text-gray-500">
            This is a placeholder page. Features will be implemented here.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold mb-2">My Introductions</h2>
            <p className="text-sm text-gray-500">
              View and manage your introduction requests
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold mb-2">My Communities</h2>
            <p className="text-sm text-gray-500">
              See communities you belong to
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
