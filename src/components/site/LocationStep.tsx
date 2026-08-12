import { useProductSelection } from "@/context/selection-context";
import { useActiveLocation } from "@/context/location-context";
import { LocationPicker } from "@/components/site/LocationPicker";

/**
 * Schritt 2 im Flow: erscheint erst, wenn eine Blüte ausgewählt wurde.
 */
export function LocationStep({ variant = "section" }: { variant?: "section" | "inline" }) {
  const { selectedProduct } = useProductSelection();
  const { activeLocation } = useActiveLocation();

  if (!selectedProduct) return null;

  const body = (
    <>
      <p className="text-eyebrow">Schritt 2 · Verfügbarkeit</p>
      <h2 className="mt-4 max-w-xl text-2xl font-medium tracking-tight md:text-4xl">
        Verfügbar in deiner grastheke
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Ausgewählt: <span className="text-foreground">{selectedProduct.name}</span> (
        {selectedProduct.genetics} · {selectedProduct.profile}). Wählen Sie die
        Partnerapotheke, in der die Verordnung eingelöst werden soll.
      </p>
      <div className="mt-8 max-w-2xl">
        <LocationPicker />
      </div>
      {activeLocation && (
        <p className="mt-4 text-xs text-muted-foreground">
          {selectedProduct.name} ist für grastheke {activeLocation.city} vorgemerkt. Die
          Abgabe erfolgt ausschließlich auf ärztliche Verordnung.
        </p>
      )}
    </>
  );

  if (variant === "inline") {
    return <div className="mt-14 border-t border-border pt-10">{body}</div>;
  }

  return (
    <section
      aria-labelledby="standort-schritt"
      className="border-t border-border bg-secondary"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28" id="standort-schritt">
        {body}
      </div>
    </section>
  );
}
