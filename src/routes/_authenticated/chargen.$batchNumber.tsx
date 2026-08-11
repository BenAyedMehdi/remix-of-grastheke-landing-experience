import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Check, X } from "lucide-react";
import { getBatchByNumber, formatDate, formatNumber } from "@/lib/batches";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/_authenticated/chargen/$batchNumber")({
  head: ({ params }) => ({
    meta: [
      { title: `Charge ${params.batchNumber} — Chargendaten | Grastheke` },
      {
        name: "description",
        content: `Alle Analysedaten zur Charge ${params.batchNumber}: Terpenprofil, Restfeuchte, CoA-Werte und Betriebsfotos.`,
      },
      { property: "og:title", content: `Charge ${params.batchNumber} — Grastheke` },
      {
        property: "og:description",
        content: "Chargendaten in Echtzeit aus unserem Qualitätssystem.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BatchDetailPage,
});

function BatchDetailPage() {
  const { batchNumber } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["batch", batchNumber],
    queryFn: () => getBatchByNumber(batchNumber),
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 pt-36 md:px-10">
        <p className="text-sm text-muted-foreground">Chargendaten werden geladen …</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-36 md:px-10">
        <h1 className="text-2xl font-medium tracking-tight">Charge nicht gefunden</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Zu dieser Chargennummer liegen keine freigegebenen Daten vor.
        </p>
        <Link to="/chargen" className="mt-6 inline-block text-sm underline">
          Zurück zur Chargensuche
        </Link>
      </section>
    );
  }

  const { batch, terpenes, labResults, photos, coaUrl } = data;
  const categories = [...new Set(labResults.map((r) => r.category))];
  const maxTerpene = Math.max(...terpenes.map((t) => Number(t.percent ?? 0)), 0.01);

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-10 md:pt-44">
      <Breadcrumbs
        items={[
          { label: "Startseite", to: "/" },
          { label: "Chargensuche", to: "/chargen" },
          { label: `Charge ${batchNumber}` },
        ]}
      />

      <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-eyebrow">Charge {batch.batch_number}</p>
          <h1 className="mt-4 text-4xl font-medium tracking-tight md:text-5xl">
            {batch.product_name}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {[batch.cultivar, batch.genetics, batch.origin].filter(Boolean).join(" · ")}
          </p>
        </div>
        {coaUrl && (
          <a
            href={coaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-full bg-accent px-6 py-3 text-sm text-accent-foreground transition-opacity hover:opacity-90"
          >
            <FileText className="size-4" strokeWidth={1.5} />
            CoA als PDF
          </a>
        )}
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-px bg-border md:grid-cols-4 lg:grid-cols-6">
        {[
          ["THC", formatNumber(batch.thc_percent, " %")],
          ["CBD", formatNumber(batch.cbd_percent, " %")],
          ["Gesamtterpene", formatNumber(batch.total_terpenes_percent, " %")],
          ["Restfeuchte", formatNumber(batch.moisture_percent, " %")],
          ["Wasseraktivität", formatNumber(batch.water_activity)],
          ["Bestrahlung", batch.irradiation ?? "—"],
          ["Anbau", batch.cultivation ?? "—"],
          ["Ernte", formatDate(batch.harvest_date)],
          ["Verpackt", formatDate(batch.packaged_date)],
          ["Mindestens haltbar bis", formatDate(batch.best_before)],
          ["CoA-Nummer", batch.coa_number ?? "—"],
          ["Prüflabor", batch.coa_lab ?? "—"],
        ].map(([label, value]) => (
          <div key={label} className="bg-background p-4">
            <dt className="text-eyebrow">{label}</dt>
            <dd className="mt-2 text-sm">{value}</dd>
          </div>
        ))}
      </dl>

      {terpenes.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-medium tracking-tight">Terpenprofil</h2>
          <ul className="mt-6 max-w-2xl space-y-4">
            {terpenes.map((t) => (
              <li key={t.id}>
                <div className="flex items-baseline justify-between text-sm">
                  <span>
                    {t.name}
                    {t.note ? (
                      <span className="text-muted-foreground"> · {t.note}</span>
                    ) : null}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {formatNumber(t.percent, " %")}
                  </span>
                </div>
                <div className="mt-2 h-1 w-full bg-secondary">
                  <div
                    className="h-1 bg-accent"
                    style={{
                      width: `${Math.min(100, (Number(t.percent ?? 0) / maxTerpene) * 100)}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {labResults.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-medium tracking-tight">
            Analysenzertifikat (CoA)
          </h2>
          <div className="mt-6 space-y-10">
            {categories.map((category) => (
              <div key={category}>
                <p className="text-eyebrow">{category}</p>
                <table className="mt-3 w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="py-2 font-normal">Parameter</th>
                      <th className="py-2 font-normal">Wert</th>
                      <th className="py-2 font-normal">Einheit</th>
                      <th className="py-2 font-normal">Grenzwert</th>
                      <th className="py-2 text-right font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labResults
                      .filter((r) => r.category === category)
                      .map((r) => (
                        <tr key={r.id} className="border-b border-border/60">
                          <td className="py-3">{r.parameter}</td>
                          <td className="py-3 font-mono">{r.value ?? "—"}</td>
                          <td className="py-3 text-muted-foreground">{r.unit ?? "—"}</td>
                          <td className="py-3 text-muted-foreground">
                            {r.limit_value ?? "—"}
                          </td>
                          <td className="py-3 text-right">
                            {r.passed === null ? (
                              "—"
                            ) : r.passed ? (
                              <Check className="ml-auto size-4 text-accent" />
                            ) : (
                              <X className="ml-auto size-4 text-destructive" />
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-medium tracking-tight">Fotos aus dem Betrieb</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <figure key={photo.id}>
                {photo.url && (
                  <img
                    src={photo.url}
                    alt={photo.caption ?? `Charge ${batch.batch_number}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full bg-secondary object-cover"
                  />
                )}
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  {photo.caption ?? "Betriebsfoto"}
                  {photo.taken_at ? ` · ${formatDate(photo.taken_at)}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {batch.notes && (
        <p className="mt-16 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {batch.notes}
        </p>
      )}

      {batch.product_slug && (
        <div className="mt-16 border-t border-border pt-8">
          <h2 className="text-lg font-medium tracking-tight">
            Patientenbewertungen
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Bewertungen werden bei der jeweiligen Blüte gesammelt und lassen sich dort
            nach Charge filtern – auch nach dieser Charge {batch.batch_number}.
          </p>
          <Link
            to="/sortiment/$slug"
            params={{ slug: batch.product_slug }}
            className="mt-4 inline-flex rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-foreground"
          >
            Bewertungen zu {batch.product_name} ansehen
          </Link>
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Stand der Daten: {formatDate(batch.updated_at.slice(0, 10))}. Abgabe
        ausschließlich auf ärztliche Verordnung.
      </p>
    </section>
  );
}