import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Providers from "@/app/providers";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thetrailmakers.in";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "The Trail Makers - Explore new routes in the Himalayas",
  description:
    "Join for unforgettable journeys with The Trail Makers, your ultimate destination for immersive trekking and hiking experiences. Discover breathtaking landscapes, explore challenging trails, and forge lasting memories in the great outdoors.",
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
