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
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={title} className="h-48 w-full object-cover" />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-gray-400">
          No Image
        </div>
      )}
      <div className="space-y-2 p-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {location && <p className="text-sm text-gray-500">{location}</p>}
        <p className="text-sm font-semibold text-brand-primary">₹{price.toLocaleString()} / night</p>
        <Link
          href={`/rooms/${id}`}
          className="inline-block rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
