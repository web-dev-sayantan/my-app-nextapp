"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch, FiX, FiMenu } from "react-icons/fi";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import NavbarLinks, { type NavbarLink } from "@/components/navbar-links";
import { signOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";

// Shared easing constants matching the project's motion tokens
const EASE_OUT = [0.25, 1, 0.5, 1] as const;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// Motion-enhanced Next.js Link — preserves all Link props + adds whileTap etc.
const MotionLink = motion.create(Link);

type NavbarClientProps = {
  links: NavbarLink[];
  isAuthenticated: boolean;
  dashboardHref: string;
};

export default function NavbarClient({
  links,
  isAuthenticated,
  dashboardHref,
}: NavbarClientProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { duration: 0.2, ease: EASE_OUT };

  const mobileSheetTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { duration: 0.28, ease: EASE_OUT_EXPO };

  const actionGroupVariants = shouldReduceMotion
    ? {
        hidden: {},
        visible: {},
      }
    : {
        hidden: {},
        visible: {
          transition: {
            delayChildren: 0.14,
            staggerChildren: 0.05,
          },
        },
      };

  const actionItemVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: -10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.24,
            ease: EASE_OUT_EXPO,
          },
        },
      };

  const closeMobile = () => {
    setMobileOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobile();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const toggleSearch = () => {
    setSearchOpen((open) => {
      const next = !open;
      if (next) {
        setMobileOpen(false);
      }
      return next;
    });
  };

  const toggleMobile = () => {
    setMobileOpen((open) => {
      const next = !open;
      if (next) {
        setSearchOpen(false);
      }
      return next;
    });
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
    closeMobile();
  };

  return (
    <div className="relative flex flex-1 items-start justify-end">
      <div className="hidden lg:flex min-w-0 flex-1 items-center justify-end gap-3 xl:gap-4">
        <div className="nav-floating-pill nav-desktop-pill-height flex min-w-0 items-center px-2.5">
          <NavbarLinks links={links} />
        </div>

        <div className="nav-floating-pill nav-desktop-pill-height flex items-center gap-1 p-1.5">
          <motion.button
            onClick={toggleSearch}
            whileTap={{ scale: 0.88 }}
            aria-label="Toggle search"
            className="nav-icon-button"
          >
            <AnimatePresence mode="wait" initial={false}>
              {searchOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  transition={{ duration: 0.15, ease: EASE_OUT }}
                >
                  <FiX className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="search"
                  initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  transition={{ duration: 0.15, ease: EASE_OUT }}
                >
                  <FiSearch className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <ThemeToggle />
        </div>

        {!isAuthenticated ? (
          <div className="nav-floating-pill nav-desktop-pill-height flex items-center gap-1 p-1.5 pl-2">
            <MotionLink
              href="/login"
              whileTap={{ scale: 0.96 }}
              className="nav-secondary-action"
            >
              Login
            </MotionLink>
            <MotionLink
              href="/signup"
              whileTap={{ scale: 0.97 }}
              className="nav-primary-action"
            >
              Get Started
            </MotionLink>
          </div>
        ) : (
          <div className="nav-floating-pill nav-desktop-pill-height flex items-center gap-1 p-1.5 pl-2">
            <MotionLink
              href={dashboardHref}
              whileTap={{ scale: 0.97 }}
              className="nav-primary-action"
            >
              Dashboard
            </MotionLink>
            <motion.button
              onClick={handleSignOut}
              whileTap={{ scale: 0.96 }}
              className="nav-secondary-action"
            >
              Logout
            </motion.button>
          </div>
        )}
      </div>

      {/* ── Desktop search expand ──────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="desktop-search"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="absolute right-0 top-[calc(100%+0.8rem)] hidden w-[min(28rem,calc(100vw-3rem))] lg:block"
          >
            <form
              onSubmit={handleSearch}
              className="nav-floating-pill flex items-center gap-3 rounded-[1.7rem] px-4 py-3"
            >
              <FiSearch className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search treks, lessons, FAQs…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    key="clear"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.12, ease: EASE_OUT }}
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile controls ────────────────────────────────── */}
      <div className="nav-floating-pill lg:hidden flex items-center gap-1 p-1.5">
        <motion.button
          onClick={toggleSearch}
          whileTap={{ scale: 0.88 }}
          aria-label="Toggle search"
          aria-expanded={searchOpen}
          aria-controls="mobile-search-panel"
          className="nav-icon-button"
        >
          <AnimatePresence mode="wait" initial={false}>
            {searchOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
              >
                <FiX className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="search"
                initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
              >
                <FiSearch className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <ThemeToggle />
        <motion.button
          onClick={toggleMobile}
          whileTap={{ scale: 0.88 }}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation-sheet"
          className="nav-icon-button"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
              >
                <FiX className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
              >
                <FiMenu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Mobile search bar ──────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="mobile-search"
            id="mobile-search-panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={searchTransition}
            className="fixed inset-x-0 top-[var(--navbar-mobile-offset)] lg:hidden"
            style={{ zIndex: "var(--z-raised)" }}
          >
            <form
              onSubmit={handleSearch}
              className="nav-floating-pill flex items-center gap-3 rounded-[1.6rem] px-4 py-3.5 shadow-[0_28px_60px_-38px_color-mix(in_oklab,var(--foreground)_35%,transparent)]"
            >
              <FiSearch className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ──────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              key="mobile-drawer-backdrop"
              type="button"
              aria-label="Close menu"
              onClick={closeMobile}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={mobileSheetTransition}
              className="fixed inset-0 bg-[color-mix(in_oklab,var(--background)_54%,transparent)] backdrop-blur-[2px] lg:hidden"
              style={{ zIndex: "var(--z-base)" }}
            />

            <div
              className="fixed inset-x-0 top-[var(--navbar-mobile-offset)] lg:hidden"
              style={{ zIndex: "var(--z-raised)" }}
            >
              <motion.aside
                key="mobile-drawer"
                id="mobile-navigation-sheet"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={mobileSheetTransition}
                className="nav-mobile-sheet mx-auto w-full max-w-[32rem] overflow-hidden"
              >
                <div className="flex max-h-[calc(100dvh-var(--navbar-mobile-offset)-1rem)] flex-col overflow-y-auto px-4 pb-4 pt-3">
                  <NavbarLinks links={links} mobile onNavigate={closeMobile} />

                  <div className="my-4 h-px bg-foreground/8" />

                  {!isAuthenticated ? (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={actionGroupVariants}
                      className="flex flex-col gap-2.5"
                    >
                      <motion.div variants={actionItemVariants}>
                        <MotionLink
                          href="/login"
                          onClick={closeMobile}
                          whileTap={{ scale: 0.985 }}
                          className="nav-mobile-secondary-action"
                        >
                          Login
                        </MotionLink>
                      </motion.div>
                      <motion.div variants={actionItemVariants}>
                        <MotionLink
                          href="/signup"
                          onClick={closeMobile}
                          whileTap={{ scale: 0.985 }}
                          className="nav-mobile-primary-action"
                        >
                          Get Started
                        </MotionLink>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={actionGroupVariants}
                      className="flex flex-col gap-2.5"
                    >
                      <motion.div variants={actionItemVariants}>
                        <MotionLink
                          href={dashboardHref}
                          onClick={closeMobile}
                          whileTap={{ scale: 0.985 }}
                          className="nav-mobile-primary-action"
                        >
                          Dashboard
                        </MotionLink>
                      </motion.div>
                      <motion.div variants={actionItemVariants}>
                        <motion.button
                          onClick={handleSignOut}
                          whileTap={{ scale: 0.985 }}
                          className="nav-mobile-danger-action"
                        >
                          Logout
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.aside>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
