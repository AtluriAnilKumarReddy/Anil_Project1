import { useState } from 'react';
import { X, Phone, MapPin, Calendar, Users, Home, CheckCircle } from 'lucide-react';
import ModalPortal from './ModalPortal';
import { useScrollLock } from '@/hooks/useScrollLock';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

interface PGOption {
  name: string;
  slug: string;
  address: string;
  sharing: string[];
}

const PG_OPTIONS: PGOption[] = [
  {
    name: "SRI KAPOTHESWARA DELUXE WOMEN'S PG",
    slug: 'deluxe',
    address: 'LIG-669, Kukatpally Housing Board Colony, Hyderabad',
    sharing: ['2 Sharing', '3 Sharing', '4 Sharing', '5 Sharing'],
  },
  {
    name: "SRI KAPOTHESWARA EXECUTIVE WOMEN'S PG",
    slug: 'executive',
    address: 'LIG-645, Road No. 5, Kukatpally, Hyderabad',
    sharing: ['2 Sharing', '3 Sharing', '4 Sharing', '5 Sharing'],
  },
  {
    name: "SRI KAPOTHESWARA PREMIUM WOMEN'S PG",
    slug: 'premium',
    address: 'LIG-608, Street Number 1, Kukatpally, Hyderabad',
    sharing: ['3 Sharing', '4 Sharing'],
  },
];

export default function BookingModal({ open, onClose }: BookingModalProps) {
  const [step, setStep] = useState<'select' | 'form' | 'success'>('select');
  const [selectedPG, setSelectedPG] = useState<PGOption | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    visitDate: '',
    sharingType: '',
    message: '',
  });

  useScrollLock(open);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('select');
      setSelectedPG(null);
      setFormData({ fullName: '', phone: '', email: '', visitDate: '', sharingType: '', message: '' });
    }, 200);
  };

  const handlePGSelect = (pg: PGOption) => {
    setSelectedPG(pg);
    setStep('form');
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.phone || !formData.visitDate) return;
    setStep('success');
  };

  return (
    <ModalPortal open={open} onClose={handleClose}>
      <div className="bg-warm-ivory rounded-2xl max-w-2xl w-full shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-warm-ivory transition-colors"
        >
          <X className="w-5 h-5 text-warm-brown" />
        </button>

        {/* Header */}
        <div className="bg-deep-saffron rounded-t-2xl px-8 py-6">
          <h2 className="font-display text-2xl text-warm-ivory">Book a Visit</h2>
          <p className="font-body text-sm text-warm-ivory/70 mt-1">
            Select your preferred property and schedule a visit.
          </p>
        </div>

        <div className="p-8">
          {/* Step 1: Select PG */}
          {step === 'select' && (
            <div className="space-y-6">
              <h3 className="font-display text-lg text-deep-saffron mb-4">Select Property</h3>
              <div className="space-y-3">
                {PG_OPTIONS.map((pg) => (
                  <button
                    key={pg.slug}
                    onClick={() => handlePGSelect(pg)}
                    className="w-full text-left bg-white border border-warm-taupe/10 rounded-xl p-5 hover:border-deep-saffron hover:shadow-md transition-all group"
                  >
                    <p className="font-display text-base text-warm-brown">{pg.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-warm-taupe" />
                      <p className="font-body text-xs text-warm-taupe">{pg.address}</p>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {pg.sharing.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-amber-accent/10 text-amber-accent rounded-full font-body text-[10px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Fill Form */}
          {step === 'form' && selectedPG && (
            <div className="space-y-6">
              {/* Selected PG summary */}
              <div className="bg-deep-saffron/5 border border-deep-saffron/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-sm text-deep-saffron">{selectedPG.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-warm-taupe" />
                      <p className="font-body text-xs text-warm-taupe">{selectedPG.address}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('select')}
                    className="font-body text-xs text-deep-saffron underline"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-body text-sm font-medium text-warm-brown mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-warm-brown mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-warm-brown mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-warm-brown mb-1">Visit Date *</label>
                  <input
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-warm-brown mb-1">Sharing Preference</label>
                  <select
                    value={formData.sharingType}
                    onChange={(e) => setFormData({ ...formData, sharingType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
                  >
                    <option value="">Select sharing type</option>
                    {selectedPG.sharing.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-body text-sm font-medium text-warm-brown mb-1">Message (Optional)</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any special requirements..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!formData.fullName || !formData.phone || !formData.visitDate}
                  className="flex-1 py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors disabled:opacity-50"
                >
                  Submit Booking Request
                </button>
                <a
                  href="tel:+919849937305"
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-deep-saffron text-deep-saffron rounded-full font-body text-sm font-medium hover:bg-deep-saffron hover:text-warm-ivory transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-display text-2xl text-warm-brown mb-2">Booking Request Received!</h3>
              <p className="font-body text-sm text-warm-taupe mb-6 max-w-sm mx-auto">
                Thank you <strong>{formData.fullName}</strong>. We will contact you shortly on{' '}
                <strong>{formData.phone}</strong> to confirm your visit.
              </p>
              <div className="bg-warm-ivory/50 rounded-xl p-4 max-w-sm mx-auto mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-deep-saffron" />
                  <span className="font-body text-sm text-warm-brown">{selectedPG?.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-deep-saffron" />
                  <span className="font-body text-sm text-warm-brown">Visit on {formData.visitDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-deep-saffron" />
                  <span className="font-body text-sm text-warm-brown">{formData.sharingType || 'Any sharing type'}</span>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors"
                >
                  Done
                </button>
                <a
                  href="https://wa.me/919849937305"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 border border-green-500 text-green-600 rounded-full font-body text-sm font-medium hover:bg-green-500 hover:text-white transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
