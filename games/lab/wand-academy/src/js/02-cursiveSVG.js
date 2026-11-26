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


// ============ helpers / state ============
const $ = s => document.querySelector(s);
const rnd = n => Math.floor(Math.random()*n);
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; };
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const KEY='wandAcademy.v1';
const fresh=()=>({stars:0,level:null,seen:[],done:{},bests:{},sound:true,trial:false,introSeen:false,ch:1,view:1,chDone:{},allDone:false,met:{}});
let S=fresh();
try{const o=JSON.parse(localStorage.getItem(KEY)||'null'); if(o) S=Object.assign(fresh(),o);}catch(e){}
// upgrade saves from v1.x (Chapter 1 only)
(function(){ const old=['rune','mei','chain','duel','fly']; let moved=false; old.forEach(k=>{ if(S.done[k]){ S.done['c1:'+k]=true; delete S.done[k]; moved=true; } }); if(S.best&&!S.bests.fireflies){ S.bests.fireflies=S.best; } if(S.chapterDone){ S.chDone[1]=true; S.ch=Math.max(S.ch,2); delete S.chapterDone; moved=true; } if(moved) try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){} })();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}};
let sessionMissions=0;

// ============ sound ============
const Snd={ctx:null,master:null,music:null,musicTimer:null,
 init(){ if(this.ctx) return; try{const AC=window.AudioContext||window.webkitAudioContext; this.ctx=new AC(); this.master=this.ctx.createGain(); this.master.gain.value=S.sound?1:0; this.master.connect(this.ctx.destination); this.music=this.ctx.createGain(); this.music.gain.value=0; this.music.connect(this.master);}catch(e){} },
 tone(f,t0,d,type='sine',v=.18,dest){ const c=this.ctx; if(!c) return; const o=c.createOscillator(),g=c.createGain(); o.type=type; o.frequency.value=f; g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(v,t0+.02); g.gain.exponentialRampToValueAtTime(.0001,t0+d); o.connect(g); g.connect(dest||this.master); o.start(t0); o.stop(t0+d+.05); },
 noise(t0,d,f0,f1,v=.25,type='bandpass'){ const c=this.ctx; if(!c) return; if(!this.nb){ const b=c.createBuffer(1,c.sampleRate,c.sampleRate),a=b.getChannelData(0); for(let i=0;i<a.length;i++) a[i]=Math.random()*2-1; this.nb=b; }
  const s=c.createBufferSource(); s.buffer=this.nb; s.loop=true; const fl=c.createBiquadFilter(); fl.type=type; fl.Q.value=1.2; fl.frequency.setValueAtTime(f0,t0); fl.frequency.exponentialRampToValueAtTime(f1,t0+d); const gn=c.createGain(); gn.gain.setValueAtTime(0,t0); gn.gain.linearRampToValueAtTime(v,t0+.04); gn.gain.exponentialRampToValueAtTime(.0001,t0+d); s.connect(fl); fl.connect(gn); gn.connect(this.master); s.start(t0); s.stop(t0+d+.05); },
 sfx(k){ if(!this.ctx) return; const t=this.ctx.currentTime;
  if(k==='whoosh') this.noise(t,.7,300,2400,.3);
  if(k==='charge'){ const c=this.ctx,o=c.createOscillator(),gn=c.createGain(); o.type='sawtooth'; o.frequency.setValueAtTime(160,t); o.frequency.exponentialRampToValueAtTime(1400,t+1.2); gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(.07,t+.9); gn.gain.linearRampToValueAtTime(0,t+1.3); o.connect(gn); gn.connect(this.master); o.start(t); o.stop(t+1.35); this.noise(t,1.2,400,3000,.12); [523,659,784,1047].forEach((f,i)=>this.tone(f,t+.3+i*.18,.4,'triangle',.06)); }
  if(k==='boom'){ this.noise(t,.6,900,80,.5,'lowpass'); this.tone(110,t,.5,'sine',.35); this.tone(55,t,.7,'sine',.3); }
  if(k==='fire') this.noise(t,.8,2000,500,.25,'highpass');
  if(k==='ice') [2093,2637,3136,2349].forEach((f,i)=>this.tone(f,t+i*.06,.4,'sine',.08));
  if(k==='water') [600,900,500].forEach((f,i)=>this.tone(f,t+i*.07,.15,'sine',.12));
  if(k==='wind') this.noise(t,1,400,1600,.3);
  if(k==='earth') { this.noise(t,.5,300,60,.45,'lowpass'); this.tone(80,t,.4,'square',.08); }
  if(k==='bolt'){ this.tone(1800,t,.08,'sawtooth',.12); this.tone(120,t+.02,.25,'sawtooth',.15); this.noise(t,.3,5000,1500,.3,'highpass'); }
  if(k==='light') [523,659,784,1047,1319].forEach((f,i)=>this.tone(f,t+i*.05,.5,'triangle',.1));
  if(k==='rise') [523,659,784,1047,1319,1568].forEach((f,i)=>this.tone(f,t+i*.06,.45,'triangle',.11));
  if(k==='poof'){ this.noise(t,.5,1200,200,.3,'lowpass'); this.tone(220,t,.25,'square',.05); this.tone(165,t+.12,.3,'square',.05); }
  if(k==='dissolve'){ this.noise(t,1.4,3000,200,.25); [1568,1319,1047,784,659].forEach((f,i)=>this.tone(f,t+.3+i*.12,.6,'sine',.08)); }
  if(k==='fanfare') [[523,0],[659,.12],[784,.24],[1047,.4],[784,.56],[1047,.68]].forEach(([f,d])=>{ this.tone(f,t+d,.5,'triangle',.14); this.tone(f/2,t+d,.5,'sine',.08); });
  if(k==='chime') [784,988,1175,1568].forEach((f,i)=>this.tone(f,t+i*.08,.6,'triangle',.15));
  if(k==='spark') [1568,2093].forEach((f,i)=>this.tone(f,t+i*.05,.25,'sine',.1));
  if(k==='fizz') [330,262].forEach((f,i)=>this.tone(f,t+i*.12,.3,'square',.06));
  if(k==='tap') this.tone(660,t,.12,'triangle',.12);
  if(k==='catch') this.tone(1200+rnd(400),t,.15,'sine',.12);
  if(k==='gold') [1047,1319,1568,2093].forEach((f,i)=>this.tone(f,t+i*.05,.3,'triangle',.12));
 },
 // gentle "magic school" theme on title + map only
 startMusic(){ if(!this.ctx||this.musicTimer) return; const notes=[[220,330,440,523],[196,294,392,494],[175,262,349,440],[196,294,392,587]]; let bar=0;
  const play=()=>{ const t=this.ctx.currentTime+.05; const ch=notes[bar%4]; this.tone(ch[0]/2,t,1.8,'sine',.12,this.music);
   [0,1,2,3,2,1].forEach((k,i)=>this.tone(ch[k]*2,t+i*.3,.5,'triangle',.05,this.music)); if(bar%2===0) this.tone(ch[3]*2,t+1.2,.9,'sine',.06,this.music); bar++; };
  play(); this.musicTimer=setInterval(play,1800); this.music.gain.cancelScheduledValues(this.ctx.currentTime); this.music.gain.linearRampToValueAtTime(1,this.ctx.currentTime+1); },
 stopMusic(){ if(!this.ctx||!this.musicTimer) return; const t=this.ctx.currentTime; this.music.gain.cancelScheduledValues(t); this.music.gain.setValueAtTime(this.music.gain.value,t); this.music.gain.linearRampToValueAtTime(0,t+.8); clearInterval(this.musicTimer); this.musicTimer=null; },
 setOn(on){ S.sound=on; save(); if(this.master) this.master.gain.value=on?1:0; document.querySelectorAll('[id^=muteBtn]').forEach(b=>b.textContent=on?'🔊':'🔇'); if(!on) Voice.stop(); }
};
