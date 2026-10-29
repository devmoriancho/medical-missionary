"use client";

import Link from "next/link";
import { AppLogo } from "@/components/AppLogo";
import { useCart } from "@/context/CartContext";

const NAVIGATION_LINKS = [
  { label: "Home", href: "/" },
  { label: "Remedies", href: "/categories/natural-remedies-powders" },
  { label: "Remedial Oils", href: "/categories/cold-pressed-remedial-oils" },
  { label: "Literature", href: "/categories/lifestyle-health-literature" },
];

export function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-12">
        <Link
          href="/"
          className="flex items-center gap-3 transition hover:opacity-90"
        >
          <AppLogo size={36} />
          <span className="text-lg font-black text-slate-900 tracking-tight hidden sm:block">
            Medical Missionary
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-600 hover:text-teal-700 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            title="Account Profile"
            className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            title="View Shopping Basket"
            className="relative rounded-xl bg-teal-50 p-2.5 text-teal-700 hover:bg-teal-100 transition cursor-pointer"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-black text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
