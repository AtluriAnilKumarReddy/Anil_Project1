import Navigation from '@/components/Navigation';
import Cursor from '@/components/Cursor';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import FacilitiesSection from '@/sections/FacilitiesSection';
import GallerySection from '@/sections/GallerySection';
import TestimonialsSection from '@/sections/TestimonialsSection';
import ContactSection from '@/sections/ContactSection';
import Footer from '@/sections/Footer';

export default function PublicLayout() {
  return (
    <>
      <Cursor />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <FacilitiesSection />
        <GallerySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
