import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Vikrant Fitness | Elite Personal Coaching & 1-on-1 Transformation",
  description:
    "Science-backed personal coaching, tailored fat loss protocols, hypertrophy training, and 1-on-1 consultations with Trainer Vikrant.",
  keywords: [
    "Vikrant Fitness",
    "Personal Trainer",
    "Fitness Coaching",
    "Fat Loss",
    "Hypertrophy",
    "1-on-1 Consultation",
    "Online Transformation Coach",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-[#bef264] selection:text-zinc-950">
        <Providers>
          <Navbar />
          <SmoothScroll>
            <main className="flex-1">{children}</main>
            <Footer />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
