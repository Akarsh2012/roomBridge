"use client";

import Image from "next/image";
import React from "react";

export default function ConnectSection() {
  return (
    <section className="bg-gray-50 py-24 px-6 sm:px-12 lg:px-24">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">
          Seamlessly Connect. <br className="hidden sm:block" /> Perfectly Match.
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find your next tenant or your ideal home with our intuitive platform.
        </p>
      </div>

      {/* Cards Container */}
       {/* Cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Owner Card */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
          {/* image wrapper uses relative and fixed height so next/image fill works reliably */}
          <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96">
            <Image
              src="/owner.png"              // put public/owner.jpg
              alt="Property Owner"
              fill
              className="w-full fit"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-sky-900 mb-2">
              Property Owners: List Your Space
            </h3>
            <p className="text-gray-600 mb-4">
              Reach qualified tenants quickly and easily. Manage listings,
              inquiries, and applications all in one place.
            </p>
            <button className="inline-block bg-indigo-500 text-white font-medium py-2 px-5 rounded-lg hover:bg-indigo-600 transition">
              Get Started as an Owner
            </button>
          </div>
        </article>

        {/* Tenant Card */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
          <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96">
            <Image
              src="/tenant.png"            // put public/tenant.jpg
              alt="Tenant"
              fill
              className="w-full fit"
              priority
              sizes="(max-width: 768px) 100vw, 50vw ,h-50"
            />
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-sky-900 mb-2">
              Tenants: Discover Your Next Home
            </h3>
            <p className="text-gray-600 mb-4">
              Browse curated listings, connect with landlords, and secure your
              perfect room or apartment.
            </p>
            <button className="inline-block bg-indigo-500 text-white font-medium py-2 px-5 rounded-lg hover:bg-indigo-600 transition">
              Find Your New Home
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
