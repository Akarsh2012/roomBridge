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
      role: "ADMIN",
      bio: "Platform administrator",
    },
  });

  const host1 = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@roombridge.com",
      password,
      bio: "Property owner in Mumbai with 5 years of hosting experience",
      phone: "+91-9876543210",
    },
  });

  const host2 = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya@roombridge.com",
      password,
      bio: "Superhost managing premium properties across Goa",
      phone: "+91-9876543211",
    },
  });

  const guest = await prisma.user.create({
    data: {
      name: "Akarsh Guest",
      email: "guest@roombridge.com",
      password,
      bio: "Love traveling and exploring new places",
    },
  });

  // Create rooms
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
        hostId: host2.id,
      },
    }),
  ]);

  console.log("Seed complete!");
  console.log(`Created: ${1} admin, ${2} hosts, ${1} guest, ${rooms.length} rooms`);
  console.log("\nLogin credentials (all users): password123");
  console.log("Admin:  admin@roombridge.com");
  console.log("Host 1: rahul@roombridge.com");
  console.log("Host 2: priya@roombridge.com");
  console.log("Guest:  guest@roombridge.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
