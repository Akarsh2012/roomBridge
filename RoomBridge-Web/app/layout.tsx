import type { ReactNode } from "react";
import "../styles/globals.css";
import FooterGuard from "@/app/components/layout/FooterGuard";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "RoomBridge",
  description: "Find and book rooms effortlessly.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider>
          {children}
          <FooterGuard />
        </AuthProvider>
      </body>
    </html>
  );
}
