import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header / Navbar */}
      <header className="flex items-center justify-between px-8 py-5 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/235/235861.png"
            alt="RoomBridge Logo"
            width={40}
            height={40}
          />
          <h1 className="text-2xl font-bold text-blue-800">RoomBridge</h1>
        </div>

        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-700 transition-transform duration-300 hover:scale-110">Home</a>
          <a href="#" className="hover:text-blue-700 transition-transform duration-300 hover:scale-110">Rooms</a>
          <a href="#" className=" transition-transform duration-300 hover:scale-110">Bookings</a>
          <a href="#" className=" transition-transform duration-300 hover:scale-110">Amenities</a>
          <a href="#" className="hover:text-blue-700 transition-transform duration-300 hover:scale-110">Events</a>
          <a href="#" className="hover:text-blue-700 transition-transform duration-300 hover:scale-110">Contact</a>
        </nav>

        <button className="bg-blue-800 text-white px-5 py-2 rounded-md hover:bg-blue-900">
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[70vh] flex flex-col justify-center items-center text-white text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="bg-black/40 absolute inset-0"></div>
        <div className="relative z-10 px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Connecting You to Perfect Spaces
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            Discover premium rooms that match your comfort, convenience, and lifestyle.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 mt-10 bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-11/12 md:w-auto">
          <input
            type="text"
            placeholder="Where"
            className="border px-4 py-2 rounded-md w-full md:w-40"
          />
          <input
            type="date"
            className="border px-4 py-2 rounded-md w-full md:w-40"
          />
          <input
            type="date"
            className="border px-4 py-2 rounded-md w-full md:w-40"
          />
          <button className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-900">
            Search
          </button>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 px-6 md:px-20 bg-white text-center">
        <h3 className="text-3xl font-bold mb-10">Featured Rooms</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              name: "Deluxe Suite",
              img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            },
            {
              name: "Deluxe Elity",
              img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            },
            {
              name: "Cozy Fiden",
              img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            },
            {
              name: "Cozy Cabin",
              img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
            },
          ].map((room) => (
            <div key={room.name} className="rounded-lg overflow-hidden shadow-lg bg-gray-50">
              <Image
                src={room.img}
                alt={room.name}
                width={400}
                height={250}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h4 className="text-xl font-semibold mb-2">{room.name}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Experience a luxurious stay with modern comfort and elegant design.
                </p>
                <button className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews & Latest News */}
      <section className="py-16 bg-gray-100 px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Reviews */}
        <div>
          <h3 className="text-3xl font-bold mb-6">Customer Reviews</h3>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-700 italic mb-4">
              “Great stay! The room was clean, spacious, and had an amazing view.
              Highly recommend RoomBridge for your next trip!”
            </p>
            <p className="font-semibold">– User Testimonial</p>
            <div className="text-yellow-500 mt-2">★★★★★</div>
          </div>
        </div>

        {/* Latest News */}
        <div>
          <h3 className="text-3xl font-bold mb-6">Latest News</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Overlooking Oniwa Waterfront",
                img: "https://images.unsplash.com/photo-1501117716987-c8e3f09a1fca?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Blog Post: The Mastermatch",
                img: "https://images.unsplash.com/photo-1505691723518-36a9b2ab7e50?auto=format&fit=crop&w=800&q=80",
              },
            ].map((news) => (
              <div key={news.title} className="bg-white rounded-lg shadow overflow-hidden">
                <Image
                  src={news.img}
                  alt={news.title}
                  width={400}
                  height={250}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold">{news.title}</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Explore our recent updates and travel stories from happy guests.
                  </p>
                  <a href="#" className="text-blue-700 mt-3 inline-block">
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 text-center">
        <div className="space-x-4 mb-4">
          <a href="#" className="hover:underline">
            About Us
          </a>
          <a href="#" className="hover:underline">
            Careers
          </a>
          <a href="#" className="hover:underline">
            Press
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
        <p className="text-sm text-gray-300">
          © {new Date().getFullYear()} RoomBridge. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
