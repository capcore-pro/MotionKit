import { buildDoc, type Effect, type Values } from "@/lib/effects";

export interface Preset {
  id: string;
  name: string;
  bg: string;
  colors: string[];
}

export const PRESETS: Preset[] = [
  { id: "neon", name: "Néon Cyberpunk", bg: "#07060f", colors: ["#00f0ff", "#ff2bd6", "#8b5cff"] },
  { id: "luxe", name: "Monochrome Luxe", bg: "#0a0a0a", colors: ["#f5f5f4", "#d4af37", "#a8a29e"] },
  {
    id: "sunset",
    name: "Sunset Vibrant",
    bg: "#1a0b1f",
    colors: ["#ff7a18", "#ff3d77", "#a020f0"],
  },
  {
    id: "emeraude",
    name: "Émeraude Tech",
    bg: "#06131a",
    colors: ["#34f5c5", "#1e90ff", "#a7f3d0"],
  },
  {
    id: "cosmique",
    name: "Cosmos & Étoiles",
    bg: "#040612",
    colors: ["#38bdf8", "#f43f5e", "#a855f7"],
  },
];

/** Applies a palette to an effect: background goes to "bg", other colors in order. */
export function applyPreset(e: Effect, v: Values, p: Preset): Values {
  const next: Values = { ...v };
  let i = 0;
  for (const param of e.params) {
    if (param.type !== "color") continue;
    next[param.key] = param.key === "bg" ? p.bg : p.colors[i++ % p.colors.length];
  }
  return next;
}

export type Env = "sombre" | "clair" | "contenu";

const MOCK = `<div style="position:fixed;inset:0;display:grid;place-items:center;pointer-events:none;z-index:50;font-family:system-ui;text-align:center;padding:24px"><div><h1 style="margin:0;font-size:clamp(28px,5vw,52px);color:#fff;text-shadow:0 2px 20px #0008">Votre titre ici</h1><p style="color:#ffffffcc;max-width:440px;margin:12px auto 20px">Un paragraphe d'exemple pour vérifier la lisibilité du texte au-dessus de l'animation.</p><span style="display:inline-block;pointer-events:auto;background:#fff;color:#111;padding:10px 22px;border-radius:999px;font-weight:600">Bouton d'action</span></div></div>`;

export function previewDoc(e: Effect, v: Values, env: Env): string {
  const vals =
    env === "clair" && e.params.some((p) => p.key === "bg") ? { ...v, bg: "#f4f4f5" } : v;
  const doc = buildDoc(e, vals);
  return env === "contenu" ? doc.replace("</body>", `${MOCK}\n</body>`) : doc;
}

const pascal = (id: string) =>
  id
    .split(/[-_]/)
    .map((s) => (s[0] ?? "").toUpperCase() + s.slice(1))
    .join("");

export function reactCode(e: Effect, v: Values): string {
  const { html, css, js } = e.generate(v);
  const name = pascal(e.id);
  return `import { useEffect, useRef } from "react";

const css = ${JSON.stringify(css)};
const html = ${JSON.stringify(html)};

export default function ${name}() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = html;${
      js
        ? `
    const script = document.createElement("script");
    script.textContent = ${JSON.stringify(`(()=>{${js}})()`)};
    ref.current.appendChild(script);`
        : ""
    }
  }, []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} />
    </>
  );
}
`;
}

export function embedCode(e: Effect, v: Values): string {
  const { html, css, js } = e.generate(v);
  return `<!-- MotionKit · ${e.name} — collez ce bloc dans un "Embed" (Webflow, Framer) ou un bloc HTML personnalisé (WordPress) -->
<style>
${css}
</style>
${html}${js ? `\n<script>\n(()=>{\n${js}\n})();\n</script>` : ""}`;
}

/** Minimal escaped syntax highlighter returning HTML spans. */
export function highlight(code: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const re =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(<\/?[a-zA-Z][\w-]*)|(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|s|ms|%|vw|vh|deg|em|rem|vmax)?\b)|\b(const|let|var|function|return|import|export|default|from|if|else|for|while|new|useEffect|useRef)\b/g;
  let out = "",
    last = 0,
    m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    const cls = m[1] ? "hl-c" : m[2] ? "hl-s" : m[3] ? "hl-t" : m[4] ? "hl-n" : "hl-k";
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = re.lastIndex;
  }
  return out + esc(code.slice(last));
}
