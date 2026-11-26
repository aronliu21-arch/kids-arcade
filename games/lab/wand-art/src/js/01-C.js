
// ===== Cursive letterforms (original, Zaner-Bloser-inspired beginner style) =====
// Units: baseline y=0, midline y=1, top line y=2, descender y=-1. y points UP.
// Each stroke is a list of control points [x, y, cusp?]. A cusp (3rd value 1)
// is a sharp turn / retrace point. Points are joined with centripetal Catmull-Rom.
// exit: 'low' (leaves near baseline), 'high' (leaves at midline), null (no join).
// hi: index of the first control point to keep when the previous letter exits high.
const C = 1;
const GLYPHS = {
  a: { s: [[[0,0],[0.5,0.55],[0.98,0.97,C],[0.55,1.02],[0.2,0.7],[0.24,0.2],[0.55,0.0],[0.86,0.35],[1.0,1.0,C],[0.97,0.3],[1.12,0.02],[1.45,0.35]]], exit:'low', hi:2 },
  b: { s: [[[0,0],[0.45,0.7],[0.78,1.55],[0.62,2.0],[0.38,1.72],[0.32,0.9],[0.33,0.18],[0.58,0.0],[0.9,0.4],[0.86,0.94],[0.72,0.86],[0.9,0.84],[1.3,0.95]]], exit:'high' },
  c: { s: [[[0,0],[0.45,0.6],[0.86,0.97],[0.96,0.86],[0.8,0.9],[0.52,0.99],[0.23,0.66],[0.26,0.17],[0.56,0.0],[0.95,0.12],[1.25,0.35]]], exit:'low', hi:2 },
  d: { s: [[[0,0],[0.5,0.55],[0.98,0.97,C],[0.55,1.02],[0.2,0.7],[0.24,0.2],[0.55,0.0],[0.86,0.35],[1.02,1.1],[1.08,2.0,C],[1.0,1.0],[0.97,0.3],[1.12,0.02],[1.45,0.35]]], exit:'low', hi:2 },
  e: { s: [[[0,0],[0.42,0.25],[0.76,0.62],[0.74,0.95],[0.56,1.0],[0.36,0.78],[0.3,0.32],[0.55,0.02],[0.9,0.1],[1.2,0.35]]], exit:'low', hi:2 },
  f: { s: [[[0,0],[0.45,0.7],[0.78,1.55],[0.62,2.0],[0.38,1.72],[0.34,1.0],[0.34,0.0],[0.33,-0.7],[0.43,-0.97],[0.56,-0.7],[0.47,-0.2],[0.36,0.04],[0.72,0.14],[1.1,0.35]]], exit:'low', hi:2 },
  g: { s: [[[0,0],[0.5,0.55],[0.98,0.97,C],[0.55,1.02],[0.2,0.7],[0.24,0.2],[0.55,0.0],[0.86,0.35],[1.0,1.0,C],[0.98,0.0],[0.92,-0.7],[0.7,-0.98],[0.47,-0.8],[0.62,-0.4],[1.0,-0.07],[1.35,0.35]]], exit:'low', hi:2 },
  h: { s: [[[0,0],[0.45,0.7],[0.78,1.55],[0.62,2.0],[0.38,1.72],[0.33,1.0],[0.3,0.0,C],[0.38,0.6],[0.64,0.98],[0.88,0.78],[0.88,0.2],[1.0,0.0],[1.3,0.35]]], exit:'low', hi:2 },
  i: { s: [[[0,0],[0.32,0.5],[0.55,1.0,C],[0.52,0.3],[0.68,0.0],[1.0,0.35]], [[0.56,1.42]]], exit:'low' },
  j: { s: [[[0,0],[0.32,0.5],[0.55,1.0,C],[0.55,0.0],[0.53,-0.7],[0.36,-0.98],[0.2,-0.75],[0.45,-0.36],[0.85,-0.02],[1.15,0.35]], [[0.56,1.42]]], exit:'low' },
  k: { s: [[[0,0],[0.45,0.7],[0.78,1.55],[0.62,2.0],[0.38,1.72],[0.33,1.0],[0.3,0.0,C],[0.4,0.62],[0.7,1.0],[0.88,0.82],[0.68,0.56],[0.38,0.5,C],[0.72,0.38],[0.86,0.06],[1.2,0.35]]], exit:'low', hi:2 },
  l: { s: [[[0,0],[0.45,0.7],[0.78,1.55],[0.62,2.0],[0.38,1.72],[0.34,0.9],[0.4,0.15],[0.65,0.0],[1.0,0.35]]], exit:'low', hi:2 },
  m: { s: [[[0,0],[0.14,0.66],[0.36,1.0],[0.52,0.72],[0.52,0.0,C],[0.56,0.6],[0.78,1.0],[0.98,0.72],[0.98,0.0,C],[1.02,0.6],[1.24,1.0],[1.44,0.72],[1.44,0.15],[1.56,0.0],[1.88,0.35]]], exit:'low', hi:2 },
  n: { s: [[[0,0],[0.14,0.66],[0.36,1.0],[0.52,0.72],[0.52,0.0,C],[0.56,0.6],[0.78,1.0],[0.98,0.72],[0.98,0.15],[1.1,0.0],[1.42,0.35]]], exit:'low', hi:2 },
  o: { s: [[[0,0],[0.32,0.55],[0.64,0.98],[0.36,0.92],[0.19,0.5],[0.36,0.04],[0.64,0.04],[0.8,0.5],[0.66,0.97],[0.58,0.86],[0.76,0.83],[1.15,0.95]]], exit:'high', hi:2 },
  p: { s: [[[0,0],[0.3,0.6],[0.46,1.05,C],[0.42,0.0],[0.38,-1.0,C],[0.43,0.0],[0.48,0.6],[0.72,1.0],[0.96,0.6],[0.82,0.06],[0.46,0.06],[0.82,0.1],[1.2,0.35]]], exit:'low', hi:2 },
  q: { s: [[[0,0],[0.5,0.55],[0.98,0.97,C],[0.55,1.02],[0.2,0.7],[0.24,0.2],[0.55,0.0],[0.86,0.35],[1.0,1.0,C],[0.98,0.0],[0.96,-0.95],[1.16,-0.62],[1.04,-0.06],[1.45,0.35]]], exit:'low', hi:2 },
  r: { s: [[[0,0],[0.3,0.65],[0.5,1.1,C],[0.64,0.9],[0.84,0.95,C],[0.8,0.4],[0.88,0.0],[1.25,0.35]]], exit:'low', hi:2 },
  s: { s: [[[0,0],[0.3,0.6],[0.55,1.1,C],[0.78,0.6],[0.78,0.2],[0.55,0.0],[0.32,0.12,C],[0.62,0.04],[0.95,0.1],[1.25,0.35]]], exit:'low', hi:2 },
  t: { s: [[[0,0],[0.36,0.72],[0.6,1.62,C],[0.55,0.9],[0.55,0.2],[0.7,0.0],[1.05,0.35]], [[0.3,1.08],[0.9,1.08]]], exit:'low', hi:2 },
  u: { s: [[[0,0],[0.15,0.6],[0.3,1.0,C],[0.26,0.35],[0.45,0.0],[0.7,0.3],[0.85,1.0,C],[0.83,0.3],[0.95,0.0],[1.3,0.35]]], exit:'low', hi:2 },
  v: { s: [[[0,0],[0.12,0.62],[0.32,1.0],[0.46,0.6],[0.58,0.02],[0.8,0.5],[0.9,0.98],[0.75,0.88],[0.9,0.84],[1.3,0.95]]], exit:'high', hi:2 },
  w: { s: [[[0,0],[0.15,0.6],[0.3,1.0,C],[0.26,0.35],[0.45,0.0],[0.65,0.3],[0.76,1.0,C],[0.74,0.3],[0.9,0.0],[1.1,0.4],[1.15,0.98],[1.0,0.88],[1.15,0.84],[1.55,0.95]]], exit:'high', hi:2 },
  x: { s: [[[0,0],[0.15,0.7],[0.36,1.0],[0.52,0.7],[0.56,0.3],[0.7,0.0],[1.05,0.35]], [[0.86,1.0],[0.26,0.0]]], exit:'low', hi:2 },
  y: { s: [[[0,0],[0.12,0.62],[0.3,1.0],[0.42,0.6],[0.42,0.2],[0.6,0.0],[0.8,0.3],[0.9,1.0,C],[0.88,0.0],[0.82,-0.7],[0.6,-0.98],[0.4,-0.8],[0.6,-0.4],[1.0,-0.07],[1.3,0.35]]], exit:'low', hi:2 },
  z: { s: [[[0,0],[0.15,0.65],[0.35,1.0],[0.6,0.92],[0.62,0.55],[0.35,0.05,C],[0.65,0.0],[0.7,-0.5],[0.47,-0.96],[0.3,-0.76],[0.6,-0.36],[1.0,-0.07],[1.3,0.35]]], exit:'low', hi:2 },

  A: { s: [[[1.12,1.75],[0.75,2.0],[0.3,1.6],[0.12,0.7],[0.36,0.04],[0.72,0.3],[1.05,1.25],[1.25,2.0,C],[1.15,0.8],[1.2,0.04],[1.6,0.35]]], exit:'low' },
  B: { s: [[[0.48,2.0],[0.34,1.0],[0.22,0.0,C],[0.34,1.0],[0.48,1.78],[0.82,2.04],[1.1,1.75],[0.96,1.25],[0.64,1.08],[0.96,1.0],[1.25,0.6],[1.1,0.12],[0.7,-0.02],[0.32,0.15]]], exit:null },
  C: { s: [[[1.22,1.7],[1.08,1.98],[0.7,1.98],[0.28,1.55],[0.12,0.7],[0.4,0.05],[0.9,0.05],[1.3,0.35]]], exit:'low' },
  D: { s: [[[0.62,2.0],[0.48,1.0],[0.32,0.1],[0.1,0.08],[0.18,0.24],[0.62,0.0],[1.2,0.3],[1.45,1.15],[1.12,1.95],[0.55,1.96],[0.3,1.72],[0.62,1.62]]], exit:null },
  E: { s: [[[1.12,1.75],[0.86,2.0],[0.48,1.86],[0.52,1.36],[0.78,1.12],[0.6,1.13],[0.22,0.8],[0.16,0.3],[0.5,0.0],[1.0,0.1],[1.3,0.35]]], exit:'low' },
  F: { s: [[[0.3,1.72],[0.7,1.96],[1.1,1.84],[1.5,2.0]], [[1.0,1.9],[0.8,1.0],[0.6,0.2],[0.36,0.0],[0.15,0.25]], [[0.55,1.02],[1.15,1.06]]], exit:null },
  G: { s: [[[1.22,1.7],[1.04,2.0],[0.62,1.95],[0.22,1.4],[0.16,0.5],[0.5,0.0],[0.95,0.15],[1.16,0.6],[1.2,0.98,C],[1.16,0.4],[1.22,0.02],[1.58,0.35]]], exit:'low' },
  H: { s: [[[0.15,1.75],[0.45,2.0],[0.44,1.0],[0.3,0.0]], [[1.3,2.0],[1.2,1.0],[1.15,0.15],[1.3,0.0],[1.6,0.35]], [[0.42,1.04],[1.2,1.04]]], exit:'low' },
  I: { s: [[[0.06,1.0],[0.36,1.36],[0.8,1.9],[1.0,2.0],[0.9,1.4],[0.7,0.4],[0.46,0.0],[0.16,0.14],[0.26,0.44],[0.72,0.5]]], exit:null },
  J: { s: [[[0.06,1.0],[0.36,1.36],[0.8,1.9],[1.0,2.0],[0.9,1.4],[0.76,0.5],[0.66,-0.5],[0.46,-0.96],[0.26,-0.7],[0.5,-0.3],[0.95,0.04],[1.3,0.35]]], exit:'low' },
  K: { s: [[[0.15,1.75],[0.45,2.0],[0.44,1.0],[0.3,0.0]], [[1.4,2.0],[0.9,1.4],[0.46,1.05,C],[0.8,1.0],[1.0,0.6],[1.05,0.1],[1.2,0.0],[1.55,0.35]]], exit:'low' },
  L: { s: [[[0.92,1.5],[1.1,1.9],[0.9,2.02],[0.62,1.62],[0.46,0.7],[0.3,0.1],[0.06,0.06],[0.16,0.22],[0.5,0.0],[1.0,0.05],[1.3,0.3]]], exit:'low' },
  M: { s: [[[0.3,1.72],[0.46,2.0],[0.4,1.0],[0.2,0.0,C],[0.46,1.2],[0.76,2.0],[0.96,1.2],[0.9,0.0,C],[1.1,1.2],[1.4,2.0],[1.6,1.2],[1.55,0.2],[1.7,0.0],[2.0,0.35]]], exit:'low' },
  N: { s: [[[0.3,1.72],[0.46,2.0],[0.4,1.0],[0.2,0.0,C],[0.46,1.2],[0.76,2.0],[0.96,1.2],[0.9,0.2],[1.05,0.0],[1.35,0.35]]], exit:'low' },
  O: { s: [[[0.9,1.96],[0.45,1.85],[0.15,1.2],[0.2,0.4],[0.6,0.0],[1.0,0.3],[1.2,1.0],[1.1,1.75],[0.85,1.98],[0.66,1.76],[0.96,1.66],[1.3,1.8]]], exit:null },
  P: { s: [[[0.48,1.96],[0.34,1.0],[0.22,0.0,C],[0.34,1.0],[0.48,1.8],[0.82,2.05],[1.2,1.8],[1.15,1.3],[0.76,1.05],[0.36,1.15]]], exit:null },
  Q: { s: [[[0.2,1.6],[0.55,1.98],[1.05,1.9],[1.15,1.4],[0.8,0.8],[0.32,0.12],[0.12,0.06],[0.26,0.24],[0.7,0.06],[1.1,0.02],[1.4,0.3]]], exit:'low' },
  R: { s: [[[0.48,1.96],[0.34,1.0],[0.22,0.0,C],[0.34,1.0],[0.48,1.8],[0.82,2.05],[1.2,1.8],[1.15,1.3],[0.76,1.05],[0.5,1.06,C],[0.78,1.0],[0.96,0.6],[1.0,0.1],[1.15,0.0],[1.45,0.35]]], exit:'low' },
  S: { s: [[[0.0,0.1],[0.55,1.0],[1.05,2.0,C],[0.85,1.3],[1.1,0.7],[0.92,0.1],[0.46,0.0],[0.15,0.25],[0.4,0.45],[0.6,0.3]]], exit:null },
  T: { s: [[[0.2,1.72],[0.6,1.96],[1.1,1.84],[1.6,2.0]], [[1.0,1.9],[0.8,1.0],[0.6,0.2],[0.36,0.0],[0.15,0.25]]], exit:null },
  U: { s: [[[0.2,1.7],[0.46,2.0],[0.4,1.0],[0.46,0.2],[0.76,0.0],[1.06,0.4],[1.25,2.0,C],[1.15,0.8],[1.2,0.04],[1.55,0.35]]], exit:'low' },
  V: { s: [[[0.2,1.7],[0.46,2.0],[0.5,1.0],[0.75,0.0],[1.0,1.0],[1.3,1.86],[1.22,1.7],[1.5,1.94]]], exit:null },
  W: { s: [[[0.2,1.7],[0.46,2.0],[0.45,1.0],[0.6,0.0],[0.85,1.0],[1.0,1.7,C],[1.1,1.0],[1.3,0.0],[1.55,1.0],[1.74,1.92],[1.6,1.8],[1.9,1.95]]], exit:null },
  X: { s: [[[0.15,1.75],[0.45,2.0],[0.8,1.6],[1.0,0.5],[1.2,0.0],[1.5,0.3]], [[1.35,2.0],[0.2,0.0]]], exit:null },
  Y: { s: [[[0.2,1.7],[0.46,2.0],[0.4,1.0],[0.5,0.4],[0.8,0.6],[1.2,2.0,C],[1.1,0.8],[1.0,0.0],[0.95,-0.7],[0.7,-0.98],[0.5,-0.8],[0.7,-0.4],[1.1,-0.07],[1.4,0.35]]], exit:'low' },
  Z: { s: [[[0.2,1.7],[0.5,2.0],[0.95,1.95],[1.0,1.6],[0.5,0.15,C],[0.9,0.05],[0.95,-0.5],[0.7,-0.95],[0.5,-0.75],[0.8,-0.35],[1.2,-0.07],[1.5,0.35]]], exit:'low' },

  '.': { s: [[[0.15,0.05]]], exit:null, punct:true },
  '!': { s: [[[0.35,2.0],[0.2,0.5]], [[0.15,0.05]]], exit:null, punct:true },
  '?': { s: [[[0.1,1.6],[0.4,2.0],[0.8,1.8],[0.7,1.3],[0.4,1.0],[0.38,0.55]], [[0.36,0.05]]], exit:null, punct:true },
  ',': { s: [[[0.2,0.1],[0.1,-0.3]]], exit:null, punct:true },
  "'": { s: [[[0.25,2.0],[0.15,1.6]]], exit:null, punct:true },
};

// ===== Cursive engine: layout, spline sampling, rendering, scoring, recognition =====
const SLANT = 0.16;           // forward slant applied to every letter
const STEP = 0.03;            // sampling step in units
const MAIN_IDX = { F:1, T:1, H:1, K:1 }; // strokes before this index are written first, after it are "extras"

function d2(a, b) { const dx = a[0]-b[0], dy = a[1]-b[1]; return Math.sqrt(dx*dx+dy*dy); }

// Centripetal Catmull-Rom segment p1->p2, n samples (excluding p2)
function crSeg(p0, p1, p2, p3, n, out) {
  const k = (a, b) => Math.pow(Math.max(d2(a, b), 1e-4), 0.5);
  const t0 = 0, t1 = t0 + k(p0, p1), t2 = t1 + k(p1, p2), t3 = t2 + k(p2, p3);
  const L = (a, b, ta, tb, t) => { const u = (t-ta)/(tb-ta); return [a[0]+(b[0]-a[0])*u, a[1]+(b[1]-a[1])*u]; };
  for (let i = 0; i < n; i++) {
    const t = t1 + (t2-t1)*i/n;
    const A1 = L(p0, p1, t0, t1, t), A2 = L(p1, p2, t1, t2, t), A3 = L(p2, p3, t2, t3, t);
    const B1 = L(A1, A2, t0, t2, t), B2 = L(A2, A3, t1, t3, t);
    out.push(L(B1, B2, t1, t2, t));
  }
}

// Sample a control-point stroke into a dense polyline. Returns {pts, seg} where seg[i] = control index of segment.
function sampleStroke(P) {
  if (P.length === 1) return { pts: [[P[0][0], P[0][1]]], seg: [0], dot: true };
  const pts = [], seg = [];
  // split at cusps
  const cuts = [0];
  for (let i = 1; i < P.length-1; i++) if (P[i][2]) cuts.push(i);
  cuts.push(P.length-1);
  for (let c = 0; c < cuts.length-1; c++) {
    const a = cuts[c], b = cuts[c+1];
    const Q = P.slice(a, b+1);
    for (let i = 0; i < Q.length-1; i++) {
      const p1 = Q[i], p2 = Q[i+1];
      const p0 = i > 0 ? Q[i-1] : [2*p1[0]-p2[0], 2*p1[1]-p2[1]];
      const p3 = i < Q.length-2 ? Q[i+2] : [2*p2[0]-p1[0], 2*p2[1]-p1[1]];
      const n = Math.max(2, Math.ceil(d2(p1, p2)/STEP));
      const before = pts.length;
      crSeg(p0, p1, p2, p3, n, pts);
      for (let j = before; j < pts.length; j++) seg.push(a+i);
    }
  }
  const last = P[P.length-1];
  pts.push([last[0], last[1]]); seg.push(P.length-2);
  return { pts, seg, dot: false };
}

function isUpper(ch) { return ch >= 'A' && ch <= 'Z'; }
function isLower(ch) { return ch >= 'a' && ch <= 'z'; }

// Lay out text as connected cursive. Result is cached.
const _layoutCache = new Map();
function layoutText(text) {
  if (_layoutCache.has(text)) return _layoutCache.get(text);
  const strokes = [];   // {ctrl:[[x,y,c]], kind:'main'|'extra', letters:[]}
  const letters = [];   // {ch, x0, x1}
  const joins = [];     // {stroke, ctrl}  (segment ctrl->ctrl+1 is the connecting stroke)
  let x = 0, cur = null, prevExit = null, prevBodyRight = 0, pendingExtras = [];
  const flushWord = () => { for (const e of pendingExtras) strokes.push(e); pendingExtras = []; cur = null; prevExit = null; };
  for (let ci = 0; ci < text.length; ci++) {
    const ch = text[ci];
    if (ch === ' ') { flushWord(); x += 0.7; continue; }
    const g = GLYPHS[ch]; if (!g) continue;
    const m = MAIN_IDX[ch] || 0;
    let main = g.s[m].map(p => p.slice());
    const pre = g.s.slice(0, m), extras = g.s.slice(m+1);
    let ox;
    const joinable = cur && prevExit && isLower(ch);
    if (joinable) {
      // drop previous exit tip; drop this letter's lead-in
      const prevLast = cur.ctrl[cur.ctrl.length-2];
      cur.ctrl.pop();
      const keepFrom = prevExit === 'high' ? (g.hi ?? 2) : 1;
      const kept = main.slice(keepFrom);
      if (keepFrom > 0 && kept[0][2]) kept[0][2] = 1; // keep cusp flag
      const K = kept[0];
      let minX = Infinity; for (const p of kept) minX = Math.min(minX, p[0]);
      const want = prevExit === 'high' ? 0.45 : 0.22 + 0.45*K[1];
      ox = Math.max(prevLast[0] + want - K[0], prevBodyRight + 0.14 - minX);
      const start = cur.ctrl.length - 1;
      joins.push({ stroke: strokes.indexOf(cur), ctrl: start });
      // cusp at the junction for a high join into a cusp point is fine; otherwise smooth
      for (const p of kept) cur.ctrl.push([p[0]+ox, p[1], p[2]]);
      main = kept;
    } else {
      if (cur) flushWord();
      const gap = letters.length ? (GLYPHS[text[ci-1]] && GLYPHS[text[ci-1]].punct ? 0.25 : 0.12) : 0;
      let minX = Infinity; for (const s of g.s) for (const p of s) minX = Math.min(minX, p[0]);
      ox = g.punct ? x + 0.05 : x + gap - minX;
      if (letters.length && text[ci-1] !== ' ' && !g.punct) ox = Math.max(ox, x + gap - minX);
      for (const s of pre) strokes.push({ ctrl: s.map(p => [p[0]+ox, p[1], p[2]]), kind: 'main' });
      cur = { ctrl: main.map(p => [p[0]+ox, p[1], p[2]]), kind: 'main' };
      strokes.push(cur);
    }
    for (const s of extras) pendingExtras.push({ ctrl: s.map(p => [p[0]+ox, p[1], p[2]]), kind: 'extra' });
    let x0 = Infinity, x1 = -Infinity;
    for (const s of g.s) for (const p of s) { x0 = Math.min(x0, p[0]+ox); x1 = Math.max(x1, p[0]+ox); }
    // body right excludes the exit tip
    const ms = g.s[m]; let br = -Infinity;
    for (let i = 0; i < ms.length - (g.exit ? 1 : 0); i++) br = Math.max(br, ms[i][0]+ox);
    for (const s of extras) for (const p of s) br = Math.max(br, p[0]+ox);
    prevBodyRight = br;
    letters.push({ ch, x0, x1 });
    prevExit = g.exit;
    x = x1;
    if (!g.exit) { flushWord(); }
  }
  flushWord();
  // sample
  const out = { text, strokes: [], letters, joins, len: 0 };
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const s of strokes) {
    const smp = sampleStroke(s.ctrl);
    smp.pts = smp.pts.map(p => [p[0] + SLANT*p[1], p[1]]);
    smp.kind = s.kind;
    for (const p of smp.pts) { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
    let L = 0; for (let i = 1; i < smp.pts.length; i++) L += d2(smp.pts[i-1], smp.pts[i]);
    smp.len = L; out.len += L;
    out.strokes.push(smp);
  }
  // mark connector samples
  for (const j of joins) {
    const s = out.strokes[j.stroke];
    s.conn = s.conn || [];
    s.conn.push([s.seg.indexOf(j.ctrl), s.seg.lastIndexOf(j.ctrl)]);
  }
  out.bbox = { minX, maxX, minY, maxY, w: maxX-minX, h: maxY-minY };
  _layoutCache.set(text, out);
  return out;
}

