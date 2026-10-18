import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { EffectCard } from "@/components/EffectCard";
import { CATEGORIES, EFFECTS, type Category } from "@/lib/effects";

export const Route = createFileRoute("/bibliotheque")({
  validateSearch: (s: Record<string, unknown>): { cat?: Category | undefined } => ({
    cat: CATEGORIES.some((c) => c.id === s["cat"]) ? (s["cat"] as Category) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Bibliothèque d'effets animés — MotionKit" },
      {
        name: "description",
        content: "Parcourez tous les fonds, curseurs, encadrements et textes animés de MotionKit.",
      },
      { property: "og:title", content: "Bibliothèque d'effets animés — MotionKit" },
      { property: "og:description", content: "Tous les effets animés, filtrables par catégorie." },
    ],
  }),
  component: Library,
});

function Library() {
  const { cat } = Route.useSearch();
  const [q, setQ] = useState("");
  const list = EFFECTS.filter(
    (e) =>
      (!cat || e.category === cat) &&
      (e.name + e.description).toLowerCase().includes(q.toLowerCase()),
  );
  const tab = "rounded-full border px-4 py-1.5 text-sm transition";
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight">Bibliothèque</h1>
        <p className="mt-2 text-muted-foreground">
          {list.length} effet(s) · cliquez sur « Ouvrir » pour personnaliser et récupérer le code.
        </p>
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/bibliotheque"
              search={{}}
              className={`${tab} ${!cat ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Tous
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to="/bibliotheque"
                search={{ cat: c.id }}
                className={`${tab} ${cat === c.id ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {c.label}
              </Link>
            ))}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un effet…"
            className="w-full rounded-xl border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary md:w-72"
          />
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <EffectCard key={e.id} effect={e} />
          ))}
        </div>
        {list.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">Aucun effet ne correspond.</p>
        )}
      </div>
    </SiteShell>
  );
}
