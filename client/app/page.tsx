"use client";
import Image from "next/image";
import { useState } from "react";
import ConnectSection from "./components/ConnectSection";
export default function Home() {
  const [location, setLocation] = useState("");
   const [num, setNum] = useState<number | "">("");

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-6 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/235/235861.png"
            alt="RoomBridge Logo"
            width={40}
            height={40}
          />
          <h1 className="text-2xl font-bold text-indigo-900">RoomBridge</h1>
        </div>
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-700 transition-transform duration-300 hover:scale-110">Home</a>
          <a href="#" className="hover:text-blue-700 transition-transform duration-300 hover:scale-110">Rooms</a>
          <a href="#" className="hover:text-blue-700 transition-transform duration-300 hover:scale-110">Bookings</a>
          <a href="#" className="hover:text-blue-700 transition-transform duration-300 hover:scale-110">Amenities</a>
          <a href="#" className="hover:text-blue-700 transition-transform duration-300 hover:scale-110">Events</a>
          <a href="#" className="hover:text-blue-700 transition-transform duration-300 hover:scale-110">Contact</a>
        </nav>
        <button className="bg-indigo-900 text-white px-5 py-2 rounded-lg hover:bg-indigo-800 transition">
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative h-[75vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2000&q=80"
          alt="Hotel Room"
          fill
          className="object-cover brightness-50"
        />
        <div className="z-10">
          <h2 className="text-5xl font-extrabold mb-4">
            Connecting You to Perfect Spaces
          </h2>
          <p className="text-lg text-gray-200 mb-10">
            Discover premium rooms and suites that match your comfort and style.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-white text-gray-900 p-4 rounded-2xl shadow-lg flex flex-wrap gap-4 justify-center items-center max-w-3xl mx-auto border border-gray-100"
          >
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="p-3 px-4 border border-gray-300 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:border-indigo-400 transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-white"
            >
              <option value="">Select City</option>
  <option value="Lucknow">Lucknow</option>
  <option value="Kanpur">Kanpur</option>
  <option value="Varanasi">Varanasi</option>
  <option value="Prayagraj">Prayagraj</option>
  <option value="Agra">Agra</option>
  <option value="Noida">Noida</option>
  <option value="Ghaziabad">Ghaziabad</option>
  <option value="Meerut">Meerut</option>
  <option value="Aligarh">Aligarh</option>
  <option value="Gorakhpur">Gorakhpur</option>

            </select>
            <input
              type="number"
              placeholder="Budget Range"
              value={num}
               
              onChange={(e) => setNum(Number(e.target.value))}
              className="p-3 px-4 border border-gray-300 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:border-indigo-400 transition-all duration-200 bg-gray-50 hover:bg-white"
            />
            {/* <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="p-2 border rounded-lg w-40 focus:outline-none"
            /> */}
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      

 
    
 


      {/* Featured Rooms */}
      <section className="py-20 text-center bg-gray-100">
        <h3 className="text-3xl font-bold text-indigo-900 mb-10">Featured Rooms</h3>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 px-10">
          {[
            {
              title: "Deluxe Suite",
              img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Deluxe Elite",
              img: "https://images.unsplash.com/photo-1560448075-bb4bfc8a0e8b?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Cozy Fiden",
              img: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Cozy Cabin",
              img: "https://images.unsplash.com/photo-1600585154254-5c1b1a5f13da?auto=format&fit=crop&w=800&q=80",
            },
          ].map((room, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <Image
                src={room.img}
                alt={room.title}
                width={400}
                height={300}
                className="object-cover w-full h-56"
              />
              <div className="p-5">
                <h4 className="text-xl font-semibold mb-2">{room.title}</h4>
                <p className="text-gray-500 mb-4">
                  Experience unmatched comfort and luxury in our {room.title}.
                </p>
                <button className="bg-indigo-900 text-white px-5 py-2 rounded-lg hover:bg-indigo-800 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews & News */}
      <section className="py-20 bg-white px-10 grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-3xl font-bold text-indigo-900 mb-5">Customer Reviews</h3>
          <div className="bg-gray-100 rounded-2xl p-6 shadow-md">
            <p className="text-gray-700 mb-4 italic">
              “RoomBridge helped us find the perfect weekend stay — super easy and fast!”
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500 text-xl">★★★★★</span>
              <p className="text-gray-600 text-sm">– A Happy Customer</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-indigo-900 mb-5">Latest News</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "Overlooking the Ocean",
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Blog Post of the Month",
                img: "https://images.unsplash.com/photo-1499696010181-9d8e48e8aa02?auto=format&fit=crop&w=800&q=80",
              },
            ].map((post, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md bg-gray-100">
                <Image
                  src={post.img}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="object-cover w-full h-40"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                  <button className="text-indigo-700 font-medium hover:underline">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* <section className="py-20 bg-white px-10 grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-3xl font-bold text-indigo-900 mb-5">Customer Reviews</h3>
          <div className="bg-gray-100 rounded-2xl p-6 shadow-md">
            <p className="text-gray-700 mb-4 italic">
              “RoomBridge helped us find the perfect weekend stay — super easy and fast!”
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500 text-xl">★★★★★</span>
              <p className="text-gray-600 text-sm">– A Happy Customer</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-indigo-900 mb-5">Latest News</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "Overlooking the Ocean",
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Blog Post of the Month",
                img: "https://images.unsplash.com/photo-1499696010181-9d8e48e8aa02?auto=format&fit=crop&w=800&q=80",
              },
            ].map((post, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md bg-gray-100">
                <Image
                  src={post.img}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="object-cover w-full h-40"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                  <button className="text-indigo-700 font-medium hover:underline">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

 
  <section className="relative h-[75vh] background-color grey flex items-center justify-center text-center text-white" >

      {/* Hero/Search section here */}
      <ConnectSection />
      </section>
    

      {/* Footer */}
      <footer className=" bg-indigo-900 text-white py-50 text-center mt-100">
        <div className="flex flex-wrap justify-center space-x-6 mb-6">
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Contact</a>
        </div>
        <p className="text-sm text-gray-300">
          © 2025 RoomBridge. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
