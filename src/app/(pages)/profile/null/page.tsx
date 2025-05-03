import Link from "next/link";

export default function NullProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 text-center space-y-4">
      <h1 className="text-2xl font-semibold">
        This user hasn&apos;t set up their profile properly.
      </h1>
      <p className="text-lg">You cannot view their profile at this time.</p>
      <Link
        href="/posts"
        className="mt-4 px-6 py-3 bg-white text-black rounded-lg shadow hover:bg-gray-100 transition"
      >
        Go Back to Explore Page
      </Link>
    </div>
  );
}
