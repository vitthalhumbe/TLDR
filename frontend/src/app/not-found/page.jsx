import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center text-center px-6">
      <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-6">404</p>
      <h1 className="text-5xl font-bold tracking-tight mb-4">Page not found</h1>
      <p className="text-gray-500 mb-10 max-w-md text-sm leading-relaxed">
        The page you're looking for doesn't exist or you don't have access to it.
      </p>
      <Link
        href="/"
        className="bg-black text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition-colors text-sm"
      >
        Go home
      </Link>
    </div>
  );
}