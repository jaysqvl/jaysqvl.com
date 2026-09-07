import mark from '@/data/brand-mark.json';

export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={mark.viewBox}
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect {...mark.dot} />
      <path d={mark.path} fillRule="evenodd" />
    </svg>
  );
}
