import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NavbarClient from "@/components/navbar-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Expeditions", href: "/expeditions" },
  { name: "Trekkings", href: "/all" },
  { name: "Courses", href: "/courses" },
  { name: "Lessons", href: "/lessons" },
  { name: "FAQs", href: "/faq" },
  { name: "Contact Us", href: "/contact" },
];

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = Boolean(session?.user);
  const dashboardHref =
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "SUPER_ADMIN" ||
    session?.user?.role === "MODERATOR"
      ? "/admin"
      : "/dashboard";

  return (
    <header className="sticky top-0 left-0 right-0 bg-black border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <Image
            src="/TTM.png"
            alt="The Trail Makers Logo"
            width={60}
            height={60}
          />
        </Link>

        <NavbarClient
          links={navLinks}
          isAuthenticated={isAuthenticated}
          dashboardHref={dashboardHref}
        />
      </div>
    </header>
  );
}
