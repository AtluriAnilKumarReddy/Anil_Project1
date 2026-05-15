import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

interface Quote {
  text: string;
  author: string;
}

const QUOTES: Quote[] = [
  {
    text: "Living here has been such a wonderful experience. The food reminds me of my mother's cooking, and I always feel safe. It's truly a home away from home.",
    author: "Priya S., Software Engineer",
  },
  {
    text: "I moved here for my studies and never felt alone. The owners are so caring, the rooms are always clean, and the location near JNTU is perfect for me.",
    author: "Ananya R., Student",
  },
  {
    text: "After staying at multiple PGs in Hyderabad, I can confidently say this is the best. The homely atmosphere, 24/7 security, and friendly environment make all the difference.",
    author: "Meera K., Working Professional",
  },
];

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const quoteRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLParagraphElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animateQuote = useCallback((index: number) => {
    const quoteEl = quoteRef.current;
    const authorEl = authorRef.current;
    if (!quoteEl || !authorEl) return;

    gsap.to(quoteEl, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      onComplete: () => {
        setActiveIndex(index);
        gsap.fromTo(
          quoteEl,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
        gsap.fromTo(
          authorEl,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 0.3, ease: 'power2.out' }
        );
      },
    });
    gsap.to(authorEl, { opacity: 0, duration: 0.3 });
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % QUOTES.length;
      animateQuote(nextIndex);
    }, 6000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeIndex, animateQuote]);

  const goToQuote = (index: number) => {
    if (index === activeIndex) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    animateQuote(index);
  };

  return (
    <div className="max-w-[800px] mx-auto text-center">
      <div ref={quoteRef} className="min-h-[160px] flex items-center justify-center">
        <p className="font-display text-[clamp(22px,3vw,32px)] font-normal italic text-warm-ivory/85 leading-[1.5]">
          &ldquo;{QUOTES[activeIndex].text}&rdquo;
        </p>
      </div>
      <p
        ref={authorRef}
        className="font-body text-[13px] font-medium text-amber-accent uppercase tracking-[0.1em] mt-8"
      >
        {QUOTES[activeIndex].author}
      </p>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-3 mt-8">
        {QUOTES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToQuote(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === activeIndex ? 'bg-amber-accent' : 'bg-warm-ivory/20 hover:bg-warm-ivory/40'
            }`}
            aria-label={`Go to quote ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
