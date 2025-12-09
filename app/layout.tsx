import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { BrandProvider } from "@/lib/context/BrandContext";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Business Builder - From Idea to Digital Presence",
  description:
    "Transform your business idea into reality. Create your brand identity, claim social handles, and launch your website - all in one place. No technical skills required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <BrandProvider>
            <Header />
            {children}
            <Footer />
            <Toaster position="top-right" />
          </BrandProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
