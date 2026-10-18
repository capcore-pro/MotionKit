import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/documentation")({
  head: () => ({
    meta: [
      { title: "Guide d'intégration — MotionKit" },
      {
        name: "description",
        content:
          "Intégrez les effets MotionKit en HTML, React, WordPress ou dans une application de bureau.",
      },
      { property: "og:title", content: "Guide d'intégration — MotionKit" },
      {
        property: "og:description",
        content: "Comment intégrer les animations dans vos sites, applications et logiciels.",
      },
    ],
  }),
  component: Docs,
});

const guides = [
  {
    t: "Site HTML",
    d: "Collez le CSS dans votre <style>, le HTML dans <body> et le JS dans une balise <script> en fin de page. Ou utilisez directement le fichier complet téléchargé.",
    c: `<style>/* CSS copié */</style>\n<!-- HTML copié -->\n<script>/* JS copié */</script>`,
  },
  {
    t: "React / Next.js",
    d: "Le plus simple : servez le fichier .html téléchargé depuis /public et affichez-le en fond via une iframe, ou injectez le code dans un useEffect.",
    c: `export function Fond() {\n  return <iframe src="/aurore.html" className="fixed inset-0 -z-10 h-full w-full border-0 pointer-events-none" />;\n}`,
  },
  {
    t: "WordPress / Webflow",
    d: "Ajoutez un bloc « HTML personnalisé » (ou Embed) et collez le fichier complet, ou séparez CSS et JS dans les réglages du thème.",
    c: `Bloc HTML personnalisé → coller le fichier complet`,
  },
  {
    t: "Logiciel (Electron, Tauri…)",
    d: "Les effets sont des pages web autonomes : chargez le fichier .html dans une fenêtre ou une webview.",
    c: `win.loadFile("effets/hyperespace.html")`,
  },
];

function Docs() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Documentation</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Intégrer un effet</h1>
        <p className="mt-3 text-muted-foreground">
          Chaque effet est généré en HTML, CSS et JavaScript pur, sans aucune dépendance. Astuce :
          pour un curseur sur toute la page, gardez le CSS du curseur et appliquez{" "}
          <code className="font-mono text-primary">cursor:none</code> à{" "}
          <code className="font-mono text-primary">body</code>.
        </p>
        <div className="mt-10 space-y-5">
          {guides.map((g, i) => (
            <div key={g.t} className="rounded-2xl border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                <h2 className="text-xl font-semibold">{g.t}</h2>
              </div>
              <p className="mt-3 text-muted-foreground">{g.d}</p>
              <pre className="mt-4 overflow-auto rounded-xl bg-code p-4 font-mono text-xs text-muted-foreground">
                {g.c}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
