import type { ReactNode } from "react";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import FooterGuard from "@/app/components/layout/FooterGuard";
import { AuthProvider } from "@/context/AuthContext";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "RoomBridge — Stay somewhere extraordinary",
  description:
    "Curated stays, verified hosts, and effortless booking across India. Find your next room on RoomBridge.",
};

// Runs before first paint to avoid a theme flash. Defaults to light
// ("Warm Editorial Luxe"); honors a saved choice in localStorage.
const themeBootstrap = `(function(){try{var t=localStorage.getItem('rb-theme');if(t!=='light'&&t!=='dark')t='light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-screen bg-ink text-paper antialiased">
        <AuthProvider>
          {children}
          <FooterGuard />
        </AuthProvider>
        {/* Film grain — sits above everything, ignores pointer events */}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
