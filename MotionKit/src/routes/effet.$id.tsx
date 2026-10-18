import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/SiteShell";
import { buildDoc, CATEGORIES, defaults, EFFECTS, getEffect, type Values } from "@/lib/effects";
import {
  applyPreset,
  embedCode,
  highlight,
  PRESETS,
  previewDoc,
  reactCode,
  type Env,
} from "@/lib/studio";

export const Route = createFileRoute("/effet/$id")({
  loader: ({ params }) => {
    const e = getEffect(params.id);
    if (!e) throw notFound();
    return { id: e.id };
  },
  head: ({ loaderData }) => {
    const e = loaderData ? getEffect(loaderData.id) : undefined;
    const title = e ? `${e.name} — Studio MotionKit` : "Effet introuvable — MotionKit";
    const desc = e ? e.description : "Cet effet n'existe pas.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: Studio,
});

type Fmt = "complet" | "react" | "embed" | "html" | "css" | "js";
const FMT_LABEL: Record<Fmt, string> = {
  complet: "Fichier .html",
  react: "React",
  embed: "Webflow / WP",
  html: "HTML",
  css: "CSS",
  js: "JS",
};
type Panel = "apercu" | "reglages" | "code";

function Studio() {
  const { id } = Route.useLoaderData();
  const effect = getEffect(id)!;
  return <StudioInner key={id} effect={effect} />;
}

function StudioInner({ effect }: { effect: NonNullable<ReturnType<typeof getEffect>> }) {
  const navigate = useNavigate();
  const [values, setValues] = useState<Values>(() => defaults(effect));
  const [fmt, setFmt] = useState<Fmt>("complet");
  const [side, setSide] = useState<"reglages" | "code">("reglages");
  const [panel, setPanel] = useState<Panel>("apercu");
  const [env, setEnv] = useState<Env>("sombre");
  const [full, setFull] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedAI, setCopiedAI] = useState(false);
  const [seed, setSeed] = useState(0);
  const [preset, setPreset] = useState<string | null>(null);

  const idx = EFFECTS.findIndex((e) => e.id === effect.id);
  const prev = EFFECTS[(idx - 1 + EFFECTS.length) % EFFECTS.length]!;
  const next = EFFECTS[(idx + 1) % EFFECTS.length]!;
  const cat = CATEGORIES.find((c) => c.id === effect.category)!;

  const doc = useMemo(() => previewDoc(effect, values, env), [effect, values, env]);
  const code = useMemo(() => {
    const p = effect.generate(values);
    if (fmt === "complet") return buildDoc(effect, values);
    if (fmt === "react") return reactCode(effect, values);
    if (fmt === "embed") return embedCode(effect, values);
    if (fmt === "html") return p.html;
    if (fmt === "css") return p.css;
    return p.js || "// Aucun JavaScript requis pour cet effet";
  }, [effect, values, fmt]);
  const html = useMemo(() => highlight(code), [code]);

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [full]);

  const set = (k: string, v: string | number) => {
    setPreset(null);
    setValues((s) => ({ ...s, [k]: v }));
  };
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const copyForAI = async () => {
    const autonomousCode = buildDoc(effect, values);
    const promptText = `Agis comme un développeur expert front-end. Voici le code complet et autonome d'une animation configurée sur mesure. Intègre-la dans mon composant/page en adaptant la structure à mon projet existant, sans installer de bibliothèque externe :

\`\`\`html
${autonomousCode}
\`\`\``;
    await navigator.clipboard.writeText(promptText);
    setCopiedAI(true);
    setTimeout(() => setCopiedAI(false), 2000);
    toast.success("Copié ! Collez-le directement dans Mistral ou Gemini", {
      description: `Animation « ${effect.name} » prête avec vos réglages actuels`,
    });
  };
  const download = () => {
    const isReact = fmt === "react";
    const blob = new Blob([isReact ? code : buildDoc(effect, values)], {
      type: isReact ? "text/plain" : "text/html",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = isReact ? `${effect.id}.tsx` : `${effect.id}.html`;
    a.click();
  };
  const random = () => {
    const n: Values = { ...values };
    for (const p of effect.params) {
      if (p.type === "color" && p.key !== "bg")
        n[p.key] = `hsl(${Math.floor(Math.random() * 360)} 90% 60%)`;
      if (p.type === "range")
        n[p.key] = +(
          p.min +
          Math.round((Math.random() * (p.max - p.min)) / p.step) * p.step
        ).toFixed(2);
    }
    setPreset(null);
    setValues(n);
  };

  const btn = "rounded-lg border px-2.5 py-1.5 text-xs hover:bg-secondary";
  const seg = (on: boolean) =>
    `rounded-md px-2.5 py-1.5 text-xs ${on ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`;

  const previewBox = (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex gap-1">
          {(["sombre", "clair", "contenu"] as Env[]).map((e) => (
            <button key={e} onClick={() => setEnv(e)} className={seg(env === e)}>
              {e === "sombre" ? "Fond sombre" : e === "clair" ? "Fond clair" : "Avec contenu"}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button onClick={() => setSeed((s) => s + 1)} className={btn}>
            ↻ Rejouer
          </button>
          <button onClick={() => setFull(true)} className={btn}>
            ⛶ Plein écran
          </button>
        </div>
      </div>
      <div className="min-h-[260px] flex-1">
        <iframe
          key={seed}
          title={effect.name}
          srcDoc={doc}
          sandbox="allow-scripts"
          className="block h-full w-full border-0"
        />
      </div>
    </div>
  );

  const settings = (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Styles en 1 clic</h2>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setValues((v) => applyPreset(effect, v, p));
              setPreset(p.id);
            }}
            className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs hover:bg-secondary ${preset === p.id ? "border-primary" : ""}`}
          >
            <span className="flex shrink-0 overflow-hidden rounded" style={{ background: p.bg }}>
              {p.colors.map((c) => (
                <span key={c} className="h-5 w-3" style={{ background: c }} />
              ))}
            </span>
            <span className="min-w-0 truncate">{p.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <span>📋</span> Prompt pour l'IA (Mistral & Gemini)
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            Code complet autonome configuré sur mesure
          </p>
        </div>
        <button
          onClick={copyForAI}
          className="shrink-0 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition"
          title="Copier le prompt pour Mistral ou Gemini"
        >
          {copiedAI ? "Copié ✓" : "Copier pour l'IA"}
        </button>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-semibold">Réglages</h2>
        <div className="flex gap-2">
          <button onClick={random} className={btn}>
            Aléatoire
          </button>
          <button
            onClick={() => {
              setPreset(null);
              setValues(defaults(effect));
            }}
            className={btn}
          >
            Réinitialiser
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-5">
        {effect.params.map((p) => (
          <label key={p.key} className="block">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">{p.label}</span>
              {p.type === "range" && <span className="font-mono text-xs">{values[p.key]}</span>}
            </div>
            {p.type === "range" && (
              <input
                type="range"
                min={p.min}
                max={p.max}
                step={p.step}
                value={values[p.key]}
                onChange={(e) => set(p.key, +e.target.value)}
                className="w-full accent-primary"
              />
            )}
            {p.type === "color" && (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={toHex(String(values[p.key]))}
                  onChange={(e) => set(p.key, e.target.value)}
                  className="h-9 w-12 shrink-0 cursor-pointer rounded-md border bg-transparent"
                />
                <input
                  value={values[p.key]}
                  onChange={(e) => set(p.key, e.target.value)}
                  className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 font-mono text-xs outline-none focus:border-primary"
                />
              </div>
            )}
            {p.type === "text" && (
              <input
                value={values[p.key]}
                onChange={(e) => set(p.key, e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );

  const codeBox = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-code">
      <div className="flex flex-wrap gap-1 border-b p-2">
        {(Object.keys(FMT_LABEL) as Fmt[]).map((f) => (
          <button key={f} onClick={() => setFmt(f)} className={`${seg(fmt === f)} font-mono`}>
            {FMT_LABEL[f]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-b p-2">
        <button
          onClick={copy}
          className="flex-1 min-w-[110px] rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition"
        >
          {copied ? "Copié ✓" : "Copier le code"}
        </button>
        <button
          onClick={copyForAI}
          className="flex items-center justify-center gap-1.5 rounded-md border border-primary/50 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition"
          title="Copier un prompt tout-en-un optimisé pour Mistral et Gemini"
        >
          <span>📋</span> {copiedAI ? "Prompt copié ✓" : "Copier pour l'IA"}
        </button>
        <button onClick={download} className={btn}>
          Télécharger {fmt === "react" ? ".tsx" : ".html"}
        </button>
      </div>
      <pre
        className="min-h-0 flex-1 overflow-auto p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-all text-foreground/80"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );

  return (
    <SiteShell>
      <div className="mx-auto max-w-[1500px] px-4 pb-24 pt-6 sm:px-6 lg:pb-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
              <Link to="/bibliotheque" className="hover:text-foreground">
                Bibliothèque
              </Link>
              <span>/</span>
              <Link
                to="/bibliotheque"
                search={{ cat: cat.id }}
                className="truncate hover:text-foreground"
              >
                {cat.label}
              </Link>
            </div>
            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {effect.name}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Link to="/effet/$id" params={{ id: prev.id }} className={btn} title={prev.name}>
              ←
            </Link>
            <select
              value={effect.id}
              onChange={(e) => navigate({ to: "/effet/$id", params: { id: e.target.value } })}
              className="hidden max-w-[200px] rounded-lg border bg-background px-2 py-1.5 text-xs sm:block"
              aria-label="Changer d'effet"
            >
              {CATEGORIES.map((c) => (
                <optgroup key={c.id} label={c.label}>
                  {EFFECTS.filter((e) => e.category === c.id).map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <Link to="/effet/$id" params={{ id: next.id }} className={btn} title={next.name}>
              →
            </Link>
          </div>
        </header>
        <p className="mt-1 text-sm text-muted-foreground">{effect.description}</p>

        {/* Desktop */}
        <div className="mt-5 hidden h-[calc(100vh-200px)] min-h-[560px] gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_400px]">
          {previewBox}
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-card">
            <div className="flex gap-1 border-b p-2">
              <button
                onClick={() => setSide("reglages")}
                className={`flex-1 ${seg(side === "reglages")}`}
              >
                Personnaliser
              </button>
              <button onClick={() => setSide("code")} className={`flex-1 ${seg(side === "code")}`}>
                Exporter le code
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-4">
              {side === "reglages" ? settings : <div className="h-full">{codeBox}</div>}
            </div>
          </aside>
        </div>

        {/* Mobile */}
        <div className="mt-4 lg:hidden">
          {panel === "apercu" && <div className="h-[60vh]">{previewBox}</div>}
          {panel === "reglages" && <div className="rounded-2xl border bg-card p-4">{settings}</div>}
          {panel === "code" && <div className="h-[70vh]">{codeBox}</div>}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t bg-background/95 backdrop-blur lg:hidden">
        {(["apercu", "reglages", "code"] as Panel[]).map((p) => (
          <button
            key={p}
            onClick={() => setPanel(p)}
            className={`py-3 text-sm ${panel === p ? "text-primary font-semibold" : "text-muted-foreground"}`}
          >
            {p === "apercu" ? "Aperçu" : p === "reglages" ? "Réglages" : "Code"}
          </button>
        ))}
      </nav>

      {full && (
        <div className="fixed inset-0 z-50 bg-background">
          <iframe
            title={effect.name}
            srcDoc={doc}
            sandbox="allow-scripts"
            className="block h-full w-full border-0"
          />
          <button
            onClick={() => setFull(false)}
            className="absolute right-4 top-4 rounded-full border bg-card/90 px-4 py-2 text-sm backdrop-blur hover:bg-secondary"
          >
            ✕ Fermer (Échap)
          </button>
        </div>
      )}
    </SiteShell>
  );
}

function toHex(c: string) {
  if (/^#[0-9a-f]{6}$/i.test(c)) return c;
  const m = c.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
  if (!m) return "#000000";
  const h = Number(m[1]),
    s = Number(m[2]) / 100,
    l = Number(m[3]) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
