/* Zlatni puls · potpisna lista: fotografija → izravnani sken → PDF (iz aplikacije Provedba). */
var ED = null;
function otvoriUredjivac(slike, gotovo) {
  ED = { stranice: [], cekaju: slike.slice(), filtar: 'sken', slika: null, kutovi: null, gotovo: gotovo };
  var m = document.createElement('div'); m.className = 'modal'; m.id = 'modal';
  m.innerHTML =
    '<div class="mtop"><button class="btn ghost" id="mOdustani" style="min-height:44px">Odustani</button>' +
    '<h3 id="mNaslov">Potpisna lista</h3><button class="btn ghost" id="mRot" style="min-height:44px" aria-label="Zakreni">' + I.rot + '</button></div>' +
    '<div class="stage" id="mStage"><div class="spinner"></div></div>' +
    '<div class="mbot">' +
      '<div class="small" id="mUputa" style="text-align:center;opacity:.85">Povucite zlatne točke na kutove papira.</div>' +
      '<div class="stranice" id="mStranice"></div>' +
      '<div class="btnrow"><button class="btn ghost" id="mJos">' + I.plus + 'Stranica</button>' +
      '<button class="btn gold" id="mDalje">Obreži</button></div>' +
    '</div>';
  document.body.appendChild(m);
  document.body.style.overflow = 'hidden';
  $('#mOdustani').onclick = zatvoriUredjivac;
  $('#mRot').onclick = function () { if (ED.slika) { ED.slika = zakreni(ED.slika); ED.kutovi = nadjiKutove(ED.slika); crtajObrez(); } };
  $('#mJos').onclick = function () { if (ED.faza === 'obrez') potvrdiStranicu(function () { odaberiJos(); }); else odaberiJos(); };
  $('#mDalje').onclick = function () {
    if (ED.faza === 'obrez') potvrdiStranicu(function () { if (ED.cekaju.length) sljedecaSlika(); else pregledPdf(); });
    else if (ED.faza === 'pregled') spremiPdf();
  };
  sljedecaSlika();
}
function odaberiJos() {
  var inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = function () { if (inp.files.length) { ED.cekaju.push(inp.files[0]); sljedecaSlika(); } else if (ED.stranice.length) pregledPdf(); };
  inp.click();
}
function zatvoriUredjivac() { var m = $('#modal'); if (m) m.remove(); document.body.style.overflow = ''; ED = null; }

function sljedecaSlika() {
  var f = ED.cekaju.shift();
  if (!f) { pregledPdf(); return; }
  ED.faza = 'ucitava';
  $('#mStage').innerHTML = '<div class="spinner"></div>';
  createImageBitmap(f).then(function (bmp) {
    var k = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
    var c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    ED.slika = c; ED.kutovi = nadjiKutove(c);
    crtajObrez();
  }).catch(function () { toast('Slika se ne može otvoriti.'); zatvoriUredjivac(); });
}

function zakreni(src) {
  var c = document.createElement('canvas'); c.width = src.height; c.height = src.width;
  var x = c.getContext('2d'); x.translate(c.width, 0); x.rotate(Math.PI / 2); x.drawImage(src, 0, 0);
  return c;
}

function crtajObrez() {
  ED.faza = 'obrez';
  $('#mNaslov').textContent = 'Stranica ' + (ED.stranice.length + 1) + ' – obrezivanje';
  $('#mDalje').textContent = ED.cekaju.length ? 'Sljedeća' : 'Obreži';
  $('#mUputa').textContent = 'Povucite zlatne točke na kutove papira.';
  $('#mRot').classList.remove('hidden');
  var st = $('#mStage'); st.innerHTML = '';
  var cv = ED.slika; cv.style.maxWidth = '100%'; cv.style.maxHeight = '100%';
  st.appendChild(cv);
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'quad'); st.appendChild(svg);
  var h = [];
  for (var i = 0; i < 4; i++) { var d = document.createElement('div'); d.className = 'handle'; st.appendChild(d); h.push(d); }
  function geo() { var r = cv.getBoundingClientRect(), s = st.getBoundingClientRect(); return { x: r.left - s.left, y: r.top - s.top, k: r.width / cv.width }; }
  function postavi() {
    var g = geo();
    var pts = ED.kutovi.map(function (p) { return [g.x + p[0] * g.k, g.y + p[1] * g.k]; });
    pts.forEach(function (p, i) { h[i].style.left = p[0] + 'px'; h[i].style.top = p[1] + 'px'; });
    svg.innerHTML = '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="rgba(231,200,112,.12)" stroke="#e7c870" stroke-width="2.5"/>';
  }
  h.forEach(function (el, i) {
    el.addEventListener('pointerdown', function (e) {
      e.preventDefault(); el.setPointerCapture(e.pointerId);
      function mv(ev) {
        var g = geo(), s = st.getBoundingClientRect();
        var x = (ev.clientX - s.left - g.x) / g.k, y = (ev.clientY - s.top - g.y) / g.k;
        ED.kutovi[i] = [Math.max(0, Math.min(cv.width, x)), Math.max(0, Math.min(cv.height, y))];
        postavi();
      }
      function up() { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); }
      el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up);
    });
  });
  requestAnimationFrame(postavi);
  window.onresize = function () { if (ED && ED.faza === 'obrez') postavi(); };
}

function potvrdiStranicu(dalje) {
  $('#mStage').innerHTML = '<div class="spinner"></div>';
  setTimeout(function () {
    var ravna = izravnaj(ED.slika, ED.kutovi);
    ED.stranice.push({ ravna: ravna });
    osvjeziMinijature();
    dalje();
  }, 30);
}
function osvjeziMinijature() {
  $('#mStranice').innerHTML = ED.stranice.map(function (s) {
    var c = document.createElement('canvas'), k = 64 / s.ravna.height;
    c.width = Math.round(s.ravna.width * k); c.height = 64; c.getContext('2d').drawImage(s.ravna, 0, 0, c.width, c.height);
    return '<img src="' + c.toDataURL('image/jpeg', .6) + '" alt="">';
  }).join('');
}

function pregledPdf() {
  ED.faza = 'pregled';
  $('#mNaslov').textContent = 'Pregled (' + ED.stranice.length + (ED.stranice.length === 1 ? ' stranica)' : ' stranice)');
  $('#mDalje').textContent = 'Spremi PDF';
  $('#mRot').classList.add('hidden');
  $('#mUputa').innerHTML = '<div class="seg"><button data-f="sken">Skenirano</button><button data-f="siva">Sivo</button><button data-f="boja">U boji</button></div>';
  Array.prototype.forEach.call(document.querySelectorAll('.seg button'), function (b) {
    b.classList.toggle('on', b.getAttribute('data-f') === ED.filtar);
    b.onclick = function () { ED.filtar = b.getAttribute('data-f'); pregledPdf(); };
  });
  var prva = obradi(ED.stranice[0].ravna, ED.filtar);
  var img = new Image(); img.className = 'pregled'; img.src = prva.toDataURL('image/jpeg', .8);
  $('#mStage').innerHTML = ''; $('#mStage').appendChild(img);
}

function spremiPdf() {
  var b = $('#mDalje'); b.disabled = true; b.textContent = 'Izrađujem PDF…';
  setTimeout(function () {
    var obradjene = ED.stranice.map(function (s) { return obradi(s.ravna, ED.filtar); });
    Promise.all(obradjene.map(function (c) {
      return new Promise(function (res) { c.toBlob(function (bl) { bl.arrayBuffer().then(function (ab) { res({ jpeg: new Uint8Array(ab), w: c.width, h: c.height }); }); }, 'image/jpeg', ED.filtar === 'boja' ? .82 : .78); });
    })).then(function (str) {
      var blob = napraviPdf(str);
      var c = obradjene[0], t = document.createElement('canvas'), k = 120 / c.height;
      t.width = Math.round(c.width * k); t.height = 120; t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
      var thumb = t.toDataURL('image/jpeg', .7);
      var gotovo = ED.gotovo;
      zatvoriUredjivac();
      if (gotovo) gotovo(blob, thumb);
    }).catch(function (e) { greska(e); b.disabled = false; b.textContent = 'Spremi PDF'; });
  }, 30);
}

/* Jednostavan PDF: svaka stranica je jedna JPEG slika preko cijele stranice (širina A4 = 595 pt). */
function napraviPdf(stranice) {
  var dijelovi = [], pomak = 0, xref = [];
  var enc = new TextEncoder();
  function dodaj(x) { var b = typeof x === 'string' ? enc.encode(x) : x; dijelovi.push(b); pomak += b.length; }
  var n = stranice.length, kidsIds = [];
  // objekti: 1 katalog, 2 stranice, zatim po stranici: page, slika, sadržaj
  for (var i = 0; i < n; i++) kidsIds.push(3 + i * 3);
  dodaj('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  function obj(id, tijelo, stream) {
    xref[id] = pomak;
    dodaj(id + ' 0 obj\n' + tijelo + '\n');
    if (stream) { dodaj('stream\n'); dodaj(stream); dodaj('\nendstream\n'); }
    dodaj('endobj\n');
  }
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, '<< /Type /Pages /Count ' + n + ' /Kids [' + kidsIds.map(function (k) { return k + ' 0 R'; }).join(' ') + '] >>');
  stranice.forEach(function (s, i) {
    var pid = 3 + i * 3, iid = pid + 1, cid = pid + 2;
    var wpt, hpt;
    if (s.w <= s.h) { wpt = 595.28; hpt = +(595.28 * s.h / s.w).toFixed(2); } else { hpt = 595.28; wpt = +(595.28 * s.w / s.h).toFixed(2); }
    obj(pid, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + wpt + ' ' + hpt + '] /Resources << /XObject << /Im' + i + ' ' + iid + ' 0 R >> /ProcSet [/PDF /ImageC /ImageB] >> /Contents ' + cid + ' 0 R >>');
    obj(iid, '<< /Type /XObject /Subtype /Image /Width ' + s.w + ' /Height ' + s.h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + s.jpeg.length + ' >>', s.jpeg);
    var sadrzaj = 'q ' + wpt + ' 0 0 ' + hpt + ' 0 0 cm /Im' + i + ' Do Q';
    obj(cid, '<< /Length ' + sadrzaj.length + ' >>', sadrzaj);
  });
  var ukupnoObj = 3 + n * 3;
  var xrefPos = pomak;
  var x = 'xref\n0 ' + ukupnoObj + '\n0000000000 65535 f \n';
  for (var j = 1; j < ukupnoObj; j++) x += String(xref[j]).padStart(10, '0') + ' 00000 n \n';
  dodaj(x + 'trailer\n<< /Size ' + ukupnoObj + ' /Root 1 0 R >>\nstartxref\n' + xrefPos + '\n%%EOF');
  return new Blob(dijelovi, { type: 'application/pdf' });
}

/* ─── obrada slike: pronalazak papira, izravnavanje, „sken” ────────── */
function nadjiKutove(src) {
  var W = src.width, H = src.height;
  var zadano = [[W * .06, H * .06], [W * .94, H * .06], [W * .94, H * .94], [W * .06, H * .94]];
  try {
    var k = 320 / Math.max(W, H), w = Math.round(W * k), h = Math.round(H * k);
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var x = c.getContext('2d'); x.drawImage(src, 0, 0, w, h);
    var d = x.getImageData(0, 0, w, h).data, g = new Uint8Array(w * h), hist = new Array(256).fill(0);
    for (var i = 0; i < w * h; i++) {
      var r = d[i * 4], gg = d[i * 4 + 1], b = d[i * 4 + 2];
      var sat = Math.max(r, gg, b) - Math.min(r, gg, b);
      var v = (r * 299 + gg * 587 + b * 114) / 1000 - sat * .6;   // papir je svijetao i neobojen
      v = Math.max(0, Math.min(255, v)); g[i] = v; hist[v | 0]++;
    }
    // Otsu prag
    var tot = w * h, sum = 0; for (var t = 0; t < 256; t++) sum += t * hist[t];
    var sB = 0, wB = 0, best = 0, prag = 128;
    for (t = 0; t < 256; t++) { wB += hist[t]; if (!wB) continue; var wF = tot - wB; if (!wF) break; sB += t * hist[t];
      var mB = sB / wB, mF = (sum - sB) / wF, bw = wB * wF * (mB - mF) * (mB - mF); if (bw > best) { best = bw; prag = t; } }
    // najveća svijetla povezana površina (flood fill iz središta i okoline)
    var oznaka = new Int32Array(w * h), najL = 0, najV = 0, lab = 0, stog = new Int32Array(w * h);
    for (var p = 0; p < w * h; p++) {
      if (g[p] <= prag || oznaka[p]) continue;
      lab++; var vel = 0, sp = 0; stog[sp++] = p; oznaka[p] = lab;
      while (sp) { var q = stog[--sp]; vel++; var qx = q % w, qy = (q / w) | 0;
        if (qx > 0 && !oznaka[q - 1] && g[q - 1] > prag) { oznaka[q - 1] = lab; stog[sp++] = q - 1; }
        if (qx < w - 1 && !oznaka[q + 1] && g[q + 1] > prag) { oznaka[q + 1] = lab; stog[sp++] = q + 1; }
        if (qy > 0 && !oznaka[q - w] && g[q - w] > prag) { oznaka[q - w] = lab; stog[sp++] = q - w; }
        if (qy < h - 1 && !oznaka[q + w] && g[q + w] > prag) { oznaka[q + w] = lab; stog[sp++] = q + w; } }
      if (vel > najV) { najV = vel; najL = lab; }
    }
    if (najV < w * h * .15) return zadano;
    var tl = [0, 0, 1e9], tr = [0, 0, -1e9], br = [0, 0, -1e9], bl = [0, 0, -1e9];
    for (p = 0; p < w * h; p++) {
      if (oznaka[p] !== najL) continue;
      var px = p % w, py = (p / w) | 0;
      if (px + py < tl[2]) tl = [px, py, px + py];
      if (px - py > tr[2]) tr = [px, py, px - py];
      if (px + py > br[2]) br = [px, py, px + py];
      if (py - px > bl[2]) bl = [px, py, py - px];
    }
    var kut = [tl, tr, br, bl].map(function (a) { return [Math.max(0, Math.min(W, (a[0] + .5) / k)), Math.max(0, Math.min(H, (a[1] + .5) / k))]; });
    // provjera: četverokut mora biti razuman
    var povrs = Math.abs(kut.reduce(function (s, a, i) { var b2 = kut[(i + 1) % 4]; return s + a[0] * b2[1] - b2[0] * a[1]; }, 0)) / 2;
    if (povrs < W * H * .15) return zadano;
    // malo prema unutra da rub stola ne uđe u sken
    var cx = (kut[0][0] + kut[1][0] + kut[2][0] + kut[3][0]) / 4, cy = (kut[0][1] + kut[1][1] + kut[2][1] + kut[3][1]) / 4;
    return kut.map(function (a) { return [a[0] + (cx - a[0]) * .012, a[1] + (cy - a[1]) * .012]; });
  } catch (e) { return zadano; }
}

// homografija: preslikava jedinični kvadrat (0..1) na četverokut
function homografija(q) {
  var x0 = q[0][0], y0 = q[0][1], x1 = q[1][0], y1 = q[1][1], x2 = q[2][0], y2 = q[2][1], x3 = q[3][0], y3 = q[3][1];
  var dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  var det = dx1 * dy2 - dx2 * dy1;
  var g = (dx3 * dy2 - dx2 * dy3) / det, h = (dx1 * dy3 - dx3 * dy1) / det;
  return [x1 - x0 + g * x1, x3 - x0 + h * x3, x0, y1 - y0 + g * y1, y3 - y0 + h * y3, y0, g, h];
}
function izravnaj(src, q) {
  var dist = function (a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); };
  var sirina = (dist(q[0], q[1]) + dist(q[3], q[2])) / 2, visina = (dist(q[0], q[3]) + dist(q[1], q[2])) / 2;
  var omjer = visina / sirina;
  // potpisne liste su A4 – perspektiva s mobitela iskrivljuje omjer, pa ga ispravljamo na A4
  if (omjer > 1.1 && omjer < 1.8) omjer = 1.4142;              // A4 uspravno
  else if (omjer > 0.55 && omjer < 0.91) omjer = 0.7071;       // A4 položeno
  var W = omjer >= 1 ? 1654 : Math.round(1654 / omjer), H = Math.round(W * omjer);   // ~200 dpi
  if (omjer < 1) { H = 1654; W = Math.round(H / omjer); }
  var sd = src.getContext('2d').getImageData(0, 0, src.width, src.height), s = sd.data, sw = src.width, sh = src.height;
  var out = document.createElement('canvas'); out.width = W; out.height = H;
  var ox = out.getContext('2d'), od = ox.createImageData(W, H), o = od.data;
  var m = homografija(q);
  for (var y = 0; y < H; y++) {
    var v = (y + .5) / H;
    for (var x = 0; x < W; x++) {
      var u = (x + .5) / W;
      var z = m[6] * u + m[7] * v + 1;
      var fx = (m[0] * u + m[1] * v + m[2]) / z - .5, fy = (m[3] * u + m[4] * v + m[5]) / z - .5;
      var ix = Math.floor(fx), iy = Math.floor(fy), ax = fx - ix, ay = fy - iy;
      if (ix < 0) { ix = 0; ax = 0; } if (iy < 0) { iy = 0; ay = 0; }
      if (ix >= sw - 1) { ix = sw - 2; ax = 1; } if (iy >= sh - 1) { iy = sh - 2; ay = 1; }
      var i00 = (iy * sw + ix) * 4, i10 = i00 + 4, i01 = i00 + sw * 4, i11 = i01 + 4, oi = (y * W + x) * 4;
      for (var c = 0; c < 3; c++) {
        o[oi + c] = (s[i00 + c] * (1 - ax) + s[i10 + c] * ax) * (1 - ay) + (s[i01 + c] * (1 - ax) + s[i11 + c] * ax) * ay;
      }
      o[oi + 3] = 255;
    }
  }
  ox.putImageData(od, 0, 0);
  return out;
}
function obradi(src, filtar) {
  var W = src.width, H = src.height;
  var out = document.createElement('canvas'); out.width = W; out.height = H;
  var x = out.getContext('2d'); x.drawImage(src, 0, 0);
  if (filtar === 'boja') return out;
  var id = x.getImageData(0, 0, W, H), d = id.data;
  // procjena pozadine (osvjetljenja): jako smanjena, zamućena slika
  var bw = Math.max(8, Math.round(W / 24)), bh = Math.max(8, Math.round(H / 24));
  var bc = document.createElement('canvas'); bc.width = bw; bc.height = bh;
  var bx = bc.getContext('2d'); bx.imageSmoothingQuality = 'high'; bx.drawImage(src, 0, 0, bw, bh);
  // „maksimum” u susjedstvu = boja papira (tekst je tamniji)
  var bd = bx.getImageData(0, 0, bw, bh), b = bd.data, b2 = new Uint8ClampedArray(b.length);
  for (var yy = 0; yy < bh; yy++) for (var xx = 0; xx < bw; xx++) {
    var mx = 0;
    for (var ky = -1; ky <= 1; ky++) for (var kx = -1; kx <= 1; kx++) {
      var sx = Math.min(bw - 1, Math.max(0, xx + kx)), sy = Math.min(bh - 1, Math.max(0, yy + ky)), si = (sy * bw + sx) * 4;
      var l = b[si] * .299 + b[si + 1] * .587 + b[si + 2] * .114; if (l > mx) mx = l;
    }
    var di = (yy * bw + xx) * 4; b2[di] = b2[di + 1] = b2[di + 2] = mx; b2[di + 3] = 255;
  }
  bd.data.set(b2); bx.putImageData(bd, 0, 0);
  var big = document.createElement('canvas'); big.width = W; big.height = H;
  var gx = big.getContext('2d'); gx.imageSmoothingQuality = 'high'; gx.filter = 'blur(12px)'; gx.drawImage(bc, 0, 0, W, H);
  var pd = gx.getImageData(0, 0, W, H).data;
  for (var i = 0; i < d.length; i += 4) {
    var lum = d[i] * .299 + d[i + 1] * .587 + d[i + 2] * .114;
    var bg = Math.max(60, pd[i]);
    var n = Math.min(255, lum / bg * 255);                    // izjednačeno osvjetljenje
    if (filtar === 'sken') {
      n = (n - 70) * 255 / (235 - 70);                         // pojačani kontrast
      n = n < 0 ? 0 : n > 255 ? 255 : n;
      n = 255 * Math.pow(n / 255, 1.35);                       // tamniji potezi olovke
    }
    d[i] = d[i + 1] = d[i + 2] = n;
  }
  x.putImageData(id, 0, 0);
  return out;
}

