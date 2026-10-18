import { buildDoc, type Effect, type Values } from "@/lib/effects";

export function Preview({
  effect,
  values,
  className = "",
}: {
  effect: Effect;
  values?: Values;
  className?: string;
}) {
  return (
    <iframe
      title={effect.name}
      srcDoc={buildDoc(effect, values)}
      sandbox="allow-scripts"
      loading="lazy"
      className={`block h-full w-full border-0 ${className}`}
    />
  );
}
