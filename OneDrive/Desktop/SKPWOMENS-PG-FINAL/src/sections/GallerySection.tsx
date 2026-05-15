import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, Home, Sofa, X, Phone, Navigation, CheckCircle, MapPin } from 'lucide-react';
import SectionLabel from '@/components/SectionLabel';
import ModalPortal from '@/components/ModalPortal';

gsap.registerPlugin(ScrollTrigger);

type Category = 'exterior' | 'rooms' | 'common';
type PGSlug = 'deluxe' | 'executive' | 'premium';

interface GalleryImage { src: string; alt: string }

interface SharingOption {
  type: string;
  price: string | null;
}

interface PGGallery {
  name: string;
  subtitle: string;
  address: string[];
  phone: string;
  mapUrl: string;
  description: string;
  sharing: SharingOption[];
  features: string[];
  images: { exterior: GalleryImage[]; rooms: GalleryImage[]; common: GalleryImage[] };
}

const PG_GALLERIES: Record<PGSlug, PGGallery> = {
  deluxe: {
    name: "SRI KAPOTHESWARA DELUXE WOMEN'S PG",
    subtitle: '(New Building) - LIG-669',
    address: ['LIG-669, Kukatpally Housing Board Colony', 'Dharma Reddy Colony Phase I, Kukatpally', 'Hyderabad, Telangana 500072'],
    phone: '+91 98499 37305',
    mapUrl: 'https://maps.app.goo.gl/j4WWSQFQUMfzAHkD6',
    description: 'Our flagship property with modern amenities and comfortable living spaces. Located in a prime area of Kukatpally with easy access to JNTU and metro station. Features brand new locker beds with foam mattresses and attached bathrooms with geysers.',
    sharing: [
      { type: '2 Sharing', price: '9000/-' },
      { type: '3 Sharing', price: '8000/-' },
      { type: '4 Sharing', price: '6500/-' },
      { type: '5 Sharing', price: '6000/-' },
    ],
    features: ['Washing Machine', 'CCTV Security', 'Lift', 'Homely Food', 'Daily Room Cleaning', 'Wi-Fi', 'Attached Bathroom with Geyser', 'Mineral Water', 'Locker Bed with Foam Mattress', 'Self Cooking Available'],
    images: {
      exterior: [
        { src: '/assets/deluxe-ext-building.jpg', alt: 'Building exterior at night with illuminated signage' },
        { src: '/assets/deluxe-ext-signboard.jpg', alt: 'Signboard showing all facilities and contact numbers' },
      ],
      rooms: [
        { src: '/assets/deluxe-room-1.jpg', alt: '2-sharing room with locker beds and storage' },
        { src: '/assets/deluxe-room-2.jpg', alt: '4-sharing room with beds, wall shelves and windows' },
        { src: '/assets/deluxe-room-3.jpg', alt: '3-sharing room with dual windows and foam mattresses' },
      ],
      common: [
        { src: '/assets/deluxe-common-area.jpg', alt: 'Dining area with marble finish and seating' },
        { src: '/assets/deluxe-bathroom.jpg', alt: 'Attached bathroom with geyser and marble tiles' },
      ],
    },
  },
  executive: {
    name: "SRI KAPOTHESWARA EXECUTIVE WOMEN'S PG",
    subtitle: 'LIG-645, Road No. 5',
    address: ['Second Left, Back Side, Malabar Gold', 'LIG-645, Road No. 5, Kukatpally Housing Board Colony', 'Dharma Reddy Colony Phase I, Kukatpally, Hyderabad 500072'],
    phone: '+91 98499 37305',
    mapUrl: 'https://maps.app.goo.gl/yYXXRyjaAmp3fPYz8',
    description: 'Executive-class accommodation with premium interiors and elegant lighting. Located behind Malabar Gold with excellent connectivity to JNTU and tech companies.',
    sharing: [
      { type: '2 Sharing', price: '9500/-' },
      { type: '3 Sharing', price: '8000/-' },
      { type: '4 Sharing', price: '7500/-' },
      { type: '5 Sharing', price: '7000/-' },
    ],
    features: ['Washing Machine', 'CCTV Security', 'Lift', 'Homely Food', 'Daily Room Cleaning', 'Wi-Fi', 'Attached Bathroom with Geyser', 'Mineral Water', 'Locker Bed with Foam Mattress', 'Self Cooking Available'],
    images: {
      exterior: [
        { src: 'https://lh3.googleusercontent.com/p/AF1QipPIFEiXZhqyFnjOeDmjgzwjpVrv3Df9eeoohZCO=w800-h600-k-no', alt: 'Executive PG building exterior entrance' },
        { src: 'https://lh3.googleusercontent.com/p/AF1QipMIEpJEb5BFYEMX8Oji2-JfqOKw1G6FJWE2Hiaz=w800-h600-k-no', alt: 'Executive PG building view' },
        { src: 'https://lh3.googleusercontent.com/p/AF1QipNVgbKGnbi1xMOvJ1EyZdjVIEdLPEttoAZOGI8l=w800-h600-k-no', alt: 'Executive PG exterior with corridor' },
      ],
      rooms: [
        { src: 'https://lh3.googleusercontent.com/p/AF1QipPS4lO1nIoRJnQ2kH3cyml4TblQ0DeLf_9qQ0f9=w800-h600-k-no', alt: 'Executive PG 2-sharing room with beds' },
        { src: 'https://lh3.googleusercontent.com/p/AF1QipNn9AGUMucAXQ6sqb8U4d-2Hn7swnEHov6Wj56B=w800-h600-k-no', alt: 'Executive PG spacious room with locker beds' },
        { src: 'https://lh3.googleusercontent.com/p/AF1QipOcVaPjQ_UfnM2wsZc7XO0ud_1VsVd_Rg8DzQQY=w800-h600-k-no', alt: 'Executive PG room interior with natural light' },
      ],
      common: [
        { src: 'https://lh3.googleusercontent.com/p/AF1QipPyxUCTg2_Uo5pZyKxBqDqtPQoYWbuut--ZG_Zy=w800-h600-k-no', alt: 'Executive PG common dining area' },
        { src: 'https://lh3.googleusercontent.com/p/AF1QipOyrlOqE7YUDseBNwrd2qj46yevpaLPwEvRSxvw=w800-h600-k-no', alt: 'Executive PG common area view' },
        { src: 'https://lh3.googleusercontent.com/p/AF1QipNRT_mefCv9a04_QE5pcNGdnCr7ll7scqa464Ia=w800-h600-k-no', alt: 'Executive PG hallway and amenities' },
      ],
    },
  },
  premium: {
    name: "SRI KAPOTHESWARA PREMIUM WOMEN'S PG",
    subtitle: 'LIG-608, Street Number 1',
    address: ['Street No 1, Left Side of Road No 5, KPHB Colony', 'Backside of Malabar Gold, LIG-608', 'Kukatpally Housing Board Colony, Hyderabad 500072'],
    phone: '+91 98499 37305',
    mapUrl: 'https://maps.app.goo.gl/Z8dx9LCRiZFhBLwT6',
    description: 'Our premium offering with top-notch facilities and spacious rooms. Best value for working women and students near JNTU.',
    sharing: [
      { type: '3 Sharing', price: '8000/-' },
      { type: '4 Sharing', price: '7000/-' },
    ],
    features: ['Washing Machine', 'CCTV Security', 'Lift', 'Homely Food', 'Daily Room Cleaning', 'Wi-Fi', 'Attached Bathroom with Geyser', 'Mineral Water', 'Locker Bed with Foam Mattress', 'Self Cooking Available'],
    images: { exterior: [], rooms: [], common: [] },
  },
};

const CATEGORY_TABS: { key: Category; label: string; icon: typeof Building2 }[] = [
  { key: 'exterior', label: 'Exterior', icon: Building2 },
  { key: 'rooms', label: 'Rooms', icon: Home },
  { key: 'common', label: 'Common Area', icon: Sofa },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [activePG, setActivePG] = useState<PGSlug>('deluxe');
  const [activeCategory, setActiveCategory] = useState<Category>('exterior');
  const [detailPG, setDetailPG] = useState<PGSlug | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current.children, {
          y: 40, opacity: 0, stagger: 0.1, duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const currentGallery = PG_GALLERIES[activePG];
  const currentImages = currentGallery.images[activeCategory];

  return (
    <section ref={sectionRef} id="gallery" className="bg-warm-ivory py-[120px] lg:py-[160px]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12">
          <SectionLabel text="OUR GALLERY" />
          <h2 className="heading-display mt-4">
            <span className="block">Our Properties</span>
          </h2>
          <p className="font-body text-base font-light text-warm-brown mt-4 max-w-xl mx-auto">
            Click on any PG card to explore photos and details of our properties.
          </p>
        </div>

        {/* PG Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {(Object.entries(PG_GALLERIES) as [PGSlug, PGGallery][]).map(([key, pg]) => (
            <button
              key={key}
              onClick={() => { setActivePG(key); setActiveCategory('exterior'); setDetailPG(key); }}
              className={`text-left bg-white rounded-xl border p-6 transition-all duration-300 hover:shadow-lg ${
                activePG === key ? 'border-deep-saffron shadow-md' : 'border-warm-taupe/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-deep-saffron" />
                <span className="font-body text-xs text-warm-taupe uppercase tracking-wider">{pg.subtitle}</span>
              </div>
              <h3 className="font-display text-lg text-warm-brown leading-tight">{pg.name}</h3>
              <p className="font-body text-sm text-warm-taupe mt-2 line-clamp-2">{pg.description}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {pg.sharing.map(s => (
                  <span key={s.type} className="px-2 py-0.5 bg-amber-accent/10 text-amber-accent rounded-full font-body text-xs">
                    {s.type}{s.price ? ` - Rs. ${s.price}` : ''}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 mt-4 font-body text-sm text-deep-saffron font-medium">
                <Phone className="w-3 h-3" /> {pg.phone}
              </span>
            </button>
          ))}
        </div>

        {/* PG Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-full p-1 border border-warm-taupe/10 shadow-sm">
            {(Object.entries(PG_GALLERIES) as [PGSlug, PGGallery][]).map(([key, pg]) => (
              <button
                key={key}
                onClick={() => { setActivePG(key); setActiveCategory('exterior'); }}
                className={`px-6 py-2.5 rounded-full font-body text-sm font-medium transition-all ${
                  activePG === key ? 'bg-deep-saffron text-warm-ivory shadow-md' : 'text-warm-taupe hover:text-warm-brown'
                }`}
              >
                {pg.name.replace("SRI KAPOTHESWARA ", "").replace(" WOMEN'S PG", "").trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs - show for Deluxe & Executive */}
        {(activePG === 'deluxe' || activePG === 'executive') && (
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {CATEGORY_TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm transition-all border ${
                    activeCategory === key ? 'bg-deep-saffron text-warm-ivory border-deep-saffron' : 'bg-white text-warm-taupe border-warm-taupe/20 hover:border-warm-taupe/40'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Photos Message for Premium only */}
        {activePG === 'premium' && (
          <div className="text-center py-16 bg-white rounded-xl border border-warm-taupe/10">
            <p className="font-body text-lg text-warm-taupe">Photos coming soon</p>
            <p className="font-body text-sm text-warm-taupe/60 mt-1">Contact us for a video tour</p>
          </div>
        )}

        {/* Image Grid - Deluxe & Executive */}
        {(activePG === 'deluxe' || activePG === 'executive') && (
          <div className={`grid gap-4 ${currentImages.length > 2 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
            {currentImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-xl group">
                <div className="relative overflow-hidden rounded-xl">
                  <img src={image.src} alt={image.alt} className="w-full h-[250px] md:h-[320px] object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="font-body text-xs text-warm-taupe mt-2 px-1">{image.alt}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal using Portal */}
      <ModalPortal open={!!detailPG} onClose={() => setDetailPG(null)}>
        {detailPG && (
          <PGDetailModal pg={PG_GALLERIES[detailPG]} onClose={() => setDetailPG(null)} />
        )}
      </ModalPortal>
    </section>
  );
}

function PGDetailModal({ pg, onClose }: { pg: PGGallery; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Category>('exterior');

  const allImages = [...pg.images.exterior, ...pg.images.rooms, ...pg.images.common];
  const hasPhotos = allImages.length > 0;

  return (
    <div className="bg-warm-ivory rounded-2xl max-w-4xl w-full shadow-2xl relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-warm-ivory transition-colors"
      >
        <X className="w-5 h-5 text-warm-brown" />
      </button>

      {/* Header Image */}
      <div className="h-56 md:h-72 rounded-t-2xl overflow-hidden relative">
        {hasPhotos ? (
          <img src={allImages[0].src} alt={pg.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-dark-brown flex items-center justify-center">
            <Building2 className="w-20 h-20 text-warm-ivory/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/80 to-transparent" />
        <div className="absolute bottom-4 left-6">
          <span className="font-body text-xs text-amber-accent uppercase tracking-wider">{pg.subtitle}</span>
          <h2 className="font-display text-2xl md:text-3xl text-warm-ivory mt-1">{pg.name}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 space-y-8">
        {/* Address & Contact */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-deep-saffron mt-0.5 flex-shrink-0" />
            <div>{pg.address.map((line, i) => <p key={i} className="font-body text-sm text-warm-brown">{line}</p>)}</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${pg.phone.replace(/\s/g, '')}`} onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors">
              <Phone className="w-4 h-4" /> {pg.phone}
            </a>
            {pg.mapUrl && (
              <a href={pg.mapUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-deep-saffron text-deep-saffron rounded-full font-body text-sm font-medium hover:bg-deep-saffron hover:text-warm-ivory transition-colors">
                <Navigation className="w-4 h-4" /> Google Maps
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="font-body text-base text-warm-brown leading-relaxed">{pg.description}</p>

        {/* Sharing + Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-display text-lg text-deep-saffron mb-3">Sharing Options</h3>
            <div className="flex flex-wrap gap-2">
              {pg.sharing.map(s => (
                <span key={s.type} className="flex items-center gap-1 px-3 py-1.5 bg-amber-accent/10 text-amber-accent rounded-full font-body text-sm">
                  <CheckCircle className="w-3 h-3" />{s.type}{s.price ? ` - Rs. ${s.price}` : ''}
                </span>
              ))}
            </div>
            <div className="mt-3 px-4 py-3 bg-deep-saffron/10 border border-deep-saffron/20 rounded-lg">
              <p className="font-body text-sm text-deep-saffron font-medium">Advance: Rs. 2000/-</p>
              <p className="font-body text-xs text-warm-brown mt-1">Need to inform 20 days prior before vacating</p>
            </div>
          </div>
          <div>
            <h3 className="font-display text-lg text-deep-saffron mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {pg.features.map(f => (
                <div key={f} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-warm-taupe/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-deep-saffron flex-shrink-0" />
                  <span className="font-body text-sm text-warm-brown">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        {hasPhotos && (
          <div>
            <h3 className="font-display text-lg text-deep-saffron mb-3">Photo Gallery</h3>
            <div className="flex gap-2 mb-4">
              {CATEGORY_TABS.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-body text-xs transition-all border ${
                    activeTab === key ? 'bg-deep-saffron text-warm-ivory border-deep-saffron' : 'bg-white text-warm-taupe border-warm-taupe/20'
                  }`}>
                  <Icon className="w-3 h-3" /> {label}
                </button>
              ))}
            </div>
            <div className={`grid gap-3 ${pg.images[activeTab].length > 2 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2'}`}>
              {pg.images[activeTab].map((img, i) => (
                <div key={i} className="overflow-hidden rounded-lg group">
                  <img src={img.src} alt={img.alt} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <p className="font-body text-xs text-warm-taupe mt-1">{img.alt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Bar */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-warm-taupe/10">
          <a href="tel:+91984993705"
            className="inline-flex items-center gap-2 px-6 py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors">
            <Phone className="w-4 h-4" /> +91 98499 37305
          </a>
          <a href="tel:+918367074254"
            className="inline-flex items-center gap-2 px-6 py-3 border border-deep-saffron text-deep-saffron rounded-full font-body text-sm font-medium hover:bg-deep-saffron hover:text-warm-ivory transition-colors">
            <Phone className="w-4 h-4" /> +91 83670 74254
          </a>
          {pg.mapUrl && (
            <a href={pg.mapUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-warm-taupe text-warm-taupe rounded-full font-body text-sm font-medium hover:bg-warm-taupe hover:text-warm-ivory transition-colors">
              <Navigation className="w-4 h-4" /> Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
