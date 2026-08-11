import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShieldCheck } from "lucide-react";
import { searchBatches, formatDate, formatNumber } from "@/lib/batches";
import { useRoles } from "@/hooks/use-session";

export const Route = createFileRoute("/_authenticated/chargen/")({
  head: () => ({
    meta: [
      { title: "Chargensuche — Echtzeitdaten je Blüte | Grastheke" },
      {
        name: "description",
        content:
          "Chargennummer eingeben und alle Daten zur Blüte einsehen: Terpenprofil, Restfeuchte, CoA-Werte und Fotos aus unserem Betrieb.",
      },
      { property: "og:title", content: "Chargensuche — Grastheke" },
      {
        property: "og:description",
        content: "Transparente Chargendaten für Patientinnen und Patienten.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BatchSearchPage,
});

function BatchSearchPage() {
  const [term, setTerm] = useState("");
  const { data: roles } = useRoles();
  const { data, isLoading, error } = useQuery({
    queryKey: ["batches", term],
    queryFn: () => searchBatches(term),
  });

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-10 md:pt-44">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-eyebrow">Chargenrückverfolgung</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight md:text-6xl">
            Alles über Ihre Charge
          </h1>
        </div>
        {roles?.isStaff && (
          <Link
            to="/chargen-verwaltung"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs transition-colors hover:border-foreground"
          >
            <ShieldCheck className="size-3.5" strokeWidth={1.5} />
            Chargenverwaltung
          </Link>
        )}
      </div>

      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
        Geben Sie die Chargennummer von Ihrer Verpackung ein. Sie sehen Terpenprofil,
        Restfeuchte, alle CoA-Messwerte und echte Fotos aus unserem Betrieb.
      </p>

      <div className="relative mt-10 max-w-xl">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.5}
        />
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="z. B. GT-2026-0812-A"
          aria-label="Chargennummer suchen"
          className="w-full rounded-full border border-border bg-background py-4 pl-11 pr-5 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>

      {error && (
        <p className="mt-8 text-sm text-destructive">
          Chargen konnten nicht geladen werden.
        </p>
      )}
      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Wird geladen …</p>}
      {!isLoading && data?.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          Keine Charge gefunden. Bitte prüfen Sie die Chargennummer auf der Verpackung.
        </p>
      )}

      <div className="mt-10 divide-y divide-border border-y border-border">
        {data?.map((batch) => (
          <Link
            key={batch.id}
            to="/chargen/$batchNumber"
            params={{ batchNumber: batch.batch_number }}
            className="group grid gap-3 py-6 transition-colors hover:bg-secondary/60 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:items-center md:px-3"
          >
            <div>
              <p className="font-mono text-sm tracking-tight">{batch.batch_number}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {batch.product_name}
                {batch.genetics ? ` · ${batch.genetics}` : ""}
                {batch.status !== "published" ? ` · ${batch.status}` : ""}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              THC {formatNumber(batch.thc_percent, " %")}
            </p>
            <p className="text-sm text-muted-foreground">
              Restfeuchte {formatNumber(batch.moisture_percent, " %")}
            </p>
            <p className="text-sm text-muted-foreground md:text-right">
              Verpackt {formatDate(batch.packaged_date)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}