import Link from "next/link";
import { siteConfig } from "@/config/site";
import { footerLinks } from "@/config/navigation";

// lucide-react no longer ships brand/logo icons (trademark reasons),
// so social icons are small hand-rolled SVGs kept to the same 18px/2px style.
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M15 8h-2a2 2 0 0 0-2 2v10M9 13h6M18 2H6a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4Z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M2.5 8.5a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4h-11a4 4 0 0 1-4-4Z" />
      <path d="m10 9 5 3-5 3Z" />
    </svg>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <Link href={link.href} className="text-sm text-neutral-300 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container-nova grid grid-cols-2 gap-x-8 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <span className="text-2xl font-bold tracking-tight text-white">
            {siteConfig.logo.text}
          </span>
          <p className="mt-3 max-w-xs text-sm text-neutral-400">{siteConfig.description}</p>
          <div className="mt-5 flex items-center gap-4">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-neutral-400 hover:text-white"
            >
              <InstagramIcon width={18} height={18} />
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-neutral-400 hover:text-white"
            >
              <FacebookIcon width={18} height={18} />
            </a>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="text-neutral-400 hover:text-white"
            >
              <YoutubeIcon width={18} height={18} />
            </a>
          </div>
        </div>

        <FooterColumn title="Shop" links={footerLinks.shop} />
        <FooterColumn title="Customer Service" links={footerLinks.customerService} />
        <FooterColumn title="Account" links={footerLinks.account} />

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Contact
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-neutral-300">
            <li>{siteConfig.contact.email}</li>
            <li className="text-neutral-400">{siteConfig.contact.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="container-nova flex flex-col items-center justify-between gap-3 py-6 text-xs text-neutral-500 sm:flex-row">
          <p>
            &copy; {year} {siteConfig.logo.text}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {footerLinks.legal.map((link) => (
              <Link key={`${link.label}-${link.href}`} href={link.href} className="hover:text-neutral-300">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
