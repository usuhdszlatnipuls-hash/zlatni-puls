/* Zlatni puls · service worker: aplikacija radi bez interneta, red se šalje kad se mreža vrati. */
var VERZIJA = 'zp-2026-10-26a';
var DATOTEKE = ['./', './index.html', './styles.css', './app.js', './sync.js', './scanner.js', './manifest.webmanifest',
  './ikona-192.png', './ikona-512.png', './logo.jpg', './traka.png'];

importScripts('./sync.js');

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERZIJA).then(function (c) { return c.addAll(DATOTEKE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (x) { return x !== VERZIJA; }).map(function (x) { return caches.delete(x); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;   // API pozivi idu ravno na mrežu
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) {
    var mreza = fetch(e.request).then(function (odg) {
      if (odg && odg.ok) { var kopija = odg.clone(); caches.open(VERZIJA).then(function (c) { c.put(e.request, kopija); }); }
      return odg;
    }).catch(function () { return r; });
    return r || mreza;
  }));
});

/* Pozadinska sinkronizacija (Android Chrome): pošalji red i kad je aplikacija zatvorena. */
self.addEventListener('sync', function (e) {
  if (e.tag === 'zp-red') e.waitUntil(ZP.pokreni());
});
self.addEventListener('periodicsync', function (e) {
  if (e.tag === 'zp-red') e.waitUntil(ZP.pokreni());
});
self.addEventListener('message', function (e) {
  if (e.data === 'posalji') e.waitUntil(ZP.pokreni());
});
