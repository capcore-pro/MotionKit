import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { unlockSite } from "@/lib/gate.functions";

export const Route = createFileRoute("/unlock")({
  head: () => ({
    meta: [
      { title: "Accès privé — MotionKit" },
      { name: "description", content: "Entrez votre code pour accéder à MotionKit." },
      { property: "og:title", content: "Accès privé — MotionKit" },
      { property: "og:description", content: "Espace privé." },
    ],
  }),
  component: Unlock,
});

function Unlock() {
  const router = useRouter();
  const unlock = useServerFn(unlockSite);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const password = new FormData(e.currentTarget).get("password") as string;
    const { ok } = await unlock({ data: { password } });
    setBusy(false);
    if (ok) {
      await router.invalidate();
      await router.navigate({ to: "/" });
    } else setError(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg"
      >
        <img src="/favicon.png" alt="" className="mx-auto mb-4 h-14 w-14 rounded-xl" />
        <h1 className="text-center text-2xl font-semibold text-foreground">MotionKit</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Espace privé — entrez votre code
        </p>
        <input
          name="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          aria-label="Code d'accès"
          className="mt-6 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
        />
        {error && <p className="mt-2 text-sm text-destructive">Code incorrect</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {busy ? "Vérification…" : "Entrer"}
        </button>
        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Retour à l'accueil
          </Link>
        </div>
      </form>
    </main>
  );
}
