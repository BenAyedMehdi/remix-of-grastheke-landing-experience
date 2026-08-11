import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell } from "lucide-react";
import { DropsSection } from "@/components/site/DropsSection";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { safeStorage } from "@/lib/native";

const DROP_NOTIFY_KEY = "grastheke.notify-drops";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Drops — Grastheke" },
      {
        name: "description",
        content:
          "Aktuelle Drops, Restocks und fachliche Hinweise der Grastheke Partnerapotheken – neue Genetiken und Lieferwochen im Überblick.",
      },
      { property: "og:title", content: "News & Drops — Grastheke" },
      {
        property: "og:description",
        content: "Neue Genetiken, Restocks und Hinweise zur Rezeptübermittlung.",
      },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const [notify, setNotify] = useState(
    () => safeStorage.get(DROP_NOTIFY_KEY) === "true",
  );

  const toggleNotify = () => {
    const next = !notify;
    setNotify(next);
    safeStorage.set(DROP_NOTIFY_KEY, String(next));
  };

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-44">
      <Breadcrumbs />
      <p className="text-eyebrow">News & Drops</p>
      <h1 className="mt-5 max-w-3xl text-3xl font-medium tracking-tight md:text-6xl">
        Was gerade verfügbar ist
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
        Neue Genetiken, Restocks und fachliche Hinweise. Alle Inhalte sind Platzhalter.
      </p>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-card p-4 sm:max-w-md">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
            <Bell className="size-4 text-accent" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Benachrichtigungen</p>
            <p className="text-xs text-muted-foreground">Bei neuen Drops informiert werden</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={notify}
          aria-label="Benachrichtigungen für neue Drops aktivieren"
          onClick={toggleNotify}
          className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            notify ? "border-accent bg-accent" : "border-border bg-secondary"
          }`}
        >
          <span
            className={`absolute top-0.5 size-5 rounded-full bg-background transition-transform ${
              notify ? "translate-x-[1.55rem]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className="mt-14">
        <DropsSection />
      </div>
    </section>
  );
}