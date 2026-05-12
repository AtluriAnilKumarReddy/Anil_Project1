import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, ExternalLink, X, Navigation, Building2, CheckCircle } from 'lucide-react';
import SectionLabel from '@/components/SectionLabel';
import ModalPortal from '@/components/ModalPortal';

gsap.registerPlugin(ScrollTrigger);

interface SharingOption {
  type: string;
  price: string | null;
}

interface Hostel {
  name: string;
  subtitle?: string;
  address: string[];
  landmark: string;
  mapUrl: string;
  phone: string;
  description: string;
  sharing: SharingOption[];
  features: string[];
}

const HOSTELS: Hostel[] = [
  {
    name: "SRI KAPOTHESWARA DELUXE WOMEN'S PG",
    subtitle: "(New Building)",
    address: ["LIG-669, Kukatpally Housing Board Colony", "Dharma Reddy Colony Phase I, Kukatpally", "Hyderabad, Telangana 500072"],
    landmark: "Near Malabar Gold & Little Fashions Kids Wear",
    mapUrl: "https://maps.app.goo.gl/j4WWSQFQUMfzAHkD6",
    phone: "+91 98499 37305",
    description: "Our flagship property with modern amenities. Prime location with easy access to JNTU and metro station.",
    sharing: [
      { type: "2 Sharing", price: "9000/-" },
      { type: "3 Sharing", price: "8000/-" },
      { type: "4 Sharing", price: "6500/-" },
      { type: "5 Sharing", price: "6000/-" },
    ],
    features: ["Washing Machine", "CCTV Security", "Lift", "Homely Food", "Daily Room Cleaning", "Wi-Fi", "Attached Bathroom with Geyser", "Mineral Water", "Locker Bed with Foam Mattress", "Self Cooking Available"],
  },
  {
    name: "SRI KAPOTHESWARA EXECUTIVE WOMEN'S PG",
    subtitle: "",
    address: ["Second Left, Back Side, Malabar Gold", "LIG-645, Road No. 5, Kukatpally Housing Board Colony", "Dharma Reddy Colony Phase I, Kukatpally, Hyderabad 500072"],
    landmark: "Behind Malabar Gold, Road No. 5",
    mapUrl: "https://maps.app.goo.gl/yYXXRyjaAmp3fPYz8",
    phone: "+91 98499 37305",
    description: "Executive-class accommodation with premium interiors and elegant lighting. Located behind Malabar Gold with excellent connectivity to JNTU and tech companies.",
    sharing: [
      { type: "2 Sharing", price: "9500/-" },
      { type: "3 Sharing", price: "8000/-" },
      { type: "4 Sharing", price: "7500/-" },
      { type: "5 Sharing", price: "7000/-" },
    ],
    features: ["Washing Machine", "CCTV Security", "Lift", "Homely Food", "Daily Room Cleaning", "Wi-Fi", "Attached Bathroom with Geyser", "Mineral Water", "Locker Bed with Foam Mattress", "Self Cooking Available"],
  },
  {
    name: "SRI KAPOTHESWARA PREMIUM WOMEN'S PG",
    subtitle: "",
    address: ["Street No 1, Left Side of Road No 5, KPHB Colony", "Backside of Malabar Gold, LIG-608", "Kukatpally Housing Board Colony, Hyderabad 500072"],
    landmark: "Street No 1, Left Side of Road No 5, KPHB Colony, Backside of Malabar Gold",
    mapUrl: "https://maps.app.goo.gl/Z8dx9LCRiZFhBLwT6",
    phone: "+91 98499 37305",
    description: "Our premium offering with top-notch facilities and spacious rooms. Best value near JNTU.",
    sharing: [
      { type: "3 Sharing", price: "8000/-" },
      { type: "4 Sharing", price: "7000/-" },
    ],
    features: ["Washing Machine", "CCTV Security", "Lift", "Homely Food", "Daily Room Cleaning", "Wi-Fi", "Attached Bathroom with Geyser", "Mineral Water", "Locker Bed with Foam Mattress", "Self Cooking Available"],
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [detailHostel, setDetailHostel] = useState<number | null>(null);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current.children, {
          y: 40, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); };

  return (
    <section ref={sectionRef} id="contact" className="bg-warm-ivory py-[120px] lg:py-[160px]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12">
          <SectionLabel text="GET IN TOUCH" />
          <h2 className="heading-display mt-4"><span className="block">Visit Us</span><span className="block">Anytime</span></h2>
          <p className="font-body text-base font-light text-warm-brown mt-4 max-w-xl mx-auto">
            We have three properties in Kukatpally, Hyderabad. Click on any card for full details.
          </p>
        </div>

        {/* Three Hostel Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {HOSTELS.map((hostel, idx) => (
            <button key={idx} onClick={() => setDetailHostel(idx)}
              className="text-left bg-white rounded-2xl p-6 border border-warm-taupe/10 hover:border-deep-saffron hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-5 h-5 text-deep-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm font-semibold text-warm-brown">{hostel.name}</p>
                  {hostel.subtitle && <p className="font-body text-xs text-deep-saffron">{hostel.subtitle}</p>}
                </div>
              </div>
              {hostel.address.map((line, i) => (
                <p key={i} className="font-body text-sm font-light text-warm-brown pl-8">{line}</p>
              ))}
              <p className="font-body text-xs text-warm-taupe pl-8 mt-1">{hostel.landmark}</p>
              <div className="flex items-center gap-2 mt-3 pl-8">
                <a href={`tel:${hostel.phone.replace(/\s/g, '')}`} onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 font-body text-xs text-deep-saffron hover:underline">
                  <Phone className="w-3 h-3" /> {hostel.phone}
                </a>
              </div>
              <div className="mt-3 pl-8 flex flex-wrap gap-1">
                {hostel.sharing.map(s => (
                  <span key={s.type} className="px-2 py-0.5 bg-amber-accent/10 text-amber-accent rounded-full font-body text-[10px]">
                    {s.type}{s.price ? ` - ${s.price}` : ''}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 mt-4 pl-8 font-body text-xs text-deep-saffron font-medium group-hover:underline">
                <ExternalLink className="w-3 h-3" /> Click for full details
              </span>
            </button>
          ))}
        </div>

        {/* Contact Form + Email */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-wrap gap-3 mb-3">
              <a href="tel:+919849937305" className="inline-flex items-center gap-2 px-6 py-2.5 border border-deep-saffron text-deep-saffron rounded-full font-body text-sm hover:bg-deep-saffron hover:text-warm-ivory transition-all">
                <Phone className="w-4 h-4" /> +91 98499 37305
              </a>
              <a href="tel:+918367074254" className="inline-flex items-center gap-2 px-6 py-2.5 border border-deep-saffron text-deep-saffron rounded-full font-body text-sm hover:bg-deep-saffron hover:text-warm-ivory transition-all">
                <Phone className="w-4 h-4" /> +91 83670 74254
              </a>
            </div>
            <a href="mailto:srikapotheswarawomenspg@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-deep-saffron text-deep-saffron rounded-full font-body text-sm hover:bg-deep-saffron hover:text-warm-ivory transition-all mb-8">
              <Mail className="w-4 h-4" /> srikapotheswarawomenspg@gmail.com
            </a>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b border-warm-taupe py-3 font-body text-base text-warm-brown placeholder:text-warm-taupe/60 focus:border-deep-saffron focus:outline-none transition-colors" />
              <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border-b border-warm-taupe py-3 font-body text-base text-warm-brown placeholder:text-warm-taupe/60 focus:border-deep-saffron focus:outline-none transition-colors" />
              <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-transparent border-b border-warm-taupe py-3 font-body text-base text-warm-brown placeholder:text-warm-taupe/60 focus:border-deep-saffron focus:outline-none transition-colors" />
              <textarea placeholder="Your Message" rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border-b border-warm-taupe py-3 font-body text-base text-warm-brown placeholder:text-warm-taupe/60 focus:border-deep-saffron focus:outline-none transition-colors resize-none" />
              <button type="submit" className="px-8 py-3 bg-deep-saffron text-warm-ivory font-display text-sm font-medium rounded-full hover:bg-amber-accent transition-colors">
                {submitted ? 'Message Sent!' : 'Send Message'}
              </button>
            </form>
          </div>
          {/* Map Preview */}
          <div className="w-full lg:w-1/2">
            <a href={HOSTELS[0].mapUrl} target="_blank" rel="noopener noreferrer"
              className="block h-full min-h-[400px] rounded-2xl overflow-hidden relative group"
              style={{ background: 'linear-gradient(135deg, #E8DDD4 0%, #D4C4B5 50%, #C4B0A0 100%)' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-deep-saffron/10 flex items-center justify-center mb-4 group-hover:bg-deep-saffron/20 transition-colors">
                  <MapPin className="w-8 h-8 text-deep-saffron" />
                </div>
                <p className="font-display text-xl text-warm-brown mb-2">{HOSTELS[0].name}</p>
                <p className="font-body text-sm text-warm-taupe mb-4">{HOSTELS[0].address.join(', ')}</p>
                <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium group-hover:bg-amber-accent transition-colors">
                  <Navigation className="w-4 h-4" /> Open in Google Maps
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <ModalPortal open={detailHostel !== null} onClose={() => setDetailHostel(null)}>
        {detailHostel !== null && (
          <div className="bg-warm-ivory rounded-2xl max-w-3xl w-full shadow-2xl relative">
            <button onClick={() => setDetailHostel(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-warm-ivory border border-warm-taupe/10 transition-colors">
              <X className="w-5 h-5 text-warm-brown" />
            </button>
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-3 mb-4">
                <Building2 className="w-6 h-6 text-deep-saffron mt-1" />
                <div>
                  <h2 className="font-display text-2xl text-warm-brown">{HOSTELS[detailHostel].name}</h2>
                  {HOSTELS[detailHostel].subtitle && <p className="font-body text-sm text-deep-saffron">{HOSTELS[detailHostel].subtitle}</p>}
                </div>
              </div>
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="w-4 h-4 text-deep-saffron mt-1" />
                <div>{HOSTELS[detailHostel].address.map((l, i) => <p key={i} className="font-body text-sm text-warm-brown">{l}</p>)}</div>
              </div>
              <p className="font-body text-sm text-warm-taupe mb-4">{HOSTELS[detailHostel].landmark}</p>
              <p className="font-body text-base text-warm-brown leading-relaxed mb-6">{HOSTELS[detailHostel].description}</p>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-display text-lg text-deep-saffron mb-2">Sharing Options</h3>
                  <div className="flex flex-wrap gap-2">
                    {HOSTELS[detailHostel].sharing.map(s => <span key={s.type} className="flex items-center gap-1 px-3 py-1.5 bg-amber-accent/10 text-amber-accent rounded-full font-body text-sm"><CheckCircle className="w-3 h-3" />{s.type}{s.price ? ` - Rs. ${s.price}` : ''}</span>)}
                  </div>
                  <div className="mt-3 px-4 py-3 bg-deep-saffron/10 border border-deep-saffron/20 rounded-lg">
                    <p className="font-body text-sm text-deep-saffron font-medium">Advance: Rs. 2000/-</p>
                    <p className="font-body text-xs text-warm-brown mt-1">Need to inform 20 days prior before vacating</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-lg text-deep-saffron mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {HOSTELS[detailHostel].features.map(f => <span key={f} className="flex items-center gap-1 px-3 py-1.5 bg-deep-saffron/10 text-deep-saffron rounded-full font-body text-sm"><CheckCircle className="w-3 h-3" />{f}</span>)}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+919849937305" className="inline-flex items-center gap-2 px-6 py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors">
                  <Phone className="w-4 h-4" /> +91 98499 37305
                </a>
                <a href="tel:+918367074254" className="inline-flex items-center gap-2 px-6 py-3 border border-deep-saffron text-deep-saffron rounded-full font-body text-sm font-medium hover:bg-deep-saffron hover:text-warm-ivory transition-colors">
                  <Phone className="w-4 h-4" /> +91 83670 74254
                </a>
                {HOSTELS[detailHostel].mapUrl && (
                  <a href={HOSTELS[detailHostel].mapUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-warm-taupe text-warm-taupe rounded-full font-body text-sm font-medium hover:bg-warm-taupe hover:text-warm-ivory transition-colors">
                    <Navigation className="w-4 h-4" /> Google Maps
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </ModalPortal>
    </section>
  );
}
