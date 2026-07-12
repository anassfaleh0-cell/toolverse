const CACHE_NAME = "nuvora-v1";
const STATIC_ASSETS = [
  /\.(js|css|svg|woff2?|ttf|eot|png|jpg|jpeg|webp|avif|wasm)(\?.*)?$/,
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : undefined));
      await clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithTimeout(request, 5000));
    return;
  }

  if (STATIC_ASSETS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirstWithTimeout(request, 5000));
});

async function networkFirstWithTimeout(request, timeout) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), timeout)
  );

  try {
    const response = await Promise.race([fetch(request), timeoutPromise]);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      "You are offline. Please check your connection.",
      { status: 503, headers: { "Content-Type": "text/plain" } }
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("", { status: 408 });
  }
}
