/* Home with Lana · Studio  service worker */
const V = 'studio-v2';
const SHELL = ['./','index.html','styles.css','data.js','visuals.js','app.js','manifest.webmanifest','favicon.svg','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; /* fonts and the like go straight to the network */
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(V).then(c => c.put(e.request, copy)).catch(() => {}); }
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
