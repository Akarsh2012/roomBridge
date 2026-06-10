import Link from "next/link";

type RoomCardProps = {
  id: string;
  title: string;
  price: number;
  location?: string;
  imageUrl?: string;
};

export default function RoomCard({ id, title, price, location, imageUrl }: RoomCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-line bg-ink-2 transition-colors hover:border-line-strong">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={title}
          className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-52 w-full items-center justify-center bg-ink-3 font-mono text-xs uppercase tracking-widest text-faint">
          No image
        </div>
      )}
      <div className="space-y-2 p-5">
        <h3 className="font-display text-lg font-semibold text-paper">{title}</h3>
        {location && <p className="text-sm text-muted">{location}</p>}
        <p className="font-mono text-sm text-amber">₹{price.toLocaleString()} / night</p>
        <Link
          href={`/rooms/${id}`}
          className="btn-ghost mt-2 w-full py-2.5 text-sm"
        >
          View details
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
