import Header from "@/app/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import Link from "next/link";
import GoogleAnalytics from "@/app/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Top Policy government Jobs in London",
  description:
    "Find top london jobs, including roles in long agencies, government affairs, and public policy. Apply today to top career opportunities!.",
  verification: {
    google: "IPQK9o-Ctj-mRI0LGd7JAXC9e1eSeMpA0J25py8xg7c",
  },
  icons: {
    icon: [
      { url: "/united-kingdom.png" },
    ],
    apple:
      { url: "/united-kingdom.png" },
    shortcut: [
      { url: "/united-kingdom.png" },
    ],
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
        {/* Google Analytics Integration */}
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        <footer className="container py-8 text-gray-500 border-t-2 mt-2 md:mt-4 lg:mt-8">
          <div className="flex md:flex-row flex-col justify-between md:items-center">
            <div>LobbyinLondon &copy; 2024 - All rights reserved</div>
            <nav className="flex flex-col underline mt-4 md:mt-0 gap-1">
              <Link href="/blog" className="hover:text-gray-700 transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="hover:text-gray-700 transition-colors">
                Contact
              </Link>
              <Link
                href="https://www.eujobs.co"
                className="hover:text-gray-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jobs In EU
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
