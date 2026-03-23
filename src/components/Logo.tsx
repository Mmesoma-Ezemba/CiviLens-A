export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="2" width="14.1421" height="14.1421" transform="rotate(45 12 2)" fill="#f27f0d" />
      <path d="M7 14L12 9L17 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
