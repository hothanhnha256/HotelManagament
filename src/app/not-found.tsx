import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white w-screen">
      <h1 className="text-9xl font-extrabold mb-4 animate-pulse">404</h1>
      <h2 className="text-4xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-lg mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link href="/">Go Home</Link>
    </div>
  );
}
