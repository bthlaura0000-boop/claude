/* Cartea Fermecată — service worker
   Enables "install as app" + offline use of the shell, fonts and the OCR engine.
   NOTE: translation services (Google/Lingva/MyMemory) and Gemini always need the
   network, so they are never cached. OCR works offline only AFTER a first online
   run (the engine + Norwegian data are cached on first use). */
const CACHE = "cartea-fermecata-v1";

// App shell precached at install time (all relative -> works under any subpath)
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-maskable.svg"
];

// Cross-origin hosts we WANT to cache at runtime (fonts + OCR engine + language data)
const RUNTIME_HOSTS = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "cdn.jsdelivr.net",              // tesseract.js + wasm core
  "tessdata.projectnaptha.com"     // tesseract language data (nor.traineddata)
];

// Hosts that must NEVER be cached (dynamic translation / AI — always fresh)
const NO_CACHE_HOSTS = [
  "translate.googleapis.com",
  "lingva.ml",
  "api.mymemory.translated.net",
  "generativelanguage.googleapis.com"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  let url;
  try { url = new URL(req.url); } catch (_) { return; }

  // Always hit the network for translation / AI endpoints
  if (NO_CACHE_HOSTS.some((h) => url.hostname.includes(h))) return;

  const sameOrigin = url.origin === self.location.origin;
  const runtimeOk = RUNTIME_HOSTS.some((h) => url.hostname.includes(h));
  if (!sameOrigin && !runtimeOk) return; // let the browser handle anything else

  // Cache-first, then network (and refresh the cache in the background)
  e.respondWith(
    caches.match(req).then((hit) => {
      const fetchPromise = fetchAndCache(req);
      if (hit) { fetchPromise.catch(() => {}); return hit; }
      return fetchPromise.catch(() =>
        sameOrigin ? caches.match("./index.html") : Response.error()
      );
    })
  );
});

function fetchAndCache(req) {
  return fetch(req).then((res) => {
    // cache successful and opaque (cross-origin no-cors) responses
    if (res && (res.ok || res.type === "opaque")) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
    }
    return res;
  });
}
