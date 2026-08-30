import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/lib/language-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Crop | Farm Intelligence Platform",
  description: "AI-Powered Farm Intelligence, Crop Advisory, Mandi Prices and Financial Support.",
};

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_YXNzdXJlZC1hbGllbi01OTgxLmNsZXJrLmFjY291bnRzLmRldiQ";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ClerkProvider publishableKey={publishableKey}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
