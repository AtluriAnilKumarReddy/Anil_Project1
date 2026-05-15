import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import DotGrid from '@/components/DotGrid';
import BookingModal from '@/components/BookingModal';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    if (labelRef.current) {
      tl.from(labelRef.current, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' });
    }

    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll('.hero-word');
      tl.from(words, {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.2');
    }

    if (subtitleRef.current) {
      tl.from(subtitleRef.current, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    }

    if (ctaRef.current) {
      tl.from(ctaRef.current, { opacity: 0, y: 20, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    }

    if (metaRef.current) {
      tl.from(metaRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    }

    return () => { tl.kill(); };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="home"
        className="min-h-screen flex flex-col lg:flex-row relative bg-warm-ivory"
      >
        {/* Text Content - Left */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-10 lg:px-[8vw] py-24 lg:py-0 z-10">
          <span ref={labelRef} className="section-label mb-4">
            SRI KAPOTHESWARA WOMEN&apos;S PG
          </span>
          <h1 ref={headingRef} className="heading-hero mb-6">
            <span className="hero-word inline-block">A</span>{' '}
            <span className="hero-word inline-block">Home</span>{' '}
            <span className="hero-word inline-block">Away</span>
            <br />
            <span className="hero-word inline-block">From</span>{' '}
            <span className="hero-word inline-block">Home</span>
          </h1>
          <p
            ref={subtitleRef}
            className="font-body text-lg font-light text-warm-brown max-w-[420px] leading-relaxed"
          >
            Safe &amp; comfortable living for working women and students in Kukatpally, Hyderabad.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setBookingOpen(true)}
              className="inline-flex items-center justify-center px-8 py-3 bg-deep-saffron text-warm-ivory font-display text-sm font-medium rounded-full hover:bg-amber-accent transition-all duration-300"
            >
              Book a Visit
            </button>
            <a
              href="tel:+919849937305"
              className="inline-flex items-center justify-center px-8 py-3 border border-deep-saffron text-deep-saffron font-display text-sm font-medium rounded-full hover:bg-deep-saffron hover:text-warm-ivory transition-all duration-300"
            >
              Call Now
            </a>
          </div>

          {/* Meta info */}
          <div ref={metaRef} className="mt-12 flex flex-wrap gap-8">
            <div>
              <p className="font-display text-3xl text-deep-saffron">1.5+</p>
              <p className="font-body text-xs text-warm-taupe uppercase tracking-wider mt-1">Years of Trust</p>
            </div>
            <div>
              <p className="font-display text-3xl text-deep-saffron">3</p>
              <p className="font-body text-xs text-warm-taupe uppercase tracking-wider mt-1">Properties</p>
            </div>
            <div>
              <p className="font-display text-3xl text-deep-saffron">2-5</p>
              <p className="font-body text-xs text-warm-taupe uppercase tracking-wider mt-1">Sharing Options</p>
            </div>
          </div>
        </div>

        {/* Dot Grid Canvas - Right */}
        <div className="hidden lg:block w-[45%] relative overflow-hidden" style={{ borderRadius: '40% 0 0 40%' }}>
          <DotGrid />
        </div>

        {/* Mobile: subtle gradient background */}
        <div
          className="lg:hidden absolute inset-0 opacity-15 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 50%, #FFF8F0 100%)' }}
        />
      </section>

      {/* Booking Modal */}
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
