import RoomCard from "../../components/cards/RoomCard";

const mockRooms = [
  { id: "1", title: "Cozy Studio Apartment", price: 65, location: "Downtown" },
  { id: "2", title: "Spacious 2BR Condo", price: 120, location: "Near Park" },
  { id: "3", title: "Modern Loft", price: 95, location: "City Center" }
];

export default function RoomsPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Rooms</h1>
      <p className="mb-6 text-gray-700">Browse all available rooms.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockRooms.map((r) => (
          <RoomCard key={r.id} id={r.id} title={r.title} price={r.price} location={r.location} />
        ))}
      </div>
    </div>
  );
}
