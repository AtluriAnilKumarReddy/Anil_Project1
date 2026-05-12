const FOOTER_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-brown py-10 px-6 sm:px-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-body text-xs font-medium text-amber-accent uppercase tracking-wider">
            SRI KAPOTHESWARA PG
          </span>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-body text-xs font-light text-warm-ivory/50 hover:text-amber-accent transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <span className="font-body text-[11px] font-light text-warm-ivory/35">
            &copy; 2025 All rights reserved.
          </span>
        </div>

        <p className="font-display text-[13px] italic text-warm-ivory/25 text-center mt-4">
          Designed with care for the women who call this home.
        </p>
      </div>
    </footer>
  );
}
