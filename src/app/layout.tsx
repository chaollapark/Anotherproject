import Header from "@/app/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { PostHogProvider } from "@/app/providers/PostHogProvider";
import Link from "next/link";
import GoogleAnalytics from "@/app/components/GoogleAnalytics";
import LogoScroller from "@/app/components/layout/LogoScroller";
import FloatingSignup from "@/app/components/FloatingSignup";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.eujobs.co'),

  title: "Top EU Jobs in Brussels | EU Agencies, Government, & Policy Roles",
  description:
    "All EU policy jobs in one place—Brussels, EU agencies, government affairs, and public policy roles.",
  verification: {
    google: "IPQK9o-Ctj-mRI0LGd7JAXC9e1eSeMpA0J25py8xg7c",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="google-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted'
          });
        `}
      </Script>
        {/* Google Analytics Integration */}
        <GoogleAnalytics />
      </head>
      <PostHogProvider>
        <body className={inter.className}>
          <Header />
          <div className="relative border border-gray-200 rounded-md bg-gray-50">
            <LogoScroller />
          </div>
          {children}
          {/* Floating Email Signup */}
          <FloatingSignup />
          
          <footer className="container py-8 text-gray-500 border-t-2 mt-2 md:mt-4 lg:mt-8">
            <div className="flex md:flex-row flex-col justify-between md:items-center">
              <div>EUjobs.co &copy; 2024 - All rights reserved</div>
              <nav className="flex flex-col underline mt-4 md:mt-0 gap-1">
                <Link href="/blog" className="hover:text-gray-700 transition-colors">
                  EUjobs Blog
                </Link>
                <Link href="/fairpay" className="hover:text-gray-700 transition-colors">
                  EUjobs Fair Pay Calculator
                </Link>
                <Link href="/contact" className="hover:text-gray-700 transition-colors">
                  EUjobs Contact
                </Link>
                <Link href="/scholarship" className="hover:text-gray-700 transition-colors">
                  EUjobs Scholarship
                </Link>
              </nav>
            </div>
          </footer>
        </body>
      </PostHogProvider>
    </html>
  );
}
