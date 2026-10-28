/* Zlatni puls · service worker: aplikacija radi bez interneta, red se šalje kad se mreža vrati. */
var VERZIJA = 'zp-2026-10-28a';
var DATOTEKE = ['./', './index.html', './styles.css', './app.js', './sync.js', './scanner.js', './mediabunny.min.js', './manifest.webmanifest',
  './ikona-192.png', './ikona-512.png', './logo.jpg', './traka.png'];

importScripts('./sync.js');

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERZIJA).then(function (c) { return c.addAll(DATOTEKE.map(function (u) { return new Request(u, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (x) { return x !== VERZIJA; }).map(function (x) { return caches.delete(x); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;   // API pozivi idu ravno na mrežu
  // Najprije mreža (da se nova verzija odmah vidi), a bez interneta ili ako mreža kasni >4 s – spremljena kopija.
  e.respondWith(new Promise(function (resolve) {
    var gotovo = false;
    var izKesa = function () { return caches.match(e.request, { ignoreSearch: true }); };
    var t = setTimeout(function () { izKesa().then(function (r) { if (r && !gotovo) { gotovo = true; resolve(r); } }); }, 4000);
    fetch(e.request, { cache: 'no-cache' }).then(function (odg) {
      if (odg && odg.ok) { var kopija = odg.clone(); caches.open(VERZIJA).then(function (c) { c.put(e.request, kopija); }); }
      clearTimeout(t); if (!gotovo) { gotovo = true; resolve(odg); }
    }).catch(function () {
      clearTimeout(t); izKesa().then(function (r) { if (!gotovo) { gotovo = true; resolve(r || Response.error()); } });
    });
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
