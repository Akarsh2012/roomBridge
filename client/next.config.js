/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn-icons-png.flaticon.com'], // 👈 Add allowed image hostnames here
  },

   images: {
    domains: [
      "cdn-icons-png.flaticon.com",
      "images.unsplash.com",
    ],
  },

};

module.exports = nextConfig;

