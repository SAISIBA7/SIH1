import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Crop | Agriculture Intelligence",
  description: "AI-Powered Agriculture Officer Dashboard, Crop Intelligence and Farmer Support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-full flex flex-col antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
