"use client";

import Image from "next/image";
import React from "react";

export default function ConnectSection() {
  return (
    <section className="relative py-30 bg-gray-50 text-center mt-30">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-6">
          Seamlessly Connect. <br className="hidden sm:block" /> Perfectly Match.
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find your next tenant or your ideal home with our intuitive platform.
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Property Owners Card */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          <Image
            src="/owner.png"
            alt="Property Owner"
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />
          <div className="p-6 text-left">
            <h3 className="text-xl font-semibold text-sky-900 mb-2">
              Property Owners: List Your Space
            </h3>
            <p className="text-gray-600 mb-4">
              Reach qualified tenants quickly and easily. Manage listings,
              inquiries, and applications all in one place.
            </p>
            <button className="bg-indigo-600 text-white font-medium py-2 px-5 rounded-lg hover:bg-indigo-700 transition-all">
              Get Started as an Owner
            </button>
          </div>
        </div>

        {/* Tenants Card */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          <Image
            src="/tenant.png"
            alt="Tenant"
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />
          <div className="p-6 text-left">
            <h3 className="text-xl font-semibold text-sky-900 mb-2">
              Tenants: Discover Your Next Home
            </h3>
            <p className="text-gray-600 mb-4">
              Browse curated listings, connect with landlords, and secure your
              perfect room or apartment.
            </p>
            <button className="bg-indigo-600 text-white font-medium py-2 px-5 rounded-lg hover:bg-indigo-700 transition-all">
              Find Your New Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
