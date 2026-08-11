import { Star } from "lucide-react";

export function StarRating({
  value,
  onChange,
  label,
  size = "size-5",
}: {
  value: number;
  onChange?: (value: number) => void;
  label?: string;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-1" role={onChange ? "radiogroup" : undefined} aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        const icon = (
          <Star
            className={`${size} ${filled ? "fill-accent text-accent" : "text-border"}`}
            strokeWidth={1.5}
          />
        );
        if (!onChange) return <span key={star}>{icon}</span>;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} von 5${label ? ` – ${label}` : ""}`}
            onClick={() => onChange(value === star ? 0 : star)}
            className="transition-transform hover:scale-110"
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}