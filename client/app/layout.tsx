import type { ReactNode } from "react";
import "../styles/globals.css";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "RoomBridge",
  description: "Find and book rooms effortlessly.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <div className="mx-auto grid max-w-6xl gap-6 p-4 lg:grid-cols-[220px_1fr]">
          <Sidebar />
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
