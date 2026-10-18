import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { PWAInstallButton } from "@/components/PWAInstallButton";

const nav = [
  { to: "/bibliotheque", label: "Bibliothèque" },
  { to: "/documentation", label: "Intégration" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster richColors position="top-right" />
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand font-mono text-sm text-primary-foreground">
              ◐
            </span>
            Motion<span className="text-gradient">Kit</span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 text-sm">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="rounded-lg px-3 py-2 text-muted-foreground transition hover:text-foreground"
                  activeProps={{ className: "rounded-lg px-3 py-2 text-foreground bg-secondary" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <PWAInstallButton />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <p>MotionKit — composants animés prêts à intégrer.</p>
          <p className="font-mono text-xs">HTML · CSS · JS · zéro dépendance</p>
        </div>
      </footer>
    </div>
  );
}
