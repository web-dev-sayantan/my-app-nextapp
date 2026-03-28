"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

export type NavbarLink = {
  name: string;
  href: string;
};

type NavbarLinksProps = {
  links: NavbarLink[];
  mobile?: boolean;
  onNavigate?: () => void;
};

const SPRING = { type: "spring", bounce: 0, duration: 0.5 } as const;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export default function NavbarLinks({
  links,
  mobile = false,
  onNavigate,
}: NavbarLinksProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const mobileListVariants = shouldReduceMotion
    ? {
        hidden: {},
        visible: {},
      }
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.045,
            delayChildren: 0.03,
          },
        },
      };

  const mobileItemVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: -12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.28,
            ease: EASE_OUT_EXPO,
          },
        },
      };

  if (mobile) {
    return (
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={mobileListVariants}
        className="flex flex-col gap-2"
      >
        {links.map(({ name, href }) => {
          const isActive = pathname === href;
          return (
            <motion.li
              key={href}
              variants={mobileItemVariants}
              className="relative"
            >
              {isActive && (
                <motion.span
                  layoutId="navbar-mobile-active"
                  className="nav-mobile-link-active-pill"
                  transition={SPRING}
                />
              )}
              <Link
                href={href}
                onClick={onNavigate}
                className={`nav-mobile-link ${
                  isActive ? "text-foreground" : "nav-mobile-link-muted"
                }`}
              >
                {name}
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    );
  }

  return (
    <ul className="flex items-center gap-1.5">
      {links.map(({ name, href }) => {
        const isActive = pathname === href;
        return (
          <li key={href} className="relative">
            {isActive && (
              <motion.span
                layoutId="navbar-desktop-active"
                className="nav-desktop-link-active-pill"
                transition={SPRING}
              />
            )}
            <Link
              href={href}
              onClick={onNavigate}
              className={`nav-desktop-link ${
                isActive ? "text-background" : "nav-desktop-link-muted"
              }`}
            >
              {name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
