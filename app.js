/* ═══════════════════════════════════════════════════════════════════════
   ZLATNI PULS · jedinstvena mobilna aplikacija
   Provedba aktivnosti · Komunikacija i vidljivost · Prijave na aktivnosti
   Sve se sprema na mobitel i šalje na Drive kad ima interneta.
   ═══════════════════════════════════════════════════════════════════════ */
var VERZIJA_APP = '2026-11-13d';
var DANI = ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'];
var MJ = ['siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'];
var MJ_GEN = ['siječnja', 'veljače', 'ožujka', 'travnja', 'svibnja', 'lipnja', 'srpnja', 'kolovoza', 'rujna', 'listopada', 'studenoga', 'prosinca'];
var LOKACIJE = ['Dugo Selo', 'Brckovljani', 'Rugvica'];
var MAX_FOTO_ORIGINAL = 8 * 1024 * 1024;

/* Kategorije vidljivosti (iste kao na poslužitelju – ZP_Vidljivost.gs) */
var KATEGORIJE = [
  { id: 'drustvene', naziv: 'Društvene mreže', dulje: 'Društvene mreže (objava)', kanali: ['FB', 'IG', 'TikTok', 'X', 'WhatsApp'], cilj: 0 },
  { id: 'video', naziv: 'Promotivni video', dulje: 'Promotivni video (web i društvene mreže)', kanali: ['FB', 'IG', 'TikTok', 'X', 'YouTube', 'Web'], cilj: 12 },
  { id: 'web_esf', naziv: 'Web – objava ESF+', dulje: 'Web – objava o potpori ESF+', kanali: ['Web'], cilj: 1 },
  { id: 'web', naziv: 'Web stranica', dulje: 'Web stranica (ostale objave)', kanali: ['Web'], cilj: 0 },
  { id: 'plakati', naziv: 'Plakati (min. A2)', dulje: 'Plakati (min. A2)', kanali: ['Plakat'], cilj: 50, brojKomada: true },
  { id: 'letci', naziv: 'Letci', dulje: 'Letci', kanali: ['Letak'], cilj: 2500, brojKomada: true, obavezanBroj: true },
  { id: 'vanjsko', naziv: 'Jumbo / city light', dulje: 'Vanjsko oglašavanje (jumbo plakat / city light)', kanali: ['Jumbo plakat', 'City light'], cilj: 3 },
  { id: 'mediji', naziv: 'Mediji i portali', dulje: 'Mediji – PR članci i portali', kanali: ['Portal', 'Novine', 'Radio', 'TV'], cilj: 0 },
  { id: 'rollup', naziv: 'Roll-up banner', dulje: 'Roll-up banner', kanali: ['Roll-up'], cilj: 1 },
  { id: 'dogadjanja', naziv: 'Događanja', dulje: 'Događanja i predstavljanja projekta', kanali: ['Događanje'], cilj: 0 },
  { id: 'sastanak', naziv: 'Kvartalni sastanak', dulje: 'Kvartalni sastanak partnera (komunikacija)', kanali: ['Sastanak'], cilj: 4 }
];
var POZNATE_ORG = ['Grad Dugo Selo', 'Općina Rugvica', 'Općina Brckovljani', 'Crveni križ Dugo Selo', 'SUH Dugo Selo', 'SUH Rugvica',
  'USUH Dugo Selo', 'Gradska udruga umirovljenika Dugo Selo', 'KUD Preporod Dugo Selo', 'Udruga Crne mambe', 'Udruga umirovljenika Brckovljani', 'Hrvatski vitezovi',
  'Gradska knjižnica Dugo Selo', 'Dom zdravlja Dugo Selo', 'Radio Martin', 'Dugoselska kronika', 'Prigorski.hr', 'Zagrebački.hr', 'Dugoselski.hr'];

var S = { tab: 'provedba', datum: danas(), mjesec: danas().slice(0, 7), termin: null, prijaveMjesec: danas().slice(0, 7), korisnici: null };

/* ─── ikone ─── */
var I = {
  lijevo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  desno: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
  foto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></svg>',
  lista: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h7"/></svg>',
  galerija: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>',
  mapa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h6l2 2h10v10H3z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  kal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  izv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h10l4 4v14H5z"/><path d="M8 13l3 3 5-6"/></svg>',
  olovka: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>',
  x: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  ispis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/></svg>'
};

/* ─── pomoćne ─── */
function $(s, el) { return (el || document).querySelector(s); }
function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function pad(n) { return (n < 10 ? '0' : '') + n; }
function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function danas() { return ymd(new Date()); }
function odYmd(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function pomakni(s, n) { var d = odYmd(s); d.setDate(d.getDate() + n); return ymd(d); }
function pomakniMj(ym, n) { var p = ym.split('-'); var d = new Date(+p[0], +p[1] - 1 + n, 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
function nazivMj(ym) { var p = ym.split('-'); return MJ[+p[1] - 1] + ' ' + p[0] + '.'; }
function lijepDatum(s) { var d = odYmd(s); return DANI[d.getDay()] + ', ' + d.getDate() + '. ' + MJ_GEN[d.getMonth()] + ' ' + d.getFullYear() + '.'; }
function kratkiDatum(s) { var d = odYmd(s); return d.getDate() + '.' + (d.getMonth() + 1) + '.'; }
function mb(b) { return (b / 1048576).toFixed(b > 10485760 ? 0 : 1) + ' MB'; }
function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').trim(); }
function toast(t, ms) {
  var el = document.createElement('div'); el.className = 'toast'; el.textContent = t;
  document.body.appendChild(el); setTimeout(function () { el.remove(); }, ms || 2800);
}
function greska(e) { console.error(e); toast('Greška: ' + ((e && e.message) || e), 6000); }
function vrijemeT(t) { return (t.pocetak || '') + (t.zavrsetak && t.zavrsetak !== t.pocetak ? '–' + t.zavrsetak : ''); }
function naMrezi() { return navigator.onLine !== false; }
function ekstenzija(file, zadano) {
  var m = /\.([a-z0-9]{2,4})$/i.exec(file.name || '');
  if (m) return m[1].toLowerCase().replace('jpeg', 'jpg').replace('heic', 'jpg');
  var t = (file.type || '').split('/')[1] || zadano;
  return t.replace('jpeg', 'jpg').replace('quicktime', 'mov').replace(/;.*/, '');
}
/** Otvara odabir datoteke: kamera (capture) ili galerija. */
function odaberi(accept, kamera, vise, cb) {
  var inp = document.createElement('input'); inp.type = 'file'; inp.accept = accept;
  if (kamera) inp.setAttribute('capture', 'environment');
  if (vise) inp.multiple = true;
  inp.style.display = 'none'; document.body.appendChild(inp);
  inp.onchange = function () { var f = Array.prototype.slice.call(inp.files || []); inp.remove(); if (f.length) cb(f); };
  inp.click();
}

/* ─── DRAG & DROP i LIJEPLJENJE (Ctrl+V) datoteka s računala ─── */
function vrijemeOznaka() { var d = new Date(); return ymd(d) + '_' + pad(d.getHours()) + '-' + pad(d.getMinutes()) + '-' + pad(d.getSeconds()); }
/** Slike iz međuspremnika dobivaju naziv Screenshot_<datum-vrijeme>.png (ili .jpg). */
function datotekeIzMedjuspremnika(cd) {
  var out = [], oznaka = vrijemeOznaka();
  Array.prototype.slice.call((cd && cd.items) || []).forEach(function (it) {
    if (it.kind !== 'file') return;
    var f = it.getAsFile(); if (!f) return;
    if (/^image\//.test(f.type)) {
      var ext = /jpe?g/i.test(f.type) ? 'jpg' : (f.type.split('/')[1] || 'png').replace(/[^a-z0-9]/gi, '').slice(0, 4);
      var ime = 'Screenshot_' + oznaka + (out.length ? '_' + (out.length + 1) : '') + '.' + ext;
      try { f = new File([f], ime, { type: f.type, lastModified: Date.now() }); } catch (e) { f.name2 = ime; }
    }
    out.push(f);
  });
  if (!out.length && cd && cd.files && cd.files.length) out = Array.prototype.slice.call(cd.files);
  return out;
}
function imaDatoteka(e) { var t = e.dataTransfer && e.dataTransfer.types; return !!t && Array.prototype.indexOf.call(t, 'Files') >= 0; }
/** Zona za ispuštanje: el dobiva obrub dok se datoteka vuče iznad nje; cb(files) prima ispuštene datoteke. */
function zonaIspustanja(el, cb) {
  if (!el) return;
  var dubina = 0;
  el.addEventListener('dragenter', function (e) { if (!imaDatoteka(e)) return; e.preventDefault(); dubina++; el.classList.add('drop-on'); });
  el.addEventListener('dragover', function (e) { if (!imaDatoteka(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
  el.addEventListener('dragleave', function () { dubina = Math.max(0, dubina - 1); if (!dubina) el.classList.remove('drop-on'); });
  el.addEventListener('drop', function (e) {
    if (!imaDatoteka(e)) return;
    e.preventDefault(); e.stopPropagation(); dubina = 0; el.classList.remove('drop-on');
    var f = Array.prototype.slice.call(e.dataTransfer.files || []);
    if (f.length) cb(f);
  });
}
function jeSlika(f) { return /^image\//.test(f.type || '') || /\.(jpe?g|png|gif|webp|heic|bmp)$/i.test(f.name || ''); }
function jeVideo(f) { return /^video\//.test(f.type || '') || /\.(mp4|mov|webm|3gp|m4v|avi|mkv)$/i.test(f.name || ''); }
function jePdf(f) { return f.type === 'application/pdf' || /\.pdf$/i.test(f.name || ''); }
var SAVJET_ISPUSTANJA = '<p class="muted small savjet-drop">Na računalu: povucite datoteke ovamo ili zalijepite snimku zaslona (Ctrl+V).</p>';

function thumbnail(file) {
  if (!/^image\//.test(file.type || '')) return Promise.resolve('');
  return createImageBitmap(file).then(function (bmp) {
    var c = document.createElement('canvas'), k = 120 / Math.max(bmp.width, bmp.height);
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', .7);
  }).catch(function () { return ''; });
}
/** Fotografija: najviše 1920 px po duljoj strani, JPEG 80 % (obično 0,3–0,8 MB umjesto 3–8 MB). */
var FOTO_MAX_PX = 1920, FOTO_KVALITETA = 0.8;
function smanjiFoto(file) {
  if (file.size <= 700 * 1024 && /jpe?g/i.test(file.type)) return Promise.resolve({ blob: file, mime: 'image/jpeg', ext: 'jpg' });
  return createImageBitmap(file, { imageOrientation: 'from-image' }).then(function (bmp) {
    var k = Math.min(1, FOTO_MAX_PX / Math.max(bmp.width, bmp.height));
    var c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    var x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(bmp, 0, 0, c.width, c.height);
    if (bmp.close) bmp.close();
    return new Promise(function (res) {
      c.toBlob(function (b) { res(b && b.size < file.size ? { blob: b, mime: 'image/jpeg', ext: 'jpg' } : { blob: file, mime: file.type || 'image/jpeg', ext: ekstenzija(file, 'jpg') }); }, 'image/jpeg', FOTO_KVALITETA);
    });
  });
}

/** Video: 720p (najviše 1280 px po duljoj strani), ~1,8 Mbit/s, MP4 – oko 13 MB po minuti.
 *  Radi na mobitelu (WebCodecs, hardversko kodiranje). Ako preglednik ne može, šalje se original. */
var VIDEO_MAX_PX = 1280, VIDEO_BITRATE = 1800000, AUDIO_BITRATE = 96000;
function smanjiVideo(file, naNapredak) {
  var MB = window.Mediabunny;
  var original = { blob: file, mime: file.type || 'video/mp4', ext: ekstenzija(file, 'mp4'), smanjeno: false };
  if (!MB || typeof VideoEncoder === 'undefined' || file.size < 8 * 1024 * 1024) return Promise.resolve(original);
  var input, conv;
  var aac = MB.canEncodeAudio ? MB.canEncodeAudio('aac').catch(function () { return false; }) : Promise.resolve(false);
  var avc = MB.canEncodeVideo ? MB.canEncodeVideo('avc').catch(function () { return false; }) : Promise.resolve(false);
  return Promise.all([aac, avc]).then(function (mog) {
    var imaAac = mog[0], imaAvc = mog[1];
    var audioOpcije = { bitrate: AUDIO_BITRATE };
    if (imaAac) audioOpcije.codec = 'aac';        // AAC se reproducira svugdje (Windows, iPhone, e-Kohezija)
    input = new MB.Input({ formats: MB.ALL_FORMATS, source: new MB.BlobSource(file) });
    var output = new MB.Output({ format: new MB.Mp4OutputFormat({ fastStart: 'in-memory' }), target: new MB.BufferTarget() });
    return MB.Conversion.init({
      input: input, output: output, showWarnings: false,
      video: function (track) {
        var w = track.displayWidth, h = track.displayHeight, o = { bitrate: VIDEO_BITRATE, forceTranscode: true };
        if (imaAvc) o.codec = 'avc';              // H.264 – reproducira se na svakom računalu i mobitelu
        if (Math.max(w, h) > VIDEO_MAX_PX) { if (w >= h) o.width = VIDEO_MAX_PX; else o.height = VIDEO_MAX_PX; }
        return o;
      },
      audio: audioOpcije
    }).then(function (c) {
      conv = c;
      if (!c.isValid) throw new Error('pretvorba nije moguća');
      c.onProgress = function (p) { if (naNapredak) naNapredak(p); };
      return c.execute();
    }).then(function () {
      var buf = output.target.buffer;
      if (!buf || buf.byteLength < 1000 || buf.byteLength >= file.size * 0.9) return original;
      var b = new Blob([buf], { type: 'video/mp4' });
      return { blob: b, mime: 'video/mp4', ext: 'mp4', smanjeno: true };
    });
  }).catch(function (e) { console.warn('Video nije smanjen:', e); return original; })
    .then(function (r) { try { input && input.dispose && input.dispose(); } catch (e) {} return r; });
}

/** Obrada jedna po jedna (štedi memoriju mobitela) uz traku napretka na dnu zaslona. */
S.obrada = Promise.resolve(); S.uObradi = 0;
function uObradu(opis, posao) {
  S.uObradi++; trakaObrade(opis, 0);
  var p = S.obrada.then(function () { trakaObrade(opis, 0); return posao(function (x) { trakaObrade(opis, x); }); });
  S.obrada = p.catch(function () {}).then(function () { S.uObradi--; trakaObrade(); });
  return p;
}
function trakaObrade(opis, x) {
  var el = $('#obradaTraka');
  if (!S.uObradi || !opis) { if (el && !S.uObradi) el.remove(); return; }
  if (!el) { el = document.createElement('div'); el.id = 'obradaTraka'; el.className = 'obradaTraka'; document.body.appendChild(el); }
  el.innerHTML = '<b>' + esc(opis) + (S.uObradi > 1 ? ' (još ' + (S.uObradi - 1) + ')' : '') + '</b> ' + (x ? Math.round(x * 100) + ' %' : '') +
    '<div class="bar"><i style="width:' + Math.round((x || 0) * 100) + '%"></i></div>';
}

function trajanjeVidea(file) {
  return new Promise(function (res) {
    var v = document.createElement('video'); v.preload = 'metadata'; v.muted = true;
    var url = URL.createObjectURL(file);
    var gotovo = function (d) { URL.revokeObjectURL(url); res(d); };
    v.onloadedmetadata = function () { gotovo(isFinite(v.duration) ? v.duration : 0); };
    v.onerror = function () { gotovo(0); };
    setTimeout(function () { gotovo(0); }, 8000);
    v.src = url;
  });
}

/* ─── podaci s poslužitelja uz pričuvnu kopiju na mobitelu ─── */
function sKesom(kljuc, akcija, args, svjeze) {
  var izMreze = function () {
    return ZP.api.apply(null, [akcija].concat(args || [])).then(function (r) { ZP.kesSpremi(kljuc, { vrijeme: Date.now(), r: r }); return r; });
  };
  return ZP.kesUzmi(kljuc).then(function (k) {
    if (k && (!svjeze || !naMrezi())) {
      if (naMrezi() && Date.now() - k.vrijeme > 5 * 60000) izMreze().then(function () { if (S.osvjezi) S.osvjezi(); }).catch(function () {});
      return k.r;
    }
    if (!naMrezi()) { if (k) return k.r; throw new Error('Nema interneta, a ovi podaci još nisu spremljeni na mobitel.'); }
    return izMreze().catch(function (e) { if (k) return k.r; throw e; });
  });
}
function terminiMjeseca(ym, svjeze) {
  var p = ym.split('-'), zadnji = new Date(+p[0], +p[1], 0).getDate();
  return sKesom('termini_' + ym, 'termini', [ym + '-01', ym + '-' + pad(zadnji)], svjeze);
}
function korisnici(svjeze) { return sKesom('korisnici', 'korisnici', [], svjeze).then(function (k) { S.korisnici = k; return k; }); }

/** Lokalni red (što čeka slanje) za termin / vrstu. */
function redZa(filter) { return ZP.redSvi().then(function (svi) { return svi.filter(filter); }); }

/* ─── okvir: kartice, stanje mreže ─── */
function postaviTab(tab) {
  S.tab = tab; S.osvjezi = null;
  $$('#tabs button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === tab); });
  $('#podnaslov').textContent = { provedba: 'Provedba aktivnosti', vidljivost: 'Komunikacija i vidljivost', prijave: 'Prijave na aktivnosti', hodogram: 'Hodogram i pokazatelji', pregled: 'Pregled evidencije', slanje: 'Slanje i postavke' }[tab];
  window.scrollTo(0, 0);
  ({ provedba: pocetnaProvedba, vidljivost: pocetnaVidljivost, prijave: pocetnaPrijave, hodogram: pocetnaHodogram, pregled: pocetnaPregled, slanje: pocetnaSlanje })[tab]();
}
/** Kamo idu datoteke ispuštene/zalijepljene izvan zona: otvoreni termin ili novi element vidljivosti. */
function ciljUmetanja() {
  if (S.tab === 'provedba' && S.termin && $('#tSadrzaj')) { var t = S.termin; return function (f, uNap) { rasporediUTermin(t, f, uNap); }; }
  if (S.tab === 'vidljivost' && S.vid && S.vid.dodajDokaz && $('#vDat')) { var V = S.vid; return function (f) { V.dodajDokaz(f); toast('Dodano u dokaz: ' + f.length + '.'); }; }
  return null;
}
function osvjeziStanjeMreze() {
  ZP.redSvi().then(function (svi) {
    var ceka = svi.filter(function (q) { return q.status !== 'gotovo'; });
    var salje = svi.some(function (q) { return q.status === 'salje'; });
    var b = $('#mreza');
    b.className = 'mreza' + (!naMrezi() ? ' off' : salje ? ' salje' : '');
    b.textContent = !naMrezi() ? (ceka.length ? 'Bez mreže · čeka ' + ceka.length : 'Bez mreže') : salje ? 'Šaljem… (' + ceka.length + ')' : ceka.length ? 'Čeka ' + ceka.length : 'Sve poslano ✓';
    var bd = $('#badge'); bd.textContent = ceka.length; bd.classList.toggle('hidden', !ceka.length);
  });
}
ZP.slusaci.push(function (q) {
  osvjeziStanjeMreze();
  if (S.naPromjenuReda) { clearTimeout(S._t); S._t = setTimeout(function () { if (S.naPromjenuReda) S.naPromjenuReda(q); }, q && q.status === 'salje' && q.napredak ? 150 : 50); }
});
ZP.registrirajSync = function () {
  if (navigator.serviceWorker && navigator.serviceWorker.ready) {
    navigator.serviceWorker.ready.then(function (r) { if (r.sync) return r.sync.register('zp-red'); }).catch(function () {});
  }
};

/* ═══ 1. PROVEDBA AKTIVNOSTI ═════════════════════════════════════════ */
function pocetnaProvedba() {
  S.termin = null; S.naPromjenuReda = null;
  var app = $('#app');
  app.innerHTML =
    '<div class="datebar"><button class="iconbtn" id="prev" aria-label="Prethodni dan">' + I.lijevo + '</button>' +
    '<div class="dan"><b>' + esc(lijepDatum(S.datum)) + '</b><input type="date" id="odabirDatuma" value="' + S.datum + '"></div>' +
    '<button class="iconbtn" id="next" aria-label="Sljedeći dan">' + I.desno + '</button></div>' +
    '<div id="lista"><div class="spinner"></div></div>' +
    '<div class="btnrow"><button class="btn ghost" id="danas">' + I.kal + 'Danas</button><button class="btn ghost" id="pregledMj">' + I.lista + 'Što nedostaje</button></div>';
  $('#prev').onclick = function () { S.datum = pomakni(S.datum, -1); pocetnaProvedba(); };
  $('#next').onclick = function () { S.datum = pomakni(S.datum, 1); pocetnaProvedba(); };
  $('#danas').onclick = function () { S.datum = danas(); pocetnaProvedba(); };
  $('#odabirDatuma').onchange = function (e) { if (e.target.value) { S.datum = e.target.value; pocetnaProvedba(); } };
  $('#pregledMj').onclick = pregledMjeseca;
  var crtaj = function () {
    return Promise.all([terminiMjeseca(S.datum.slice(0, 7)), redZa(function (q) { return q.termin && q.status !== 'gotovo'; })]).then(function (r) {
      if (S.tab !== 'provedba' || S.termin) return;
      var lista = r[0].filter(function (t) { return t.datum === S.datum; }), red = r[1];
      var el = $('#lista');
      if (!lista.length) { el.innerHTML = '<div class="prazno">Za ovaj dan nema aktivnosti u kalendaru.</div>'; return; }
      el.innerHTML = lista.map(function (t, i) { return karticaTermina(t, i, red.filter(function (q) { return q.termin.kljuc === t.kljuc; })); }).join('');
      lista.forEach(function (t, i) { $('#t' + i).onclick = function () { otvoriTermin(t); }; });
    }).catch(function (e) { $('#lista').innerHTML = '<div class="obavijest bad">' + esc(e.message) + '</div>'; });
  };
  S.osvjezi = crtaj; S.naPromjenuReda = crtaj;
  crtaj();
}

function karticaTermina(t, i, red) {
  var s = t.stanje, cls = s ? (s.status === 'POTPUNO' ? 'potpuno' : 'nepotpuno') : '';
  var chips = '';
  if (s) {
    chips += '<span class="chip ' + (s.fotografije >= 2 ? 'ok' : 'bad') + '">Foto ' + s.fotografije + '</span>';
    chips += '<span class="chip ' + (s.video >= 1 ? 'ok' : 'bad') + '">Video ' + s.video + '</span>';
    chips += '<span class="chip ' + (s.potpisne >= 1 ? 'ok' : 'bad') + '">Lista ' + s.potpisne + '</span>';
    chips += '<span class="chip ' + (s.izvjesce ? 'ok' : 'warn') + '">Izvješće ' + (s.izvjesce ? '✓' : '–') + '</span>';
  } else chips += '<span class="chip">Još ništa predano</span>';
  if (red.length) chips += '<span class="chip gold">Na mobitelu čeka ' + red.length + '</span>';
  return '<button class="card termin ' + cls + '" id="t' + i + '"><div class="red1"><span class="naziv">' + esc(t.kratko || t.aktivnost) + '</span>' +
    '<span class="vrijeme">' + esc(vrijemeT(t)) + '</span></div>' +
    '<div class="mjesto">' + esc(t.sifra) + ' · ' + esc(t.lokacija) + (t.mjesto ? ' · ' + esc(t.mjesto) : '') + (t.voditelj ? ' · ' + esc(t.voditelj) : '') + '</div>' +
    '<div class="chips">' + chips + '</div></button>';
}

function pregledMjeseca() {
  var ym = S.datum.slice(0, 7);
  $('#app').innerHTML = '<button class="btn link back" id="natrag">' + I.lijevo + 'Natrag</button><h2>Što nedostaje – ' + esc(nazivMj(ym)) + '</h2><div id="pl"><div class="spinner"></div></div>';
  $('#natrag').onclick = pocetnaProvedba;
  terminiMjeseca(ym, true).then(function (lista) {
    var dan = danas();
    var nep = lista.filter(function (t) { return t.datum <= dan && (!t.stanje || t.stanje.status !== 'POTPUNO'); });
    var bezIzv = lista.filter(function (t) { return t.stanje && t.stanje.status === 'POTPUNO' && !t.stanje.izvjesce; });
    var red = function (t) {
      var s = t.stanje || { fotografije: 0, video: 0, potpisne: 0 }, f = [];
      if (s.fotografije < 2) f.push('fotografije (' + s.fotografije + '/2)');
      if (s.video < 1) f.push('video');
      if (s.potpisne < 1) f.push('potpisna lista');
      return '<li data-k="' + esc(t.kljuc) + '"><span class="ime"><b>' + kratkiDatum(t.datum) + ' ' + esc(t.pocetak) + '</b> ' + esc(t.kratko || t.aktivnost) + ' · ' + esc(t.lokacija) +
        '<br><span class="muted small">' + (f.length ? 'Nedostaje: ' + f.join(', ') : 'Čeka pripremu i izvješće') + '</span></span>' + I.desno + '</li>';
    };
    $('#pl').innerHTML = '<div class="card"><h3>Nepotpuno (' + nep.length + ')</h3>' + (nep.length ? '<ul class="popis">' + nep.map(red).join('') + '</ul>' : '<p class="muted">Sve održane aktivnosti imaju dokaze. 🎉</p>') + '</div>' +
      '<div class="card"><h3>Dokazi predani, čeka se izvješće (' + bezIzv.length + ')</h3>' + (bezIzv.length ? '<ul class="popis">' + bezIzv.map(red).join('') + '</ul>' : '<p class="muted">Nema.</p>') +
      '<p class="muted small">Pripremu i izvješće piše Claude u tjednom zadatku i sprema ih u mapu termina.</p></div>';
    $$('#pl li[data-k]').forEach(function (li) {
      li.onclick = function () { var t = lista.filter(function (x) { return x.kljuc === li.getAttribute('data-k'); })[0]; if (t) { S.datum = t.datum; otvoriTermin(t); } };
    });
  }).catch(function (e) { $('#pl').innerHTML = '<div class="obavijest bad">' + esc(e.message) + '</div>'; });
}

function otvoriTermin(t) {
  S.termin = t;
  $('#app').innerHTML = '<button class="btn link back" id="natrag">' + I.lijevo + 'Svi termini</button>' +
    '<div class="card thead"><span class="sifra">' + esc(t.sifra) + '</span><h2>' + esc(t.aktivnost || t.kratko) + '</h2>' +
    '<dl><dt>Datum</dt><dd>' + esc(lijepDatum(t.datum)) + '</dd>' + (t.pocetak ? '<dt>Vrijeme</dt><dd>' + esc(vrijemeT(t)) + '</dd>' : '') +
    '<dt>Lokacija</dt><dd>' + esc(t.lokacija) + '</dd>' + (t.mjesto ? '<dt>Mjesto</dt><dd>' + esc(t.mjesto) + '</dd>' : '') +
    (t.voditelj ? '<dt>Voditelj/ica</dt><dd>' + esc(t.voditelj) + '</dd>' : '') + '</dl></div><div id="tSadrzaj"><div class="spinner"></div></div>';
  $('#natrag').onclick = pocetnaProvedba;
  S.naPromjenuReda = function () {
    var a = document.activeElement;
    if (a && a.id === 'napTekst') { a.onblur = function () { a.onblur = null; if (S.termin === t) crtajTermin(t); }; return; }
    crtajTermin(t);
  };
  crtajTermin(t);
  if (naMrezi()) {                    // otvori/stvori mapu na Driveu i osvježi što je predano
    ZP.mapaTermina(t).then(function (m) { return ZP.api('stanjeMape', m.folderId, t); })
      .then(function (st) { return ZP.kesSpremi('stanje_' + t.kljuc, st); })
      .then(function () { if (S.termin === t) crtajTermin(t); }).catch(function () {});
  }
}

function crtajTermin(t) {
  Promise.all([ZP.kesUzmi('stanje_' + t.kljuc), ZP.kesUzmi('mapa_' + t.kljuc), redZa(function (q) { return q.termin && q.termin.kljuc === t.kljuc && (q.status !== 'gotovo' || Date.now() - q.gotovo < 60000); })])
    .then(function (r) {
      if (S.termin !== t) return;
      var st = r[0] || { datoteke: [], stanje: t.stanje || { fotografije: 0, video: 0, potpisne: 0, izvjesce: false, kalendar: false } };
      var mapa = r[1], red = r[2], s = st.stanje, dat = st.datoteke || [];
      var vrste = function (v) { return dat.filter(function (d) { return d.vrsta === v; }); };
      var redV = function (v) { return red.filter(function (q) { return (q.tip === 'datoteka' && q.vrsta === v) || (v === 'napomena' && q.tip === 'napomena'); }); };
      var cekaV = function (v) { return redV(v).filter(function (q) { return q.status !== 'gotovo'; }).length; };
      var html = '';
      if (s.status === 'POTPUNO') html += '<div class="obavijest ok">Predano: fotografije, video i potpisna lista.' + (s.izvjesce ? ' Priprema i izvješće su u mapi.' : ' Pripremu i izvješće napisat će Claude u tjednom zadatku.') + '</div>';
      else if (!naMrezi()) html += '<div class="obavijest warn">Nema interneta – sve što dodate sprema se na mobitel i šalje se samo čim se spojite. Mapa na Driveu stvorit će se automatski.</div>';
      var fb = s.fotografije + cekaV('foto');
      html += sekcija('foto', I.foto, 'Fotografije', 'Potrebno 2–4 fotografije', '<span class="brojac ' + (fb >= 2 ? 'ok' : '') + '">' + fb + ' / 4</span>',
        '<button class="btn primary" data-akc="foto-k">' + I.foto + 'Fotografiraj</button><button class="btn ghost" data-akc="foto-g">' + I.galerija + 'Galerija</button>', vrste('foto'), redV('foto'), SAVJET_ISPUSTANJA);
      var vb = s.video + cekaV('video');
      html += sekcija('video', I.video, 'Video', 'Jedan video do 1 minute', '<span class="brojac ' + (vb >= 1 ? 'ok' : '') + '">' + vb + ' / 1</span>',
        '<button class="btn primary" data-akc="video-k">' + I.video + 'Snimi video</button><button class="btn ghost" data-akc="video-g">' + I.galerija + 'Galerija</button>', vrste('video'), redV('video'), SAVJET_ISPUSTANJA);
      var pb = s.potpisne + cekaV('potpisna');
      html += sekcija('potpisna', I.lista, 'Potpisna lista', 'Fotografija se pretvara u PDF; osobe s liste upisuju se u Prijave', '<span class="brojac ' + (pb >= 1 ? 'ok' : '') + '">' + pb + '</span>',
        '<button class="btn primary" data-akc="lista-k">' + I.foto + 'Fotografiraj</button><button class="btn ghost" data-akc="lista-g">' + I.galerija + 'Slika / PDF</button>', vrste('potpisna'), redV('potpisna'), SAVJET_ISPUSTANJA);
      var kal = vrste('kalendar'), izv = vrste('izvjesce');
      html += '<section class="card sekcija"><div class="glava"><span class="ikona">' + I.kal + '</span><div class="t"><h3>Kalendar aktivnosti</h3><div class="muted">Mjesečni kalendar kopira se u mapu automatski</div></div>' +
        '<span class="brojac ' + (s.kalendar || kal.length ? 'ok' : 'warn') + '">' + (s.kalendar || kal.length ? '✓' : 'čeka') + '</span></div>' + popisDatoteka(kal, I.kal) + '</section>';
      html += '<section class="card sekcija"><div class="glava"><span class="ikona">' + I.izv + '</span><div class="t"><h3>Priprema i izvješće</h3><div class="muted">Piše Claude kad su dokazi predani</div></div>' +
        '<span class="brojac ' + (s.izvjesce || izv.length ? 'ok' : 'warn') + '">' + (s.izvjesce || izv.length ? '✓' : 'čeka') + '</span></div>' + popisDatoteka(izv, I.izv) + '</section>';
      html += sekcija('napomena', I.olovka, 'Napomena / obrazloženje', 'Nije obavezno – npr. „aktivnost je provodila koordinatorica umjesto voditelja”', '',
        '', vrste('napomena'), redV('napomena'), '<div class="glas" style="margin-top:10px"><textarea class="unos" id="napTekst" placeholder="Upišite ili izdiktirajte obrazloženje…"></textarea>' + gumbMic('napTekst') + '</div>' +
        '<div class="btnrow one"><button class="btn gold" id="napSpremi">' + I.olovka + 'Spremi napomenu na obrascu Zlatni puls</button></div>' +
        '<div class="btnrow one"><button class="btn ghost" id="napPrivitak">' + I.lista + 'Priloži datoteku uz napomenu</button></div>' +
        '<p class="muted small">Privitak se sprema u mapu termina kao Napomena_' + esc((mapa && mapa.nazivMape) || '<mapa>') + '_01, _02 … Na računalu ga možete i povući ovamo ili zalijepiti (Ctrl+V) dok pišete napomenu.</p>');
      html += '<div class="btnrow">' + (mapa && mapa.folderUrl ? '<a class="btn ghost" href="' + mapa.folderUrl + '" target="_blank" rel="noopener">' + I.mapa + 'Otvori mapu</a>' : '<span></span>') +
        '<button class="btn ghost" id="naPrijave">Prijave na termin</button></div>' + (mapa ? '<p class="muted small" style="margin-top:14px">Mapa: ' + esc(mapa.putanja || mapa.nazivMape) + '</p>' : '');
      var stariTekst = $('#napTekst') ? $('#napTekst').value : '';
      $('#tSadrzaj').innerHTML = html;
      if (stariTekst) $('#napTekst').value = stariTekst;
      vezivoMic();
      $$('[data-akc]').forEach(function (b) { b.onclick = function () { akcijaTermina(t, b.getAttribute('data-akc')); }; });
      $$('[data-ponovi]').forEach(function (b) { b.onclick = function () { ponovi(b.getAttribute('data-ponovi')); }; });
      $$('[data-makni]').forEach(function (b) { b.onclick = function () { makniIzReda(b.getAttribute('data-makni')); }; });
      $$('[data-obrisi]').forEach(function (b) { b.onclick = function () { obrisiDatoteku(t, b.getAttribute('data-obrisi'), b.getAttribute('data-ime')); }; });
      $('#napSpremi').onclick = function () {
        var tx = $('#napTekst').value.trim();
        if (!tx) { toast('Napomena je prazna.'); return; }
        ZP.uRed({ tip: 'napomena', termin: t, tekst: tx, ime: 'Napomena: ' + tx.slice(0, 40) }).then(function () { $('#napTekst').value = ''; toast(naMrezi() ? 'Napomena se šalje…' : 'Napomena spremljena na mobitel – poslat će se kad bude interneta.'); });
      };
      $('#naPrijave').onclick = function () { postaviTab('prijave'); otvoriPrijaveTermina(t); };
      $('#napPrivitak').onclick = function () { odaberi('*/*', false, true, function (f) { primiPrivitkeNapomene(t, f); }); };
      zonaIspustanja($('#sek-foto'), function (f) { primiFotografije(t, f.filter(jeSlika)); if (f.some(function (x) { return !jeSlika(x); })) toast('U Fotografije idu samo slike.'); });
      zonaIspustanja($('#sek-video'), function (f) { primiVideo(t, f.filter(jeVideo)); if (f.some(function (x) { return !jeVideo(x); })) toast('U Video idu samo video datoteke.'); });
      zonaIspustanja($('#sek-potpisna'), function (f) { primiListe(t, f.filter(function (x) { return jeSlika(x) || jePdf(x); })); });
      zonaIspustanja($('#sek-napomena'), function (f) { primiPrivitkeNapomene(t, f); });
    });
}

/** Datoteka ispuštena izvan zona ili zalijepljena (Ctrl+V) u otvorenom terminu: slika → Fotografije, video → Video, PDF → Potpisna lista. */
function rasporediUTermin(t, files, uNapomenu) {
  if (uNapomenu) { primiPrivitkeNapomene(t, files); return; }
  var foto = files.filter(jeSlika), vid = files.filter(jeVideo), pdf = files.filter(jePdf);
  var ostalo = files.filter(function (f) { return !jeSlika(f) && !jeVideo(f) && !jePdf(f); });
  if (foto.length) primiFotografije(t, foto);
  if (vid.length) primiVideo(t, vid);
  if (pdf.length) primiListe(t, pdf);
  if (ostalo.length) primiPrivitkeNapomene(t, ostalo);
  toast([foto.length ? foto.length + ' u Fotografije' : '', vid.length ? vid.length + ' u Video' : '', pdf.length ? pdf.length + ' u Potpisnu listu' : '',
    ostalo.length ? ostalo.length + ' kao privitak napomene' : ''].filter(Boolean).join(', ') + '.', 3500);
}

/** Privitak uz napomenu: sprema se u mapu termina kao Napomena_<mapa>_01.<ext>, _02 … (bez prepisivanja). */
function primiPrivitkeNapomene(t, files) {
  files.forEach(function (f) {
    uObradu('Pripremam privitak', function () {
      return thumbnail(f).then(function (th) {
        return ZP.uRed({ tip: 'datoteka', termin: t, vrsta: 'napomena', ime: 'Privitak napomene: ' + (f.name || 'datoteka'), blob: f,
          mime: f.type || 'application/octet-stream', ext: ekstenzija(f, 'bin'), velicina: f.size, thumb: th });
      });
    }).then(function () { toast(naMrezi() ? 'Privitak napomene se šalje…' : 'Privitak spremljen na mobitel – poslat će se kad bude interneta.'); })
      .catch(function () { toast('Datoteka se ne može pročitati: ' + f.name); });
  });
}

function popisDatoteka(dat, ikona) {
  if (!dat.length) return '';
  return '<ul class="popis">' + dat.map(function (d) {
    return '<li><span class="ph">' + ikona + '</span><span class="ime"><a href="' + d.url + '" target="_blank" rel="noopener">' + esc(d.naziv) + '</a></span></li>';
  }).join('') + '</ul>';
}

function sekcija(vrsta, ikona, naslov, opis, brojac, gumbi, datoteke, red, dodatak) {
  var li = datoteke.map(function (d) {
    return '<li><span class="ph">' + ikona + '</span><span class="ime"><a href="' + d.url + '" target="_blank" rel="noopener">' + esc(d.naziv) + '</a>' +
      (d.velicina ? '<br><span class="muted small">' + mb(d.velicina) + '</span>' : '') + '</span>' +
      '<button class="x" aria-label="Obriši" data-obrisi="' + d.id + '" data-ime="' + esc(d.naziv) + '">' + I.x + '</button></li>';
  }).join('');
  li += red.map(stavkaRedaHtml.bind(null, ikona)).join('');
  return '<section class="card sekcija" id="sek-' + vrsta + '"><div class="glava"><span class="ikona">' + ikona + '</span>' +
    '<div class="t"><h3>' + naslov + '</h3><div class="muted">' + opis + '</div></div>' + brojac + '</div>' +
    (li ? '<ul class="popis">' + li + '</ul>' : '') + (gumbi ? '<div class="btnrow">' + gumbi + '</div>' : '') + (dodatak || '') + '</section>';
}

function stavkaRedaHtml(ikona, q) {
  var th = q.thumb ? '<img class="th" src="' + q.thumb + '" alt="">' : '<span class="ph">' + ikona + '</span>';
  var st;
  if (q.status === 'gotovo') st = '<span class="small" style="color:var(--ok);font-weight:700">Poslano ✓</span>';
  else if (q.status === 'greska') st = '<span class="status-err small">Nije poslano: ' + esc(q.greska) + '</span><br><button class="btn link" data-ponovi="' + q.id + '">Pokušaj ponovno</button> <button class="btn link" data-makni="' + q.id + '">Makni</button>';
  else st = '<span class="muted small">' + (q.status === 'salje' ? 'Šaljem ' + Math.round((q.napredak || 0) * 100) + ' %' : naMrezi() ? 'Čeka na slanje' : 'Spremljeno na mobitel · čeka internet') + (q.velicina ? ' · ' + mb(q.velicina) : '') + '</span>' +
    '<div class="bar"><i style="width:' + Math.round((q.napredak || 0) * 100) + '%"></i></div>';
  return '<li>' + th + '<span class="ime">' + esc(q.naziv || q.ime) + '<br>' + st + '</span></li>';
}

function ponovi(id) {
  ZP.redSvi().then(function (svi) {
    var q = svi.filter(function (x) { return x.id === id; })[0];
    if (!q) return;
    q.status = 'ceka'; q.greska = ''; q.pokusaja = 0;
    return ZP.redSpremi(q).then(function () { ZP.obavijesti(q); ZP.pokreni(); });
  });
}
function makniIzReda(id) {
  if (!confirm('Maknuti ovu stavku s mobitela? Neće se poslati.')) return;
  ZP.redObrisi(id).then(function () { ZP.obavijesti(); });
}
function obrisiDatoteku(t, id, ime) {
  if (!naMrezi()) { toast('Brisanje s Drivea moguće je samo uz internet.'); return; }
  if (!confirm('Obrisati „' + ime + '”? Datoteka ide u smeće na Driveu.')) return;
  ZP.api('obrisi', id).then(function () { return ZP.mapaTermina(t); }).then(function (m) { return ZP.api('stanjeMape', m.folderId, t); })
    .then(function (st) { return ZP.kesSpremi('stanje_' + t.kljuc, st); }).then(function () { toast('Obrisano.'); crtajTermin(t); }).catch(greska);
}

function akcijaTermina(t, akc) {
  var p = akc.split('-'), kamera = p[1] === 'k';
  if (p[0] === 'foto') odaberi('image/*', kamera, !kamera, function (f) { primiFotografije(t, f); });
  if (p[0] === 'video') odaberi('video/*', kamera, false, function (f) { primiVideo(t, f); });
  if (p[0] === 'lista') odaberi(kamera ? 'image/*' : 'image/*,application/pdf', kamera, !kamera, function (f) { primiListe(t, f); });
}
function primiFotografije(t, files) {
  files.forEach(function (f) {
    uObradu('Smanjujem fotografiju', function () {
      return Promise.all([thumbnail(f), smanjiFoto(f)]).then(function (r) {
        return ZP.uRed({ tip: 'datoteka', termin: t, vrsta: 'foto', ime: f.name || 'fotografija.jpg', blob: r[1].blob, mime: r[1].mime, ext: r[1].ext, velicina: r[1].blob.size, thumb: r[0] });
      });
    }).catch(function () { toast('Slika se ne može pročitati: ' + f.name); });
  });
}
function primiVideo(t, files) {
  files.forEach(function (f) {
    uObradu('Smanjujem video', function (napredak) {
      return smanjiVideo(f, napredak).then(function (v) {
        return ZP.uRed({ tip: 'datoteka', termin: t, vrsta: 'video', ime: f.name || 'video', blob: v.blob, mime: v.mime, ext: v.ext, velicina: v.blob.size });
      }).then(function (q) { return q; });
    }).catch(greska);
  });
}
/** Potpisna lista: fotografija se automatski obreže, izravna, pretvori u „sken” i spremi kao PDF – bez dodatnih koraka.
 *  Više slika odjednom (iz galerije) = jedan PDF s više stranica. */
function primiListe(t, files) {
  var slike = [], pdf = [];
  files.forEach(function (f) { (f.type === 'application/pdf' || /\.pdf$/i.test(f.name) ? pdf : slike).push(f); });
  pdf.forEach(function (f) { ZP.uRed({ tip: 'datoteka', termin: t, vrsta: 'potpisna', ime: f.name, blob: f, mime: 'application/pdf', ext: 'pdf', velicina: f.size }); });
  if (!slike.length) return;
  uObradu('Pretvaram potpisnu listu u PDF', function (napredak) {
    return autoSkenPdf(slike, napredak).then(function (r) {
      return ZP.uRed({ tip: 'datoteka', termin: t, vrsta: 'potpisna', ime: 'Potpisna lista (PDF, ' + slike.length + ' str.)', blob: r.blob, mime: 'application/pdf', ext: 'pdf', velicina: r.blob.size, thumb: r.thumb });
    });
  }).then(function () { toast('Potpisna lista spremljena kao PDF.', 3000); }).catch(greska);
}
function autoSkenPdf(slike, napredak) {
  var stranice = [], thumb = '';
  var i = 0;
  var sljedeca = function () {
    if (i >= slike.length) return Promise.resolve();
    var f = slike[i];
    return createImageBitmap(f, { imageOrientation: 'from-image' }).then(function (bmp) {
      var k = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
      var c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      if (bmp.close) bmp.close();
      return new Promise(function (r) { setTimeout(r, 20); }).then(function () {
        var ravna = izravnaj(c, nadjiKutove(c));
        var sken = obradi(ravna, 'sken');
        if (!thumb) { var tc = document.createElement('canvas'), kk = 120 / sken.height; tc.width = Math.round(sken.width * kk); tc.height = 120; tc.getContext('2d').drawImage(sken, 0, 0, tc.width, tc.height); thumb = tc.toDataURL('image/jpeg', .7); }
        return new Promise(function (res) { sken.toBlob(function (bl) { bl.arrayBuffer().then(function (ab) { res({ jpeg: new Uint8Array(ab), w: sken.width, h: sken.height }); }); }, 'image/jpeg', .78); });
      });
    }).then(function (st) { stranice.push(st); i++; napredak(i / slike.length); return sljedeca(); });
  };
  return sljedeca().then(function () { return { blob: napraviPdf(stranice), thumb: thumb }; });
}

/* ═══ GLASOVNI UNOS (diktiranje na hrvatskom; bez mreže – snimka glasa) ═══ */
var Prepoznavanje = window.SpeechRecognition || window.webkitSpeechRecognition;
S.glas = null; S.snimke = {};
function gumbMic(cilj, snimkaDopustena) {
  return '<button class="mic" type="button" data-mic="' + cilj + '"' + (snimkaDopustena ? ' data-snimka="1"' : '') + ' aria-label="Diktiraj">' + I.mic + '</button>';
}
function vezivoMic() {
  $$('[data-mic]').forEach(function (b) { b.onclick = function () { mikrofon(b); }; });
}
function mikrofon(b) {
  var cilj = $('#' + b.getAttribute('data-mic'));
  if (S.glas) { var g = S.glas; S.glas = null; try { g.stop(); } catch (e) {} return; }
  if (Prepoznavanje && naMrezi()) {
    var r = new Prepoznavanje();
    r.lang = 'hr-HR'; r.continuous = true; r.interimResults = true;
    var pocetno = cilj.value ? cilj.value.replace(/\s*$/, ' ') : '';
    var konacno = '';
    r.onresult = function (e) {
      var privremeno = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) konacno += e.results[i][0].transcript + ' ';
        else privremeno += e.results[i][0].transcript;
      }
      cilj.value = (pocetno + konacno + privremeno).replace(/\s+/g, ' ').replace(/^\s/, '');
      cilj.dispatchEvent(new Event('input', { bubbles: true }));
    };
    r.onerror = function (e) { if (e.error !== 'no-speech' && e.error !== 'aborted') toast('Diktiranje: ' + e.error); };
    r.onend = function () { b.classList.remove('slusa'); b.innerHTML = I.mic; if (S.glas === r) S.glas = null; cilj.dispatchEvent(new Event('change', { bubbles: true })); };
    S.glas = r; b.classList.add('slusa'); b.innerHTML = I.stop;
    try { r.start(); } catch (e) { S.glas = null; b.classList.remove('slusa'); toast('Diktiranje se ne može pokrenuti.'); }
    return;
  }
  if (!b.getAttribute('data-snimka')) { toast(Prepoznavanje ? 'Diktiranje radi samo uz internet – upišite tekst tipkovnicom (ili mikrofonom na tipkovnici).' : 'Ovaj preglednik ne podržava diktiranje – koristite mikrofon na tipkovnici.', 5000); return; }
  // bez mreže: snimi glasovnu bilješku koja se prilaže uz zapis
  if (!navigator.mediaDevices || !window.MediaRecorder) { toast('Snimanje glasa nije podržano.'); return; }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    var rec = new MediaRecorder(stream), dijelovi = [];
    rec.ondataavailable = function (e) { if (e.data.size) dijelovi.push(e.data); };
    rec.onstop = function () {
      stream.getTracks().forEach(function (tr) { tr.stop(); });
      b.classList.remove('slusa'); b.innerHTML = I.mic;
      var mime = rec.mimeType || 'audio/webm';
      S.snimke[b.getAttribute('data-mic')] = new Blob(dijelovi, { type: mime });
      toast('Glasovna bilješka snimljena – priložit će se uz zapis.', 4000);
      cilj.dispatchEvent(new Event('change', { bubbles: true }));
    };
    S.glas = rec; b.classList.add('slusa'); b.innerHTML = I.stop; rec.start();
    toast('Nema interneta: snimam glasovnu bilješku. Dodirnite ponovno za kraj.', 3500);
  }).catch(function () { toast('Mikrofon nije dopušten.'); });
}

/* ═══ KOMUNIKACIJA I VIDLJIVOST – OBVEZE (prijavni obrazac SF.3.4.08.06.0086 + Upute za prijavitelje 2.10. i mjerljivi ishod 5) ═══ */
var PROJEKT = { pocetak: '2026-05-25', mjeseci: 36 };
var PARTNERI = [
  { id: 'usuh', naziv: 'USUH Dugo Selo (prijavitelj)', re: /usuh|sindikat|zlatni ?puls|\bsuh\b/ },
  { id: 'gdck', naziv: 'Crveni križ Dugo Selo', re: /crven|gdck/ },
  { id: 'guu', naziv: 'Gradska udruga umirovljenika Dugo Selo', re: /gradsk\w* udrug\w* umirov|\bguu\b/ },
  { id: 'kud', naziv: 'KUD Preporod Dugo Selo', re: /\bkud\b|preporod/ },
  { id: 'mambe', naziv: 'Udruga Crne mambe', re: /mamb/ }
];
/* Mjerljivi ishod 5 – „Broj provedenih aktivnosti radi promocije projekta” (ispunjen tek kad su ispunjene SVE stavke). */
var ISHOD5 = [
  { kat: 'web_esf', kratko: 'ESF+ web', naziv: 'Objava o potpori ESF+ na webu prijavitelja i partnera', godisnje: 1, dokazi: 'poveznica + snimka zaslona' },
  { kat: 'vanjsko', kratko: 'Jumbo', naziv: 'Jumbo plakat / city light – vizualno različiti oglasi', godisnje: 3, dokazi: 'fotografije + račun dobavljača i specifikacija' },
  { kat: 'video', kratko: 'Video', naziv: 'Promotivni video na webu i društvenim mrežama', godisnje: 12, dokazi: 'poveznica + snimka zaslona za SVAKI video' },
  { kat: 'rollup', kratko: 'Roll-up', naziv: 'Roll-up banner o projektu', projekt: 1, dokazi: 'fotografija postavljenog bannera + račun' },
  { kat: 'plakati', kratko: 'Plakati', naziv: 'Promotivni plakati, najmanje A2', godisnje: 50, komadi: true, dokazi: 'fotografije postavljenih plakata + račun' }
];
var DOKAZI = { web_esf: ['poveznica', 'snimka'], video: ['poveznica', 'snimka'], drustvene: ['poveznica', 'snimka'], web: ['poveznica', 'snimka'],
  mediji: ['poveznica', 'snimka'], vanjsko: ['foto', 'racun'], rollup: ['foto', 'racun'], plakati: ['foto', 'racun'], letci: ['foto'],
  dogadjanja: ['foto'], sastanak: ['datoteka'] };
var DOKAZ_NAZIV = { poveznica: 'poveznica na objavu', snimka: 'snimka zaslona', foto: 'fotografija', racun: 'račun dobavljača', datoteka: 'zapisnik / potpisna lista' };
var IZJAVA_EU = 'Izneseni stavovi i mišljenja samo su autorova i ne odražavaju nužno službena stajališta Europske unije ili Europske komisije. Ni Europska unija ni Europska komisija ne mogu se smatrati odgovornima za njih.';

function pgGranice(g) {
  var p = odYmd(PROJEKT.pocetak);
  return { od: ymd(new Date(p.getFullYear() + g - 1, p.getMonth(), p.getDate())), do: ymd(new Date(p.getFullYear() + g, p.getMonth(), p.getDate() - 1)) };
}
function projGodina(s) { for (var g = 1; g <= 3; g++) if (s <= pgGranice(g).do) return g; return 3; }
function partnerOd(org) { var o = norm(org); var p = PARTNERI.filter(function (x) { return x.re.test(o); })[0]; return p ? p.id : ''; }
function dokaziZapisa(z) {
  var r = { foto: 0, racun: 0, poveznica: z.poveznica ? 1 : 0 };
  if (z.dokazi) String(z.dokazi).split(';').forEach(function (p) { var kv = p.split(':'); if (kv[0] in r) r[kv[0]] = Number(kv[1]) || 0; });
  else r.foto = Number(z.datoteka) || 0;
  if (z.poveznica) r.poveznica = 1;
  return r;
}
/** Što nedostaje pojedinom zapisu (račun se provjerava po vrsti i projektnoj godini). */
/** Zapis koji je samo račun dobavljača (ne broji se kao plakat/oglas). */
function jeRacun(z) { var d = dokaziZapisa(z); return /^racun/.test(norm(z.naslov)) || (d.racun > 0 && !d.foto); }
function nedostajeZapisu(z) {
  var d = dokaziZapisa(z), f = [];
  if (jeRacun(z)) return f;
  (DOKAZI[z.kat] || []).forEach(function (t) {
    if (t === 'poveznica' && !d.poveznica) f.push(t);
    if ((t === 'snimka' || t === 'foto' || t === 'datoteka') && !d.foto) f.push(t);
  });
  return f;
}
function kvIzracun(zap, g) {
  var gr = pgGranice(g), danasS = danas();
  var uG = zap.filter(function (z) { return projGodina(z.datum || danasS) === g; });
  var od = odYmd(gr.od).getTime(), doo = odYmd(gr.do).getTime() + 864e5;
  var udio = Math.max(0, Math.min(1, (Date.now() - od) / (doo - od)));
  var ishod = ISHOD5.map(function (it) {
    var skup = it.projekt ? zap : uG;
    var ovi = skup.filter(function (z) { return z.kat === it.kat && !jeRacun(z); });
    var broj = ovi.reduce(function (s, z) { return s + (it.komadi ? (Number(z.brojKomada) || 1) : 1); }, 0);
    var cilj = it.projekt || it.godisnje;
    var ocek = it.projekt ? cilj : Math.ceil(cilj * udio);
    var racun = (DOKAZI[it.kat] || []).indexOf('racun') >= 0 ? skup.some(function (z) { return z.kat === it.kat && dokaziZapisa(z).racun > 0; }) : null;
    var st = broj >= cilj ? 'ok' : (g < projGodina(danasS) ? 'bad' : broj >= ocek ? 'gold' : 'warn');
    return { it: it, broj: broj, cilj: cilj, ocek: ocek, racun: racun, st: st };
  });
  var nedostaje = uG.map(function (z) { return { z: z, f: nedostajeZapisu(z) }; }).filter(function (x) { return x.f.length; });
  var partneri = PARTNERI.map(function (p) {
    var ovi = uG.filter(function (z) { return partnerOd(z.organizacija) === p.id && z.kat !== 'sastanak' && z.kat !== 'letci'; });
    return { p: p, broj: ovi.length, esf: ovi.some(function (z) { return z.kat === 'web_esf'; }), doseg: ovi.reduce(function (s, z) { return s + (Number(z.doseg) || 0); }, 0) };
  });
  var sast = uG.filter(function (z) { return z.kat === 'sastanak'; }).sort(function (a, b) { return b.datum.localeCompare(a.datum); });
  var sviUsuh = function (kat) { return zap.some(function (z) { return z.kat === kat && partnerOd(z.organizacija) === 'usuh'; }); };
  var obveze = [
    { t: 'Kratki opis projekta (ciljevi, rezultati, potpora EU) na službenoj web stranici korisnika', ok: sviUsuh('web_esf') || sviUsuh('web') },
    { t: 'Isti kratki opis na društvenim mrežama korisnika', ok: zap.some(function (z) { return z.kat === 'drustvene' && (partnerOd(z.organizacija) === 'usuh' || !z.organizacija); }) },
    { t: 'Izjava o potpori EU (amblem + „Sufinancira Europska unija”) na svim dokumentima i materijalima za javnost i sudionike', ok: true, auto: 'PDF-ovi iz aplikacije imaju traku i izjavu automatski' },
    { t: 'Najmanje jedan tiskani plakat (min. A3) s informacijama o projektu na mjestu jasno vidljivom javnosti', ok: zap.some(function (z) { return z.kat === 'plakati'; }) },
    { t: 'Materijali za komunikaciju i vidljivost dostupni na zahtjev UT-u i tijelima EU (besplatna, neisključiva licenca EU)', ok: true, auto: 'sve se čuva u 2. Vidljivost na Driveu' }
  ];
  return { g: g, gr: gr, udio: udio, uG: uG, ishod: ishod, nedostaje: nedostaje, partneri: partneri, sast: sast, obveze: obveze };
}

function kvPregled(g) {
  S.naPromjenuReda = null; S.osvjezi = null; S.vid = null;
  g = g || S.kvG || projGodina(danas()); S.kvG = g;
  $('#app').innerHTML = '<button class="btn link back" id="natrag">' + I.lijevo + 'Natrag</button><h2>Obveze komunikacije i vidljivosti</h2>' +
    '<p class="muted small">Prema prijavnom obrascu (aktivnost KV, mjeseci 1–36, Dugo Selo, Rugvica, Brckovljani) i Uputama za prijavitelje (2.10. Komunikacija i vidljivost, mjerljivi ishod 5).</p>' +
    '<div class="mjesec"><button class="iconbtn" id="gPrev" aria-label="Prethodna projektna godina">' + I.lijevo + '</button><b>' + g + '. projektna godina</b>' +
    '<button class="iconbtn" id="gNext" aria-label="Sljedeća projektna godina">' + I.desno + '</button></div><div id="kvSad"><div class="spinner"></div></div>';
  $('#natrag').onclick = pocetnaVidljivost;
  $('#gPrev').onclick = function () { if (g > 1) kvPregled(g - 1); };
  $('#gNext').onclick = function () { if (g < 3) kvPregled(g + 1); };
  var crtaj = function (zap, gr) {
    if (!$('#kvSad')) return;
    $('#kvSad').innerHTML = (gr ? '<div class="obavijest warn">' + esc(gr) + '</div>' : '') + kvHtml(zap ? kvIzracun(zap, g) : null, g);
    $$('#kvSad [data-kvnovi]').forEach(function (b) { b.onclick = function () { noviVidljivost({ kategorija: b.getAttribute('data-kvnovi') }); }; });
    $$('#kvSad [data-kvracun]').forEach(function (b) { b.onclick = function () { noviVidljivost({ kategorija: b.getAttribute('data-kvracun'), naslov: 'Račun dobavljača', racun: true }); }; });
    $$('#kvSad [data-kvpopis]').forEach(function (b) { b.onclick = function () { popisVidljivosti(b.getAttribute('data-kvpopis'), 0); }; });
    if ($('#kvKopiraj')) $('#kvKopiraj').onclick = function () {
      (navigator.clipboard ? navigator.clipboard.writeText(IZJAVA_EU) : Promise.reject()).then(function () { toast('Izjava kopirana.'); }, function () { toast('Označite tekst i kopirajte ručno.'); });
    };
  };
  sKesom('kv_zapisi', 'kvZapisi', [], true).then(function (zap) { crtaj(zap); }).catch(function (e) {
    crtaj(null, /Nepoznata akcija/.test(e.message) ? 'Brojke će se prikazati kad se objavi nova verzija API-ja (Apps Script).' : e.message);
  });
}

function kvHtml(R, g) {
  var gr = pgGranice(g), h = [];
  var ln = function (st, t) { return '<span class="chip ' + st + '">' + t + '</span>'; };
  var mjOst = Math.max(0, Math.round((odYmd(pgGranice(3).do) - new Date()) / (30.44 * 864e5)));
  h.push('<div class="card"><h3>Razdoblje</h3><p>' + esc(lijepDatum(gr.od)) + ' – ' + esc(lijepDatum(gr.do)) + '</p>' +
    (R ? '<div class="bar"><i style="width:' + Math.round(R.udio * 100) + '%"></i></div><p class="muted small">Prošlo ' + Math.round(R.udio * 100) + ' % projektne godine · do kraja projekta oko ' + mjOst + ' mj.</p>' : '') +
    '<p class="muted small">Ciljevi se broje po projektnoj godini. Ako projekt ne traje pune godine, cilj se računa razmjerno i zaokružuje na sljedeći cijeli broj.</p></div>');

  // Mjerljivi ishod 5
  var isp = R ? R.ishod.filter(function (x) { return x.st === 'ok'; }).length : 0;
  h.push('<div class="card"><h3>Mjerljivi ishod 5 · promocija projekta' + (R ? ' ' + ln(isp === ISHOD5.length ? 'ok' : 'warn', isp + ' / ' + ISHOD5.length) : '') + '</h3>' +
    '<p class="muted small">Ishod je ispunjen tek kad su ispunjene SVE stavke.</p>' + ISHOD5.map(function (it, i) {
      var x = R ? R.ishod[i] : null, cilj = it.projekt || it.godisnje;
      var post = x ? Math.min(100, Math.round(x.broj / cilj * 100)) : 0;
      var status = !x ? '' : x.st === 'ok' ? ln('ok', 'Ispunjeno') : x.st === 'gold' ? ln('gold', 'U roku') : x.st === 'bad' ? ln('bad', 'Nije ispunjeno') : ln('warn', 'Kasni: do danas ' + x.ocek);
      return '<div class="cilj"><span><b>' + esc(it.naziv) + '</b><br><span class="muted small">Cilj: ' + cilj + (it.projekt ? ' po projektu' : ' godišnje') + (it.komadi ? ' kom.' : '') + ' · Dokaz: ' + esc(it.dokazi) + '</span></span>' +
        '<b>' + (x ? x.broj : '–') + ' / ' + cilj + '</b>' + (x ? '<div class="bar" style="grid-column:1/3"><i style="width:' + post + '%"></i></div>' : '') +
        '<div class="chips" style="grid-column:1/3">' + status + (x && x.racun === false ? ln('bad', 'Nema računa') : x && x.racun ? ln('ok', 'Račun ✓') : '') +
        '<button class="chip gold" type="button" data-kvnovi="' + it.kat + '">+ Dodaj</button>' +
        (x && x.racun === false ? '<button class="chip" type="button" data-kvracun="' + it.kat + '">+ Račun</button>' : '') +
        '<button class="chip" type="button" data-kvpopis="' + it.kat + '">Datoteke</button></div></div>';
    }).join('') + '</div>');

  // Dokazna dokumentacija
  if (R) h.push('<div class="card"><h3>Dokazna dokumentacija ' + ln(R.nedostaje.length ? 'warn' : 'ok', R.nedostaje.length ? 'nedostaje ' + R.nedostaje.length : 'potpuna') + '</h3>' +
    (R.nedostaje.length ? '<ul class="popis">' + R.nedostaje.slice(0, 40).map(function (x) {
      var k = KATEGORIJE.filter(function (q) { return q.id === x.z.kat; })[0];
      return '<li><span class="ime"><b>' + esc(kratkiDatum(x.z.datum)) + '</b> ' + esc((k ? k.naziv : '') + ' · ' + [x.z.organizacija, x.z.naslov].filter(Boolean).join(' · ')) +
        '<br><span class="muted small">Nedostaje: ' + esc(x.f.map(function (t) { return DOKAZ_NAZIV[t]; }).join(', ')) + '</span></span></li>';
    }).join('') + '</ul><p class="muted small">Upute: za objave i video – poveznica i snimka zaslona; za plakate, jumbo i roll-up – fotografije i račun s specifikacijom. Uvažavaju se i jednakovrijedni dokazi.</p>'
      : '<p class="muted">Svi zapisi ove projektne godine imaju potrebne dokaze.</p>') + '</div>');

  // Partneri
  if (R) h.push('<div class="card"><h3>Prijavitelj i partneri · objava barem jednom godišnje</h3>' + R.partneri.map(function (x) {
    return '<div class="cilj"><span>' + esc(x.p.naziv) + (x.doseg ? '<br><span class="muted small">Doseg: ' + x.doseg + '</span>' : '') + '</span><b>' + x.broj + '</b>' +
      '<div class="chips" style="grid-column:1/3">' + ln(x.broj ? 'ok' : 'bad', x.broj ? 'Objavio' : 'Nema objave') + ln(x.esf ? 'ok' : 'warn', x.esf ? 'ESF+ web ✓' : 'ESF+ web objava') + '</div></div>';
  }).join('') + '<p class="muted small">Prijavni obrazac: partneri koriste dostavljene vizuale, objavljuju informacije o projektu barem jednom godišnje, dokumentiraju aktivnosti i izvještavaju o dosegu. Organizacija se prepoznaje iz polja „Gdje / kod koga”.</p></div>');

  // Kvartalni sastanci
  if (R) h.push('<div class="card"><h3>Kvartalni sastanci koordinacije ' + ln(R.sast.length >= 4 ? 'ok' : R.sast.length >= Math.ceil(4 * R.udio) ? 'gold' : 'warn', R.sast.length + ' / 4') + '</h3>' +
    '<p class="muted small">Komunikacijske aktivnosti koordinira prijavitelj kroz kvartalne sastanke s partnerima. Dokaz: zapisnik i potpisna lista.' +
    (R.sast.length ? ' Zadnji: ' + esc(lijepDatum(R.sast[0].datum)) + '.' : '') + '</p><div class="chips"><button class="chip gold" type="button" data-kvnovi="sastanak">+ Upiši sastanak</button></div></div>');

  // Obveze čl. 50.
  h.push('<div class="card"><h3>Obveze korisnika (Upute 2.10., čl. 50. Uredbe (EU) 2021/1060)</h3><ul class="popis">' + (R ? R.obveze : [
    { t: 'Kratki opis projekta na web stranici korisnika' }, { t: 'Isti opis na društvenim mrežama korisnika' }, { t: 'Izjava o potpori EU na svim dokumentima i materijalima' },
    { t: 'Najmanje jedan plakat min. A3 na javno vidljivom mjestu' }, { t: 'Materijali dostupni na zahtjev UT-u i tijelima EU' }]).map(function (o) {
    return '<li><span class="ime">' + (R ? (o.ok ? '✅ ' : '⚠️ ') : '') + esc(o.t) + (o.auto ? '<br><span class="muted small">' + esc(o.auto) + '</span>' : '') + '</span></li>';
  }).join('') + '</ul><div class="obavijest warn">Ako se obveze komunikacije i vidljivosti ne poštuju, primjenjuje se financijska korekcija do 3 % potpore.</div></div>');

  // Obvezni elementi
  h.push('<div class="card"><h3>Na svakom materijalu (plakat, letak, objava, video, dokument)</h3><img src="traka.png" alt="Traka s logotipima" style="width:100%;height:auto;margin:6px 0">' +
    '<p class="small">' + esc(IZJAVA_EU) + '</p><div class="btnrow one"><button class="btn ghost" id="kvKopiraj">Kopiraj izjavu</button></div>' +
    '<p class="muted small">Redoslijed trake: ESF+ Učinkoviti ljudski potencijali · Vlada RH Ured za udruge · Nacionalna zaklada za razvoj civilnoga društva · Sufinancira Europska unija. ESF+ logotip prema Knjizi grafičkih standarda (esf.hr).</p></div>');

  // Spremanje
  h.push('<div class="card"><h3>Gdje se sprema</h3><p class="small">Drive › Zlatni puls – provedba › <b>2. Vidljivost</b> › mapa vrste. Naziv se slaže sam i počinje danom objave:<br>' +
    '<b>2026-11-13_FB_Crveni_križ_Dugo_Selo_Poziv_na_radionice_01.jpg</b><br>račun: <b>…_Račun_dobavljača_Racun_01.pdf</b>, zapis: <b>…_zapis.pdf</b>. Evidencija je u tablici, list „Vidljivost”.</p></div>');
  return h.join('');
}

/* ═══ 5. HODOGRAM I POKAZATELJI ═════════════════════════════════════ */
/* Hodogram iz Projektne tablice (list „Hodogram”, prema prijavnom obrascu): [naziv, {mjesec: oznaka}] */
var HODOGRAM = [["A1 AKTIVNOSTI EDUKACIJE OCD-a ZA PROVEDBU PROGRAMA AKTIVNOG STARENJA",{}],["A1.0 Organizacija edukacija, poziv i odabir 10 polaznika/volontera",{"1":"X"}],["A1.1 Osnove gerontologije – 12 sati",{"1":"12"}],["A1.2 Andragogija – kako voditi radionice za starije – 8 sati",{"2":"8"}],["A1.3 Pristupačnost za osobe s invaliditetom – 4 sata",{"2":"4"}],["A1.4 Tehnologija za zdrav život – 4 sata",{"2":"4"}],["A1.5 Digitalna fotografija i fotoknjige – 2 dana × 3 sata",{"3":"6"}],["A1.6 Recikliranje kao kreativni izraz – 2 dana × 3 sata",{"3":"6"}],["A1.7 Horizontalna načela, inkluzija, zeleno i digitalno – 3 × 3 sata",{"3":"9"}],["A2 PROGRAM AKTIVNOG STARENJA",{}],["A2.0 Javni poziv, prijave sudionika, provjera ciljne skupine i revizijski trag odabira",{"1":"X","2":"X","3":"X","4":"X","5":"X","6":"X","7":"X","8":"X","9":"X","10":"X","11":"X","12":"X","13":"X","14":"X","15":"X","16":"X","17":"X","18":"X","19":"X","20":"X","21":"X","22":"X","23":"X","24":"X","25":"X","26":"X","27":"X","28":"X","29":"X","30":"X","31":"X","32":"X","33":"X","34":"X","35":"X","36":"X"}],["A2.1 Medijska pismenost i zaštita od financijskih prijevara – ciklusi po lokacijama",{"4":"10","5":"10","6":"10","16":"10","17":"10","18":"10","28":"10","29":"10","30":"10"}],["A2.1 Informatička pismenost – početni tečaj",{"7":"20","8":"20","19":"20","20":"20","31":"20","32":"20"}],["A2.1 Informatička pismenost – napredni tečaj",{"9":"20","10":"20","21":"20","22":"20","33":"20","34":"20"}],["A2.2.1 Kognitivne i sportsko-rekreativne aktivnosti – 3 lokacije, 2× tjedno tijekom 10 mjeseci/god.",{"4":"24","5":"24","6":"24","7":"24","8":"24","9":"24","10":"24","11":"24","12":"24","13":"24","16":"24","17":"24","18":"24","19":"24","20":"24","21":"24","22":"24","23":"24","24":"24","25":"24","28":"24","29":"24","30":"24","31":"24","32":"24","33":"24","34":"24","35":"24","36":"24"}],["A2.2.1 Vježbe u vodi – 2× mjesečno tijekom cijele godine",{"4":"2","5":"2","6":"2","7":"2","8":"2","9":"2","10":"2","11":"2","12":"2","13":"2","14":"2","15":"2","16":"2","17":"2","18":"2","19":"2","20":"2","21":"2","22":"2","23":"2","24":"2","25":"2","26":"2","27":"2","28":"2","29":"2","30":"2","31":"2","32":"2","33":"2","34":"2","35":"2","36":"2"}],["A2.2.2 Društvene, kognitivne i društveno-korisne aktivnosti protiv usamljenosti",{"4":"8","5":"8","6":"8","7":"8","8":"8","9":"8","10":"8","11":"8","12":"8","13":"8","14":"8","15":"8","16":"8","17":"8","18":"8","19":"8","20":"8","21":"8","22":"8","23":"8","24":"8","25":"8","26":"8","27":"8","28":"8","29":"8","30":"8","31":"8","32":"8","33":"8","34":"8","35":"8","36":"8"}],["A2.2.2 Kreativno-praktične i „uradi sam“ aktivnosti usmjerene na funkcionalne vještine i socijalizaciju",{"4":"8","5":"8","6":"8","7":"8","8":"8","9":"8","10":"8","11":"8","12":"8","13":"8","14":"8","15":"8","16":"8","17":"8","18":"8","19":"8","20":"8","21":"8","22":"8","23":"8","24":"8","25":"8","26":"8","27":"8","28":"8","29":"8","30":"8","31":"8","32":"8","33":"8","34":"8","35":"8","36":"8"}],["A2.2.3 Javne manifestacije za prevenciju bolesti i promicanje zdravlja (mjerenja, sportske igre, akcije)",{"1":"1","6":"1","12":"1","18":"1","24":"1","30":"1","36":"1"}],["A3 INDIVIDUALNA STRUČNA SAVJETOVANJA ZA STARIJE OSOBE I/ILI UMIROVLJENIKE",{}],["A3.1 Besplatna pravna pomoć – individualna savjetovanja",{"4":"6","5":"6","6":"6","7":"6","8":"6","9":"6","10":"6","11":"6","12":"6","13":"6","14":"6","16":"6","17":"6","18":"6","19":"6","20":"6","21":"6","22":"6","23":"6","24":"6","25":"6","26":"6","28":"6","29":"6","30":"6","31":"6","32":"6","33":"6","34":"6","35":"6"}],["A3.2 Savjetovanja prema iskazanim potrebama: psihološko-zdravstveno, nutricionističko, socijalno",{"4":"6","5":"6","6":"6","7":"6","8":"6","9":"6","10":"6","11":"6","12":"6","13":"6","14":"6","16":"6","17":"6","18":"6","19":"6","20":"6","21":"6","22":"6","23":"6","24":"6","25":"6","26":"6","28":"6","29":"6","30":"6","31":"6","32":"6","33":"6","34":"6","35":"6"}],["A4 INFORMIRANJE STARIJIH OSOBA I/ILI UMIROVLJENIKA – INFO KUTCI",{}],["A4.1 Uspostava i objava otvaranja info kutka na lokacijama prijavitelja i partnera",{"1":"X","2":"X"}],["A4.2 Informiranja u info kutku – zdravlje, socijalna prava, rad nakon mirovine, dostupne usluge",{"3":"12","4":"12","5":"12","6":"12","7":"12","8":"12","9":"12","10":"12","11":"12","12":"12","13":"12","14":"12","15":"12","16":"12","17":"12","18":"12","19":"12","20":"12","21":"12","22":"12","23":"12","24":"12","25":"12","26":"12","27":"12","28":"12","29":"12","30":"12","31":"12","32":"12","33":"12","34":"12","35":"12","36":"12"}],["A4.3 Upitnici/izjave korisnika i godišnji izvještaji o informiranju",{"12":"G","24":"G","36":"G"}],["KOMUNIKACIJA I VIDLJIVOST",{}],["KV.1 Objava o potpori dobivenoj iz ESF+ na mrežnim stranicama prijavitelja i partnera",{"1":"1","13":"1","25":"1"}],["KV.2 Vanjsko oglašavanje: billboard/city light ili jednakovrijedno",{"2":"3","14":"3","26":"3"}],["KV.3 Promotivne video snimke i objave na webu/društvenim mrežama",{"3":"1","5":"1","8":"1","11":"1","15":"1","17":"1","20":"1","23":"1","27":"1","29":"1","32":"1","35":"1"}],["KV.4 Roll-up banner projekta – nabava i izlaganje",{"1":"1"}],["KV.5 Promotivni plakati projekta – izrada/postavljanje po lokacijama",{"2":"50","14":"50","26":"50"}],["KV.6 Mjesečni kalendari događanja i najave aktivnosti",{"1":"K","2":"K","3":"K","4":"K","5":"K","6":"K","7":"K","8":"K","9":"K","10":"K","11":"K","12":"K","13":"K","14":"K","15":"K","16":"K","17":"K","18":"K","19":"K","20":"K","21":"K","22":"K","23":"K","24":"K","25":"K","26":"K","27":"K","28":"K","29":"K","30":"K","31":"K","32":"K","33":"K","34":"K","35":"K","36":"K"}],["UPRAVLJANJE PROJEKTOM I ADMINISTRACIJA",{}],["UP.1 Zapošljavanje/angažman koordinatora i odluke o postotku rada po aktivnostima",{"1":"X"}],["UP.2 Operativna provedba, koordinacija partnera, administracija, praćenje aktivnosti i dokaza",{"1":"X","2":"X","3":"X","4":"X","5":"X","6":"X","7":"X","8":"X","9":"X","10":"X","11":"X","12":"X","13":"X","14":"X","15":"X","16":"X","17":"X","18":"X","19":"X","20":"X","21":"X","22":"X","23":"X","24":"X","25":"X","26":"X","27":"X","28":"X","29":"X","30":"X","31":"X","32":"X","33":"X","34":"X","35":"X","36":"X"}],["UP.3 Partnerski/projektni sastanci i zapisnici",{"1":"1","4":"1","7":"1","10":"1","13":"1","16":"1","19":"1","22":"1","25":"1","28":"1","31":"1","34":"1","36":"1"}],["UP.4 Izrada i predaja ZNS-ova / zahtjeva za plaćanje prema tijeku novca",{"5":"ZNS1","8":"ZNS2","11":"ZNS3","14":"ZNS4","17":"ZNS5","20":"ZNS6","23":"ZNS7","26":"ZNS8","29":"ZNS9","32":"ZNS10","35":"ZNS11","36":"ZNS12"}],["UP.5 Priprema završnog izvješća, kontrola pokazatelja i arhiviranje dokumentacije",{"36":"X"}],["HORIZONTALNA NAČELA",{}],["HN.1 Jednake mogućnosti i pristupačnost: upiti o potrebama prilagodbe, pristupačni prostori, materijali velikim slovima/audio gdje je potrebno",{"1":"X","2":"X","3":"X","4":"X","5":"X","6":"X","7":"X","8":"X","9":"X","10":"X","11":"X","12":"X","13":"X","14":"X","15":"X","16":"X","17":"X","18":"X","19":"X","20":"X","21":"X","22":"X","23":"X","24":"X","25":"X","26":"X","27":"X","28":"X","29":"X","30":"X","31":"X","32":"X","33":"X","34":"X","35":"X","36":"X"}],["HN.2 Rodna ravnopravnost i nediskriminacija: rodno osjetljiv jezik i praćenje sudjelovanja po spolu",{"1":"X","2":"X","3":"X","4":"X","5":"X","6":"X","7":"X","8":"X","9":"X","10":"X","11":"X","12":"X","13":"X","14":"X","15":"X","16":"X","17":"X","18":"X","19":"X","20":"X","21":"X","22":"X","23":"X","24":"X","25":"X","26":"X","27":"X","28":"X","29":"X","30":"X","31":"X","32":"X","33":"X","34":"X","35":"X","36":"X"}],["HN.3 Zelena i digitalna načela: manje papira, digitalna arhiva, odvojeno prikupljanje otpada, edukacija o održivosti",{"1":"X","2":"X","3":"X","4":"X","5":"X","6":"X","7":"X","8":"X","9":"X","10":"X","11":"X","12":"X","13":"X","14":"X","15":"X","16":"X","17":"X","18":"X","19":"X","20":"X","21":"X","22":"X","23":"X","24":"X","25":"X","26":"X","27":"X","28":"X","29":"X","30":"X","31":"X","32":"X","33":"X","34":"X","35":"X","36":"X"}]];
var POKAZATELJI = [
  { id: 'R1', naziv: 'SF.3.4.08.06-01 Broj OCD-a podržanih u okviru PDP-a', cilj: 1, dokaz: 'Ugovor o dodjeli bespovratnih sredstava' },
  { id: 'R2', naziv: 'SF.3.4.08.06-02 Broj starijih osoba i/ili umirovljenika uključenih u Program aktivnog starenja', cilj: 303, dokaz: 'Potpisne liste + dokumentacija o pripadnosti ciljnoj skupini' },
  { id: 'I1', naziv: 'Mjerljivi ishod 1 · Provedene edukacije za provedbu PAS-a (A1)', cilj: 7, dokaz: 'Program izobrazbe, potvrde o sudjelovanju, ugovori/volontiranje', sifra: 'A1' },
  { id: 'I2', naziv: 'Mjerljivi ishod 2 · Održane aktivnosti Programa aktivnog starenja (A2)', cilj: 1770, dokaz: 'Fotografije, video min. 1 min, potpisne liste, mjesečni kalendar', sifra: 'A2' },
  { id: 'I3', naziv: 'Mjerljivi ishod 3 · Pohađana individualna stručna savjetovanja (A3)', cilj: 396, dokaz: 'Potpisna lista korisnika i izvještaj o savjetovanju', sifra: 'A3', poOsobi: true },
  { id: 'I4', naziv: 'Mjerljivi ishod 4 · Pružena informiranja putem info kutka (A4)', cilj: 350, dokaz: 'Objava otvaranja info kutka, upitnici, potpisne liste, izvještaj', sifra: 'A4', poOsobi: true },
  { id: 'I5', naziv: 'Mjerljivi ishod 5 · Provedene aktivnosti promocije projekta (KV)', cilj: 67, dokaz: 'Poveznice, snimke zaslona, fotografije, računi' }
];
/** Projektni mjesec (1–36) za datum: mjesec traje od 25. do 24. */
function projMjesec(s) {
  var p = s.split('-'), g = +p[0], m = +p[1], d = +p[2];
  var n = (g - 2026) * 12 + (m - 5) + (d >= 25 ? 1 : 0);
  return n;
}
function pmRaspon(n) {
  var od = new Date(2026, 4 + n - 1, 25), doo = new Date(2026, 4 + n, 24);
  return od.getDate() + '.' + (od.getMonth() + 1) + '.' + od.getFullYear() + '. – ' + doo.getDate() + '.' + (doo.getMonth() + 1) + '.' + doo.getFullYear() + '.';
}
function pmKratko(n) { var od = new Date(2026, 4 + n - 1, 25); return MJ[od.getMonth()].slice(0, 3) + ' ' + String(od.getFullYear()).slice(2); }
/** ZNS prema razdoblju troška (Plan ZNS: ZNS1 = 5–7/2026, ZNS2 = 8–10/2026 …). */
function znsZaDatum(s) { var p = s.split('-'), i = (+p[0] - 2026) * 12 + (+p[1] - 5); return i < 0 ? '' : 'ZNS' + (Math.floor(i / 3) + 1); }

/** Iz sirovih podataka složi sve brojke za Hodogram i Pregled. */
function pregledIzracun(P) {
  var dan = P.danas || danas();
  var T = {}; P.termini.forEach(function (t) { t.odrzan = t.d <= dan; T[t.k] = t; });
  var K = {}; P.korisnici.forEach(function (k) { K[k.id] = k; k.sud = []; });
  var vid = {}, sud = [];
  P.prijave.forEach(function (p) {
    var t = T[p[0]]; if (!t) return;
    var kl = p[0] + '|' + p[1]; if (vid[kl]) return; vid[kl] = 1;
    sud.push({ t: t, kid: p[1] });
    (t.polaznici = t.polaznici || []).push(p[1]);
    if (K[p[1]]) K[p[1]].sud.push(t);
  });
  P.korisnici.forEach(function (k) {
    k.sud.sort(function (a, b) { return a.d.localeCompare(b.d); });
    k.prvi = k.sud.length ? k.sud[0].d : '';
    k.znsIzr = k.prvi ? znsZaDatum(k.prvi) : '';
  });
  var odrzani = P.termini.filter(function (t) { return t.odrzan; });
  var poSifri = function (pref) { return odrzani.filter(function (t) { return String(t.s).indexOf(pref) === 0; }); };
  var sudPo = function (pref) { return sud.filter(function (x) { return x.t.odrzan && String(x.t.s).indexOf(pref) === 0; }); };
  var a2osobe = {}; sudPo('A2').forEach(function (x) { a2osobe[x.kid] = 1; });
  var sveOsobe = {}; sud.forEach(function (x) { if (x.t.odrzan) sveOsobe[x.kid] = 1; });
  var kvBroj = (P.kv || []).filter(function (z) { return z.kat !== 'sastanak' && !/^ra[cč]un/i.test(z.n || ''); }).length;
  var pmDanas = Math.max(1, Math.min(36, projMjesec(dan)));
  var udio = Math.min(1, pmDanas / 36);
  var vrijednost = {
    R1: 1, R2: Object.keys(a2osobe).length || Object.keys(sveOsobe).length,
    I1: poSifri('A1').length, I2: poSifri('A2').length, I3: sudPo('A3').length || poSifri('A3').length,
    I4: sudPo('A4').length || poSifri('A4').length, I5: kvBroj
  };
  // plan iz hodograma do danas (zbroj brojčanih oznaka po skupini)
  var planDo = function (pref, doMj) {
    var s = 0; HODOGRAM.forEach(function (r) {
      if (r[0].indexOf(pref + '.') !== 0) return;
      Object.keys(r[1]).forEach(function (m) { if (+m <= doMj && /^\d+$/.test(r[1][m])) s += +r[1][m]; });
    }); return s;
  };
  var pok = POKAZATELJI.map(function (p) {
    var v = vrijednost[p.id] || 0;
    var ocek = p.id === 'R1' ? 1 : p.id === 'I1' ? (pmDanas >= 3 ? 7 : Math.ceil(7 * pmDanas / 3)) : Math.ceil(p.cilj * udio);
    return { p: p, v: v, post: Math.round(v / p.cilj * 1000) / 10, ocek: ocek, uRoku: v >= ocek };
  });
  // ostvareno po projektnom mjesecu i skupini
  var ostv = {};
  odrzani.forEach(function (t) { var m = projMjesec(t.d), g = String(t.s).split('.')[0]; ostv[g + '|' + m] = (ostv[g + '|' + m] || 0) + 1; });
  return { P: P, T: T, K: K, sud: sud, odrzani: odrzani, pok: pok, pmDanas: pmDanas, ostv: ostv, planDo: planDo, dan: dan };
}
function ucitajPregled(svjeze) { return sKesom('pregled', 'pregled', [], svjeze).then(function (P) { S.pregled = pregledIzracun(P); return S.pregled; }); }
function pregledGreska(el, e) {
  el.innerHTML = '<div class="obavijest warn">' + esc(/Nepoznata akcija/.test(e.message) ? 'Brojke će se prikazati kad se objavi nova verzija API-ja (Apps Script).' : e.message) + '</div>';
}

function pocetnaHodogram() {
  S.naPromjenuReda = null;
  $('#app').innerHTML = '<div class="naslovTaba"><h2>Hodogram i pokazatelji</h2></div>' +
    '<p class="muted small">Prema hodogramu aktivnosti iz prijavnog obrasca (Projektna tablica, list „Hodogram”). Projekt traje 36 mjeseci od 25. 5. 2026.; mjesec provedbe traje od 25. do 24.</p>' +
    '<div id="hSad"><div class="spinner"></div></div>';
  var crtaj = function (R) {
    if (S.tab !== 'hodogram' || !$('#hSad')) return;
    var h = [], ln = function (st, t) { return '<span class="chip ' + st + '">' + t + '</span>'; };
    h.push('<div class="card"><h3>Sada: ' + R.pmDanas + '. mjesec provedbe</h3><p>' + esc(pmRaspon(R.pmDanas)) + '</p>' +
      '<div class="bar"><i style="width:' + Math.round(R.pmDanas / 36 * 100) + '%"></i></div><p class="muted small">Prošlo ' + Math.round(R.pmDanas / 36 * 100) + ' % trajanja projekta · ' + (36 - R.pmDanas) + ' mj. do kraja.</p></div>');
    // pokazatelji
    h.push('<div class="card"><h3>Postotak ostvarenosti pokazatelja</h3>' + R.pok.map(function (x) {
      var w = Math.min(100, x.post);
      return '<div class="cilj"><span><b>' + esc(x.p.naziv) + '</b><br><span class="muted small">Cilj: ' + x.p.cilj + ' · Očekivano do danas: ' + x.ocek + ' · Dokaz: ' + esc(x.p.dokaz) + '</span></span>' +
        '<b class="hPost">' + String(x.post).replace('.', ',') + ' %</b><div class="bar" style="grid-column:1/3"><i style="width:' + w + '%"></i></div>' +
        '<div class="chips" style="grid-column:1/3">' + ln('', x.v + ' / ' + x.p.cilj) + (x.v >= x.p.cilj ? ln('ok', 'Ostvareno') : x.uRoku ? ln('gold', 'U roku') : ln('warn', 'Ispod plana (−' + (x.ocek - x.v) + ')')) + '</div></div>';
    }).join('') + '<p class="muted small">Brojevi iz aplikacije: održani termini iz kalendara (do danas), sudionici s potpisnih lista / prijava (list „Prijave”), elementi vidljivosti (list „Vidljivost”, bez računa i sastanaka). A1 se broji samo ako su edukacije upisane u kalendar.</p></div>');
    // plan vs ostvareno po skupinama
    var skupine = [['A2', 'Program aktivnog starenja'], ['A3', 'Individualna savjetovanja'], ['A4', 'Info kutci']];
    h.push('<div class="card"><h3>Plan iz hodograma i ostvareno do danas</h3>' + skupine.map(function (s) {
      var plan = R.planDo(s[0], R.pmDanas), ost = 0;
      for (var m = 1; m <= R.pmDanas; m++) ost += R.ostv[s[0] + '|' + m] || 0;
      var post = plan ? Math.round(ost / plan * 100) : 0;
      return '<div class="cilj"><span><b>' + s[0] + ' ' + esc(s[1]) + '</b><br><span class="muted small">Planirano termina do ' + R.pmDanas + '. mj.: ' + plan + ' · održano: ' + ost + '</span></span><b>' + post + ' %</b>' +
        '<div class="bar" style="grid-column:1/3"><i style="width:' + Math.min(100, post) + '%"></i></div></div>';
    }).join('') + '</div>');
    // gantt
    var mj = []; for (var i = 1; i <= 36; i++) mj.push(i);
    var redak = function (r) {
      var naziv = r[0], skup = !/^[A-Z]{1,2}\d?\.\d/.test(naziv) && !/^(KV|UP|HN)\.\d/.test(naziv);
      var g = (naziv.match(/^(A\d)/) || [])[1];
      var celije = mj.map(function (m) {
        var v = r[1][m], cls = (m === R.pmDanas ? ' sad' : '') + (m < R.pmDanas ? ' prosl' : '');
        if (skup) { var o = g ? R.ostv[g + '|' + m] : 0; return '<td class="g' + cls + '">' + (o ? '<span class="ostv">' + o + '</span>' : '') + '</td>'; }
        return '<td class="' + cls + (v ? ' on' : '') + '">' + (v ? esc(v === 'X' ? '' : v) : '') + '</td>';
      }).join('');
      return '<tr class="' + (skup ? 'grp' : '') + '"><th title="' + esc(naziv) + '">' + esc(naziv) + '</th>' + celije + '</tr>';
    };
    h.push('<div class="card"><h3>Hodogram aktivnosti (mjeseci 1–36)</h3><p class="muted small">Zlatno = planirano (broj = planirani termini/sati/komadi), plavi broj u retku skupine = održani termini iz kalendara. Uokviren je tekući mjesec.</p>' +
      '<div class="hodWrap"><table class="hod"><thead><tr><th>Aktivnost / mjesec</th>' + mj.map(function (m) {
        return '<th class="' + (m === R.pmDanas ? 'sad' : '') + '" title="' + esc(pmRaspon(m)) + '">' + m + '<br><span>' + esc(pmKratko(m)) + '</span></th>';
      }).join('') + '</tr></thead><tbody>' + HODOGRAM.map(redak).join('') + '</tbody></table></div></div>');
    $('#hSad').innerHTML = h.join('');
    var w = $('.hodWrap'), sad = $('.hod thead th.sad'); if (w && sad) w.scrollLeft = Math.max(0, sad.offsetLeft - 260);
  };
  S.osvjezi = function () { if (S.pregled) crtaj(S.pregled); };
  ucitajPregled(true).then(crtaj).catch(function (e) { if ($('#hSad')) pregledGreska($('#hSad'), e); });
}

/* ═══ 6. PREGLED (dashboard) ════════════════════════════════════════ */
function pocetnaPregled() {
  S.naPromjenuReda = null;
  S.pgPrikaz = S.pgPrikaz || 'radionice';
  $('#app').innerHTML = '<div class="naslovTaba"><h2>Pregled evidencije</h2></div><div id="pgSad"><div class="spinner"></div></div>';
  ucitajPregled(true).then(function (R) { if (S.tab === 'pregled') pregledCrtaj(R); }).catch(function (e) { if ($('#pgSad')) pregledGreska($('#pgSad'), e); });
  S.osvjezi = function () { if (S.pregled && S.tab === 'pregled') pregledCrtaj(S.pregled); };
}
function pregledCrtaj(R) {
  var el = $('#pgSad'); if (!el) return;
  var aktivni = R.P.korisnici.filter(function (k) { return k.sud.some(function (t) { return t.odrzan; }); });
  var potpuno = R.odrzani.filter(function (t) { return /POTPUNO/i.test(t.st) && !/NEPOTPUNO/i.test(t.st); }).length;
  var sudOdr = R.sud.filter(function (x) { return x.t.odrzan; }).length;
  var zns = {}; aktivni.forEach(function (k) { var z = k.zns || k.znsIzr || '–'; zns[z] = (zns[z] || 0) + 1; });
  var kpi = function (br, t) { return '<div class="kpi"><b>' + br + '</b><span>' + t + '</span></div>'; };
  var h = '<div class="kpis">' + kpi(R.odrzani.length, 'održanih radionica / termina') + kpi(potpuno, 'potpuno dokumentiranih') +
    kpi(sudOdr, 'sudjelovanja (potpisi)') + kpi(aktivni.length, 'različitih polaznika') + kpi(R.P.korisnici.length, 'korisnika u bazi') + kpi(R.pmDanas + '/36', 'mjesec provedbe') + '</div>';
  h += '<div class="card"><h3>Polaznici po ZNS-u</h3><div class="chips">' + Object.keys(zns).sort(function (a, b) { return (parseInt(a.replace(/\D/g, '')) || 99) - (parseInt(b.replace(/\D/g, '')) || 99); }).map(function (z) {
    return '<span class="chip gold">' + esc(z) + ': ' + zns[z] + '</span>'; }).join('') + '</div><p class="muted small">' +
    (R.P.znsStupci && R.P.znsStupci.length ? 'Iz stupca „' + esc(R.P.znsStupci.join('”, „')) + '” lista Korisnici; gdje je prazno, ZNS je izračunat po prvom sudjelovanju.' :
      'ZNS je izračunat po datumu prvog sudjelovanja (Plan ZNS: ZNS1 = 5–7/2026, ZNS2 = 8–10/2026, ZNS3 = 11/2026–1/2027 …). Za stvarni upis dodajte stupac „ZNS” u list Korisnici.') + '</p></div>';
  h += '<div class="seg" id="pgSeg">' + [['radionice', 'Radionice'], ['polaznici', 'Polaznici'], ['aktivnosti', 'Po aktivnosti'], ['mjeseci', 'Po mjesecu']].map(function (x) {
    return '<button type="button" data-pg="' + x[0] + '" class="' + (S.pgPrikaz === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>' +
    '<input type="search" id="pgTrazi" class="trazi" placeholder="Traži (ime, aktivnost, lokacija, datum, ZNS)…" value="' + esc(S.pgTrazi || '') + '"><div id="pgLista"></div>';
  el.innerHTML = h;
  $$('#pgSeg button').forEach(function (b) { b.onclick = function () { S.pgPrikaz = b.getAttribute('data-pg'); pregledCrtaj(R); }; });
  $('#pgTrazi').oninput = function () { S.pgTrazi = this.value; pregledLista(R); };
  pregledLista(R);
}
function pregledLista(R) {
  var el = $('#pgLista'), q = norm(S.pgTrazi || ''), v = S.pgPrikaz, h = '';
  var ime = function (id) { var k = R.K[id]; return k ? k.prezime + ' ' + k.ime : id; };
  var odg = function (s) { return !q || q.split(/\s+/).every(function (w) { return norm(s).indexOf(w) >= 0; }); };
  if (v === 'radionice') {
    var lista = R.odrzani.slice().reverse().filter(function (t) { return odg([t.d, kratkiDatum(t.d), t.s, t.a, t.l, t.m, znsZaDatum(t.d)].join(' ')); });
    h = '<ul class="popis pgL">' + lista.slice(0, 300).map(function (t) {
      var n = (t.polaznici || []).length;
      return '<li><details><summary><span class="ime"><b>' + esc(kratkiDatum(t.d) + t.d.slice(0, 4) + '. ' + (t.v || '')) + '</b> ' + esc(t.a) + '<br><span class="muted small">' + esc([t.s, t.l, t.m, znsZaDatum(t.d)].filter(Boolean).join(' · ')) + '</span></span>' +
        '<span class="chip ' + (n ? 'ok' : 'warn') + '">' + n + ' pol.</span>' + (t.st ? '<span class="chip ' + (/NEPOTPUNO/i.test(t.st) ? 'warn' : 'ok') + '">' + esc(t.st.toLowerCase()) + '</span>' : '<span class="chip">bez evidencije</span>') + '</summary>' +
        (n ? '<ol class="small">' + t.polaznici.map(ime).sort(function (a, b) { return a.localeCompare(b, 'hr'); }).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' : '<p class="muted small">Nema upisanih polaznika (potpisna lista nije obrađena).</p>') + '</details></li>';
    }).join('') + '</ul>' + (lista.length > 300 ? '<p class="muted small">Prikazano 300 od ' + lista.length + ' – suzite pretragu.</p>' : '');
    if (!lista.length) h = '<p class="prazno">Nema rezultata.</p>';
  } else if (v === 'polaznici') {
    var ko = R.P.korisnici.filter(function (k) { return odg([k.ime, k.prezime, k.naselje, k.id, k.zns, k.znsIzr].join(' ')); })
      .sort(function (a, b) { return b.sud.length - a.sud.length || (a.prezime + a.ime).localeCompare(b.prezime + b.ime, 'hr'); });
    h = '<ul class="popis pgL">' + ko.slice(0, 300).map(function (k) {
      return '<li><details><summary><span class="ime"><b>' + esc(k.prezime + ' ' + k.ime) + '</b><br><span class="muted small">' + esc([k.id, k.naselje, k.god ? 'god. ' + k.god : '', k.prvi ? 'prvi put ' + kratkiDatum(k.prvi) + k.prvi.slice(0, 4) + '.' : ''].filter(Boolean).join(' · ')) + '</span></span>' +
        '<span class="chip ' + (k.sud.length ? 'ok' : '') + '">' + k.sud.length + ' rad.</span>' + (k.zns ? '<span class="chip gold">' + esc(k.zns) + '</span>' : k.znsIzr ? '<span class="chip">' + esc(k.znsIzr) + ' (izr.)</span>' : '') + '</summary>' +
        (k.sud.length ? '<ul class="small">' + k.sud.map(function (t) { return '<li>' + esc(kratkiDatum(t.d) + t.d.slice(0, 4) + '. · ' + t.a + ' · ' + t.l + (t.odrzan ? '' : ' (najava)')) + '</li>'; }).join('') + '</ul>' : '<p class="muted small">Još nije sudjelovao/la.</p>') + '</details></li>';
    }).join('') + '</ul>' + (ko.length > 300 ? '<p class="muted small">Prikazano 300 od ' + ko.length + '.</p>' : '');
  } else if (v === 'aktivnosti') {
    var g = {};
    R.odrzani.forEach(function (t) { var k = t.s + '|' + t.a; var x = g[k] = g[k] || { s: t.s, a: t.a, n: 0, p: 0, lok: {}, osobe: {} }; x.n++; x.p += (t.polaznici || []).length; x.lok[t.l] = (x.lok[t.l] || 0) + 1; (t.polaznici || []).forEach(function (id) { x.osobe[id] = 1; }); });
    var arr = Object.keys(g).map(function (k) { return g[k]; }).filter(function (x) { return odg(x.s + ' ' + x.a + ' ' + Object.keys(x.lok).join(' ')); }).sort(function (a, b) { return a.s.localeCompare(b.s) || b.n - a.n; });
    h = '<div class="tabWrap"><table class="pgT"><thead><tr><th>Šifra</th><th>Aktivnost</th><th>Termina</th><th>Sudjelovanja</th><th>Osoba</th><th>Lokacije</th></tr></thead><tbody>' + arr.map(function (x) {
      return '<tr><td>' + esc(x.s) + '</td><td>' + esc(x.a) + '</td><td>' + x.n + '</td><td>' + x.p + '</td><td>' + Object.keys(x.osobe).length + '</td><td class="small">' + esc(Object.keys(x.lok).map(function (l) { return l + ' ' + x.lok[l]; }).join(', ')) + '</td></tr>';
    }).join('') + '</tbody></table></div>';
  } else {
    var m = {};
    R.odrzani.forEach(function (t) { var k = projMjesec(t.d); var x = m[k] = m[k] || { n: 0, p: 0, o: {}, nove: 0 }; x.n++; x.p += (t.polaznici || []).length; (t.polaznici || []).forEach(function (id) { x.o[id] = 1; }); });
    R.P.korisnici.forEach(function (k) { if (k.prvi && k.prvi <= R.dan) { var x = m[projMjesec(k.prvi)]; if (x) x.nove++; } });
    var max = 1; Object.keys(m).forEach(function (k) { max = Math.max(max, m[k].n); });
    h = '<div class="tabWrap"><table class="pgT"><thead><tr><th>Mj.</th><th>Razdoblje</th><th>ZNS</th><th>Termina</th><th></th><th>Sudjelovanja</th><th>Osoba</th><th>Novih</th></tr></thead><tbody>' +
      Object.keys(m).sort(function (a, b) { return a - b; }).map(function (k) { var x = m[k], od = new Date(2026, 4 + (+k) - 1, 25);
        return '<tr><td>' + k + '.</td><td class="small">' + esc(pmRaspon(+k)) + '</td><td>' + esc(znsZaDatum(ymd(od))) + '</td><td>' + x.n + '</td><td style="min-width:90px"><div class="bar"><i style="width:' + Math.round(x.n / max * 100) + '%"></i></div></td><td>' + x.p + '</td><td>' + Object.keys(x.o).length + '</td><td>' + x.nove + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="muted small">ZNS stupac pokazuje u koji ZNS ulazi mjesec prema Planu ZNS (razdoblja po kalendarskim mjesecima).</p>';
  }
  el.innerHTML = h;
}

/* ═══ 2. KOMUNIKACIJA I VIDLJIVOST ═══════════════════════════════════ */
function pocetnaVidljivost() {
  S.naPromjenuReda = null;
  var app = $('#app');
  app.innerHTML = '<div class="naslovTaba"><h2>Komunikacija i vidljivost</h2></div>' +
    '<div class="btnrow"><button class="btn gold" id="vNovi">' + I.plus + 'Novi element</button><button class="btn primary" id="vKvBtn">' + I.izv + 'Obveze i ishod 5</button></div>' +
    '<div class="card hidden" id="vKv"></div>' +
    '<div class="card" id="vCilj"><h3>Ciljevi iz prijavnog obrasca (' + new Date().getFullYear() + '.)</h3><div class="spinner"></div></div>' +
    '<div class="card" id="vRed"><h3>Zadnje spremljeno s mobitela</h3><div class="spinner"></div></div>';
  $('#vNovi').onclick = function () { noviVidljivost(); };
  $('#vKvBtn').onclick = function () { kvPregled(); };
  var crtaj = function () {
    sKesom('kv_zapisi', 'kvZapisi', []).then(function (zap) {
      if (!$('#vKv')) return;
      var R = kvIzracun(zap, projGodina(danas()));
      var isp = R.ishod.filter(function (x) { return x.st === 'ok' || x.st === 'gold'; }).length;
      var kasni = R.ishod.filter(function (x) { return x.st === 'warn' || x.st === 'bad'; }).map(function (x) { return x.it.kratko + ' ' + x.broj + '/' + x.ocek; });
      $('#vKv').innerHTML = '<h3>' + R.g + '. projektna godina · stanje</h3><div class="chips">' +
        '<span class="chip ' + (kasni.length ? 'warn' : 'ok') + '">Ishod 5: ' + isp + '/' + R.ishod.length + ' u roku</span>' +
        '<span class="chip ' + (R.nedostaje.length ? 'warn' : 'ok') + '">Nedostaje dokaza: ' + R.nedostaje.length + '</span>' +
        '<span class="chip ' + (R.partneri.every(function (x) { return x.broj; }) ? 'ok' : 'warn') + '">Partneri s objavom: ' + R.partneri.filter(function (x) { return x.broj; }).length + '/' + R.partneri.length + '</span>' +
        '<span class="chip">Sastanci: ' + R.sast.length + '/4</span></div>' +
        (kasni.length ? '<p class="muted small">Kasni (do danas treba): ' + esc(kasni.join(' · ')) + '</p>' : '');
      $('#vKv').classList.remove('hidden');
    }).catch(function () {});
    sKesom('vid_pregled', 'vidljivostPregled', [new Date().getFullYear()]).then(function (p) {
      if (S.tab !== 'vidljivost' || !$('#vCilj')) return;
      $('#vCilj').innerHTML = '<h3>Ciljevi iz prijavnog obrasca (' + new Date().getFullYear() + '.)</h3>' + p.map(function (k) {
        var kk = KATEGORIJE.filter(function (x) { return x.id === k.id; })[0];
        var cilj = Math.max(Number(k.cilj) || 0, kk ? kk.cilj : 0);
        var post = cilj ? Math.min(100, Math.round(k.broj / cilj * 100)) : 0;
        return '<button type="button" class="cilj" data-vkat="' + esc(k.id) + '" title="Prikaži spremljene datoteke"><span>' + esc(k.naziv) + '</span><b>' + k.broj + (cilj ? ' / ' + cilj : '') + ' ' + I.desno + '</b>' +
          (cilj ? '<div class="bar" style="grid-column:1/3"><i style="width:' + post + '%"></i></div>' : '') + '</button>';
      }).join('') + '<p class="muted small">Dodirnite vrstu za popis spremljenih datoteka. Plakati i letci broje se po komadu. Brojke se osvježavaju kad je mobitel na internetu.</p>';
      $$('#vCilj [data-vkat]').forEach(function (b) { b.onclick = function () { popisVidljivosti(b.getAttribute('data-vkat'), new Date().getFullYear()); }; });
    }).catch(function (e) { if ($('#vCilj')) $('#vCilj').innerHTML = '<h3>Ciljevi iz prijavnog obrasca</h3><p class="muted">' + esc(e.message) + '</p>'; });
    redZa(function (q) { return q.tip === 'vidljivost'; }).then(function (red) {
      if (!$('#vRed')) return;
      red = red.slice(-12).reverse();
      $('#vRed').innerHTML = '<h3>Zadnje spremljeno s mobitela</h3>' + (red.length ? '<ul class="popis">' + red.map(function (q) {
        var k = KATEGORIJE.filter(function (x) { return x.id === q.z.kategorija; })[0];
        q.naziv = q.z.datum + ' · ' + (k ? k.naziv : '') + ' · ' + (q.z.naslov || q.z.organizacija || '');
        return stavkaRedaHtml(I.galerija, q);
      }).join('') + '</ul>' : '<p class="muted">Ništa još nije spremljeno.</p>');
      $$('#vRed [data-ponovi]').forEach(function (b) { b.onclick = function () { ponovi(b.getAttribute('data-ponovi')); }; });
      $$('#vRed [data-makni]').forEach(function (b) { b.onclick = function () { makniIzReda(b.getAttribute('data-makni')); }; });
    });
  };
  S.osvjezi = crtaj; S.naPromjenuReda = crtaj;
  crtaj();
}

/** Popis datoteka spremljenih pod vrstom vidljivosti (2. Vidljivost / <vrsta>) – naziv, datum, poveznica na Drive. */
function popisVidljivosti(katId, godina) {
  S.naPromjenuReda = null; S.osvjezi = null;
  var k = KATEGORIJE.filter(function (x) { return x.id === katId; })[0] || { naziv: katId, dulje: katId };
  $('#app').innerHTML = '<button class="btn link back" id="natrag">' + I.lijevo + 'Natrag</button><h2>' + esc(k.dulje) + '</h2>' +
    '<div class="mjesec"><button class="iconbtn" id="gPrev" aria-label="Prethodna godina">' + I.lijevo + '</button><b>' + (godina ? godina + '.' : 'Sve godine') + '</b>' +
    '<button class="iconbtn" id="gNext" aria-label="Sljedeća godina">' + I.desno + '</button></div>' +
    '<div id="vpSad"><div class="spinner"></div></div>' +
    '<div class="btnrow one"><button class="btn ghost" id="gSve">' + (godina ? 'Prikaži sve godine' : 'Samo ' + new Date().getFullYear() + '.') + '</button></div>';
  $('#natrag').onclick = pocetnaVidljivost;
  var g0 = godina || new Date().getFullYear();
  $('#gPrev').onclick = function () { popisVidljivosti(katId, g0 - 1); };
  $('#gNext').onclick = function () { popisVidljivosti(katId, g0 + 1); };
  $('#gSve').onclick = function () { popisVidljivosti(katId, godina ? 0 : new Date().getFullYear()); };
  sKesom('vid_dat_' + katId + '_' + (godina || 'sve'), 'vidljivostDatoteke', [katId, godina || 0], true).then(function (r) {
    if (!$('#vpSad')) return;
    var dat = r.datoteke || [], zap = r.zapisi || [];
    var ukupnoKom = zap.reduce(function (s, z) { return s + (Number(z.brojKomada) || 0); }, 0);
    var html = '<div class="card"><h3>Datoteke (' + dat.length + ')</h3>' + (dat.length ? '<ul class="popis">' + dat.map(function (d) {
      var ik = /^image\//.test(d.mime || '') ? I.galerija : /^video\//.test(d.mime || '') ? I.video : /pdf/.test(d.mime || '') ? I.lista : I.mapa;
      return '<li><span class="ph">' + ik + '</span><span class="ime"><a href="' + esc(d.url) + '" target="_blank" rel="noopener">' + esc(d.naziv) + '</a>' +
        '<br><span class="muted small">' + (d.datum ? esc(lijepDatum(d.datum)) : '') + (d.velicina ? ' · ' + mb(d.velicina) : '') + '</span></span></li>';
    }).join('') + '</ul>' : '<p class="muted">Pod ovom vrstom još nema spremljenih datoteka' + (godina ? ' za ' + godina + '.' : '') + '.</p>') +
      (r.folderUrl ? '<div class="btnrow one"><a class="btn ghost" href="' + esc(r.folderUrl) + '" target="_blank" rel="noopener">' + I.mapa + 'Otvori mapu na Driveu</a></div>' : '') +
      (r.mapa ? '<p class="muted small">Mapa: ' + esc(r.mapa) + '</p>' : '') + '</div>';
    if (zap.length) html += '<div class="card"><h3>Zapisi u evidenciji (' + zap.length + ')' + (k.brojKomada ? ' · ukupno ' + ukupnoKom + ' kom.' : '') + '</h3><ul class="popis">' + zap.map(function (z) {
      return '<li><span class="ime"><b>' + (z.datum ? esc(kratkiDatum(z.datum)) : '') + '</b> ' + esc([z.kanal, z.organizacija, z.naslov].filter(Boolean).join(' · ')) +
        (z.brojKomada ? ' · <b>' + esc(z.brojKomada) + ' kom.</b>' : '') + (z.poveznica ? ' · <a href="' + esc(z.poveznica) + '" target="_blank" rel="noopener">poveznica</a>' : '') + '</span></li>';
    }).join('') + '</ul></div>';
    $('#vpSad').innerHTML = html;
  }).catch(function (e) {
    if ($('#vpSad')) $('#vpSad').innerHTML = '<div class="obavijest bad">' + esc(/Nepoznata akcija/.test(e.message) ? 'Poslužitelj još nema ovu mogućnost – potrebno je objaviti novu verziju API-ja (Apps Script).' : e.message) + '</div>';
  });
}

function noviVidljivost(pre) {
  pre = pre || {};
  S.naPromjenuReda = null; S.snimke = {};
  var V = { kategorija: '', datum: danas(), kanal: '', organizacija: '', naslov: '', opis: '', poveznica: '', brojKomada: '', doseg: '', datoteke: [], rucno: {} };
  S.vid = V;
  var app = $('#app');
  app.innerHTML = '<button class="btn link back" id="natrag">' + I.lijevo + 'Natrag</button><h2>Novi element vidljivosti</h2>' +
    '<div class="card"><label class="polje" for="vGlas">Recite gdje je objavljeno i kako spremiti</label>' +
    '<div class="glas"><textarea class="unos" id="vGlas" placeholder="Npr. „Danas objava na Facebooku Crvenog križa Dugo Selo, poziv na radionice, spremi kao poziv na prijavu”"></textarea>' + gumbMic('vGlas', true) + '</div>' +
    '<p class="muted small">Iz izgovorenog se popunjavaju polja ispod – sve možete i ručno ispraviti.</p></div>' +
    '<div class="card"><label class="polje">Vrsta</label><div class="kat" id="vKat">' + KATEGORIJE.map(function (k) {
      return '<button type="button" data-k="' + k.id + '">' + esc(k.naziv) + (k.cilj ? '<span class="muted">cilj ' + k.cilj + '/god.</span>' : '') + '</button>';
    }).join('') + '</div>' +
    '<label class="polje" for="vAkt">Aktivnost projekta (naziv datoteke)</label><select class="unos" id="vAkt"><option value="">– općenito o projektu –</option></select>' +
    '<div class="dvoje"><div><label class="polje" for="vDatum">Datum</label><input class="unos" type="date" id="vDatum"></div>' +
    '<div><label class="polje" for="vKanal">Kanal</label><input class="unos" id="vKanal" list="vKanali" placeholder="FB, IG, Web…"><datalist id="vKanali"></datalist></div></div>' +
    '<label class="polje" for="vOrg">Gdje / kod koga (organizacija, stranica, mjesto)</label><input class="unos" id="vOrg" list="vOrgL" placeholder="npr. Crveni križ Dugo Selo">' +
    '<datalist id="vOrgL">' + POZNATE_ORG.map(function (o) { return '<option value="' + esc(o) + '">'; }).join('') + '</datalist>' +
    '<label class="polje" for="vNaslov">Naslov (naziv datoteke)</label><input class="unos" id="vNaslov" placeholder="npr. Poziv na prijavu">' +
    '<div id="vKomadi" class="hidden"><label class="polje" for="vBroj" id="vBrojLbl">Broj komada</label><input class="unos" type="number" min="1" id="vBroj"></div>' +
    '<label class="polje" for="vDoseg">Doseg – broj pregleda ili dosegnutih osoba (neobavezno)</label><input class="unos" type="number" min="0" id="vDoseg">' +
    '<label class="polje" for="vLink">Poveznica (ako postoji)</label><input class="unos" type="url" id="vLink" placeholder="https://…">' +
    '<label class="polje" for="vOpis">Opis</label><div class="glas"><textarea class="unos" id="vOpis"></textarea>' + gumbMic('vOpis', true) + '</div>' +
    '<p class="muted small" id="vNaziv"></p></div>' +
    '<div class="card sekcija" id="vDokaz"><div class="glava"><span class="ikona">' + I.galerija + '</span><div class="t"><h3>Dokaz</h3><div class="muted">Snimka zaslona, fotografija plakata, video, PDF</div></div></div>' +
    '<div class="chips" id="vTreba"></div>' +
    '<ul class="popis" id="vDat"></ul><div class="btnrow"><button class="btn primary" id="vKamera">' + I.foto + 'Fotografiraj</button><button class="btn ghost" id="vGalerija">' + I.galerija + 'Galerija</button></div>' +
    '<div class="btnrow one"><button class="btn ghost" id="vRacun">' + I.lista + 'Dodaj račun dobavljača (PDF ili foto)</button></div>' + SAVJET_ISPUSTANJA + '</div>' +
    '<div class="btnrow one"><button class="btn gold" id="vSpremi">Spremi u Vidljivost</button></div>';
  $('#natrag').onclick = pre.kategorija ? function () { kvPregled(); } : pocetnaVidljivost;
  $('#vDatum').value = V.datum;
  V.akt = null;
  var AKT_OPC = [];
  function puniAktivnosti() {
    var d = V.datum || danas();
    Promise.all([terminiMjeseca(d.slice(0, 7)).catch(function () { return []; }), sKesom('aktivnosti_prijave', 'aktivnostiPrijave', []).catch(function () { return []; })]).then(function (r) {
      if (!$('#vAkt')) return;
      var dan = r[0].filter(function (t) { return t.datum === d; }), vid = {};
      AKT_OPC = [];
      dan.forEach(function (t) { AKT_OPC.push({ k: 'T|' + t.kljuc, sifra: t.sifra, naziv: t.aktivnost || t.kratko, kljuc: t.kljuc, opis: t.pocetak + ' ' + (t.kratko || t.aktivnost) + ' · ' + t.lokacija }); });
      r[0].concat(r[1]).forEach(function (a) {
        var nz = a.aktivnost || a.kratko; if (!a.sifra || !nz || vid[a.sifra + nz]) return; vid[a.sifra + nz] = 1;
        AKT_OPC.push({ k: 'A|' + a.sifra + '|' + nz, sifra: a.sifra, naziv: nz, opis: a.sifra + ' ' + nz });
      });
      var sel = V.akt ? V.akt.k : $('#vAkt').value;
      $('#vAkt').innerHTML = '<option value="">– općenito o projektu –</option>' +
        (dan.length ? '<optgroup label="Termini ' + esc(kratkiDatum(d)) + '">' + AKT_OPC.filter(function (o) { return o.kljuc; }).map(function (o) { return '<option value="' + esc(o.k) + '">' + esc(o.opis) + '</option>'; }).join('') + '</optgroup>' : '') +
        '<optgroup label="Aktivnosti">' + AKT_OPC.filter(function (o) { return !o.kljuc; }).sort(function (a, b) { return a.sifra.localeCompare(b.sifra); }).map(function (o) { return '<option value="' + esc(o.k) + '">' + esc(o.opis) + '</option>'; }).join('') + '</optgroup>';
      if (sel) $('#vAkt').value = sel;
    });
  }
  function odaberiAkt(k) {
    V.akt = AKT_OPC.filter(function (o) { return o.k === k; })[0] || null;
    if ($('#vAkt').value !== (V.akt ? V.akt.k : '')) $('#vAkt').value = V.akt ? V.akt.k : '';
    nazivPregled();
  }
  function aktTekst() { return V.akt ? V.akt.sifra + ' ' + V.akt.naziv : ''; }
  $('#vAkt').onchange = function () { V.rucno.akt = true; odaberiAkt($('#vAkt').value); };
  $('#vDatum').addEventListener('change', puniAktivnosti);
  puniAktivnosti();
  V.aktTekst = aktTekst;
  var polja = { kanal: '#vKanal', organizacija: '#vOrg', naslov: '#vNaslov', brojKomada: '#vBroj', poveznica: '#vLink', datum: '#vDatum', opis: '#vOpis', doseg: '#vDoseg' };
  Object.keys(polja).forEach(function (k) { $(polja[k]).addEventListener('input', function () { V[k] = $(polja[k]).value; V.rucno[k] = true; nazivPregled(); }); });
  $$('#vKat button').forEach(function (b) { b.onclick = function () { V.rucno.kategorija = true; odaberiKat(b.getAttribute('data-k')); }; });
  $('#vGlas').addEventListener('input', function () { protumaci($('#vGlas').value); });
  $('#vKamera').onclick = function () { odaberi('image/*', true, false, dodajDokaz); };
  $('#vGalerija').onclick = function () { odaberi('image/*,video/*,application/pdf', false, true, dodajDokaz); };
  $('#vRacun').onclick = function () { odaberi('application/pdf,image/*', false, true, function (f) { dodajDokaz(f, 'racun'); }); };
  $('#vSpremi').onclick = spremiVidljivost;
  zonaIspustanja($('#vDokaz'), function (f) { dodajDokaz(f); });
  V.dodajDokaz = function (f) { dodajDokaz(f); };
  vezivoMic();
  $('#vGlas').addEventListener('change', crtajDokaze); $('#vOpis').addEventListener('change', crtajDokaze);

  function odaberiKat(id) {
    V.kategorija = id;
    var k = KATEGORIJE.filter(function (x) { return x.id === id; })[0];
    $$('#vKat button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-k') === id); });
    $('#vKanali').innerHTML = (k ? k.kanali : []).map(function (c) { return '<option value="' + esc(c) + '">'; }).join('');
    if (k && k.kanali.length === 1 && !V.rucno.kanal) { V.kanal = k.kanali[0]; $('#vKanal').value = V.kanal; }
    $('#vKomadi').classList.toggle('hidden', !(k && k.brojKomada));
    $('#vBrojLbl').textContent = id === 'letci' ? 'Broj podijeljenih letaka (cilj ' + k.cilj + ' godišnje)' : 'Broj komada';
    nazivPregled();
  }
  function postavi(k, v) { if (v == null || v === '' || V.rucno[k]) return; V[k] = v; $(polja[k]).value = v; }
  function protumaci(tx) {
    var r = parsirajGlas(tx);
    if (r.kategorija && !V.rucno.kategorija) odaberiKat(r.kategorija);
    ['kanal', 'organizacija', 'naslov', 'brojKomada', 'poveznica', 'datum'].forEach(function (k) { postavi(k, r[k]); });
    if (!V.rucno.opis) { V.opis = tx; $('#vOpis').value = tx; }
    if (!V.rucno.akt) {
      var t = ' ' + norm(tx) + ' ';
      var nadjen = AKT_OPC.filter(function (o) {
        var rij = norm(o.naziv).split(/[^a-z0-9]+/).filter(function (w) { return w.length > 4 && ['radionice', 'savjetovanje', 'aktivnosti'].indexOf(w) < 0; });
        return rij.length && rij.some(function (w) { return t.indexOf(w.slice(0, 6)) >= 0; });
      });
      nadjen.sort(function (a, b) { return (b.kljuc ? 1 : 0) - (a.kljuc ? 1 : 0); });
      if (nadjen[0]) odaberiAkt(nadjen[0].k);
    }
    nazivPregled();
  }
  function nazivPregled() {
    var d = [V.datum || danas(), dio(V.kanal || 'Ostalo')];
    if (V.organizacija) d.push(dio(V.organizacija));
    var k = KATEGORIJE.filter(function (x) { return x.id === V.kategorija; })[0];
    if (V.akt) d.push(dio(aktTekst()));
    if (V.naslov || !V.akt) d.push(dio(V.naslov || (k ? k.naziv : 'Vidljivost')));
    trebaPregled();
    $('#vNaziv').innerHTML = 'Spremit će se u <b>2. Vidljivost / ' + esc(k ? k.dulje : '…') + '</b> kao<br><b>' + esc(d.join('_')) + '_01.jpg</b>';
  }
  function trebaPregled() {
    var tr = DOKAZI[V.kategorija] || [];
    if (!$('#vTreba')) return;
    var foto = V.datoteke.filter(function (d) { return d.uloga !== 'racun'; }).length, rac = V.datoteke.some(function (d) { return d.uloga === 'racun'; });
    $('#vTreba').innerHTML = tr.length ? '<span class="chip">Za dokaz treba:</span>' + tr.map(function (t) {
      var ok = t === 'poveznica' ? !!(V.poveznica || '').trim() : t === 'racun' ? rac : foto > 0;
      return '<span class="chip ' + (ok ? 'ok' : t === 'racun' ? 'gold' : 'warn') + '">' + (ok ? '✓ ' : '') + esc(DOKAZ_NAZIV[t]) + (t === 'racun' && !ok ? ' (jednom po narudžbi)' : '') + '</span>';
    }).join('') : '';
  }
  function dio(s) { return String(s || '').trim().replace(/[\\\/:*?"<>|#%\[\]]+/g, '').replace(/\s+/g, '_').slice(0, 60); }
  function dodajDokaz(files, uloga) {
    files.forEach(function (f) {
      var slika = /^image\//.test(f.type), video = /^video\//.test(f.type);
      uObradu(video ? 'Smanjujem video' : slika ? 'Smanjujem fotografiju' : 'Pripremam datoteku', function (napredak) {
        return Promise.all([thumbnail(f), slika ? smanjiFoto(f) : video ? smanjiVideo(f, napredak) : Promise.resolve({ blob: f, mime: f.type || 'application/octet-stream', ext: ekstenzija(f, 'bin') })]).then(function (r) {
          V.datoteke.push({ ime: f.name, blob: r[1].blob, mime: r[1].mime, ext: r[1].ext, velicina: r[1].blob.size, thumb: r[0], uloga: uloga || 'dokaz' });
          if (S.vid === V) crtajDokaze();
        });
      });
    });
  }
  function crtajDokaze() {
    var sve = V.datoteke.slice();
    Object.keys(S.snimke).forEach(function (k) { sve.push({ ime: 'Glasovna bilješka', velicina: S.snimke[k].size, glas: k }); });
    $('#vDat').innerHTML = sve.map(function (d, i) {
      return '<li>' + (d.thumb ? '<img class="th" src="' + d.thumb + '">' : '<span class="ph">' + (d.glas ? I.mic : I.lista) + '</span>') +
        '<span class="ime">' + esc(d.ime) + (d.uloga === 'racun' ? ' <span class="chip gold">račun</span>' : '') + '<br><span class="muted small">' + mb(d.velicina) + '</span></span>' +
        '<button class="x" data-i="' + i + '" data-g="' + (d.glas || '') + '">' + I.x + '</button></li>';
    }).join('');
    $$('#vDat .x').forEach(function (b) {
      b.onclick = function () { if (b.getAttribute('data-g')) delete S.snimke[b.getAttribute('data-g')]; else V.datoteke.splice(+b.getAttribute('data-i'), 1); crtajDokaze(); };
    });
    trebaPregled();
  }
  if (pre.kategorija) { V.rucno.kategorija = true; odaberiKat(pre.kategorija); }
  if (pre.naslov) { V.naslov = pre.naslov; V.rucno.naslov = true; $('#vNaslov').value = pre.naslov; }
  if (pre.racun) toast('Priložite račun dobavljača gumbom „Dodaj račun dobavljača”.', 4000);
  nazivPregled();
}

function spremiVidljivost() {
  var V = S.vid;
  if (S.uObradi) { toast('Pričekajte – još smanjujem priložene datoteke…'); S.obrada.then(function () { if (S.vid === V) spremiVidljivost(); }); return; }
  if (!V.kategorija) { toast('Odaberite vrstu (npr. Društvene mreže, Plakati…).'); return; }
  var kat = KATEGORIJE.filter(function (x) { return x.id === V.kategorija; })[0];
  if (kat && kat.obavezanBroj && !(Number(V.brojKomada) > 0)) { toast('Upišite broj podijeljenih letaka.'); if ($('#vBroj')) $('#vBroj').focus(); return; }
  var glasovi = Object.keys(S.snimke).map(function (k) { return S.snimke[k]; });
  if (!V.datoteke.length && !glasovi.length && !V.poveznica && !confirm('Niste priložili nijedan dokaz (snimku zaslona, fotografiju). Ipak spremiti?')) return;
  var dat = V.datoteke.map(function (d) { return { ime: d.ime, blob: d.blob, mime: d.mime, ext: d.ext, velicina: d.velicina, uloga: d.uloga || 'dokaz' }; });
  var brFoto = V.datoteke.filter(function (d) { return d.uloga !== 'racun'; }).length, brRac = V.datoteke.length - brFoto;
  glasovi.forEach(function (g) { dat.push({ ime: 'glasovna bilješka', blob: g, mime: g.type || 'audio/webm', ext: /mp4/.test(g.type) ? 'm4a' : 'webm', velicina: g.size }); });
  var z = { kategorija: V.kategorija, datum: V.datum || danas(), kanal: V.kanal.trim(), organizacija: V.organizacija.trim(), naslov: [V.aktTekst ? V.aktTekst() : '', V.naslov.trim()].filter(Boolean).join(' ') || (kat ? kat.naziv : ''),
    napomena: V.akt ? 'Aktivnost: ' + V.aktTekst() + (V.akt.kljuc ? ' (termin ' + V.akt.kljuc + ')' : '') : '',
    doseg: V.doseg ? Number(V.doseg) : '', dokazi: 'foto:' + brFoto + ';racun:' + brRac + ';poveznica:' + (V.poveznica.trim() ? 1 : 0),
    opis: (V.opis || '').trim() + (glasovi.length ? '\n[priložena glasovna bilješka]' : ''), poveznica: V.poveznica.trim(), brojKomada: V.brojKomada ? Number(V.brojKomada) : '' };
  var thumb = (V.datoteke.filter(function (d) { return d.thumb; })[0] || {}).thumb || '';
  ZP.uRed({ tip: 'vidljivost', z: z, datoteke: dat, thumb: thumb, ime: z.naslov || z.organizacija, velicina: dat.reduce(function (s, d) { return s + d.velicina; }, 0) }).then(function () {
    S.snimke = {};
    toast(naMrezi() ? 'Spremljeno – šaljem na Drive.' : 'Spremljeno na mobitel – poslat će se kad bude interneta.', 3500);
    ZP.kesSpremi('kv_zapisi', null).catch(function () {});
    pocetnaVidljivost();
  }).catch(greska);
}

/** Iz izgovorenog teksta prepoznaje vrstu, kanal, organizaciju, naslov, broj komada, datum, poveznicu. */
function parsirajGlas(tx) {
  var t = ' ' + norm(tx) + ' ', r = {};
  var ima = function (re) { return re.test(t); };
  if (ima(/sastan|kvartaln/)) r.kategorija = 'sastanak';
  else if (ima(/jumbo|city ?light|billboard|vanjsk/)) r.kategorija = 'vanjsko';
  else if (ima(/roll ?-?up|rolap|banner/)) r.kategorija = 'rollup';
  else if (ima(/\bvideo|snimk|reel|klip/)) r.kategorija = 'video';
  else if (ima(/plakat/)) r.kategorija = 'plakati';
  else if (ima(/letak|letk|letc/)) r.kategorija = 'letci';
  else if (ima(/facebook|fejs|\bfb\b|instagram|insta|tik ?tok|twitter|whatsapp|drustven|\bstory|\bstori/)) r.kategorija = 'drustvene';
  else if (ima(/portal|clanak|clank|novin|\bradij?[ua]?\b|televizij|\btv\b|medij|kronik/)) r.kategorija = 'mediji';
  else if (ima(/esf|europsk|potpor/) && ima(/web|stranic|www/)) r.kategorija = 'web_esf';
  else if (ima(/\bweb|mrezn\w* stranic|www|stranic/)) r.kategorija = 'web';
  else if (ima(/dogadanj|predstavljanj|konferencij|potpisivanj|svecan/)) r.kategorija = 'dogadjanja';

  if (ima(/facebook|fejs|\bfb\b/)) r.kanal = 'FB';
  else if (ima(/instagram|insta/)) r.kanal = 'IG';
  else if (ima(/tik ?tok/)) r.kanal = 'TikTok';
  else if (ima(/youtube|jutjub/)) r.kanal = 'YouTube';
  else if (ima(/twitter|\bx\b/)) r.kanal = 'X';
  else if (ima(/whatsapp|vocap/)) r.kanal = 'WhatsApp';
  else if (ima(/portal/)) r.kanal = 'Portal';
  else if (ima(/\bradij?[ua]?\b/)) r.kanal = 'Radio';
  else if (ima(/novin|kronik/)) r.kanal = 'Novine';
  else if (ima(/jumbo/)) r.kanal = 'Jumbo plakat';
  else if (ima(/city ?light/)) r.kanal = 'City light';
  else if (ima(/plakat/)) r.kanal = 'Plakat';
  else if (ima(/letak|letk|letc/)) r.kanal = 'Letak';
  else if (ima(/\bweb|stranic|www/)) r.kanal = 'Web';

  // organizacija: najprije poznata imena (i padežni oblici – usporedba po korijenu riječi)
  var korijen = function (s) { return norm(s).split(/\s+/).map(function (w) { return w.slice(0, Math.max(4, w.length - 2)); }); };
  POZNATE_ORG.some(function (o) {
    var k = korijen(o);
    if (k.every(function (w) { return t.indexOf(' ' + w) >= 0; })) { r.organizacija = o; return true; }
  });
  if (!r.organizacija) {
    var m = String(tx).match(/(?:kod|na stranici|na profilu|stranic[ai] od|u|na|za)\s+((?:udrug|grad|općin|opcin|crven|SUH|USUH|knjižnic|knjiznic|dom|ljekarn|trgovin|konzum|crkv|župn|zupn|ambulant|pošt|post|portal|škol|skol|vrtić|vrtic|centar|klub|DVD)[^,.;]*)/i);
    if (m) r.organizacija = m[1].trim().replace(/\s+(i|te|pa)\s.*$/i, '');
  }
  var mN = String(tx).match(/(?:spremi(?:ti)?|nazovi|naslov(?:om)?|naziv(?:om)?)\s*(?:je|kao|pod|da je)?\s*[:\-–]?\s*(?:„|")?([^,.;"”]+)/i);
  if (mN) r.naslov = mN[1].trim().replace(/^(kao|pod)\s+/i, '');
  var mB = t.match(/(\d+)\s*(komad|kom\b|plakat|letak|letk|primjer)/);
  if (mB) r.brojKomada = mB[1];
  var mL = String(tx).match(/(https?:\/\/\S+|www\.\S+)/i);
  if (mL) r.poveznica = mL[1];
  var d = new Date();
  if (ima(/prekjucer/)) { d.setDate(d.getDate() - 2); r.datum = ymd(d); }
  else if (ima(/jucer/)) { d.setDate(d.getDate() - 1); r.datum = ymd(d); }
  else if (ima(/danas/)) r.datum = ymd(d);
  var mD = t.match(/\b(\d{1,2})\.\s?(\d{1,2})\.?(?:\s?(20\d{2}))?/);
  if (mD && +mD[1] <= 31 && +mD[2] <= 12) r.datum = (mD[3] || d.getFullYear()) + '-' + pad(+mD[2]) + '-' + pad(+mD[1]);
  return r;
}

/* ═══ 3. PRIJAVE NA AKTIVNOSTI ═══════════════════════════════════════ */
function prijaveMjeseca(ym, svjeze) { return sKesom('prijave_' + ym, 'prijaveMjeseca', [ym], svjeze); }

function pocetnaPrijave() {
  S.naPromjenuReda = null; S.prijaveTermin = null;
  var ym = S.prijaveMjesec;
  $('#app').innerHTML = '<h2>Prijave na aktivnosti</h2>' +
    '<div class="btnrow one"><button class="btn gold" id="pNovaOsoba">' + I.plus + 'Prijava osobe na aktivnosti</button></div>' +
    '<div class="mjesec"><button class="iconbtn" id="pmPrev">' + I.lijevo + '</button><b>' + esc(nazivMj(ym)) + '</b><button class="iconbtn" id="pmNext">' + I.desno + '</button></div>' +
    '<div id="pCekaju"></div>' +
    '<div class="card"><h3>Mjesečne prijavnice za potpis</h3><p class="muted small">Jedan PDF: za svaku osobu prijavnica sa svim aktivnostima u mjesecu (bez potpisa) – ispišite i dajte na potpis.</p>' +
    '<div class="dvoje"><div><select class="unos" id="pLok"><option value="">Sve lokacije</option>' + LOKACIJE.map(function (l) { return '<option>' + l + '</option>'; }).join('') + '</select></div>' +
    '<div><button class="btn primary full" id="pIspis">' + I.ispis + 'Izradi PDF</button></div></div>' +
    '<label class="osoba" style="border:0"><input type="checkbox" id="pSamoNep" checked><span class="ime small">Samo prijave bez elektroničkog potpisa</span></label><div id="pIspisRez"></div></div>' +
    '<div id="pTermini"><div class="spinner"></div></div>';
  $('#pNovaOsoba').onclick = prijavaOsobe;
  $('#pmPrev').onclick = function () { S.prijaveMjesec = pomakniMj(ym, -1); pocetnaPrijave(); };
  $('#pmNext').onclick = function () { S.prijaveMjesec = pomakniMj(ym, 1); pocetnaPrijave(); };
  $('#pIspis').onclick = function () {
    if (!naMrezi()) { toast('Za izradu PDF-a potreban je internet.'); return; }
    var b = $('#pIspis'); b.disabled = true; b.textContent = 'Izrađujem…';
    ZP.api('ispisPrijavnica', ym, { lokacija: $('#pLok').value, samoNepotpisane: $('#pSamoNep').checked }).then(function (r) {
      $('#pIspisRez').innerHTML = '<div class="obavijest ok">Izrađeno: ' + r.osoba + ' prijavnica. <a href="' + r.url + '" target="_blank" rel="noopener"><b>Otvori ' + esc(r.naziv) + '</b></a></div>';
    }).catch(greska).then(function () { b.disabled = false; b.innerHTML = I.ispis + 'Izradi PDF'; });
  };
  var crtaj = function () {
    Promise.all([terminiMjeseca(ym), prijaveMjeseca(ym).catch(function () { return { termini: [] }; }), redZa(function (q) { return q.tip === 'prijave' && q.status !== 'gotovo'; })]).then(function (r) {
      if (S.tab !== 'prijave' || S.prijaveTermin) return;
      var broj = {};
      r[1].termini.forEach(function (t) { broj[t.kljuc] = t.prijave.length; });
      var ceka = {};
      r[2].forEach(function (q) { ceka[q.p.termin.kljuc] = (ceka[q.p.termin.kljuc] || 0) + (q.p.korisnici || []).length + (q.p.novi || []).length; });
      var poDanu = {};
      r[0].forEach(function (t) { (poDanu[t.datum] = poDanu[t.datum] || []).push(t); });
      var html = Object.keys(poDanu).sort().map(function (d) {
        return '<div class="card"><h3>' + esc(lijepDatum(d)) + '</h3><ul class="popis">' + poDanu[d].map(function (t) {
          var n = broj[t.kljuc] || 0, c = ceka[t.kljuc] || 0;
          return '<li data-k="' + esc(t.kljuc) + '" style="cursor:pointer"><span class="ime"><b>' + esc(t.pocetak) + '</b> ' + esc(t.kratko || t.aktivnost) + '<br><span class="muted small">' + esc(t.lokacija) + (t.mjesto ? ' · ' + esc(t.mjesto) : '') + '</span></span>' +
            '<span class="brojac ' + (n ? 'ok' : '') + '">' + n + (c ? ' +' + c : '') + '</span></li>';
        }).join('') + '</ul></div>';
      }).join('');
      $('#pTermini').innerHTML = html || '<div class="prazno">U ovom mjesecu nema termina.</div>';
      $$('#pTermini li[data-k]').forEach(function (li) {
        li.onclick = function () { var t = r[0].filter(function (x) { return x.kljuc === li.getAttribute('data-k'); })[0]; otvoriPrijaveTermina(t); };
      });
    }).catch(function (e) { $('#pTermini').innerHTML = '<div class="obavijest bad">' + esc(e.message) + '</div>'; });
    sKesom('potpisne_obrada', 'potpisneZaObradu', [], true).then(function (lista) {
      if (!$('#pCekaju')) return;
      lista = lista.filter(function (x) { return x.datum.slice(0, 7) === ym; });
      $('#pCekaju').innerHTML = lista.length ? '<div class="card"><h3>Potpisne liste – osobe još nisu upisane (' + lista.length + ')</h3><ul class="popis">' + lista.map(function (x) {
        return '<li data-k="' + esc(x.kljuc) + '" style="cursor:pointer"><span class="ime"><b>' + kratkiDatum(x.datum) + ' ' + esc(x.vrijeme) + '</b> ' + esc(x.aktivnost) + ' · ' + esc(x.lokacija) + '</span>' + I.desno + '</li>';
      }).join('') + '</ul></div>' : '';
      $$('#pCekaju li[data-k]').forEach(function (li) {
        li.onclick = function () { terminiMjeseca(ym).then(function (tt) { var t = tt.filter(function (x) { return x.kljuc === li.getAttribute('data-k'); })[0]; if (t) otvoriPrijaveTermina(t); }); };
      });
    }).catch(function () {});
  };
  S.osvjezi = crtaj; S.naPromjenuReda = crtaj;
  crtaj();
}

function otvoriPrijaveTermina(t) {
  S.prijaveTermin = t;
  var P = { odabrani: [], novi: [], nacin: 'potpisna' };
  $('#app').innerHTML = '<button class="btn link back" id="natrag">' + I.lijevo + 'Svi termini</button>' +
    '<div class="card thead"><span class="sifra">' + esc(t.sifra) + '</span><h2>' + esc(t.aktivnost || t.kratko) + '</h2>' +
    '<dl><dt>Datum</dt><dd>' + esc(lijepDatum(t.datum)) + '</dd><dt>Vrijeme</dt><dd>' + esc(vrijemeT(t)) + '</dd><dt>Lokacija</dt><dd>' + esc(t.lokacija) + (t.mjesto ? ', ' + esc(t.mjesto) : '') + '</dd></dl></div>' +
    '<div id="pLista" class="card"><div class="spinner"></div></div>' +
    '<div class="card"><h3>Upis osoba s potpisne liste</h3><p class="muted small">Dodirujte osobe redom kao na listi. Vrijeme prijave: vrijeme termina + 1–3 min za svaku osobu.</p>' +
    '<div class="odabrani" id="pOdabrani"></div>' +
    '<input class="unos" id="pTrazi" placeholder="Prezime ili ime…" autocomplete="off"><div id="pRez"></div>' +
    '<details style="margin-top:10px"><summary class="small">Osoba nije u bazi – dodaj novu</summary><div class="dvoje"><div><input class="unos" id="nIme" placeholder="Ime"></div><div><input class="unos" id="nPrezime" placeholder="Prezime"></div></div>' +
    '<div class="dvoje" style="margin-top:8px"><div><input class="unos" id="nGod" type="number" placeholder="Godina rođenja"></div><div><button class="btn ghost full" id="nDodaj">' + I.plus + 'Dodaj</button></div></div></details>' +
    '<label class="osoba"><input type="radio" name="nacin" value="potpisna" checked><span class="ime small">S potpisne liste (datum i vrijeme termina)</span></label>' +
    '<label class="osoba"><input type="radio" name="nacin" value="rucno"><span class="ime small">Prijava bez potpisa – odabrani datum prijave</span></label>' +
    '<div class="dvoje hidden" id="pDatumPr"><div><input class="unos" type="date" id="pDP"></div><div><input class="unos" type="time" id="pVP"></div></div>' +
    '<div class="btnrow one"><button class="btn gold" id="pSpremi">Upiši prijave</button></div></div>';
  $('#natrag').onclick = pocetnaPrijave;
  $$('input[name=nacin]').forEach(function (r) { r.onchange = function () { P.nacin = r.value; $('#pDatumPr').classList.toggle('hidden', P.nacin !== 'rucno'); }; });
  (function () { var d = new Date(); $('#pDP').value = danas(); $('#pVP').value = pad(d.getHours()) + ':' + pad(d.getMinutes()); })();
  var crtajOdabrane = function () {
    var sve = P.odabrani.map(function (k, i) { return '<span>' + (i + 1) + '. ' + esc(k.prezime + ' ' + k.ime) + '<b data-i="' + i + '">×</b></span>'; })
      .concat(P.novi.map(function (n, i) { return '<span>' + (P.odabrani.length + i + 1) + '. ' + esc(n.prezime + ' ' + n.ime) + ' (nova)<b data-n="' + i + '">×</b></span>'; }));
    $('#pOdabrani').innerHTML = sve.join('');
    $$('#pOdabrani b').forEach(function (b) {
      b.onclick = function () { if (b.hasAttribute('data-i')) P.odabrani.splice(+b.getAttribute('data-i'), 1); else P.novi.splice(+b.getAttribute('data-n'), 1); crtajOdabrane(); };
    });
    $('#pSpremi').textContent = 'Upiši prijave (' + (P.odabrani.length + P.novi.length) + ')';
  };
  korisnici().then(function (lista) {
    $('#pTrazi').oninput = function () {
      var u = norm($('#pTrazi').value);
      if (u.length < 2) { $('#pRez').innerHTML = ''; return; }
      var dijelovi = u.split(/\s+/);
      var rez = lista.filter(function (k) { var s = norm(k.prezime + ' ' + k.ime); return dijelovi.every(function (d) { return s.indexOf(d) >= 0; }); }).slice(0, 12);
      $('#pRez').innerHTML = rez.map(function (k) {
        return '<div class="osoba" data-id="' + esc(k.id) + '"><span class="ime"><b>' + esc(k.prezime) + '</b> ' + esc(k.ime) + '<br><span class="muted small">' + esc([k.god, k.naselje].filter(String).join(' · ')) + '</span></span>' + I.plus + '</div>';
      }).join('') || '<p class="muted small">Nema takve osobe – dodajte je kao novu.</p>';
      $$('#pRez .osoba').forEach(function (el) {
        el.onclick = function () {
          var k = lista.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0];
          if (P.odabrani.some(function (x) { return x.id === k.id; })) { toast('Već je odabrana.'); return; }
          P.odabrani.push(k); crtajOdabrane(); $('#pTrazi').value = ''; $('#pRez').innerHTML = ''; $('#pTrazi').focus();
        };
      });
    };
  }).catch(function (e) { $('#pRez').innerHTML = '<p class="status-err small">' + esc(e.message) + '</p>'; });
  $('#nDodaj').onclick = function () {
    var ime = $('#nIme').value.trim(), prez = $('#nPrezime').value.trim();
    if (!ime || !prez) { toast('Upišite ime i prezime.'); return; }
    P.novi.push({ ime: ime, prezime: prez, god: $('#nGod').value.trim() }); $('#nIme').value = $('#nPrezime').value = $('#nGod').value = ''; crtajOdabrane();
  };
  $('#pSpremi').onclick = function () {
    if (!P.odabrani.length && !P.novi.length) { toast('Niste odabrali nijednu osobu.'); return; }
    ZP.uRed({ tip: 'prijave', p: { termin: t, korisnici: P.odabrani.map(function (k) { return k.id; }), novi: P.novi, nacin: P.nacin, datumPrijave: P.nacin === 'rucno' ? $('#pDP').value : '', vrijemePrijave: P.nacin === 'rucno' ? $('#pVP').value : '', imena: P.odabrani.map(function (k) { return k.prezime + ' ' + k.ime; }) },
      ime: (P.odabrani.length + P.novi.length) + ' prijava · ' + (t.kratko || t.aktivnost) + ' ' + kratkiDatum(t.datum) }).then(function () {
      toast(naMrezi() ? 'Upisujem prijave…' : 'Prijave spremljene na mobitel – upisat će se kad bude interneta.', 3500);
      P.odabrani = []; P.novi = []; crtajOdabrane(); crtajListu();
    }).catch(greska);
  };
  var crtajListu = function () {
    Promise.all([prijaveMjeseca(t.datum.slice(0, 7)).catch(function () { return { termini: [] }; }), redZa(function (q) { return q.tip === 'prijave' && q.p.termin.kljuc === t.kljuc && q.status !== 'gotovo'; }),
      sKesom('potpisne_obrada', 'potpisneZaObradu', []).catch(function () { return []; }), ZP.kesUzmi('stanje_' + t.kljuc)]).then(function (r) {
      if (S.prijaveTermin !== t) return;
      var tt = r[0].termini.filter(function (x) { return x.kljuc === t.kljuc; })[0];
      var pr = tt ? tt.prijave : [];
      var liste = r[2].filter(function (x) { return x.kljuc === t.kljuc; });
      var stDat = r[3] && r[3].datoteke ? r[3].datoteke.filter(function (d) { return d.vrsta === 'potpisna'; }) : [];
      var html = '<h3>Prijavljeni (' + pr.length + ')</h3>';
      if (liste.length || stDat.length) html += '<p class="small">Potpisna lista: ' + (liste.length ? liste : stDat).map(function (x) { return '<a href="' + (x.url) + '" target="_blank" rel="noopener">' + esc(x.naziv) + '</a>'; }).join(', ') + '</p>';
      html += pr.length ? '<ul class="popis">' + pr.map(function (p, i) {
        return '<li><span class="rb" style="width:26px;height:26px;border-radius:50%;background:var(--navy);color:#fff;display:grid;place-items:center;font-size:13px;flex:none">' + (i + 1) + '</span><span class="ime">' + esc(p.prezime + ' ' + p.ime) +
          '<br><span class="muted small">' + esc(p.datum ? kratkiDatum(p.datum) : '') + ' ' + esc(p.vrijeme) + ' · ' + (p.nacin === 'potpisna' ? 's potpisne liste' : p.nacin === 'aplikacija' ? 'aplikacija (potpisano)' : p.nacin === 'bezpotpisa' ? 'prijava bez potpisa' : 'upis') + '</span></span>' +
          (/^P[LR]-/.test(p.idPrijave) ? '<button class="x" data-uk="' + esc(p.idKorisnika) + '" aria-label="Ukloni">' + I.x + '</button>' : '') + '</li>';
      }).join('') + '</ul>' : '<p class="muted">Još nema prijava.</p>';
      if (r[1].length) html += '<h3 style="margin-top:12px">Čeka upis s mobitela</h3><ul class="popis">' + r[1].map(function (q) {
        q.naziv = (q.p.imena || []).concat((q.p.novi || []).map(function (n) { return n.prezime + ' ' + n.ime + ' (nova)'; })).join(', ');
        return stavkaRedaHtml(I.lista, q);
      }).join('') + '</ul>';
      if (liste.length) html += '<div class="btnrow one"><button class="btn ghost" id="pGotovaLista">Sve osobe s liste su upisane ✓</button></div>';
      $('#pLista').innerHTML = html;
      $$('#pLista [data-ponovi]').forEach(function (b) { b.onclick = function () { ponovi(b.getAttribute('data-ponovi')); }; });
      $$('#pLista [data-makni]').forEach(function (b) { b.onclick = function () { makniIzReda(b.getAttribute('data-makni')); }; });
      $$('#pLista [data-uk]').forEach(function (b) {
        b.onclick = function () {
          if (!naMrezi()) { toast('Uklanjanje je moguće samo uz internet.'); return; }
          if (!confirm('Ukloniti ovu prijavu?')) return;
          ZP.api('ukloniPrijavu', t.kljuc, b.getAttribute('data-uk')).then(function () { return prijaveMjeseca(t.datum.slice(0, 7), true); }).then(crtajListu).catch(greska);
        };
      });
      if ($('#pGotovaLista')) $('#pGotovaLista').onclick = function () {
        if (!naMrezi()) { toast('Potreban je internet.'); return; }
        Promise.all(liste.map(function (x) { return ZP.api('oznaciObradjeno', x.naziv, pr.length); }))
          .then(function () { return sKesom('potpisne_obrada', 'potpisneZaObradu', [], true); }).then(function () { toast('Označeno kao obrađeno.'); crtajListu(); }).catch(greska);
      };
    });
  };
  S.naPromjenuReda = function (q) {
    if (q && q.tip === 'prijave' && q.status === 'gotovo') prijaveMjeseca(t.datum.slice(0, 7), true).then(crtajListu, crtajListu);
    else crtajListu();
  };
  crtajOdabrane(); crtajListu();
}

/** Prijava jedne osobe na više aktivnosti (kao u aplikaciji „Prijave na aktivnosti”) – bez potpisa, s odabranim datumom prijave. */
function prijavaOsobe() {
  S.naPromjenuReda = null; S.osvjezi = null; S.prijaveTermin = { kljuc: '_osoba' };
  var sad = new Date();
  var P = { osoba: null, novi: null, datum: danas(), vrijeme: pad(sad.getHours()) + ':' + pad(sad.getMinutes()), termini: {}, opce: {}, ym: S.prijaveMjesec, lok: '' };
  $('#app').innerHTML = '<button class="btn link back" id="natrag">' + I.lijevo + 'Prijave</button><h2>Prijava na aktivnosti</h2>' +
    '<p class="muted small">Osoba iz baze (ili nova), odabrani datum prijave, bez potpisa. Potpisuje se kasnije na mjesečnoj prijavnici.</p>' +
    '<div class="card"><h3>1. Osoba</h3><div class="odabrani" id="poOsoba"></div>' +
    '<input class="unos" id="poTrazi" placeholder="Prezime ili ime…" autocomplete="off"><div id="poRez"></div>' +
    '<details style="margin-top:10px" id="poNovaD"><summary class="small">Osoba nije u bazi – upiši novu</summary>' +
    '<div class="dvoje"><div><input class="unos" id="poIme" placeholder="Ime"></div><div><input class="unos" id="poPrez" placeholder="Prezime"></div></div>' +
    '<div class="dvoje" style="margin-top:8px"><div><input class="unos" id="poGod" type="number" placeholder="Godina rođenja"></div><div><input class="unos" id="poNas" placeholder="Naselje"></div></div>' +
    '<div class="btnrow one"><button class="btn ghost" id="poNovaOK">' + I.plus + 'Koristi ovu osobu</button></div></details></div>' +
    '<div class="card"><h3>2. Datum prijave</h3><div class="dvoje"><div><label class="polje" for="poDatum">Datum</label><input class="unos" type="date" id="poDatum"></div>' +
    '<div><label class="polje" for="poVrij">Vrijeme</label><input class="unos" type="time" id="poVrij"></div></div></div>' +
    '<div class="card"><h3>3. Termini</h3><div class="mjesec"><button class="iconbtn" id="poPrev">' + I.lijevo + '</button><b id="poMj"></b><button class="iconbtn" id="poNext">' + I.desno + '</button></div>' +
    '<select class="unos" id="poLok"><option value="">Sve lokacije</option>' + LOKACIJE.map(function (l) { return '<option>' + l + '</option>'; }).join('') + '</select>' +
    '<div id="poTermini"><div class="spinner"></div></div></div>' +
    '<div class="card"><h3>4. Opća prijava (termin naknadno)</h3><p class="muted small">Za aktivnosti bez određenog termina.</p>' +
    '<select class="unos" id="poOLok">' + LOKACIJE.map(function (l) { return '<option>' + l + '</option>'; }).join('') + '</select><div id="poOpce"></div></div>' +
    '<div class="card"><div id="poSazetak" class="small"></div><div class="btnrow one"><button class="btn gold" id="poSpremi">Prijavi</button></div></div>';
  $('#natrag').onclick = function () { S.prijaveTermin = null; pocetnaPrijave(); };
  $('#poDatum').value = P.datum; $('#poVrij').value = P.vrijeme;
  $('#poDatum').onchange = function () { P.datum = $('#poDatum').value; sazetak(); };
  $('#poVrij').onchange = function () { P.vrijeme = $('#poVrij').value; sazetak(); };
  $('#poPrev').onclick = function () { P.ym = pomakniMj(P.ym, -1); crtajTermine(); };
  $('#poNext').onclick = function () { P.ym = pomakniMj(P.ym, 1); crtajTermine(); };
  $('#poLok').onchange = function () { P.lok = $('#poLok').value; crtajTermine(); };
  $('#poOLok').onchange = crtajOpce;

  function crtajOsobu() {
    var o = P.osoba ? P.osoba.prezime + ' ' + P.osoba.ime + (P.osoba.god ? ' (' + P.osoba.god + ')' : '') : P.novi ? P.novi.prezime + ' ' + P.novi.ime + ' (nova)' : '';
    $('#poOsoba').innerHTML = o ? '<span>' + esc(o) + '<b id="poMakni">×</b></span>' : '<p class="muted small">Odaberite osobu.</p>';
    if ($('#poMakni')) $('#poMakni').onclick = function () { P.osoba = P.novi = null; crtajOsobu(); };
    sazetak();
  }
  korisnici().then(function (lista) {
    $('#poTrazi').oninput = function () {
      var u = norm($('#poTrazi').value);
      if (u.length < 2) { $('#poRez').innerHTML = ''; return; }
      var dij = u.split(/\s+/);
      var rez = lista.filter(function (k) { var s = norm(k.prezime + ' ' + k.ime); return dij.every(function (d) { return s.indexOf(d) >= 0; }); }).slice(0, 12);
      $('#poRez').innerHTML = rez.map(function (k) {
        return '<div class="osoba" data-id="' + esc(k.id) + '"><span class="ime"><b>' + esc(k.prezime) + '</b> ' + esc(k.ime) + '<br><span class="muted small">' + esc([k.id, k.god, k.naselje].filter(String).join(' · ')) + '</span></span>' + I.plus + '</div>';
      }).join('') || '<p class="muted small">Nema takve osobe – upišite je kao novu.</p>';
      $$('#poRez .osoba').forEach(function (el) {
        el.onclick = function () { P.osoba = lista.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0]; P.novi = null; $('#poTrazi').value = ''; $('#poRez').innerHTML = ''; crtajOsobu(); };
      });
    };
  }).catch(function (e) { $('#poRez').innerHTML = '<p class="status-err small">' + esc(e.message) + '</p>'; });
  $('#poNovaOK').onclick = function () {
    var ime = $('#poIme').value.trim(), prez = $('#poPrez').value.trim();
    if (!ime || !prez) { toast('Upišite ime i prezime.'); return; }
    P.novi = { ime: ime, prezime: prez, god: $('#poGod').value.trim(), naselje: $('#poNas').value.trim() }; P.osoba = null;
    $('#poNovaD').open = false; crtajOsobu();
  };

  function crtajTermine() {
    $('#poMj').textContent = nazivMj(P.ym);
    $('#poTermini').innerHTML = '<div class="spinner"></div>';
    terminiMjeseca(P.ym).then(function (tt) {
      if (!$('#poTermini')) return;
      tt = tt.filter(function (t) { return !P.lok || t.lokacija === P.lok; });
      var poDanu = {};
      tt.forEach(function (t) { (poDanu[t.datum] = poDanu[t.datum] || []).push(t); });
      $('#poTermini').innerHTML = Object.keys(poDanu).sort().map(function (d) {
        return '<div class="small" style="margin-top:10px;font-weight:700;color:var(--navy)">' + esc(lijepDatum(d)) + '</div>' + poDanu[d].map(function (t) {
          return '<label class="osoba"><input type="checkbox" data-k="' + esc(t.kljuc) + '"' + (P.termini[t.kljuc] ? ' checked' : '') + '><span class="ime"><b>' + esc(t.pocetak) + '</b> ' + esc(t.kratko || t.aktivnost) +
            '<br><span class="muted small">' + esc(t.sifra + ' · ' + t.lokacija + (t.mjesto ? ' · ' + t.mjesto : '')) + '</span></span></label>';
        }).join('');
      }).join('') || '<p class="muted">Nema termina.</p>';
      $$('#poTermini input[data-k]').forEach(function (c) {
        c.onchange = function () { var t = tt.filter(function (x) { return x.kljuc === c.getAttribute('data-k'); })[0]; if (c.checked) P.termini[t.kljuc] = t; else delete P.termini[t.kljuc]; sazetak(); };
      });
    }).catch(function (e) { $('#poTermini').innerHTML = '<p class="status-err small">' + esc(e.message) + '</p>'; });
  }
  var AKT = null;
  function crtajOpce() {
    var lok = $('#poOLok').value;
    var pr = AKT ? Promise.resolve(AKT) : sKesom('aktivnosti_prijave', 'aktivnostiPrijave', []).then(function (a) { AKT = a; return a; });
    pr.then(function (a) {
      if (!$('#poOpce')) return;
      a = a.filter(function (x) { return !x.lokacije || !x.lokacije.length || x.lokacije.indexOf(lok) >= 0; });
      $('#poOpce').innerHTML = a.map(function (x) {
        var k = x.sifra + '|' + x.aktivnost + '|' + lok;
        return '<label class="osoba"><input type="checkbox" data-o="' + esc(k) + '"' + (P.opce[k] ? ' checked' : '') + '><span class="ime">' + esc(x.aktivnost) + '<br><span class="muted small">' + esc(x.sifra + ' · ' + lok) + '</span></span></label>';
      }).join('');
      $$('#poOpce input[data-o]').forEach(function (c) {
        c.onchange = function () { var d = c.getAttribute('data-o').split('|'); if (c.checked) P.opce[c.getAttribute('data-o')] = { sifra: d[0], aktivnost: d[1], lokacija: d[2] }; else delete P.opce[c.getAttribute('data-o')]; sazetak(); };
      });
    }).catch(function (e) {
      $('#poOpce').innerHTML = '<p class="muted small">' + esc(/Nepoznata akcija/.test(e.message) ? 'Opća prijava radi nakon objave nove verzije API-ja.' : e.message) + '</p>';
    });
  }
  function sazetak() {
    var nT = Object.keys(P.termini).length, nO = Object.keys(P.opce).length;
    var o = P.osoba ? P.osoba.prezime + ' ' + P.osoba.ime : P.novi ? P.novi.prezime + ' ' + P.novi.ime : '—';
    $('#poSazetak').innerHTML = '<b>' + esc(o) + '</b> · prijava ' + esc(P.datum ? kratkiDatum(P.datum) + P.datum.slice(0, 4) + '.' : '') + ' u ' + esc(P.vrijeme || '') +
      '<br>Termina: <b>' + nT + '</b> · općih prijava: <b>' + nO + '</b>';
    $('#poSpremi').textContent = 'Prijavi (' + (nT + nO) + ')';
  }
  $('#poSpremi').onclick = function () {
    if (!P.osoba && !P.novi) { toast('Odaberite osobu.'); return; }
    if (!P.datum) { toast('Odaberite datum prijave.'); return; }
    var tt = Object.keys(P.termini).map(function (k) { return P.termini[k]; }), oo = Object.keys(P.opce).map(function (k) { return P.opce[k]; });
    if (!tt.length && !oo.length) { toast('Odaberite barem jedan termin ili aktivnost.'); return; }
    var kasni = tt.filter(function (t) { return t.datum < P.datum; });
    if (kasni.length && !confirm('Datum prijave je nakon ' + kasni.length + ' odabranih termina. Ipak spremiti?')) return;
    var ime = P.osoba ? P.osoba.prezime + ' ' + P.osoba.ime : P.novi.prezime + ' ' + P.novi.ime + ' (nova)';
    ZP.uRed({ tip: 'prijavaOsobe', p: { korisnik: P.osoba ? P.osoba.id : null, novi: P.novi, datum: P.datum, vrijeme: P.vrijeme, termini: tt, opce: oo },
      ime: ime + ' · ' + (tt.length + oo.length) + ' aktivnosti' }).then(function () {
      toast(naMrezi() ? 'Prijavljujem: ' + ime : 'Spremljeno na mobitel – upisat će se kad bude interneta.', 3500);
      P.osoba = P.novi = null; P.termini = {}; P.opce = {};
      crtajOsobu(); crtajTermine(); crtajOpce();
    }).catch(greska);
  };
  crtajOsobu(); crtajTermine(); crtajOpce();
}

/* ═══ 4. SLANJE I POSTAVKE ═══════════════════════════════════════════ */
function pocetnaSlanje() {
  var crtaj = function () {
    Promise.all([ZP.redSvi(), ZP.postavke(), navigator.storage && navigator.storage.estimate ? navigator.storage.estimate() : Promise.resolve(null)]).then(function (r) {
      if (S.tab !== 'slanje') return;
      var red = r[0].slice().reverse(), p = r[1], pr = r[2];
      var ceka = red.filter(function (q) { return q.status !== 'gotovo'; });
      var opis = function (q) {
        if (q.tip === 'datoteka') return { foto: 'Fotografija', video: 'Video', potpisna: 'Potpisna lista' }[q.vrsta] + ' · ' + (q.termin.kratko || q.termin.aktivnost) + ' ' + kratkiDatum(q.termin.datum);
        if (q.tip === 'napomena') return 'Napomena · ' + (q.termin.kratko || q.termin.aktivnost) + ' ' + kratkiDatum(q.termin.datum);
        if (q.tip === 'vidljivost') return 'Vidljivost · ' + (q.z.naslov || q.z.organizacija || q.z.kategorija) + ' (' + (q.datoteke || []).length + ' dat.)';
        if (q.tip === 'prijave') return 'Prijave · ' + q.ime;
        if (q.tip === 'prijavaOsobe') return 'Prijava osobe · ' + q.ime;
        return q.ime;
      };
      var html = '<h2>Slanje</h2><div class="card"><div class="naslovTaba"><h3>' + (ceka.length ? 'Čeka slanje: ' + ceka.length : 'Sve je poslano ✓') + '</h3></div>' +
        (!naMrezi() ? '<div class="obavijest warn">Mobitel nije na internetu. Sve je sigurno spremljeno na mobitelu i poslat će se samo čim se spojite.</div>' : '') +
        (red.length ? '<ul class="popis">' + red.slice(0, 40).map(function (q) { q.naziv = opis(q); return stavkaRedaHtml(q.tip === 'prijave' || q.tip === 'prijavaOsobe' ? I.lista : q.vrsta === 'video' ? I.video : I.foto, q); }).join('') + '</ul>' : '') +
        '<div class="btnrow one"><button class="btn primary" id="sSada">Pošalji sada</button></div>' +
        (pr ? '<p class="muted small">Zauzeto na mobitelu: ' + mb(pr.usage || 0) + '</p>' : '') + '</div>';
      html += '<div class="card"><h3>Povezivanje s Driveom</h3>' +
        '<label class="polje" for="pUrl">Adresa web-aplikacije (…/exec)</label><input class="unos" id="pUrl" value="' + esc(p.url || '') + '" placeholder="https://script.google.com/macros/s/…/exec">' +
        '<label class="polje" for="pTok">Pristupni ključ</label><input class="unos" id="pTok" value="' + esc(p.token || '') + '" autocomplete="off">' +
        '<div class="btnrow"><button class="btn gold" id="pSpremiP">Spremi</button><button class="btn ghost" id="pTest">Provjeri vezu</button></div><div id="pTestRez"></div></div>';
      html += '<div class="card"><h3>Podaci za rad bez interneta</h3><p class="muted small">Kalendar aktivnosti (prošli, ovaj i sljedeći mjesec) i popis korisnika spremaju se na mobitel. Osvježite prije odlaska na teren.</p>' +
        '<div class="btnrow one"><button class="btn ghost" id="pPreuzmi">Preuzmi / osvježi podatke</button></div><div id="pPreuzmiRez"></div></div>';
      html += '<div class="card"><h3>Instalacija na mobitel</h3><p class="small">Android (Chrome): izbornik ⋮ → <b>Dodaj na početni zaslon / Instaliraj aplikaciju</b>. iPhone (Safari): Dijeli → <b>Dodaj na početni zaslon</b>.</p>' +
        '<p class="muted small">Verzija ' + VERZIJA_APP + '</p></div>';
      $('#app').innerHTML = html;
      $$('[data-ponovi]').forEach(function (b) { b.onclick = function () { ponovi(b.getAttribute('data-ponovi')); }; });
      $$('[data-makni]').forEach(function (b) { b.onclick = function () { makniIzReda(b.getAttribute('data-makni')); }; });
      $('#sSada').onclick = function () {
        ZP.redSvi().then(function (svi) { return Promise.all(svi.filter(function (q) { return q.status === 'greska'; }).map(function (q) { q.status = 'ceka'; q.pokusaja = 0; return ZP.redSpremi(q); })); })
          .then(function () { ZP.pokreni(); });
      };
      $('#pSpremiP').onclick = function () {
        ZP.kesSpremi('postavke', { url: $('#pUrl').value.trim(), token: $('#pTok').value.trim() }).then(function () { toast('Spremljeno.'); ZP.pokreni(); });
      };
      $('#pTest').onclick = function () {
        ZP.kesSpremi('postavke', { url: $('#pUrl').value.trim(), token: $('#pTok').value.trim() }).then(function () { return ZP.api('ping'); })
          .then(function (r) { $('#pTestRez').innerHTML = '<div class="obavijest ok">Veza radi ✓ (poslužitelj ' + esc(r.verzija) + ')</div>'; preuzmiPodatke(); })
          .catch(function (e) { $('#pTestRez').innerHTML = '<div class="obavijest bad">' + esc(e.message) + '</div>'; });
      };
      $('#pPreuzmi').onclick = preuzmiPodatke;
    });
  };
  S.osvjezi = null; S.naPromjenuReda = crtaj;
  crtaj();
}

function preuzmiPodatke() {
  if (!naMrezi()) { toast('Potreban je internet.'); return Promise.resolve(); }
  var el = $('#pPreuzmiRez'); if (el) el.innerHTML = '<div class="spinner"></div>';
  var ym = danas().slice(0, 7);
  return Promise.all([terminiMjeseca(pomakniMj(ym, -1), true), terminiMjeseca(ym, true), terminiMjeseca(pomakniMj(ym, 1), true), korisnici(true),
    prijaveMjeseca(ym, true), sKesom('aktivnosti_prijave', 'aktivnostiPrijave', [], true).catch(function () { return []; }), sKesom('vid_pregled', 'vidljivostPregled', [new Date().getFullYear()], true)]).then(function (r) {
    if ($('#pPreuzmiRez')) $('#pPreuzmiRez').innerHTML = '<div class="obavijest ok">Spremljeno: ' + (r[0].length + r[1].length + r[2].length) + ' termina, ' + r[3].length + ' korisnika.</div>';
  }).catch(function (e) { if ($('#pPreuzmiRez')) $('#pPreuzmiRez').innerHTML = '<div class="obavijest bad">' + esc(e.message) + '</div>'; });
}

/* ═══ POKRETANJE ═════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  $$('#tabs button').forEach(function (b) { b.onclick = function () { postaviTab(b.getAttribute('data-tab')); }; });
  $('#mreza').onclick = function () { postaviTab('slanje'); };
  // datoteka ispuštena bilo gdje na stranici: ne otvaraj je u pregledniku nego je dodaj gdje ima smisla
  document.addEventListener('dragover', function (e) { if (imaDatoteka(e)) { e.preventDefault(); e.dataTransfer.dropEffect = ciljUmetanja() ? 'copy' : 'none'; } });
  document.addEventListener('drop', function (e) {
    if (!imaDatoteka(e)) return;
    e.preventDefault();
    var f = Array.prototype.slice.call(e.dataTransfer.files || []);
    var c = ciljUmetanja();
    if (!f.length) return;
    if (!c) { toast('Otvorite termin (Provedba) ili novi element vidljivosti pa ispustite datoteku.'); return; }
    c(f, false);
  });
  // Ctrl+V: snimka zaslona (ili kopirana datoteka) iz međuspremnika
  document.addEventListener('paste', function (e) {
    var f = datotekeIzMedjuspremnika(e.clipboardData);
    if (!f.length) return;                       // običan tekst – normalno lijepljenje
    var c = ciljUmetanja();
    if (!c) { toast('Otvorite termin (Provedba) ili novi element vidljivosti pa zalijepite sliku.'); return; }
    e.preventDefault();
    var uNapomenu = !!(e.target && e.target.closest && e.target.closest('#sek-napomena'));
    c(f, uNapomenu);
  });
  window.addEventListener('online', function () { osvjeziStanjeMreze(); ZP.pokreni(); if (S.osvjezi) S.osvjezi(); });
  window.addEventListener('offline', osvjeziStanjeMreze);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) ZP.pokreni(); });
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {});
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      if (reg.periodicSync) reg.periodicSync.register('zp-red', { minInterval: 3600 * 1000 }).catch(function () {});
    }).catch(function () {});
  }
  ZP.postavke().then(function (p) {
    osvjeziStanjeMreze();
    if (!p.url || !p.token) { postaviTab('slanje'); toast('Najprije povežite aplikaciju s Driveom.', 4000); return; }
    postaviTab('provedba');
    ZP.pokreni();
    ZP.kesUzmi('zadnjePreuzimanje').then(function (z) {
      if (naMrezi() && (!z || Date.now() - z > 6 * 3600 * 1000)) preuzmiPodatke().then(function () { ZP.kesSpremi('zadnjePreuzimanje', Date.now()); });
    });
  });
  window.addEventListener('beforeunload', function (e) {
    if (S.glas) { try { S.glas.stop(); } catch (x) {} }
  });
});
