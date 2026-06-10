import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function NewRoomPage() {
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-[80vh] items-center overflow-hidden">
        <div className="glow -left-20 top-10 h-80 w-96 opacity-30" aria-hidden />
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <p className="eyebrow mb-4">Become a host</p>
          <h1 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.02] tracking-tight text-balance">
            Listing your space is{" "}
            <span className="italic text-amber">almost ready.</span>
          </h1>
          <p className="mt-5 max-w-md text-muted">
            Soon you&apos;ll add photos, set your price, describe amenities and
            publish your room in minutes — reaching verified guests across India.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/rooms" className="btn-amber px-6 py-3 text-sm">
              Browse stays meanwhile
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
