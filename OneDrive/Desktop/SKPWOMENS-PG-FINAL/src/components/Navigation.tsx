import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
  { label: 'Admin', href: '/#/admin-login' },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
        gsap.to(navRef.current, {
          height: isScrolled ? 48 : 64,
          backgroundColor: isScrolled ? 'rgba(255,248,240,0.98)' : 'rgba(255,248,240,0.9)',
          duration: 0.2,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // For hash routes (admin), let Link handle it naturally
    if (href.startsWith('/#')) {
      return; // Don't prevent default, let HashRouter handle it
    }
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 lg:px-12"
        style={{
          height: 64,
          backgroundColor: 'rgba(255,248,240,0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="font-display text-base font-semibold text-deep-saffron tracking-tight"
        >
          SRI KAPOTHESWARA
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+919849937305"
            className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-deep-saffron hover:text-amber-accent transition-colors"
          >
            +91 98499 37305
          </a>
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden relative w-8 h-8 flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5 items-center">
            <span className={`block w-5 h-0.5 bg-warm-brown transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-warm-brown transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-warm-brown transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu overlay - completely separate from nav */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-warm-ivory z-[99] md:hidden flex flex-col pt-20 px-6"
          onClick={() => setMenuOpen(false)}
        >
          <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block py-3 px-4 rounded-lg font-body text-base uppercase tracking-[0.1em] text-warm-brown hover:text-deep-saffron hover:bg-deep-saffron/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-auto mb-8 pt-6 border-t border-warm-taupe/10" onClick={(e) => e.stopPropagation()}>
            <a href="tel:+919849937305" className="block py-2 font-body text-sm text-deep-saffron font-medium">
              +91 98499 37305
            </a>
            <a href="tel:+918367074254" className="block py-2 font-body text-sm text-deep-saffron font-medium">
              +91 83670 74254
            </a>
          </div>
        </div>
      )}
    </>
  );
}
