import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kuldeep Vaishnav - Senior Java Backend Developer",
  description:
    "Senior Java Backend Developer with 6+ years of experience building scalable microservices, payment systems, and enterprise applications. Expertise in Spring Boot, Microservices, MySQL, MongoDB, and Redis.",
  keywords: [
    "Java Developer",
    "Backend Developer",
    "Spring Boot",
    "Microservices",
    "Java",
    "MySQL",
    "MongoDB",
    "Redis",
    "Software Engineer",
  ],
  authors: [{ name: "Kuldeep Vaishnav" }],
  openGraph: {
    title: "Kuldeep Vaishnav - Senior Java Backend Developer",
    description:
      "Senior Java Backend Developer with 6+ years of experience building scalable microservices",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
