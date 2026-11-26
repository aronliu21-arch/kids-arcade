// SVG markup for cursive text. opts: {h:px height of one x-height unit, color, width:stroke width, pad}
function cursiveSVG(text, opts = {}) {
  const L = layoutText(text);
  const U = opts.unit || 40, sw = opts.sw || U*0.12, pad = opts.pad ?? 0.35;
  const minY = Math.min(L.bbox.minY, opts.fullLines ? -1 : L.bbox.minY), maxY = Math.max(L.bbox.maxY, opts.fullLines ? 2 : L.bbox.maxY);
  const vx = (L.bbox.minX - pad)*U, vy = -(maxY + pad)*U, vw = (L.bbox.w + 2*pad)*U, vh = (maxY - minY + 2*pad)*U;
  const color = opts.color || 'currentColor';
  let paths = '';
  const xf = opts.mirror ? (x => (2*L.bbox.minX + L.bbox.w - x)) : (x => x);
  const yf = opts.flip ? (y => (minY + maxY - y)) : (y => y);
  for (const s of L.strokes) {
    if (s.dot) { const p = s.pts[0]; paths += `<circle cx="${(xf(p[0])*U).toFixed(1)}" cy="${(-yf(p[1])*U).toFixed(1)}" r="${(sw*0.62).toFixed(1)}" fill="${color}"/>`; continue; }
    let d = '';
    s.pts.forEach((p, i) => { d += (i ? 'L' : 'M') + (xf(p[0])*U).toFixed(1) + ' ' + (-yf(p[1])*U).toFixed(1); });
    paths += `<path d="${d}"/>`;
  }
  let guide = '';
  if (opts.lines) {
    const gx0 = vx, gx1 = vx + vw;
    guide = `<g stroke-width="${Math.max(1, U*0.03)}" fill="none">` +
      `<line x1="${gx0}" x2="${gx1}" y1="${-2*U}" y2="${-2*U}" stroke="var(--line-top)"/>` +
      `<line x1="${gx0}" x2="${gx1}" y1="${-1*U}" y2="${-1*U}" stroke="var(--line-mid)" stroke-dasharray="${U*0.15} ${U*0.12}"/>` +
      `<line x1="${gx0}" x2="${gx1}" y1="0" y2="0" stroke="var(--line-base)" stroke-width="${Math.max(1.5, U*0.05)}"/></g>`;
  }
  const cls = opts.cls ? ` class="${opts.cls}"` : '';
  const style = opts.style ? ` style="${opts.style}"` : '';
  return `<svg${cls}${style} viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}" aria-label="cursive ${escapeHTML(text)}" role="img">${guide}<g fill="none" stroke="${color}" stroke-width="${sw.toFixed(1)}" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;
}
function escapeHTML(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// ---------- Scoring ----------
function resample(stroke, step) {
  if (stroke.length < 2) return stroke.slice();
  const out = [stroke[0]]; let acc = 0;
  for (let i = 1; i < stroke.length; i++) {
    let a = stroke[i-1], b = stroke[i], d = d2(a, b);
    while (acc + d >= step) {
      const t = (step - acc) / d;
      const p = [a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t];
      out.push(p); a = p; d = d2(a, b); acc = 0;
    }
    acc += d;
  }
  out.push(stroke[stroke.length-1]);
  return out;
}
function nearest(p, pts) { let best = Infinity, bi = -1; for (let i = 0; i < pts.length; i++) { const d = (p[0]-pts[i][0])**2 + (p[1]-pts[i][1])**2; if (d < best) { best = d; bi = i; } } return [Math.sqrt(best), bi]; }
function strokesLen(strokes) { let L = 0; for (const s of strokes) for (let i = 1; i < s.length; i++) L += d2(s[i-1], s[i]); return L; }

// Normalize a point cloud for recognition: translate to centroid, uniform scale
function normCloud(strokes, n = 48) {
  const all = []; for (const s of strokes) all.push(...s);
  const L = strokesLen(strokes) || 1;
  let pts = [];
  for (const s of strokes) { if (s.length === 1) pts.push(s[0]); else pts.push(...resample(s, L/n)); }
  let cx = 0, cy = 0; for (const p of pts) { cx += p[0]; cy += p[1]; } cx /= pts.length; cy /= pts.length;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of all) { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
  const sc = Math.max(maxX-minX, maxY-minY) || 1;
  return pts.map(p => [(p[0]-cx)/sc, (p[1]-cy)/sc]);
}
function chamfer(A, B) {
  let s1 = 0; for (const p of A) s1 += nearest(p, B)[0];
  let s2 = 0; for (const p of B) s2 += nearest(p, A)[0];
  return s1/A.length*0.5 + s2/B.length*0.5;
}
const _tmplCache = {};
function letterCloud(ch) {
  if (!_tmplCache[ch]) { const L = layoutText(ch); _tmplCache[ch] = normCloud(L.strokes.map(s => s.pts)); }
  return _tmplCache[ch];
}
// Rank letters by similarity to drawn ink (template matching). Returns [{ch, d}] sorted.
function recognize(userStrokes, pool) {
  const U = normCloud(userStrokes);
  return pool.map(ch => ({ ch, d: chamfer(U, letterCloud(ch)) })).sort((a, b) => a.d - b.d);
}

/* Score Nora's ink against the model.
   user: array of strokes in unit coords. mode: 'trace' | 'write'.
   Returns {score 0..1, stars, checks:{shape, direction, start, size, position, recog}, tips:[] } */
function scoreInk(text, user, mode) {
  const L = layoutText(text);
  const ink = user.filter(s => s.length > 0);
  const res = { score: 0, stars: 0, checks: {}, tips: [], empty: false };
  const userLen = strokesLen(ink);
  if (!ink.length || userLen < L.len * 0.25) { res.empty = true; res.tips.push('Draw the whole ' + (text.length > 1 ? 'word' : 'letter') + ' — from the green dot to the end.'); return res; }
  let U = ink.map(s => s.map(p => p.slice())); const U0 = U;
  const tol = mode === 'trace' ? 0.17 : 0.22;
  // in write mode, slide the ink sideways so it lines up with the model (height stays — the lines matter)
  let uMinX = Infinity, uMaxX = -Infinity, uMinY = Infinity, uMaxY = -Infinity;
  for (const s of U) for (const p of s) { uMinX = Math.min(uMinX, p[0]); uMaxX = Math.max(uMaxX, p[0]); uMinY = Math.min(uMinY, p[1]); uMaxY = Math.max(uMaxY, p[1]); }
  const alignTo = (LL) => {
    if (mode !== 'write') return U0;
    const sx = LL.bbox.w > 0.5 ? Math.min(1.6, Math.max(0.6, LL.bbox.w / Math.max(0.2, uMaxX-uMinX))) : 1;
    const ucx = (uMinX+uMaxX)/2, rcx = (LL.bbox.minX+LL.bbox.maxX)/2;
    return U0.map(s => s.map(p => [(p[0]-ucx)*sx + rcx, p[1]]));
  };
  const covPrec = (LL, UU) => {
    const ref = []; for (const s of LL.strokes) ref.push(...(s.dot ? s.pts : resample(s.pts, 0.06)));
    const uPts = []; for (const s of UU) uPts.push(...(s.length === 1 ? s : resample(s, 0.06)));
    let cov = 0; for (const p of ref) if (nearest(p, uPts)[0] < tol) cov++;     // how much of the model she covered
    let prec = 0; for (const p of uPts) if (nearest(p, ref)[0] < tol*1.15) prec++; // how much of her ink is near the model
    return [cov / ref.length, prec / uPts.length];
  };
  U = alignTo(L);
  const [cov, prec] = covPrec(L, U);
  // direction: along each long model stroke, does her ink move forward?
  let inc = 0, dec = 0, startOK = true;
  const mains = L.strokes.filter(s => !s.dot && s.len > 0.5);
  for (const ms of mains) {
    const mp = resample(ms.pts, 0.06);
    // find her stroke that best covers this model stroke
    let best = null, bestHit = 0;
    for (const s of U) {
      if (s.length < 3) continue;
      const rs = resample(s, 0.06); let hit = 0;
      for (const p of mp) if (nearest(p, rs)[0] < tol*1.2) hit++;   // how much of this model stroke she covered
      if (hit > bestHit) { bestHit = hit; best = rs; }
    }
    if (!best) continue;
    let last = -1;
    for (const p of best) {
      const [d, i] = nearest(p, mp); if (d > tol*1.2) continue;
      if (last >= 0) { if (i > last) inc += Math.min(4, i-last); else if (i < last) dec += Math.min(4, last-i); }
      last = i;
    }
    if (d2(best[0], mp[0]) > 0.55 && d2(best[best.length-1], mp[mp.length-1]) < d2(best[0], mp[0])) startOK = false;
  }
  const dir = inc + dec > 0 ? inc / (inc + dec) : 0.5;
  // size and position on the lines
  const h = uMaxY - uMinY, rh = L.bbox.h;
  const sizeRatio = h / rh;
  const sizeOK = sizeRatio > 0.65 && sizeRatio < 1.45;
  const posOK = Math.abs(uMinY - L.bbox.minY) < 0.42 && Math.abs(uMaxY - L.bbox.maxY) < 0.48;
  let recog = null;
  if (text.length === 1 && GLYPHS[text] && !GLYPHS[text].punct) {
    const pool = isUpper(text) ? UPPER : LOWER;
    const ranks = recognize(ink, pool);
    const pos = ranks.findIndex(r => r.ch === text);
    recog = { ok: pos === 0 || (pos < 3 && ranks[pos].d <= ranks[0].d * 1.12), lookslike: ranks[0].ch, rank: pos };
  }
  // shape needs BOTH: covering the model and staying near it (stops scribbles and half-letters from scoring)
  const shapeScore = cov * Math.sqrt(prec);
  // words written on her own: compare against other real words of similar length (template matching)
  if (mode === 'write' && text.length > 1 && typeof ALL_WORDS !== 'undefined') {
    const tw = text.replace(/[.!?]/g, '');
    const others = ALL_WORDS.map(x => x.w).filter(w => w !== tw && Math.abs(w.length - tw.length) <= 4 && !tw.includes(" "));
    let beat = null;
    for (const w of others.slice(0, 120)) {
      const LL = layoutText(w); const [c2, p2] = covPrec(LL, alignTo(LL));
      if (c2 * Math.sqrt(p2) > shapeScore + 0.02) { beat = w; break; }
    }
    recog = { ok: !beat, lookslike: beat, word: true };
  }
  const dirOK = dir >= 0.6 && startOK;
  let score;
  if (mode === 'trace') score = shapeScore * (0.8 + 0.2*dir);
  else score = shapeScore * (0.75 + 0.25*dir) * (sizeOK ? 1 : 0.88) * (posOK ? 1 : 0.92) * (recog && !recog.ok ? 0.6 : 1);
  const ratio = userLen / L.len; if (ratio > 1.7) score *= Math.max(0.4, 1.7 / ratio); // too much extra ink
  score = Math.max(0, Math.min(1, score * 1.06)); // small beginner bonus
  res.score = score;
  let stars = score >= 0.8 ? 3 : score >= 0.62 ? 2 : score >= 0.42 ? 1 : 0;
  if (!dirOK) stars = Math.min(stars, 2);                    // right shape, wrong way: still praise, but not perfect
  if (recog && !recog.ok) stars = Math.min(stars, shapeScore > 0.75 ? 1 : 0);
  res.stars = stars;
  res.checks = {
    shape: cov >= 0.62 && prec >= 0.6,
    direction: dirOK,
    size: sizeOK, position: posOK,
    recog: recog ? recog.ok : null,
  };
  res.detail = { cov, prec, dir, startOK, sizeRatio, recog };
  const what = text.length > 1 ? 'word' : 'letter';
  if (!res.checks.shape) res.tips.push(cov < 0.62 ? `Some parts of the ${what} are missing — follow the whole grey path.` : `Try to stay closer to the model path.`);
  if (!startOK) res.tips.push('Start at the green dot.');
  else if (dir < 0.62) res.tips.push('Follow the arrows — that way your pencil can keep flowing into the next letter.');
  if (mode === 'write') {
    if (!sizeOK) res.tips.push(sizeRatio < 0.65 ? `Make your ${what} a little bigger — use the lines.` : `Make your ${what} a little smaller — use the lines.`);
    else if (!posOK) res.tips.push('Sit the letter on the baseline (the bold bottom line).');
    if (recog && !recog.ok) res.tips.push(`Hmm, this looks a bit like “${recog.lookslike}”. Watch the demo and try again!`);
  }
  return res;
}

const LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ===== Core: helpers, storage, sound, voice, art =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };
const dayOffset = (k) => { const d = new Date(); d.setDate(d.getDate() + k); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };
function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const k in attrs) {
    const v = attrs[k];
    if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
}
