"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiSearch, FiX } from "react-icons/fi";
import NavbarLinks, { type NavbarLink } from "@/components/navbar-links";

type NavbarClientProps = {
  links: NavbarLink[];
  isAuthenticated: boolean;
  dashboardHref: string;
};

function Hamburger({ hamburgerOpen }: { hamburgerOpen: boolean }) {
  return (
    <div className="w-8 h-8 flex flex-col justify-around flex-nowrap">
      <div
        className={`w-8 h-1 rounded-lg bg-white duration-500 ${
          hamburgerOpen ? "rotate-45 translate-y-2.75" : "rotate-0"
        }`}
      ></div>
      <div
        className={`w-8 h-1 rounded-lg bg-white duration-500 ${
          hamburgerOpen ? "rotate-90 opacity-0" : "opacity-100"
        }`}
      ></div>
      <div
        className={`w-8 h-1 rounded-lg bg-white duration-500 ${
          hamburgerOpen ? "-rotate-45 -translate-y-2.75" : "rotate-0"
        }`}
      ></div>
    </div>
  );
}

export default function NavbarClient({
  links,
  isAuthenticated,
  dashboardHref,
}: NavbarClientProps) {
  const router = useRouter();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", hamburgerOpen);

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [hamburgerOpen]);

  const closeMenus = () => {
    setHamburgerOpen(false);
    setSearchOpen(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleSignOut = () => {
    void signOut({ redirect: true, callbackUrl: "/" });
    closeMenus();
  };

  return (
    <>
      <div className="hidden lg:flex items-center gap-8 flex-1 ml-8">
        <nav>
          <NavbarLinks links={links} />
        </nav>

        <form
          onSubmit={handleSearch}
          className="flex items-center bg-gray-800 rounded-lg px-3 py-2 w-64 mx-4"
        >
          <input
            type="text"
            placeholder="Search treks, lessons, FAQs..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="bg-gray-800 text-white placeholder-gray-500 outline-hidden flex-1 text-sm"
          />
          <button
            type="submit"
            className="text-gray-400 hover:text-white transition"
          >
            <FiSearch className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="hidden lg:flex items-center gap-4">
        {!isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm font-medium text-slate-300 hover:text-white transition">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href={dashboardHref}>
              <button className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
                Dashboard
              </button>
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-slate-300 hover:text-red-400 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="lg:hidden flex items-center gap-3">
        <button
          onClick={() => setSearchOpen((current) => !current)}
          className="z-20 p-2 text-slate-300 hover:text-white transition"
        >
          {searchOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiSearch className="w-6 h-6" />
          )}
        </button>
        <button
          className="z-20 p-2"
          onClick={() => setHamburgerOpen((current) => !current)}
        >
          <Hamburger hamburgerOpen={hamburgerOpen} />
        </button>
      </div>

      {searchOpen && (
        <div className="lg:hidden border-t border-slate-800 p-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-800 rounded-lg px-3 py-2"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              autoFocus
              className="bg-gray-800 text-white placeholder-gray-500 outline-hidden flex-1 text-sm"
            />
            <button
              type="submit"
              className="text-gray-400 hover:text-white transition"
            >
              <FiSearch className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <nav
        className={`lg:hidden fixed h-screen w-full top-16 left-0 bg-black border-t border-slate-800 transition-all duration-300 overflow-y-auto ${
          hamburgerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="p-6 flex flex-col gap-6">
          <NavbarLinks links={links} mobile onNavigate={closeMenus} />

          <div className="w-full h-px bg-slate-700"></div>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={closeMenus}>
                <button className="w-full text-center text-lg font-medium text-slate-300 hover:text-white transition py-2">
                  Login
                </button>
              </Link>
              <Link href="/signup" onClick={closeMenus}>
                <button className="w-full text-center text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href={dashboardHref} onClick={closeMenus}>
                <button className="w-full text-center text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">
                  Dashboard
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-center text-lg font-medium text-red-400 hover:text-red-300 transition py-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
