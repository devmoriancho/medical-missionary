import Link from "next/link";
import { AppLogo } from "../AppLogo";

const HEALTH_PRINCIPLES_LINKS = [
  { label: "8 Laws of Health", href: "/laws-of-health" },
  {
    label: "Natural Remedies Guide",
    href: "/categories/natural-remedies-powders",
  },
  {
    label: "Historical Literature",
    href: "/categories/lifestyle-health-literature",
  },
];

const MINISTRY_RECORDS_LINKS = [
  { label: "About Our Landmarks", href: "/about" },
  { label: "Contact Messenger", href: "/contact" },
];

export function Footer() {
  const currentCalendarYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-100 bg-white py-12 px-6 md:px-12 mt-auto">
      <div className="mx-auto max-w-7xl grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 transition hover:opacity-90"
          >
            <AppLogo size={32} />
            <span className="text-base font-black text-slate-900 tracking-tight">
              Medical Missionary
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-500 max-w-xs">
            Upholding historical health reform and natural botanical preparation
            records aligned with strict structural principles.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Remedial Pathways
          </h4>
          <ul className="space-y-2.5">
            {HEALTH_PRINCIPLES_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Documentation
          </h4>
          <ul className="space-y-2.5">
            {MINISTRY_RECORDS_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Mission Standards
          </h4>
          <p className="text-xs leading-relaxed text-slate-500">
            Platform operating under server-isolated database transactions to
            ensure completely accurate ledger allocations for believers.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-slate-50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] font-medium text-slate-400">
          &copy; {currentCalendarYear} Medical Missionary Store. All historical
          landmark rights reserved.
        </p>
        <p className="text-[11px] font-bold text-teal-700 tracking-wide bg-teal-50 px-2.5 py-1 rounded-md">
          Pure Human Logic Engine
        </p>
      </div>
    </footer>
  );
}
