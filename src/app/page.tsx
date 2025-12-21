import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Curio</h1>
        <p className="text-xl text-gray-600 mb-8">
          Smart introductions for organisations
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/admin/organisations"
            className="rounded-md bg-gray-600 px-6 py-3 text-white font-medium hover:bg-gray-700 transition-colors"
          >
            Admin: Organisations
          </Link>
        </div>
      </div>
    </main>
  );
}
