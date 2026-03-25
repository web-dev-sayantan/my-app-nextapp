"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FiSearch, FiX } from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Expeditions", href: "/expeditions" },
  { name: "Trekkings", href: "/all" },
  { name: "Courses", href: "/courses" },
  { name: "Lessons", href: "/lessons" },
  { name: "FAQs", href: "/faq" },
  { name: "Contact Us", href: "/contact" },
];

function Hamburger({ hamburgerOpen }: { hamburgerOpen: boolean }) {
  return (
    <div className="w-8 h-8 flex flex-col justify-around flex-nowrap">
      <div
        className={`w-8 h-1 rounded-lg bg-white duration-500
                           ${hamburgerOpen ? "rotate-45 translate-y-[11px]" : "rotate-0"}`}
      ></div>
      <div
        className={`w-8 h-1 rounded-lg bg-white duration-500
                           ${hamburgerOpen ? "rotate-90 opacity-0 " : "opacity-100 "}`}
      ></div>
      <div
        className={`w-8 h-1 rounded-lg bg-white duration-500
                           ${hamburgerOpen ? "-rotate-45 -translate-y-[11px]" : "rotate-0"}`}
      ></div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleHamburger = () => {
    setHamburgerOpen((current) => !current);
  };

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", hamburgerOpen);

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [hamburgerOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 bg-black border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/TTM.png"
            alt="The Trail Makers Logo"
            width={60}
            height={60}
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 ml-8">
          <ul className="flex items-center gap-6">
            {navLinks.map(({ name, href }) => (
              <li key={href}>
                <Link
                  href={href || "/contact"}
                  className={`text-sm font-medium transition duration-300 ${
                    pathname === href
                      ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex items-center bg-gray-800 rounded-lg px-3 py-2 w-64 mx-4"
        >
          <input
            type="text"
            placeholder="Search treks, lessons, FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 text-white placeholder-gray-500 outline-hidden flex-1 text-sm"
          />
          <button
            type="submit"
            className="text-gray-400 hover:text-white transition"
          >
            <FiSearch className="w-4 h-4" />
          </button>
        </form>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {!session ? (
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
              <Link href="/dashboard">
                <button className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
                  Dashboard
                </button>
              </Link>
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                className="text-sm font-medium text-slate-300 hover:text-red-400 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger & Search */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="z-20 p-2 text-slate-300 hover:text-white transition"
          >
            {searchOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiSearch className="w-6 h-6" />
            )}
          </button>
          <button className="z-20 p-2" onClick={toggleHamburger}>
            <Hamburger hamburgerOpen={hamburgerOpen} />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
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
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Mobile Menu */}
      <nav
        className={`lg:hidden fixed h-screen w-full top-16 left-0 bg-black border-t border-slate-800
                            transition-all duration-300 overflow-y-auto
                            ${hamburgerOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <div className="p-6 flex flex-col gap-6">
          {/* Mobile Links */}
          <ul className="flex flex-col gap-4">
            {navLinks.map(({ name, href }) => (
              <li key={href}>
                <Link
                  href={href || "/contact"}
                  onClick={() => {
                    setHamburgerOpen(false);
                    setSearchOpen(false);
                  }}
                  className={`block text-lg font-medium transition duration-300 ${
                    pathname === href
                      ? "text-blue-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="w-full h-px bg-slate-700"></div>

          {/* Mobile Auth Buttons */}
          {!session ? (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => {
                  setHamburgerOpen(false);
                  setSearchOpen(false);
                }}
              >
                <button className="w-full text-center text-lg font-medium text-slate-300 hover:text-white transition py-2">
                  Login
                </button>
              </Link>
              <Link
                href="/signup"
                onClick={() => {
                  setHamburgerOpen(false);
                  setSearchOpen(false);
                }}
              >
                <button className="w-full text-center text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                onClick={() => {
                  setHamburgerOpen(false);
                  setSearchOpen(false);
                }}
              >
                <button className="w-full text-center text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition">
                  Dashboard
                </button>
              </Link>
              <button
                onClick={() => {
                  signOut({ redirect: true, callbackUrl: "/" });
                  toggleHamburger();
                }}
                className="w-full text-center text-lg font-medium text-red-400 hover:text-red-300 transition py-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
