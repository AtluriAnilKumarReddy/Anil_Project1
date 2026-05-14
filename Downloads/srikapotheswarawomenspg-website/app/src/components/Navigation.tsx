     1	import { useEffect, useRef, useState } from 'react';
     2	import gsap from 'gsap';
     3	
     4	const NAV_LINKS = [
     5	  { label: 'Home', href: '#home' },
     6	  { label: 'About', href: '#about' },
     7	  { label: 'Facilities', href: '#facilities' },
     8	  { label: 'Gallery', href: '#gallery' },
     9	  { label: 'Testimonials', href: '#testimonials' },
    10	  { label: 'Contact', href: '#contact' },
    11	  { label: 'Admin', href: '/admin' },
    12	];
    13	
    14	export default function Navigation() {
    15	  const navRef = useRef<HTMLElement>(null);
    16	  const [scrolled, setScrolled] = useState(false);
    17	  const [menuOpen, setMenuOpen] = useState(false);
    18	
    19	  useEffect(() => {
    20	    const handleScroll = () => {
    21	      const isScrolled = window.scrollY > 100;
    22	      if (isScrolled !== scrolled) {
    23	        setScrolled(isScrolled);
    24	        gsap.to(navRef.current, {
    25	          height: isScrolled ? 48 : 64,
    26	          backgroundColor: isScrolled ? 'rgba(255,248,240,0.98)' : 'rgba(255,248,240,0.9)',
    27	          duration: 0.2,
    28	          ease: 'power2.out',
    29	        });
    30	      }
    31	    };
    32	
    33	    window.addEventListener('scroll', handleScroll, { passive: true });
    34	    return () => window.removeEventListener('scroll', handleScroll);
    35	  }, [scrolled]);
    36	
    37	  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    38	    // For admin link, do normal navigation
    39	    if (href === '/admin') {
    40	      window.location.href = '/admin';
    41	      return;
    42	    }
    43	    e.preventDefault();
    44	    setMenuOpen(false);
    45	    const target = document.querySelector(href);
    46	    if (target) {
    47	      target.scrollIntoView({ behavior: 'smooth' });
    48	    }
    49	  };
    50	
    51	  return (
    52	    <>
    53	      <nav
    54	        ref={navRef}
    55	        className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 lg:px-12"
    56	        style={{
    57	          height: 64,
    58	          backgroundColor: 'rgba(255,248,240,0.9)',
    59	          backdropFilter: 'blur(10px)',
    60	          WebkitBackdropFilter: 'blur(10px)',