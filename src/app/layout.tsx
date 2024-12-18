import type { Metadata } from "next";
import localFont from "next/font/local";
import UserSidebar from "@/component/navbar/Navbaruser";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agoda",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-[family-name:var(--font-geist-sans)]">
        <div className="w-full min-h-screen bg-gradient-to-r bg">
          <div className="flex">
            <UserSidebar />
          </div>
          <div className="min-h-[calc(100vh)] flex items-center justify-center">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
