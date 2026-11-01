export function Mark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="var(--color-sea)" />
      <path
        fill="var(--color-gold)"
        d="M17.2 6.5h5.6v10.7H33.5v5.6H22.8V33.5h-5.6V22.8H6.5v-5.6h10.7z"
      />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2 text-ink">
      <Mark />
      <span className="font-display text-xl leading-none font-semibold">Banjoür</span>
    </span>
  );
}
