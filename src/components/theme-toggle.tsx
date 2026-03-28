"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";

const emptySubscribe = () => () => {};

// Add a brief CSS-transition burst on :root so all colors animate when the
// theme class flips. The class is removed after the transition completes.
function triggerThemeTransition() {
  const html = document.documentElement;
  html.classList.add("theme-transitioning");
  setTimeout(() => html.classList.remove("theme-transitioning"), 350);
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    // Prevent hydration mismatch — render placeholder with same dimensions.
    return <div className="h-9 w-9" aria-hidden />;
  }

  const nextTheme =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  const label =
    theme === "light"
      ? "Switch to dark mode"
      : theme === "dark"
        ? "Switch to system mode"
        : "Switch to light mode";

  const handleClick = () => {
    triggerThemeTransition();
    setTheme(nextTheme);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.88 }}
      className="nav-theme-toggle"
      aria-label={label}
      title={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" && (
          <motion.span
            key="light"
            initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
            transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </motion.span>
        )}
        {theme === "dark" && (
          <motion.span
            key="dark"
            initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
            transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </motion.span>
        )}
        {theme === "system" && (
          <motion.span
            key="system"
            initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
            transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
