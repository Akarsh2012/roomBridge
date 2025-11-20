import type { ReactNode } from "react";
import "../styles/globals.css";
// import Navbar from "../components/layout/Navbar";
// import Sidebar from "../components/layout/Sidebar";
import FooterGuard from "@/app/components/layout/FooterGuard";

export const metadata = {
  title: "RoomBridge",
  description: "Find and book rooms effortlessly.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {children}
        <FooterGuard />
      </body>
    </html>
  );
}
