/* Kids Arcade offline helper.
   Open the arcade once on Wi-Fi: every game in offline-files.json is saved on this device.
   Online: always loads the newest version (falls back to the saved copy if the network is slow or gone).
   Offline: plays the saved copy. Web fonts used while online are kept too; without them the games use system fonts. */
const CACHE = "ka-offline-v1";
const NET_TIMEOUT_MS = 4000;
const NO_CACHE = /script\.google\.com|googleusercontent|photoslibrary|googleapis\.com\/(upload|v1)/;

async function precache() {
  const c = await caches.open(CACHE);
  let list = [];
  try { list = await (await fetch("offline-files.json", { cache: "no-store" })).json(); } catch (e) { return; }
  const base = self.registration.scope;
  await Promise.all(list.map(async (u) => {
    try {
      const abs = /^https?:/.test(u) ? u : new URL(u, base).href;
      const req = /^https?:/.test(u) && !abs.startsWith(base) ? new Request(abs, { mode: "no-cors" }) : new Request(abs, { cache: "no-cache" });
      const res = await fetch(req);
      if (res.ok || res.type === "opaque") await c.put(abs, res);
    } catch (e) {}
  }));
}

self.addEventListener("install", (e) => { e.waitUntil(precache().then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE && k.startsWith("ka-offline")) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener("message", (e) => { if (e.data === "ka-refresh") e.waitUntil(precache()); });

function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error("slow")), ms)); }

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || NO_CACHE.test(req.url)) return;
  const url = new URL(req.url);
  const same = req.url.startsWith(self.registration.scope);
  if (same) {
    // network first, saved copy if offline or slow
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const key = url.origin + url.pathname;
      try {
        const res = await Promise.race([fetch(req), timeout(NET_TIMEOUT_MS)]);
        if (res && res.ok) c.put(key, res.clone()).catch(() => {});
        return res;
      } catch (err) {
        const hit = (await c.match(key)) || (await c.match(key + "index.html")) ||
          (key.endsWith("/index.html") ? await c.match(key.slice(0, -10)) : null) ||
          (await c.match(req, { ignoreSearch: true }));
        if (hit) return hit;
        throw err;
      }
    })());
  } else if (url.origin === location.origin) {
    return; // other sites on github.io (Math Quest, Doodle Dash) handle themselves
  } else {
    // fonts and libraries from other sites: saved copy first
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = await c.match(req.url);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && (res.ok || res.type === "opaque")) c.put(req.url, res.clone()).catch(() => {});
      return res;
    })());
  }
});
