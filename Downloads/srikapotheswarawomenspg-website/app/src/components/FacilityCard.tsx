import type { LucideIcon } from 'lucide-react';

interface FacilityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FacilityCard({ icon: Icon, title, description }: FacilityCardProps) {
  return (
    <div className="group flex flex-col items-start p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-amber-accent/10 group-hover:bg-amber-accent/20 transition-colors duration-300 mb-4">
        <Icon className="w-7 h-7 text-amber-accent" />
      </div>
      <h3 className="font-display text-xl text-amber-accent mb-2">{title}</h3>
      <p className="font-body text-sm text-warm-ivory/70 leading-relaxed">{description}</p>
    </div>
  );
}
