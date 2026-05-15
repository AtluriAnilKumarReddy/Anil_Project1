interface SectionLabelProps {
  text: string;
  color?: string;
}

export default function SectionLabel({ text, color = 'text-warm-taupe' }: SectionLabelProps) {
  return (
    <span className={`section-label ${color}`}>
      {text}
    </span>
  );
}
