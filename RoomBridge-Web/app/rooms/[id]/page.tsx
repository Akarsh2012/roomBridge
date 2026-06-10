import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

interface RoomDetailPageProps {
  params: { id: string };
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-[80vh] items-center overflow-hidden">
        <div className="glow -right-20 top-10 h-80 w-96 opacity-30" aria-hidden />
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <p className="eyebrow mb-4">Stay #{params.id}</p>
          <h1 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.02] tracking-tight text-balance">
            This room&apos;s full page is{" "}
            <span className="italic text-amber">on its way.</span>
          </h1>
          <p className="mt-5 max-w-md text-muted">
            Detailed photos, amenities, host profiles, availability and instant
            booking land here next. For now, keep exploring the collection.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/rooms" className="btn-amber px-6 py-3 text-sm">
              ← Back to all stays
            </Link>
            <Link href="/" className="btn-ghost px-6 py-3 text-sm">
              Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
