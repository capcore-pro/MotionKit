// Service Worker PWA - MotionKit / Doodle Dynamic Library
// Stratégie "Network-First" pour forcer la mise à jour immédiate à chaque déploiement

const CACHE_VERSION = "motionkit-v2-" + Date.now();
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PRECACHE_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
];

// 1. Installation immédiate sans attendre la fermeture des onglets existants
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .catch((err) => console.warn("[SW] Précache initial partiel:", err)),
  );
});

// 2. Activation immédiate et nettoyage radical des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Prise de contrôle de tous les clients ouverts immédiatement
      self.clients.claim(),
      // Suppression de tous les anciens caches de versions précédentes
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (!key.startsWith(CACHE_VERSION)) {
              console.log("[SW] Suppression de l'ancien cache:", key);
              return caches.delete(key);
            }
          }),
        );
      }),
    ]),
  );
});

// 3. Gestion des messages (ex: forcer skipWaiting depuis le client)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// 4. Stratégie de requêtes :
// - Requêtes de navigation (HTML) : Toujours NETWORK-FIRST pour voir le déploiement immédiatement
// - Requêtes API / ServerFn : Toujours NETWORK-ONLY
// - Assets statiques (CSS, JS, Fonts, Images) : Stale-While-Revalidate avec mise à jour en tâche de fond
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ignorer les requêtes non-GET et les schémas non supportés (chrome-extension, etc.)
  if (request.method !== "GET" || !request.url.startsWith("http")) {
    return;
  }

  const url = new URL(request.url);

  // Appels serveur / API : pas de mise en cache
  if (url.pathname.includes("/_serverFn") || url.pathname.startsWith("/api/")) {
    return;
  }

  // NAVIGATION (pages HTML) : Toujours aller chercher sur le réseau en premier pour garantir l'immédiateté des mises à jour
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // En cas de panne réseau ou mode hors-ligne, utiliser la version en cache
          return caches.match(request).then((cached) => {
            return cached || caches.match("/");
          });
        }),
    );
    return;
  }

  // ASSETS ET RESSOURCES STATIQUES : Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    }),
  );
});
