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
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={title} className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-gray-100 text-gray-400">
          No Image
        </div>
      )}
      <div className="space-y-1 p-4">
        <h3 className="text-base font-semibold">{title}</h3>
        {location && <p className="text-sm text-gray-600">{location}</p>}
        <p className="text-sm font-medium">${price.toFixed(2)} / night</p>
        <Link
          href={`/rooms/${id}`}
          className="inline-block rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
