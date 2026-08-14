"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { PUBLIC_NAV_ITEMS } from "./nav-items";

export function PublicNav({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="border-b border-border/60 bg-cream-100/90 backdrop-blur">
      <div className="container-turaya flex h-16 items-center justify-between md:h-20">
        <Link
          href="/"
          className="group inline-flex items-center gap-3"
          aria-label={`${siteName} — Beranda`}
        >
          <span
            aria-hidden
            className="inline-block size-2 rotate-45 bg-terra-500 transition-transform duration-500 group-hover:rotate-[135deg]"
          />
          <span className="font-display text-heading-lg tracking-[0.02em] text-foreground">
            {siteName}
          </span>
        </Link>

        <nav aria-label="Utama" className="hidden items-center gap-8 lg:flex">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "overline relative text-muted-foreground transition-colors duration-[250ms] hover:text-terra-500 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-terra-500 after:transition-transform after:duration-[250ms] hover:after:scale-x-100",
                isActive(item.href) && "text-terra-500 after:scale-x-100",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="public-nav-menu"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          className="inline-flex size-10 items-center justify-center text-foreground lg:hidden"
        >
          <span className="relative block h-3.5 w-6">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300",
                menuOpen && "translate-y-[0.65rem] rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1/2 h-px w-6 -translate-y-1/2 bg-current transition-opacity duration-300",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300",
                menuOpen && "-translate-y-[0.65rem] -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            id="public-nav-menu"
            aria-label="Menu utama"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/60 bg-cream-100/95 backdrop-blur lg:hidden"
          >
            <ul className="container-turaya flex flex-col py-4">
              {PUBLIC_NAV_ITEMS.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between border-b border-border/40 py-4 text-heading-lg text-foreground",
                      isActive(item.href) && "text-terra-500",
                    )}
                  >
                    <span className="font-display">{item.label}</span>
                    <span className="overline text-caption text-roast-300">0{index + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
