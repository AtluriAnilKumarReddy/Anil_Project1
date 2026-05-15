import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '@/components/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll('.about-line');
        gsap.from(lines, {
          y: 60,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Body text animation
      if (bodyRef.current) {
        gsap.from(bodyRef.current.children, {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bodyRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Image animation
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          x: 80,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          delay: 0.2,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-warm-ivory py-[120px] lg:py-[160px]"
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text - 45% */}
          <div className="w-full lg:w-[45%]">
            <SectionLabel text="ABOUT US" />
            <h2 ref={headingRef} className="heading-display mt-4 mb-8">
              <span className="about-line block">Safe &amp; Trusted</span>
              <span className="about-line block">Living Since 2023</span>
            </h2>
            <div ref={bodyRef}>
              <p className="font-body text-base font-light text-warm-brown leading-[1.7]">
                We <strong className="font-medium">SRI KAPOTHESWARA WOMEN&apos;s PG</strong> have been providing safe and comfortable accommodation for working women and students in the heart of Kukatpally, Hyderabad for over 1.5 years. With three properties, we are one of the most trusted names in women&apos;s hostel accommodation in the area. Offering daily and monthly plans at affordable charges, with 2 sharing, 3 sharing, 4 sharing, and 5 sharing options, we ensure every resident finds the perfect home.
              </p>
              <p className="font-body text-base font-light text-warm-brown leading-[1.7] mt-5">
                Located in Kukatpally Housing Board Colony, Dharma Reddy Colony Phase I, near Malabar Gold and JNTU Kukatpally, all our properties provide a secure environment with round-the-clock CCTV surveillance, attentive housekeeping, and nutritious homely meals — everything a young woman needs to focus on her career or studies without worry.
              </p>
            </div>
          </div>

          {/* Image - 55% */}
          <div className="w-full lg:w-[55%]" ref={imageRef}>
            <div className="relative">
              <img
                src="/assets/about-interior.jpg"
                alt="Interior of SRI KAPOTHESWARA DELUXE WOMEN'S PG common room"
                className="w-full rounded-2xl object-cover aspect-[4/3]"
                loading="lazy"
              />
              <div
                className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl -z-10"
                style={{ background: 'rgba(141, 110, 99, 0.15)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
