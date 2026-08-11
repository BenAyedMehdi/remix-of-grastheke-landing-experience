type Props = {
  className?: string;
  /** Only the glyph, no wordmark */
  markOnly?: boolean;
  /** Visual size of the glyph in px */
  size?: number;
};

/**
 * "the gram" — minimalist logo built directly from the name:
 * a lowercase t/g ligature (bowl of the g, stem with descender, crossbar of the t).
 */
export function GramMark({ className = "", markOnly = false, size = 28 }: Props) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0 overflow-visible"
      >
        <circle cx="12.5" cy="15" r="6.5" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M21 5.5v16.5c0 3-1.9 4.5-4.6 4.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        />
        <path d="M16.5 10.2h9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
      </svg>
      {!markOnly && (
        <span className="font-medium lowercase leading-none tracking-[-0.02em]">the gram</span>
      )}
    </span>
  );
}
