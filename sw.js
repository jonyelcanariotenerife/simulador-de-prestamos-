// Service Worker - Simulador de Préstamos Pro
// Sube la versión (CACHE_VERSION) cada vez que cambies simulador.html para forzar
// que los usuarios reciban la versión nueva.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `simulador-prestamos-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  './simulador.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
  './favicon.ico'
];

// Instalación: precachea el "esqueleto" de la app
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// Activación: elimina cachés de versiones anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('simulador-prestamos-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Estrategia de red:
// - Para el propio HTML/manifest/iconos: "network falling back to cache" (si hay
//   internet, siempre coge lo último; si no, usa lo guardado -> funciona offline).
// - Para librerías externas (Chart.js, FontAwesome vía CDN): "cache first" para
//   que carguen rápido y funcionen también sin conexión una vez visitadas.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Si piden la página principal y no hay nada cacheado, intenta servir simulador.html
    if (request.mode === 'navigate') {
      const fallback = await cache.match('./simulador.html');
      if (fallback) return fallback;
    }
    throw err;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    throw err;
  }
}
