import React, { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Masquer le bouton si l'application est déjà exécutée en PWA autonome
  if (isInstalled) {
    return null;
  }

  // Installation sur Chrome / Android / Edge / Desktop
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
        title="Installer l'application sur votre appareil"
      >
        <span>📲</span>
        <span>Installer l'app</span>
      </button>
    );
  }

  // Guide d'installation sur iOS Safari
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
          title="Installer sur iPhone ou iPad"
        >
          <span>📲</span>
          <span>Installer</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="text-base font-semibold text-foreground">
                  Installer sur iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-full p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    1
                  </span>
                  <span>
                    Touchez le bouton <strong>Partager</strong> <span className="font-mono">⎋</span>{" "}
                    dans la barre Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    2
                  </span>
                  <span>
                    Faites défiler et sélectionnez <strong>Sur l'écran d'accueil</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    3
                  </span>
                  <span>
                    Touchez <strong>Ajouter</strong> en haut à droite.
                  </span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
