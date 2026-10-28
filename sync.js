/* ═══════════════════════════════════════════════════════════════════════
   ZLATNI PULS · baza na mobitelu (IndexedDB) + red slanja (offline → Drive)
   Radi i na stranici i u service workeru (bez DOM-a).
   ═══════════════════════════════════════════════════════════════════════ */
var ZP = (typeof self !== 'undefined' ? self : window).ZP || {};
(typeof self !== 'undefined' ? self : window).ZP = ZP;

ZP.CHUNK = 4 * 1024 * 1024;     // 4 MB (višekratnik 256 KB)

/* ─── IndexedDB ─── */
ZP.db = function () {
  if (ZP._db) return ZP._db;
  ZP._db = new Promise(function (res, rej) {
    var r = indexedDB.open('zlatni-puls', 1);
    r.onupgradeneeded = function () {
      var d = r.result;
      if (!d.objectStoreNames.contains('red')) d.createObjectStore('red', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('kes')) d.createObjectStore('kes');
    };
    r.onsuccess = function () { res(r.result); };
    r.onerror = function () { rej(r.error); };
  });
  return ZP._db;
};
ZP.tx = function (store, mode, fn) {
  return ZP.db().then(function (d) {
    return new Promise(function (res, rej) {
      var t = d.transaction(store, mode), s = t.objectStore(store), out;
      var r = fn(s);
      if (r) r.onsuccess = function () { out = r.result; };
      t.oncomplete = function () { res(out); };
      t.onerror = function () { rej(t.error); };
      t.onabort = function () { rej(t.error); };
    });
  });
};
ZP.kesUzmi = function (k) { return ZP.tx('kes', 'readonly', function (s) { return s.get(k); }); };
ZP.kesSpremi = function (k, v) { return ZP.tx('kes', 'readwrite', function (s) { return s.put(v, k); }); };
ZP.redSvi = function () { return ZP.tx('red', 'readonly', function (s) { return s.getAll(); }).then(function (a) { return (a || []).sort(function (x, y) { return x.stvoreno - y.stvoreno; }); }); };
ZP.redSpremi = function (q) { return ZP.tx('red', 'readwrite', function (s) { return s.put(q); }); };
ZP.redObrisi = function (id) { return ZP.tx('red', 'readwrite', function (s) { return s.delete(id); }); };
ZP.uid = function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 10); };

/** Dodaj zadatak u red (sprema se odmah na mobitel; šalje se kad ima interneta). */
ZP.uRed = function (q) {
  q.id = q.id || ZP.uid();
  q.cid = q.cid || q.id;
  q.stvoreno = q.stvoreno || Date.now();
  q.status = 'ceka'; q.greska = ''; q.pokusaja = 0;
  return ZP.redSpremi(q).then(function () { ZP.obavijesti(); ZP.pokreni(); if (ZP.registrirajSync) ZP.registrirajSync(); return q; });
};

/* ─── poziv API-ja (Apps Script doPost) ─── */
ZP.postavke = function () {
  return ZP.kesUzmi('postavke').then(function (p) { return p || {}; });
};
ZP.api = function (akcija) {
  var args = Array.prototype.slice.call(arguments, 1);
  return ZP.postavke().then(function (p) {
    if (!p.url || !p.token) throw new Error('Aplikacija nije povezana – upišite adresu i pristupni ključ u Postavkama.');
    return fetch(p.url, {
      method: 'POST', redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ token: p.token, akcija: akcija, args: args })
    });
  }).then(function (r) {
    if (!r.ok) throw new Error('Poslužitelj je vratio ' + r.status);
    return r.json();
  }).then(function (j) {
    if (!j.ok) { var e = new Error(j.greska || 'Greška'); e.posluzitelj = true; throw e; }
    return j.rez;
  });
};

ZP.b64 = function (blob) {
  return blob.arrayBuffer().then(function (ab) {
    var u = new Uint8Array(ab), s = '', K = 0x8000;
    for (var i = 0; i < u.length; i += K) s += String.fromCharCode.apply(null, u.subarray(i, i + K));
    return btoa(s);
  });
};

/* ─── obrada reda ─── */
ZP.slusaci = [];
ZP.obavijesti = function (q) { ZP.slusaci.forEach(function (f) { try { f(q); } catch (e) {} }); };
ZP.naMrezi = function () { return typeof navigator === 'undefined' || navigator.onLine !== false; };

ZP.pokreni = function () {
  if (ZP._radi) return ZP._radi;
  var posao = function () {
    return ZP.redSvi().then(function (svi) {
      var q = svi.filter(function (x) { return x.status === 'ceka' || x.status === 'salje' || (x.status === 'greska' && x.privremena && x.pokusaja < 6); })[0];
      if (!q || !ZP.naMrezi()) return;
      q.status = 'salje'; q.greska = '';
      return ZP.redSpremi(q).then(function () { ZP.obavijesti(q); return ZP.obradi(q); }).then(function (rez) {
        q.status = 'gotovo'; q.rez = rez || q.rez || null; q.gotovo = Date.now(); delete q.blob;
        if (q.datoteke) q.datoteke.forEach(function (d) { delete d.blob; });
        return ZP.redSpremi(q);
      }, function (e) {
        q.pokusaja = (q.pokusaja || 0) + 1;
        q.status = 'greska'; q.greska = (e && e.message) || String(e);
        q.privremena = !e.posluzitelj || /zauzet|istekla|timeout|Service invoked too many|Prekoračen|try again/i.test(q.greska);
        return ZP.redSpremi(q).then(function () { if (q.privremena && ZP.naMrezi()) return new Promise(function (r) { setTimeout(r, 4000 * q.pokusaja); }); });
      }).then(function () { ZP.obavijesti(q); return posao(); });
    });
  };
  var omot = function () {
    if (typeof navigator !== 'undefined' && navigator.locks) return navigator.locks.request('zp-red', posao);
    return posao();
  };
  ZP._radi = omot().catch(function (e) { console.error(e); }).then(function () { ZP._radi = null; ZP.ocistiGotove(); ZP.obavijesti(); });
  return ZP._radi;
};

/** Gotove zadatke čuvamo 3 dana radi pregleda pa ih brišemo. */
ZP.ocistiGotove = function () {
  return ZP.redSvi().then(function (svi) {
    var granica = Date.now() - 3 * 864e5;
    return Promise.all(svi.filter(function (x) { return x.status === 'gotovo' && x.gotovo < granica; }).map(function (x) { return ZP.redObrisi(x.id); }));
  });
};

ZP.napredak = function (q, p) { q.napredak = p; ZP.obavijesti(q); };

/** Mapa termina na Driveu (stvara se pri prvom slanju) – pamti se na mobitelu. */
ZP.mapaTermina = function (t) {
  return ZP.kesUzmi('mapa_' + t.kljuc).then(function (m) {
    if (m && m.folderId) return m;
    return ZP.api('otvoriTermin', t).then(function (info) {
      var m2 = { folderId: info.folderId, folderUrl: info.folderUrl, prefiks: info.prefiks, prefiksPotpisne: info.prefiksPotpisne, nazivMape: info.nazivMape, putanja: info.putanja };
      return ZP.kesSpremi('mapa_' + t.kljuc, m2).then(function () { return m2; });
    });
  });
};

/** Predaja jedne datoteke (mala u jednom komadu, velika u dijelovima). */
ZP.predaj = function (q, folderId, naziv, blob, mime, cid, napredakFn) {
  if (blob.size <= ZP.CHUNK) {
    return ZP.b64(blob).then(function (b64) { napredakFn(.5); return ZP.api('spremiDatoteku', folderId, naziv, mime, b64, cid); })
      .then(function (r) { napredakFn(1); return r; });
  }
  return ZP.api('velikaStart', folderId, naziv, mime, blob.size, cid).then(function (s) {
    if (s.gotovo) { napredakFn(1); return { id: s.id, naziv: s.naziv }; }
    var start = 0;
    var dalje = function () {
      var dio = blob.slice(start, Math.min(start + ZP.CHUNK, blob.size));
      return ZP.b64(dio).then(function (b64) { return ZP.api('velikaDio', s.sesija, b64, start, blob.size); }).then(function (r) {
        start += dio.size; napredakFn(start / blob.size);
        return r.gotovo ? r : dalje();
      });
    };
    return dalje();
  });
};

ZP.obradi = function (q) {
  if (q.tip === 'datoteka') {
    return ZP.mapaTermina(q.termin).then(function (m) {
      var pot = q.vrsta === 'potpisna', nap = q.vrsta === 'napomena';   // nap = privitak napomene: Napomena_<mapa>_01.ext …
      var prefiks = pot ? m.prefiksPotpisne : nap ? 'Napomena_' + (m.nazivMape || m.prefiks) : m.prefiks;
      var naziv = q.naziv ? Promise.resolve(q.naziv) :
        ZP.api('rezervirajNaziv', m.folderId, prefiks, pot ? 'potpisna' : nap ? 'napomena' : 'media', q.ext).then(function (n) { q.naziv = n; return ZP.redSpremi(q).then(function () { return n; }); });
      return naziv.then(function (n) {
        return ZP.predaj(q, m.folderId, n, q.blob, q.mime, q.cid, function (p) { ZP.napredak(q, p); });
      }).then(function (r) {
        var dalje = pot ? ZP.api('potpisnaZabiljezi', q.termin, r.id, q.naziv).catch(function () {}) : Promise.resolve();
        return dalje.then(function () { return ZP.api('stanjeMape', m.folderId, q.termin).catch(function () { return null; }); })
          .then(function (st) { if (st) ZP.kesSpremi('stanje_' + q.termin.kljuc, st); return r; });
      });
    });
  }
  if (q.tip === 'napomena') {
    return ZP.api('napomena', q.termin, q.tekst, q.cid).then(function (r) {
      return ZP.mapaTermina(q.termin).then(function (m) { return ZP.api('stanjeMape', m.folderId, q.termin).catch(function () { return null; }); })
        .then(function (st) { if (st) ZP.kesSpremi('stanje_' + q.termin.kljuc, st); return r; });
    });
  }
  if (q.tip === 'vidljivost') {
    q.z.cid = q.cid;
    return ZP.api('vidljivostSpremi', q.z).then(function (v) {
      var i = 0, dat = q.datoteke || [];
      var sljedeca = function () {
        while (i < dat.length && dat[i].gotovo) i++;
        if (i >= dat.length) return Promise.resolve();
        var d = dat[i];
        var naziv = d.naziv ? Promise.resolve(d.naziv) : ZP.api('rezervirajNaziv', v.folderId, v.prefiks, 'media', d.ext).then(function (n) { d.naziv = n; return ZP.redSpremi(q).then(function () { return n; }); });
        return naziv.then(function (n) {
          return ZP.predaj(q, v.folderId, n, d.blob, d.mime, q.cid + '-' + i, function (p) { ZP.napredak(q, (i + p) / dat.length); });
        }).then(function () { d.gotovo = true; delete d.blob; i++; return ZP.redSpremi(q).then(sljedeca); });
      };
      return sljedeca().then(function () { return ZP.api('vidljivostDovrsi', v.id, v.folderId, v.prefiks); }).then(function () { return v; });
    });
  }
  if (q.tip === 'prijave') {
    q.p.cid = q.cid;
    return ZP.api('dodajPrijave', q.p);
  }
  return Promise.reject(new Error('Nepoznata vrsta zadatka'));
};
