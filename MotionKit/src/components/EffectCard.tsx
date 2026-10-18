import { Link } from "@tanstack/react-router";
import type { Effect } from "@/lib/effects";
import { Preview } from "./Preview";

export function EffectCard({ effect }: { effect: Effect }) {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-card transition hover:border-primary/40 hover:shadow-glow">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Preview effect={effect} />
      </div>
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="font-semibold">{effect.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{effect.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {effect.tags.map((t) => (
              <span
                key={t}
                className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <Link
          to="/effet/$id"
          params={{ id: effect.id }}
          className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Ouvrir
        </Link>
      </div>
    </div>
  );
}
