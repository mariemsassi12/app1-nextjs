import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WebVitals } from "./components/web-vitals";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Next.js + PostgreSQL Full-Stack App",
  description: "A production-ready Next.js + PostgreSQL application with serverless APIs, Edge Functions, and advanced monitoring",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Enable Web Vitals monitoring */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
