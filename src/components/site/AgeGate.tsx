import { useEffect, useState } from "react";
import { safeStorage } from "@/lib/native";

const KEY = "grastheke.age-verified";

export function AgeGate() {
  const [visible, setVisible] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (safeStorage.get(KEY) !== "true") setVisible(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="safe-top safe-bottom fixed inset-0 z-50 flex items-center justify-center bg-background px-5">
      <div className="fade-up w-full max-w-md text-center">
        <p className="text-eyebrow">Grastheke</p>
        <h1 className="mt-6 text-3xl font-medium tracking-tight md:text-4xl">
          Sind Sie 18 Jahre oder älter?
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Diese Seite richtet sich an volljährige Personen. Medizinisches Cannabis wird
          ausschließlich auf ärztliche Verordnung über unsere Partnerapotheken abgegeben.
        </p>

        {denied ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Der Zugang zu dieser Seite ist erst ab 18 Jahren möglich.
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => {
                safeStorage.set(KEY, "true");
                setVisible(false);
              }}
              className="inline-flex min-h-[3rem] items-center justify-center rounded-full bg-foreground px-7 text-sm text-background transition-opacity hover:opacity-85 active:opacity-75"
            >
              Ja, ich bin 18+
            </button>
            <button
              type="button"
              onClick={() => setDenied(true)}
              className="inline-flex min-h-[3rem] items-center justify-center rounded-full border border-border px-7 text-sm transition-colors hover:bg-secondary active:bg-secondary"
            >
              Nein
            </button>
          </div>
        )}
      </div>
    </div>
  );
}