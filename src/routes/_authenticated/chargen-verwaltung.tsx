import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/hooks/use-session";
import { searchBatches, getBatchByNumber, type Batch } from "@/lib/batches";
import { ReviewModeration } from "@/components/site/ReviewModeration";

export const Route = createFileRoute("/_authenticated/chargen-verwaltung")({
  head: () => ({
    meta: [
      { title: "Chargenverwaltung — internes Team | Grastheke" },
      {
        name: "description",
        content:
          "Interner Bereich zur Pflege von Chargen, CoA-Werten, Terpenprofilen und Betriebsfotos.",
      },
      { property: "og:title", content: "Chargenverwaltung — Grastheke" },
      { property: "og:description", content: "Interner Bereich für Chargendaten." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const numberFields = [
  ["thc_percent", "THC %"],
  ["cbd_percent", "CBD %"],
  ["total_terpenes_percent", "Gesamtterpene %"],
  ["moisture_percent", "Restfeuchte %"],
  ["water_activity", "Wasseraktivität aw"],
] as const;

const textFields = [
  ["product_name", "Produktname"],
  ["cultivar", "Sorte"],
  ["genetics", "Genetik"],
  ["origin", "Herkunft"],
  ["cultivation", "Anbauweise"],
  ["irradiation", "Bestrahlung"],
  ["coa_number", "CoA-Nummer"],
  ["coa_lab", "Prüflabor"],
] as const;

const dateFields = [
  ["harvest_date", "Ernte"],
  ["packaged_date", "Verpackt"],
  ["best_before", "Haltbar bis"],
  ["coa_issued_on", "CoA-Datum"],
] as const;

const inputClass =
  "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground";

function AdminPage() {
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const [selected, setSelected] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: batches } = useQuery({
    queryKey: ["admin-batches"],
    queryFn: () => searchBatches(""),
  });

  if (rolesLoading) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 pt-36 md:px-10">
        <p className="text-sm text-muted-foreground">Berechtigungen werden geprüft …</p>
      </section>
    );
  }

  if (!roles?.isStaff) {
    return (
      <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-36 md:px-10">
        <h1 className="text-2xl font-medium tracking-tight">Kein Zugriff</h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          Dieser Bereich ist dem internen Team vorbehalten. Bitte wenden Sie sich an die
          Administration, um eine Team-Rolle zu erhalten.
        </p>
        <Link to="/chargen" className="mt-6 inline-block text-sm underline">
          Zur Chargensuche
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-10 md:pt-44">
      <p className="text-eyebrow">Intern</p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight md:text-5xl">
        Chargenverwaltung
      </h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[320px_1fr]">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-eyebrow">Chargen</p>
            <button
              type="button"
              onClick={() => setSelected("new")}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:border-foreground"
            >
              <Plus className="size-3.5" strokeWidth={1.5} />
              Neu
            </button>
          </div>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {batches?.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => setSelected(b.id)}
                  className={`w-full py-3 text-left text-sm transition-colors hover:text-foreground ${
                    selected === b.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span className="font-mono">{b.batch_number}</span>
                  <span className="block text-xs">
                    {b.product_name} · {b.status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selected ? (
          <BatchEditor
            key={selected}
            batchId={selected === "new" ? null : selected}
            batches={batches ?? []}
            onSaved={(id) => {
              setSelected(id);
              queryClient.invalidateQueries({ queryKey: ["admin-batches"] });
              queryClient.invalidateQueries({ queryKey: ["batches"] });
            }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Wählen Sie links eine Charge aus oder legen Sie eine neue an.
          </p>
        )}
      </div>

      <ReviewModeration />
    </section>
  );
}

type Draft = Partial<Batch> & { batch_number: string; product_name: string };

function BatchEditor({
  batchId,
  batches,
  onSaved,
}: {
  batchId: string | null;
  batches: Batch[];
  onSaved: (id: string) => void;
}) {
  const existing = batches.find((b) => b.id === batchId) ?? null;
  const [draft, setDraft] = useState<Draft>(
    existing ?? { batch_number: "", product_name: "", status: "draft" },
  );
  const queryClient = useQueryClient();

  const details = useQuery({
    queryKey: ["admin-batch-details", existing?.batch_number],
    enabled: Boolean(existing),
    queryFn: () => getBatchByNumber(existing!.batch_number),
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...draft,
        updated_at: new Date().toISOString(),
      } as Draft;
      if (batchId) {
        const { error } = await supabase.from("batches").update(payload).eq("id", batchId);
        if (error) throw error;
        return batchId;
      }
      const { data, error } = await supabase
        .from("batches")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      return data.id;
    },
    onSuccess: (id) => {
      toast.success("Charge gespeichert.");
      onSaved(id);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Speichern fehlgeschlagen."),
  });

  function set(field: string, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value === "" ? null : value }));
  }

  async function upload(bucket: string, file: File) {
    const path = `${draft.batch_number || "unsortiert"}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    return path;
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-eyebrow">
          Chargennummer
          <input
            className={inputClass}
            value={draft.batch_number ?? ""}
            onChange={(e) => set("batch_number", e.target.value)}
          />
        </label>
        {textFields.map(([field, label]) => (
          <label key={field} className="text-eyebrow">
            {label}
            <input
              className={inputClass}
              value={(draft[field] as string | null) ?? ""}
              onChange={(e) => set(field, e.target.value)}
            />
          </label>
        ))}
        {numberFields.map(([field, label]) => (
          <label key={field} className="text-eyebrow">
            {label}
            <input
              type="number"
              step="0.001"
              className={inputClass}
              value={(draft[field] as number | null) ?? ""}
              onChange={(e) => set(field, e.target.value)}
            />
          </label>
        ))}
        {dateFields.map(([field, label]) => (
          <label key={field} className="text-eyebrow">
            {label}
            <input
              type="date"
              className={inputClass}
              value={(draft[field] as string | null) ?? ""}
              onChange={(e) => set(field, e.target.value)}
            />
          </label>
        ))}
        <label className="text-eyebrow">
          Status
          <select
            className={inputClass}
            value={draft.status ?? "draft"}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="draft">Entwurf</option>
            <option value="published">Veröffentlicht</option>
            <option value="archived">Archiviert</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block text-eyebrow">
        Hinweise
        <textarea
          rows={3}
          className={inputClass}
          value={draft.notes ?? ""}
          onChange={(e) => set("notes", e.target.value)}
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending || !draft.batch_number || !draft.product_name}
          className="rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          Charge speichern
        </button>
        {batchId && (
          <label className="cursor-pointer rounded-full border border-border px-5 py-2.5 text-xs transition-colors hover:border-foreground">
            CoA-PDF hochladen
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const path = await upload("batch-coa", file);
                  const { error } = await supabase
                    .from("batches")
                    .update({ coa_path: path })
                    .eq("id", batchId);
                  if (error) throw error;
                  setDraft((prev) => ({ ...prev, coa_path: path }));
                  toast.success("CoA hochgeladen.");
                } catch (error) {
                  toast.error(
                    error instanceof Error ? error.message : "Upload fehlgeschlagen.",
                  );
                }
              }}
            />
          </label>
        )}
        {batchId && (
          <label className="cursor-pointer rounded-full border border-border px-5 py-2.5 text-xs transition-colors hover:border-foreground">
            Betriebsfoto hochladen
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const path = await upload("batch-photos", file);
                  const { error } = await supabase
                    .from("batch_photos")
                    .insert({ batch_id: batchId, storage_path: path });
                  if (error) throw error;
                  toast.success("Foto hochgeladen.");
                  void details.refetch();
                  queryClient.invalidateQueries({ queryKey: ["batch"] });
                } catch (error) {
                  toast.error(
                    error instanceof Error ? error.message : "Upload fehlgeschlagen.",
                  );
                }
              }}
            />
          </label>
        )}
        {draft.coa_path && (
          <span className="text-xs text-muted-foreground">CoA hinterlegt</span>
        )}
      </div>

      {batchId && (
        <>
          <ChildRows
            title="Terpenprofil"
            batchId={batchId}
            table="batch_terpenes"
            columns={[
              ["name", "Terpen"],
              ["percent", "%"],
              ["note", "Notiz"],
            ]}
            rows={details.data?.terpenes ?? []}
            onChanged={() => {
              void details.refetch();
              queryClient.invalidateQueries({ queryKey: ["batch"] });
            }}
          />
          <ChildRows
            title="CoA-Messwerte"
            batchId={batchId}
            table="batch_lab_results"
            columns={[
              ["category", "Kategorie"],
              ["parameter", "Parameter"],
              ["value", "Wert"],
              ["unit", "Einheit"],
              ["limit_value", "Grenzwert"],
            ]}
            rows={details.data?.labResults ?? []}
            onChanged={() => {
              void details.refetch();
              queryClient.invalidateQueries({ queryKey: ["batch"] });
            }}
          />
        </>
      )}
    </div>
  );
}

function ChildRows({
  title,
  batchId,
  table,
  columns,
  rows,
  onChanged,
}: {
  title: string;
  batchId: string;
  table: "batch_terpenes" | "batch_lab_results";
  columns: readonly (readonly [string, string])[];
  rows: Record<string, unknown>[];
  onChanged: () => void;
}) {
  const [draft, setDraft] = useState<Record<string, string>>({});

  async function add() {
    const payload: Record<string, unknown> = { batch_id: batchId };
    for (const [field] of columns) {
      const value = draft[field]?.trim();
      if (value) payload[field] = field === "percent" ? Number(value) : value;
    }
    const { error } = await supabase.from(table).insert(payload as never);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDraft({});
    onChanged();
  }

  async function remove(id: string) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    onChanged();
  }

  return (
    <div className="mt-12">
      <p className="text-eyebrow">{title}</p>
      <ul className="mt-3 divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <li
            key={String(row["id"])}
            className="flex items-center justify-between gap-4 py-3 text-sm"
          >
            <span className="text-muted-foreground">
              {columns
                .map(([field]) => row[field])
                .filter(Boolean)
                .join(" · ")}
            </span>
            <button
              type="button"
              aria-label="Eintrag löschen"
              onClick={() => remove(String(row["id"]))}
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="size-4" strokeWidth={1.5} />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        {columns.map(([field, label]) => (
          <label key={field} className="text-eyebrow">
            {label}
            <input
              className={`${inputClass} w-36`}
              value={draft[field] ?? ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, [field]: e.target.value }))}
            />
          </label>
        ))}
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-border px-5 py-2.5 text-xs transition-colors hover:border-foreground"
        >
          Hinzufügen
        </button>
      </div>
    </div>
  );
}