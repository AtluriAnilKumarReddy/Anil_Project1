import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <>
      {/* Primary WhatsApp - 9849937305 */}
      <a
        href="https://wa.me/919849937305"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[1000] w-[50px] h-[50px] rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Contact on WhatsApp +91 98499 37305"
        title="WhatsApp: +91 98499 37305"
      >
        <MessageCircle className="w-6 h-6 text-white" fill="white" />
      </a>
      {/* Secondary WhatsApp - 8367074254 */}
      <a
        href="https://wa.me/918367074254"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[72px] right-6 z-[1000] w-[42px] h-[42px] rounded-full bg-[#128C7E] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        aria-label="Contact on WhatsApp +91 83670 74254"
        title="WhatsApp: +91 83670 74254"
      >
        <MessageCircle className="w-5 h-5 text-white" fill="white" />
      </a>
    </>
  );
}
