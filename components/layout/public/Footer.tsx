import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { PUBLIC_NAV_ITEMS } from '@/config/dashboard-nav.config';

/**
 * Footer — public-facing footer. Server Component.
 */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-gray-900 w-fit"
              aria-label={`${siteConfig.name} home`}
            >
              <Building2 size={20} className="text-emerald-600" aria-hidden="true" />
              <span>{siteConfig.name}</span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-500 max-w-xs">
              {siteConfig.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Navigation
            </p>
            <ul className="flex flex-col gap-2" role="list">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors hover:text-emerald-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Contact
            </p>
            <ul className="flex flex-col gap-2 text-sm text-gray-600" role="list">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-emerald-600 transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Blockchain-powered real estate marketplace
          </p>
        </div>
      </div>
    </footer>
  );
}
