import Link from 'next/link';

const footerLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export default function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm text-foreground/70 transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
          <Link href="/host" className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
            Become a Vendor/Host
          </Link>
        </div>
        <p className="mt-8 text-center text-sm text-foreground/60">
          © {new Date().getFullYear()} Made in Haiphong. All rights reserved.
        </p>
      </div>
    </footer>
  );
}