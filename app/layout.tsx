import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/lib/language-context";

export const metadata: Metadata = {
  title: "Smart Crop | Farm Intelligence Platform",
  description: "AI-Powered Farm Intelligence, Crop Advisory, Mandi Prices and Financial Support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="h-full antialiased"
        suppressHydrationWarning
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                function googleTranslateElementInit() {
                  new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,or,bn,te,ta,mr,gu,pa,kn,ml,as,ur,ne,sa,mai,sd,ks,kok,mni,brx,doi,sat',
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              `,
            }}
          />
          <script
            type="text/javascript"
            src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            async
          />
        </head>
        <body className="min-h-full flex flex-col font-sans">
          <div id="google_translate_element" style={{ display: 'none' }} />
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
