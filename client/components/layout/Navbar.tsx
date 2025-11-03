import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          RoomBridge
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/rooms" className="text-gray-700 hover:text-gray-900">
            Rooms
          </Link>
          <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}
