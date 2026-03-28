import Image from "next/image";
import Link from "next/link";
import NavbarClient from "@/components/navbar-client";
import { getAppSession } from "@/lib/auth-session";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Expeditions", href: "/expeditions" },
  { name: "Treks", href: "/all" },
  { name: "Courses", href: "/courses" },
  { name: "Lessons", href: "/lessons" },
  { name: "FAQs", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default async function Navbar() {
  const session = await getAppSession();
  const isAuthenticated = Boolean(session?.user);
  const dashboardHref =
    session?.user?.role === "ADMIN" ||
    session?.user?.role === "SUPER_ADMIN" ||
    session?.user?.role === "MODERATOR"
      ? "/admin"
      : "/dashboard";

  return (
    <header
      className="sticky top-0 left-0 right-0 z-sticky"
      style={
        {
          "--navbar-h": "72px",
          "--navbar-mobile-offset": "calc(var(--navbar-h) + 1.25rem)",
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="nav-fade-scrim pointer-events-none absolute inset-x-0 top-0 h-36 sm:h-40"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4">
        <div className="flex min-h-[var(--navbar-h)] items-start justify-between gap-4 sm:gap-5">
          <Link
            href="/"
            className="group flex h-14 shrink-0 items-center justify-center px-1.5"
            aria-label="The Trail Makers home"
          >
            <span className="relative block h-[60px] w-[60px]">
              <Image
                src="/TTM_Dark.png"
                alt="The Trail Makers"
                width={60}
                height={60}
                className="transition-transform duration-200 group-hover:scale-[1.04] dark:hidden"
                priority
              />
              <Image
                src="/TTM.png"
                alt="The Trail Makers"
                aria-hidden="true"
                width={60}
                height={60}
                className="absolute inset-0 hidden transition-transform duration-200 group-hover:scale-[1.04] dark:block"
                priority
              />
            </span>
          </Link>

          <NavbarClient
            links={navLinks}
            isAuthenticated={isAuthenticated}
            dashboardHref={dashboardHref}
          />
        </div>
      </div>
    </header>
  );
}
