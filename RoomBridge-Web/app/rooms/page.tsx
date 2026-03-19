"use client";

import Navbar from "@/components/layout/Navbar";

const placeholderRooms = [
  {
    id: "1",
    title: "Cozy Studio in Bandra",
    price: 2500,
    location: "Mumbai",
    guests: 2,
    bedrooms: 1,
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Sea-Facing Villa",
    price: 8000,
    location: "Goa",
    guests: 6,
    bedrooms: 3,
    img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    title: "Modern Flat in Delhi",
    price: 3500,
    location: "Delhi",
    guests: 4,
    bedrooms: 2,
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    title: "Heritage Haveli Room",
    price: 4000,
    location: "Jaipur",
    guests: 2,
    bedrooms: 1,
    img: "https://images.unsplash.com/photo-1590490360182-c33d955e5b5e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    title: "Luxury Penthouse",
    price: 6000,
    location: "Bangalore",
    guests: 4,
    bedrooms: 2,
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    title: "Beachside Cottage",
    price: 3000,
    location: "Pondicherry",
    guests: 2,
    bedrooms: 1,
    img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
  },
];

export default function RoomsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero with search */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary/80 text-white">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              {placeholderRooms.length} rooms available
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Explore Rooms
            </h1>
            <p className="text-indigo-200 max-w-xl mx-auto text-lg mb-8">
              Find your perfect stay from our curated listings across India.
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Where do you want to stay?"
                  className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                />
                <button className="px-6 py-3 rounded-xl bg-white text-brand-primary font-semibold text-sm hover:bg-indigo-50 transition shadow-sm">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Room Grid */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Rooms</h2>
              <p className="text-sm text-gray-500 mt-1">{placeholderRooms.length} properties found</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderRooms.map((room) => (
              <div
                key={room.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={room.img}
                    alt={room.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-brand-primary shadow-sm">
                    ₹{room.price.toLocaleString()}/night
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-1">{room.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {room.location}
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                      </svg>
                      {room.guests} guests
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
                      </svg>
                      {room.bedrooms} bed
                    </span>
                  </div>

                  <button className="w-full rounded-xl bg-brand-primary py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition group-hover:shadow-md group-hover:shadow-indigo-200">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
