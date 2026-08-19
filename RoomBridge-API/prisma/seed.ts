// `npm run seed` runs this through ts-node directly, which (unlike the Prisma CLI)
// does not load .env for us.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@roombridge.com",
      password,
      emailVerified: true,
      role: "ADMIN",
      bio: "Platform administrator",
    },
  });

  const host1 = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@roombridge.com",
      password,
      emailVerified: true,
      bio: "Property owner in Mumbai with 5 years of hosting experience",
      phone: "+91-9876543210",
    },
  });

  const host2 = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya@roombridge.com",
      password,
      emailVerified: true,
      bio: "Superhost managing premium properties across Goa",
      phone: "+91-9876543211",
    },
  });

  const guest = await prisma.user.create({
    data: {
      name: "Akarsh Guest",
      email: "guest@roombridge.com",
      password,
      emailVerified: true,
      bio: "Love traveling and exploring new places",
    },
  });

  // Create rooms — seeded listings represent inventory an admin has already vetted,
  // so they skip the PENDING moderation queue and are live immediately.
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        title: "Cozy Studio Apartment in Bandra",
        description: "A beautifully furnished studio apartment in the heart of Bandra. Walking distance to Bandstand and Carter Road. Perfect for solo travelers or couples.",
        price: 2500,
        location: "Bandra West",
        address: "14th Road, Bandra West",
        city: "Mumbai",
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["WiFi", "AC", "Kitchen", "Washing Machine", "TV"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
        status: "APPROVED",
        reviewedAt: new Date(),
        hostId: host1.id,
      },
    }),
    prisma.room.create({
      data: {
        title: "Sea-Facing Villa in Goa",
        description: "Wake up to stunning ocean views in this spacious 3-bedroom villa. Private pool, garden, and direct beach access. Ideal for families or group vacations.",
        price: 8000,
        location: "Calangute Beach",
        address: "Near Calangute Beach Road",
        city: "Goa",
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ["WiFi", "AC", "Pool", "Kitchen", "Parking", "Beach Access", "Garden"],
        images: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf"],
        status: "APPROVED",
        reviewedAt: new Date(),
        hostId: host2.id,
      },
    }),
    prisma.room.create({
      data: {
        title: "Modern Flat near Connaught Place",
        description: "Stylish 2BHK apartment in central Delhi. Metro station 2 minutes away. Great for business travelers exploring the capital.",
        price: 3500,
        location: "Rajiv Chowk",
        address: "Block A, Connaught Place",
        city: "Delhi",
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ["WiFi", "AC", "TV", "Elevator", "Security"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
        status: "APPROVED",
        reviewedAt: new Date(),
        hostId: host1.id,
      },
    }),
    prisma.room.create({
      data: {
        title: "Heritage Haveli Room in Jaipur",
        description: "Experience royal Rajasthani hospitality in this restored haveli. Traditional decor with modern amenities. Rooftop breakfast with fort views.",
        price: 4000,
        location: "Near Hawa Mahal",
        address: "Johari Bazaar Road",
        city: "Jaipur",
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["WiFi", "AC", "Breakfast", "Rooftop", "Heritage"],
        images: ["https://images.unsplash.com/photo-1590490360182-c33d955e5b5e"],
        status: "APPROVED",
        reviewedAt: new Date(),
        hostId: host2.id,
      },
    }),
    prisma.room.create({
      data: {
        title: "Luxury Penthouse in Koramangala",
        description: "Top-floor penthouse with panoramic city views. Fully equipped kitchen, home theater, and private terrace. Premium Bangalore living.",
        price: 6000,
        location: "Koramangala 5th Block",
        address: "80 Feet Road, Koramangala",
        city: "Bangalore",
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ["WiFi", "AC", "Kitchen", "Gym", "Terrace", "Home Theater", "Parking"],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"],
        status: "APPROVED",
        reviewedAt: new Date(),
        hostId: host1.id,
      },
    }),
    prisma.room.create({
      data: {
        title: "Beachside Cottage in Pondicherry",
        description: "Charming French-style cottage steps from the beach. Quiet neighborhood in White Town. Bicycle included for exploring the city.",
        price: 3000,
        location: "White Town",
        address: "Rue de la Marine",
        city: "Pondicherry",
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["WiFi", "AC", "Bicycle", "Beach Access", "Garden"],
        images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2"],
        status: "APPROVED",
        reviewedAt: new Date(),
        hostId: host2.id,
      },
    }),
    prisma.room.create({
      data: {
        title: "Mountain View Cabin in Manali",
        description: "Wooden cabin surrounded by pine trees with stunning Himalayan views. Fireplace, hot water, and home-cooked meals available. Perfect winter getaway.",
        price: 3500,
        location: "Old Manali",
        address: "Near Manu Temple Road",
        city: "Manali",
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ["WiFi", "Fireplace", "Mountain View", "Kitchen", "Parking", "Heater"],
        images: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739"],
        status: "APPROVED",
        reviewedAt: new Date(),
        hostId: host1.id,
      },
    }),
    prisma.room.create({
      data: {
        title: "Houseboat Stay in Alleppey",
        description: "Traditional Kerala houseboat on the backwaters. All meals included. Cruise through palm-lined canals and watch the sunset from the deck.",
        price: 5500,
        location: "Alleppey Backwaters",
        address: "Punnamada Jetty",
        city: "Alleppey",
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ["All Meals", "AC", "Deck", "Backwater Cruise", "Sunset View"],
        images: ["https://images.unsplash.com/photo-1602002418816-5c0aeef426aa"],
        status: "APPROVED",
        reviewedAt: new Date(),
        hostId: host2.id,
      },
    }),
  ]);


  // ── Listings in the other moderation states ──────────────────
  // So the admin queue is never empty on a fresh database and every state is testable.
  const pendingAndRejected = await Promise.all([
    prisma.room.create({
      data: {
        title: "Skyline Loft with Private Terrace",
        description:
          "A sunlit loft on the 11th floor with a private terrace overlooking the city skyline. Walking distance to the metro, cafes and the Sunday flea market.",
        price: 4200,
        location: "Indiranagar",
        address: "12, 100ft Road, Indiranagar",
        city: "Bangalore",
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["WiFi", "AC", "Kitchen", "Balcony", "Workspace"],
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
        status: "PENDING",
        hostId: host1.id,
      },
    }),
    prisma.room.create({
      data: {
        title: "Garden Studio near Fort Kochi",
        description:
          "A quiet studio opening onto a shared garden, five minutes from the Chinese fishing nets. Ideal for a slow, unhurried few days by the water.",
        price: 2800,
        location: "Fort Kochi",
        address: "Burgher Street",
        city: "Kochi",
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["WiFi", "Breakfast", "Garden"],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"],
        status: "PENDING",
        hostId: host2.id,
      },
    }),
    prisma.room.create({
      data: {
        title: "Budget Room near Station",
        description:
          "A simple room close to the railway station. Basic amenities, suitable for a short overnight stop between trains.",
        price: 900,
        location: "Station Road",
        address: "Near Platform 1",
        city: "Mumbai",
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["Fan"],
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"],
        status: "REJECTED",
        rejectionReason:
          "The photos do not show the actual room being listed, and the description is missing key details about shared facilities. Please upload real photos of the room and expand the description, then resubmit.",
        reviewedAt: new Date(),
        reviewedById: admin.id,
        hostId: host1.id,
      },
    }),
  ]);

  // The guest account hosts too — any verified user can list on RoomBridge.
  const guestRooms = await Promise.all([
    prisma.room.create({
      data: {
        title: "Sunny Attic Room in Old Goa",
        description:
          "A bright attic room in a Portuguese-era house, with wooden beams and a view over the coconut palms. Breakfast included, bicycles available.",
        price: 2200,
        location: "Old Goa",
        address: "Rua de Ourem",
        city: "Goa",
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["WiFi", "Breakfast", "Balcony", "Pet Friendly"],
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedById: admin.id,
        hostId: guest.id,
      },
    }),
    prisma.room.create({
      data: {
        title: "Riverside Tent Stay in Rishikesh",
        description:
          "Canvas tents pitched on the riverbank, a short walk from the rapids. Bonfire every evening, rafting and trekking can be arranged on request.",
        price: 1800,
        location: "Shivpuri",
        address: "Camp Ground 4, Shivpuri",
        city: "Rishikesh",
        maxGuests: 4,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["Breakfast", "Power Backup"],
        images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"],
        status: "PENDING",
        hostId: guest.id,
      },
    }),
  ]);

  // ── Reviews on approved listings ─────────────────────────────
  await prisma.review.createMany({
    data: [
      { rating: 5, comment: "Spotless, exactly as pictured, and the host left us a handwritten note. Would stay again without hesitation.", roomId: rooms[0].id, userId: guest.id },
      { rating: 4, comment: "Great location and very comfortable. The street outside gets a little loud in the evening, but the AC drowns it out.", roomId: rooms[0].id, userId: host2.id },
      { rating: 5, comment: "Waking up to that view was worth the trip on its own. The fireplace made the cold evenings genuinely cosy.", roomId: rooms[2].id, userId: guest.id },
      { rating: 5, comment: "The houseboat crew were wonderful and the food kept coming. A slow, beautiful two days on the backwaters.", roomId: rooms[7].id, userId: guest.id },
      { rating: 4, comment: "Clean, well kept and a two-minute walk to the beach. Wifi was patchy but we barely needed it.", roomId: rooms[1].id, userId: host1.id },
      { rating: 5, comment: "Beautifully restored old house with a lot of character. The host gave us excellent food recommendations.", roomId: guestRooms[0].id, userId: host1.id },
    ],
  });

  const totalRooms = rooms.length + pendingAndRejected.length + guestRooms.length;

  console.log("Seed complete!");
  console.log(`Created: 4 users, ${totalRooms} rooms, 6 reviews`);
  console.log("  approved:", rooms.length + 1, "| pending: 3 | rejected: 1");
  console.log("\nLogin credentials (all users): password123");
  console.log("Admin:  admin@roombridge.com  — review queue has 3 pending listings");
  console.log("Host 1: rahul@roombridge.com  — 4 approved, 1 pending, 1 rejected");
  console.log("Host 2: priya@roombridge.com  — 4 approved, 1 pending");
  console.log("Guest:  guest@roombridge.com  — 1 approved, 1 pending, wrote 3 reviews");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
