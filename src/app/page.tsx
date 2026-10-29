import { HeroSection } from "@/components/homepage/HeroSection";
import { RemediesHighlight } from "@/components/homepage/RemediesHighlight";
import { OilsHighlight } from "@/components/homepage/OilsHighlight";
import { LiteratureHighlight } from "@/components/homepage/LiteratureHighlight";
import Link from "next/link";

const LANDING_HIGHLIGHTS = [
  {
    title: "About",
    description: "Learn about our mission to make natural wellness accessible across Kenya.",
    href: "/about",
  },
  {
    title: "Services",
    description: "Explore wellness products, health education, and Kenya-wide delivery.",
    href: "/services",
  },
  {
    title: "Products",
    description: "Browse our database-powered catalogue of remedies, oils, and literature.",
    href: "/products",
  },
  {
    title: "Contact",
    description: "Get support with products, orders, and delivery.",
    href: "/contact",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <HeroSection />
      <section className="grid gap-5 bg-white px-6 py-12 sm:grid-cols-2 md:px-12 lg:grid-cols-4">
        {LANDING_HIGHLIGHTS.map((highlight) => (
          <Link
            key={highlight.href}
            href={highlight.href}
            className="rounded-2xl border border-slate-100 p-6 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-sm"
          >
            <h2 className="text-lg font-black text-slate-900">{highlight.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {highlight.description}
            </p>
            <span className="mt-4 inline-block text-sm font-bold text-teal-700">
              Learn more →
            </span>
          </Link>
        ))}
      </section>
      <RemediesHighlight />
      <OilsHighlight />
      <LiteratureHighlight />
    </main>
  );
}
