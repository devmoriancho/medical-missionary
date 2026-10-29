"use client";

import Link from "next/link";
import { MissionLogo } from "@/components/icons/logo";

export function HeroSection() {
  return (
    <section className="w-full overflow-hidden border-b border-slate-100 bg-white px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-14 md:flex-row md:gap-16">
        <div className="flex flex-1 flex-col items-start text-left">
          <span className="inline-flex items-center rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
            Natural wellness and healthy living
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Natural Health and Lifestyle Reformation
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
            Explore botanical preparations, cold-pressed oils, and health
            literature inspired by the eight laws of health. Discover resources
            that support a thoughtful, natural approach to everyday living.
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/products"
              className="inline-flex w-full items-center justify-center rounded-xl bg-teal-700 px-7 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 sm:w-auto"
            >
              Browse Products
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>

            <Link
              href="/about"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 sm:w-auto"
            >
              About Our Mission
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Botanical products, health resources, and educational literature.
          </p>
        </div>

        <div className="flex w-full flex-1 items-center justify-center md:justify-end">
          <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-8 shadow-sm sm:p-12">
            <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-teal-100/70 blur-2xl" />
            <div className="absolute bottom-8 right-8 h-24 w-24 rounded-full bg-emerald-100/70 blur-2xl" />

            <div className="relative rounded-3xl border border-white bg-white/80 p-8 shadow-sm sm:p-10">
              <MissionLogo size={140} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
