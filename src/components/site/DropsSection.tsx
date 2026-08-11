import { useState } from "react";
import { drops, type DropCategory } from "@/lib/data";

const tabs: (DropCategory | "Alle")[] = ["Alle", "Neu", "Restock", "News"];

export function DropsSection() {
  const [tab, setTab] = useState<DropCategory | "Alle">("Alle");
  const list = tab === "Alle" ? drops : drops.filter((d) => d.category === tab);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-xs transition-colors ${
              tab === t
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {list.map((d) => (
          <article
            key={d.id}
            className="group w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[24vw]"
          >
            <div className="overflow-hidden bg-secondary">
              <img
                src={d.image}
                alt={`${d.title} (Platzhalterbild)`}
                loading="lazy"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent">
                {d.category}
              </span>
              <span>{d.date}</span>
            </div>
            <h3 className="mt-3 text-lg tracking-tight">{d.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.teaser}</p>
          </article>
        ))}
      </div>
    </div>
  );
}