import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { FaTwitter } from "react-icons/fa";
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with the ${siteConfig.name} team.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
      <p className="mt-3 text-gray-500">
        We&apos;d love to hear from you. Reach out via email or Twitter.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
            <Mail size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Email</p>
            <p className="text-sm text-gray-500">{siteConfig.contact.email}</p>
          </div>
        </a>

        <a
          href={siteConfig.links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="rounded-lg bg-sky-50 p-2.5 text-sky-600">
            <FaTwitter size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Twitter / X</p>
            <p className="text-sm text-gray-500">{siteConfig.twitter.handle}</p>
          </div>
        </a>
      </div>
    </div>
  );
}
