import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import SectionLabel from '@/components/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

interface Review {
  name: string;
  role: string;
  pg: string;
  rating: number;
  text: string;
}

const REVIEWS: Review[] = [
  // DELUXE PG Reviews
  {
    name: 'Priya S.',
    role: 'Software Engineer',
    pg: 'Deluxe',
    rating: 5,
    text: 'Living at Deluxe PG has been wonderful. The food reminds me of my mother\'s cooking, and I always feel safe with 24/7 CCTV. The locker beds with foam mattresses are so comfortable. Truly a home away from home!',
  },
  {
    name: 'Ananya R.',
    role: 'Student, JNTU',
    pg: 'Deluxe',
    rating: 5,
    text: 'I moved here for my studies and never felt alone. The owners are so caring, rooms are always clean with daily cleaning, and the location near JNTU is perfect. Attached bathrooms with geysers are a lifesaver in winters!',
  },
  {
    name: 'Meera K.',
    role: 'Working Professional',
    pg: 'Deluxe',
    rating: 5,
    text: 'After staying at multiple PGs in Hyderabad, I can confidently say Deluxe is the best. The homely atmosphere, lift facility, self-cooking option, and friendly environment make all the difference. Highly recommended!',
  },
  {
    name: 'Sneha T.',
    role: 'Student',
    pg: 'Deluxe',
    rating: 4,
    text: 'Great PG with all facilities. Wi-Fi is fast, washing machine saves so much time, and mineral water is always available. The signboard outside made it easy to find. Very happy with my stay here.',
  },
  {
    name: 'Lakshmi P.',
    role: 'IT Employee',
    pg: 'Deluxe',
    rating: 5,
    text: 'The best part about Deluxe PG is the hygiene and food quality. Daily room cleaning keeps everything spotless. The 3-sharing room is spacious with good storage. Owners are very responsive to any issues.',
  },
  {
    name: 'Divya M.',
    role: 'Student',
    pg: 'Deluxe',
    rating: 5,
    text: 'I love that they provide self-cooking facilities! The kitchen is well-maintained. The common area is great for eating and chatting with other residents. Lift makes carrying groceries so easy. Love it here!',
  },
  // EXECUTIVE PG Reviews
  {
    name: 'Kavya N.',
    role: 'Software Developer',
    pg: 'Executive',
    rating: 5,
    text: 'Executive PG is absolutely premium! The building looks beautiful at night with all the decorative lights. Rooms are well-furnished with modern interiors. The location behind Malabar Gold is very safe and convenient.',
  },
  {
    name: 'Harini B.',
    role: 'Student',
    pg: 'Executive',
    rating: 5,
    text: 'Moved to Executive PG last month and I\'m loving it. The room is spacious, storage shelves are very useful, and the common TV area is perfect for relaxing. Staff is very cooperative and friendly.',
  },
  {
    name: 'Roshni V.',
    role: 'Working Professional',
    pg: 'Executive',
    rating: 5,
    text: 'Executive PG exceeded my expectations. The elegant lighting, marble stairs, and overall ambiance feel like a premium hotel. Food is delicious, Wi-Fi is uninterrupted, and CCTV security gives my parents peace of mind.',
  },
  {
    name: 'Swathi J.',
    role: 'Student, JNTU',
    pg: 'Executive',
    rating: 4,
    text: 'Great location near JNTU and tech companies. The 2-sharing room is very comfortable with attached bathroom and geyser. Lift access is convenient. Homely food is tasty and nutritious. Good value for money!',
  },
  {
    name: 'Pavani D.',
    role: 'Data Analyst',
    pg: 'Executive',
    rating: 5,
    text: 'The best decision I made was choosing Executive PG. Daily cleaning, washing machine, high-speed Wi-Fi, and the common area with TV - everything is thoughtfully provided. The building is beautiful and well-maintained.',
  },
  {
    name: 'Bhavani S.',
    role: 'Student',
    pg: 'Executive',
    rating: 5,
    text: 'I was looking for a safe and comfortable PG near Kukatpally and Executive PG checked all boxes. The owners are like family, always caring and attentive. The self-cooking kitchen is a bonus! Love staying here.',
  },
  // PREMIUM PG Reviews
  {
    name: 'Sindhu R.',
    role: 'Working Professional',
    pg: 'Premium',
    rating: 5,
    text: 'Premium PG lives up to its name! The rooms are spacious with comfortable beds and excellent storage. The location is perfect for working women near JNTU. Clean bathrooms with geysers and good food. Very satisfied!',
  },
];

const PG_FILTERS = ['All', 'Deluxe', 'Executive', 'Premium'];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(0);

  const filtered = filter === 'All' ? REVIEWS : REVIEWS.filter(r => r.pg === filter);
  const perPage = 3;
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageReviews = filtered.slice(page * perPage, (page + 1) * perPage);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current.children, {
          y: 40, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 30, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Reset page when filter changes
  useEffect(() => { setPage(0); }, [filter]);

  return (
    <section ref={sectionRef} id="testimonials" className="bg-dark-brown py-[120px] lg:py-[160px]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-6">
          <SectionLabel text="TESTIMONIALS" color="text-warm-taupe" />
          <h2 className="heading-display mt-4 text-amber-accent">
            <span className="block">What Our</span>
            <span className="block">Residents Say</span>
          </h2>
          <p className="font-body text-base text-warm-ivory/50 mt-4 max-w-xl mx-auto">
            Real reviews from our residents across all three properties.
          </p>
        </div>

        {/* PG Filter */}
        <div className="flex justify-center gap-2 mb-10">
          {PG_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full font-body text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-amber-accent text-dark-brown'
                  : 'text-warm-ivory/50 border border-warm-ivory/20 hover:text-warm-ivory hover:border-warm-ivory/40'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Review Count */}
        <p className="text-center font-body text-sm text-warm-ivory/30 mb-8">
          Showing {filtered.length} review{filtered.length !== 1 ? 's' : ''}
          {filter !== 'All' && ` for ${filter} PG`}
        </p>

        {/* Review Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pageReviews.map((review, idx) => (
            <div
              key={`${filter}-${page}-${idx}`}
              className="bg-warm-ivory/5 backdrop-blur-sm border border-warm-ivory/10 rounded-xl p-6 flex flex-col"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'text-amber-accent fill-amber-accent' : 'text-warm-ivory/20'}`}
                  />
                ))}
                <span className="ml-2 font-body text-xs text-warm-ivory/40">{review.pg} PG</span>
              </div>

              {/* Quote */}
              <div className="flex-1">
                <Quote className="w-6 h-6 text-amber-accent/30 mb-2" />
                <p className="font-body text-sm text-warm-ivory/80 leading-relaxed">
                  {review.text}
                </p>
              </div>

              {/* Author */}
              <div className="mt-6 pt-4 border-t border-warm-ivory/10">
                <p className="font-display text-base text-amber-accent">{review.name}</p>
                <p className="font-body text-xs text-warm-ivory/40">{review.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-full border border-warm-ivory/20 text-warm-ivory/50 hover:text-amber-accent hover:border-amber-accent transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-body text-sm text-warm-ivory/50">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-2 rounded-full border border-warm-ivory/20 text-warm-ivory/50 hover:text-amber-accent hover:border-amber-accent transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
