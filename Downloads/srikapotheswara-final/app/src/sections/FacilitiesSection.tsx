import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  WashingMachine, Camera, ArrowUp, UtensilsCrossed,
  Sparkles, Wifi, Bath, Droplets, Lock, ChefHat
} from 'lucide-react';
import SectionLabel from '@/components/SectionLabel';
import FacilityCard from '@/components/FacilityCard';

gsap.registerPlugin(ScrollTrigger);

const FACILITIES = [
  { icon: WashingMachine, title: 'Washing Machine', description: 'In-house laundry facilities with automatic washing machine for hassle-free living.' },
  { icon: Camera, title: 'CCTV Security', description: '24/7 surveillance cameras covering all areas for complete safety and peace of mind.' },
  { icon: ArrowUp, title: 'Lift', description: 'Elevator access to all floors for easy movement of luggage and daily convenience.' },
  { icon: UtensilsCrossed, title: 'Homely Food', description: 'Delicious and nutritious meals prepared with care, just like home. South Indian & North Indian options.' },
  { icon: Sparkles, title: 'Daily Room Cleaning', description: 'Regular housekeeping and daily cleaning to maintain a hygienic and tidy environment.' },
  { icon: Wifi, title: 'Wi-Fi', description: 'High-speed internet access for work, online classes, and staying connected with family.' },
  { icon: Bath, title: 'Attached Bathroom with Geyser', description: 'Clean, private washrooms attached to every room with hot water geyser facility.' },
  { icon: Droplets, title: 'Mineral Water', description: 'Safe and clean mineral water available for drinking and cooking purposes.' },
  { icon: Lock, title: 'Locker Bed with Foam Mattress', description: 'Every bed comes with a personal locker and comfortable foam mattress for quality sleep.' },
  { icon: ChefHat, title: 'Self Cooking Available', description: 'Kitchen facilities provided for residents who prefer to cook their own meals.' },
];

export default function FacilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current.children, {
          y: 40, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }
      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.from(cards, {
          y: 50, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="facilities" className="bg-dark-brown py-[120px] lg:py-[160px]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
        <div ref={headingRef} className="text-center mb-16">
          <SectionLabel text="WHAT WE OFFER" color="text-warm-taupe" />
          <h2 className="heading-display mt-4 text-amber-accent">
            <span className="block">Every Comfort</span>
            <span className="block">You Deserve</span>
          </h2>
          <p className="font-body text-base text-warm-ivory/60 mt-4 max-w-xl mx-auto">
            All our properties are equipped with modern amenities to ensure a comfortable and safe stay.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {FACILITIES.map((facility, index) => (
            <FacilityCard key={index} icon={facility.icon} title={facility.title} description={facility.description} />
          ))}
        </div>
      </div>
    </section>
  );
}
