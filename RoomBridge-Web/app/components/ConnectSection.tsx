"use client";

import Image from "next/image";
import Link from "next/link";

export default function ConnectSection() {
  return (
    <section className="bg-gray-50 py-20 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-primary mb-4">
          Seamlessly Connect. <br className="hidden sm:block" /> Perfectly Match.
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find your next tenant or your ideal home with our intuitive platform.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Owner Card */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <div className="relative w-full h-64 sm:h-72 md:h-64 lg:h-72">
            <Image
              src="/owner.png"
              alt="Property Owner"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-xl font-semibold text-brand-primary mb-2">
              Property Owners: List Your Space
            </h3>
            <p className="text-gray-600 mb-4">
              Reach qualified tenants quickly and easily. Manage listings,
              inquiries, and applications all in one place.
            </p>
            <Link
              href="/auth/signup?role=host"
              className="mt-auto inline-block bg-brand-secondary text-white font-medium py-2.5 px-5 rounded-lg hover:bg-brand-primary transition"
            >
              Get Started as an Owner
            </Link>
          </div>
        </article>

        {/* Tenant Card */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <div className="relative w-full h-64 sm:h-72 md:h-64 lg:h-72">
            <Image
              src="/tenant.png"
              alt="Tenant"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-xl font-semibold text-brand-primary mb-2">
              Tenants: Discover Your Next Home
            </h3>
            <p className="text-gray-600 mb-4">
              Browse curated listings, connect with landlords, and secure your
              perfect room or apartment.
            </p>
            <Link
              href="/auth/signup?role=guest"
              className="mt-auto inline-block bg-brand-secondary text-white font-medium py-2.5 px-5 rounded-lg hover:bg-brand-primary transition"
            >
              Find Your New Home
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
