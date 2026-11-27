
// ===== Letterforms =====
// Units: baseline y=0, midline y=1, top line y=2, descender y=-1. y points UP.
// Each stroke is a list of control points [x, y, cusp?]. A cusp (3rd value 1)
// is a sharp turn / retrace point. Points are joined with centripetal Catmull-Rom.
// exit: 'low' (leaves near baseline), 'high' (leaves at midline), null (no join).
// hi: index of the first control point to keep when the previous letter exits high.
const C = 1;
// ===== Print (manuscript) letterforms for Lucas: ball-and-stick style, every letter stands alone =====
// Units: baseline y=0, midline y=1, top line y=2, descender y=-1. y points UP. A 3rd value 1 marks a sharp corner.
function arc(cx,cy,rx,ry,a0,a1){ const n=Math.max(3,Math.round(Math.abs(a1-a0)/30)), out=[]; for(let i=0;i<=n;i++){ const t=(a0+(a1-a0)*i/n)*Math.PI/180; out.push([+(cx+rx*Math.cos(t)).toFixed(3),+(cy+ry*Math.sin(t)).toFixed(3)]); } return out; }
const cat=(...parts)=>{ const o=[]; parts.forEach((p,k)=>{ p.forEach((q,j)=>{ if(k>0&&j===0){ o[o.length-1][2]=C; if(Math.abs(o[o.length-1][0]-q[0])<1e-3&&Math.abs(o[o.length-1][1]-q[1])<1e-3) return; } o.push(q.slice()); }); }); return o; };
const BOWL=(cx=.42)=>arc(cx,.5,.42,.5,40,400);            // a, d, g, q: start near the top right, go round to the left
const P = (pts)=>({ s: pts, exit:null });
const GLYPHS = {
  a: P([BOWL(), [[0.86,1],[0.86,0]]]),
  b: P([[[0,2],[0,0]], arc(0.42,.5,.42,.5,180,-180)]),
  c: P([arc(0.45,.5,.45,.5,45,315)]),
  d: P([BOWL(), [[0.86,2],[0.86,0]]]),
  e: P([cat([[0.04,.5],[0.88,.5]], arc(0.46,.5,.43,.5,0,320))]),
  f: P([[[0.78,1.82],[0.58,2],[0.38,1.9],[0.3,1.6],[0.3,0]], [[0,1],[0.66,1]]]),
  g: P([BOWL(), [[0.86,1],[0.86,-0.62],[0.68,-0.96],[0.4,-1],[0.12,-0.84]]]),
  h: P([[[0,2],[0,0]], [[0,0.55],[0.14,0.88],[0.42,1],[0.7,0.9],[0.82,0.6],[0.82,0]]]),
  i: P([[[0.1,1],[0.1,0]], [[0.1,1.45]]]),
  j: P([[[0.48,1],[0.48,-0.66],[0.34,-0.96],[0.06,-0.9]], [[0.48,1.45]]]),
  k: P([[[0,2],[0,0]], [[0.74,1],[0.04,0.44,C],[0.8,0]]]),
  l: P([[[0.1,2],[0.1,0]]]),
  m: P([[[0,1],[0,0]], [[0,0.55],[0.12,0.9],[0.32,1],[0.5,0.88],[0.56,0.6],[0.56,0]], [[0.56,0.55],[0.68,0.9],[0.88,1],[1.06,0.88],[1.12,0.6],[1.12,0]]]),
  n: P([[[0,1],[0,0]], [[0,0.55],[0.14,0.88],[0.42,1],[0.7,0.9],[0.82,0.6],[0.82,0]]]),
  o: P([arc(0.46,.5,.46,.5,90,450)]),
  p: P([[[0,1],[0,-1]], arc(0.42,.5,.42,.5,180,-180)]),
  q: P([BOWL(), [[0.86,1],[0.86,-1]]]),
  r: P([[[0,1],[0,0]], [[0,0.55],[0.16,0.88],[0.42,1],[0.68,0.94]]]),
  s: P([[[0.76,0.86],[0.56,1],[0.28,0.98],[0.1,0.8],[0.16,0.6],[0.42,0.5],[0.66,0.4],[0.78,0.2],[0.62,0.02],[0.32,0],[0.06,0.14]]]),
  t: P([[[0.32,1.7],[0.32,0.2],[0.46,0.02],[0.68,0.06]], [[0,1],[0.66,1]]]),
  u: P([[[0,1],[0,0.4],[0.14,0.08],[0.42,0],[0.7,0.1],[0.82,0.4]], [[0.82,1],[0.82,0]]]),
  v: P([[[0,1],[0.42,0,C],[0.84,1]]]),
  w: P([[[0,1],[0.28,0,C],[0.56,1,C],[0.84,0,C],[1.12,1]]]),
  x: P([[[0,1],[0.8,0]], [[0.8,1],[0,0]]]),
  y: P([[[0,1],[0.42,0]], [[0.84,1],[0.22,-1]]]),
  z: P([[[0,1],[0.78,1,C],[0,0,C],[0.82,0]]]),
  A: P([[[0.72,2],[0,0]], [[0.72,2],[1.44,0]], [[0.26,0.78],[1.18,0.78]]]),
  B: P([[[0,2],[0,0]], [[0,2],[0.6,2],[0.9,1.84],[0.94,1.5],[0.78,1.12],[0.5,1],[0,1,C],[0.66,1],[0.98,0.84],[1.04,0.46],[0.86,0.12],[0.6,0],[0,0]]]),
  C: P([arc(0.86,1,0.86,1,45,315)]),
  D: P([[[0,2],[0,0]], [[0,2],[0.5,2],[0.94,1.72],[1.12,1],[0.94,0.28],[0.5,0],[0,0]]]),
  E: P([[[0,2],[0,0]], [[0,2],[0.94,2]], [[0,1],[0.78,1]], [[0,0],[0.94,0]]]),
  F: P([[[0,2],[0,0]], [[0,2],[0.94,2]], [[0,1],[0.78,1]]]),
  G: P([cat(arc(0.86,1,0.86,1,45,320),[[1.56,0.36],[1.56,0.92],[1.0,0.92]])]),
  H: P([[[0,2],[0,0]], [[1.2,2],[1.2,0]], [[0,1],[1.2,1]]]),
  I: P([[[0.42,2],[0.42,0]], [[0,2],[0.84,2]], [[0,0],[0.84,0]]]),
  J: P([[[0.92,2],[0.92,0.46],[0.76,0.1],[0.46,0],[0.16,0.1],[0,0.42]]]),
  K: P([[[0,2],[0,0]], [[1.04,2],[0.04,0.9,C],[1.08,0]]]),
  L: P([[[0,2],[0,0,C],[0.92,0]]]),
  M: P([[[0,2],[0,0]], [[0,2],[0.72,0.5,C],[1.44,2]], [[1.44,2],[1.44,0]]]),
  N: P([[[0,2],[0,0]], [[0,2],[1.2,0]], [[1.2,0],[1.2,2]]]),
  O: P([arc(0.9,1,0.9,1,90,450)]),
  P: P([[[0,2],[0,0]], [[0,2],[0.6,2],[0.94,1.84],[1.02,1.5],[0.94,1.16],[0.6,1],[0,1]]]),
  Q: P([arc(0.9,1,0.9,1,90,450), [[1.0,0.42],[1.62,-0.1]]]),
  R: P([[[0,2],[0,0]], [[0,2],[0.6,2],[0.94,1.84],[1.02,1.5],[0.94,1.16],[0.6,1],[0,1]], [[0.46,1],[1.08,0]]]),
  S: P([[[1.1,1.72],[0.82,2],[0.42,1.98],[0.12,1.76],[0.14,1.32],[0.56,1.04],[0.96,0.82],[1.14,0.42],[0.92,0.06],[0.5,0],[0.08,0.26]]]),
  T: P([[[0.62,2],[0.62,0]], [[0,2],[1.24,2]]]),
  U: P([[[0,2],[0,0.52],[0.2,0.1],[0.6,0],[1.0,0.1],[1.2,0.52],[1.2,2]]]),
  V: P([[[0,2],[0.66,0,C],[1.32,2]]]),
  W: P([[[0,2],[0.46,0,C],[0.92,2,C],[1.38,0,C],[1.84,2]]]),
  X: P([[[0,2],[1.24,0]], [[1.24,2],[0,0]]]),
  Y: P([[[0,2],[0.62,1]], [[1.24,2],[0.62,1]], [[0.62,1],[0.62,0]]]),
  Z: P([[[0,2],[1.14,2,C],[0,0,C],[1.2,0]]]),

  '.': { s: [[[0.15,0.05]]], exit:null, punct:true },
  '!': { s: [[[0.35,2.0],[0.2,0.5]], [[0.15,0.05]]], exit:null, punct:true },
  '?': { s: [[[0.1,1.6],[0.4,2.0],[0.8,1.8],[0.7,1.3],[0.4,1.0],[0.38,0.55]], [[0.36,0.05]]], exit:null, punct:true },
  ',': { s: [[[0.2,0.1],[0.1,-0.3]]], exit:null, punct:true },
  "'": { s: [[[0.25,2.0],[0.15,1.6]]], exit:null, punct:true },
};

// ===== Cursive engine: layout, spline sampling, rendering, scoring, recognition =====
const SLANT = 0;              // forward slant applied to every letter
const STEP = 0.03;            // sampling step in units
const MAIN_IDX = {}; // strokes before this index are written first, after it are "extras"

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
      const gap = letters.length ? (GLYPHS[text[ci-1]] && GLYPHS[text[ci-1]].punct ? 0.25 : 0.3) : 0;
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

