import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden h-full w-full max-w-[220px] shrink-0 lg:block">
      <div className="sticky top-[64px] space-y-2 p-2 text-sm">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Explore
        </p>
        <nav className="flex flex-col">
          <Link href="/rooms" className="rounded px-2 py-1.5 text-gray-700 hover:bg-gray-100">
            All Rooms
          </Link>
          <Link href="/rooms/new" className="rounded px-2 py-1.5 text-gray-700 hover:bg-gray-100">
            New Room
          </Link>
        </nav>
      </div>
    </aside>
  );
}

