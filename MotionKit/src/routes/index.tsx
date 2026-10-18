import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Preview } from "@/components/Preview";
import { EffectCard } from "@/components/EffectCard";
import { CATEGORIES, EFFECTS, getEffect } from "@/lib/effects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MotionKit — Bibliothèque de composants animés" },
      {
        name: "description",
        content:
          "Fonds d'écran, curseurs, encadrements et textes animés personnalisables, avec code prêt à intégrer.",
      },
      { property: "og:title", content: "MotionKit — Bibliothèque de composants animés" },
      {
        property: "og:description",
        content:
          "Personnalisez vitesse et couleurs, puis copiez le code dans votre site ou application.",
      },
    ],
  }),
  component: Index,
});

const hero = getEffect("reseau")!;

function Index() {
  const classic = ["aurore", "anneau", "conique", "glitch", "grille", "etincelles"].map((id) =>
    getEffect(id)!,
  );
  const celestial = [
    "constellations",
    "meteores",
    "orbites-cosmiques",
    "aurore-ondoyante",
    "crepuscule-dore",
    "nuages-vaporeux",
  ].map((id) => getEffect(id)!);

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <Preview
            effect={hero}
            values={{ color: "#7cff6b", count: 70, speed: 0.6, dist: 140, bg: "#141419" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:py-36">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> {EFFECTS.length}{" "}
            effets · Nouveautés célestes & Export IA
          </span>
          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-7xl">
            Le mouvement,
            <br />
            <span className="text-gradient">prêt à copier.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Fonds d'écran, curseurs, encadrements et ambiances célestes. Réglez vitesse et couleurs
            en direct, copiez le code autonome ou exportez un prompt pour Mistral & Gemini.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/bibliotheque"
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
            >
              Explorer la bibliothèque
            </Link>
            <Link
              to="/effet/$id"
              params={{ id: "aurore" }}
              className="rounded-xl border bg-background/60 px-6 py-3 font-semibold backdrop-blur transition hover:bg-secondary"
            >
              Ouvrir le studio
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Collections</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Quatre familles d'animations
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.id}
              to="/bibliotheque"
              search={{ cat: c.id }}
              className="group rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40"
            >
              <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-8 text-xl font-semibold">{c.label}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.blurb}</p>
              <p className="mt-6 font-mono text-xs text-primary">
                {EFFECTS.filter((e) => e.category === c.id).length} effets →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-card/40 grid-noise">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-3">
          {[
            ["Choisir", "Parcourez les effets avec un aperçu animé en direct."],
            ["Régler", "Couleurs, vitesse, taille, densité : tout se modifie en temps réel."],
            [
              "Intégrer",
              "Copiez le code autonome, ou générez un prompt prêt à coller dans Mistral ou Gemini.",
            ],
          ].map(([t, d], i) => (
            <div key={t}>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand font-mono font-bold text-primary-foreground">
                {i + 1}
              </div>
              <h3 className="mt-5 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nouveautés Célestes */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Nouveautés</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Série Céleste & Atmosphérique
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Étoiles scintillantes, météores, orbites, nuages et crépuscules dorés avec export IA.
            </p>
          </div>
          <Link
            to="/bibliotheque"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            Tout voir →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {celestial.map((e) => (
            <EffectCard key={e.id} effect={e} />
          ))}
        </div>
      </section>

      {/* Les incontournables */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Sélection</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Les incontournables
            </h2>
          </div>
          <Link
            to="/bibliotheque"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            Tout voir →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {classic.map((e) => (
            <EffectCard key={e.id} effect={e} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="rounded-3xl border bg-card p-10 text-center shadow-glow sm:p-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Sites, applications, logiciels.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Du code autonome, sans bibliothèque externe : il fonctionne en HTML, React, Vue,
            WordPress ou Electron.
          </p>
          <Link
            to="/documentation"
            className="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Guide d'intégration
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
