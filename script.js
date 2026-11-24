// Icônes en matrice de points (mêmes dessins que dans l'app : DexupApp/src/components/icons.jsx)
// et apparition des sections au défilement.
const GRIDS = {
 "LayoutGrid": [
  "xxxx.xxxx",
  "x..x.x..x",
  "x..x.x..x",
  "xxxx.xxxx",
  ".........",
  "xxxx.xxxx",
  "x..x.x..x",
  "x..x.x..x",
  "xxxx.xxxx"
 ],
 "ScanLine": [
  "xxx...xxx",
  "x.......x",
  "x.......x",
  ".........",
  "xxxxxxxxx",
  ".........",
  "x.......x",
  "x.......x",
  "xxx...xxx"
 ],
 "Languages": [
  "..xxxxx..",
  ".x..x..x.",
  "x..x.x..x",
  "x..x.x..x",
  "xxxxxxxxx",
  "x..x.x..x",
  "x..x.x..x",
  ".x..x..x.",
  "..xxxxx.."
 ],
 "BookMarked": [
  "xxxxxxxxx",
  "x..x.x..x",
  "x..x.x..x",
  "x...x...x",
  "x.......x",
  "x.......x",
  "xxxxxxxxx",
  "x.......x",
  ".xxxxxxxx"
 ],
 "Users": [
  "...xxx...",
  "..x...x..",
  "..x...x..",
  "...xxx...",
  ".........",
  "..xxxxx..",
  ".x.....x.",
  "x.......x",
  "x.......x"
 ],
 "Chart": [
  ".........",
  ".......x.",
  "......x.x",
  ".....x...",
  "..x.x....",
  ".x.x.....",
  "x........",
  ".........",
  "xxxxxxxxx"
 ],
 "Card": ["xxxxxxxxxxx", "x.........x", "x.xxxxxxx.x", "x.x.....x.x", "x.x..x..x.x", "x.x.xxx.x.x", "x.x..x..x.x", "x.x.....x.x", "x.xxxxxxx.x", "x.........x", "x.xxxxx...x", "x.........x", "x.xxx.xxx.x", "x.........x", "xxxxxxxxxxx"]
};

function dotSvg(rows, r = 0.4) {
  const h = rows.length;
  const w = rows[0].length;
  let d = '';
  rows.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === 'x') d += `M${x + 0.5 - r} ${y + 0.5}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
  }));
  return `<svg viewBox="-0.25 -0.25 ${w + 0.5} ${h + 0.5}" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;
}

document.querySelectorAll('[data-icon]').forEach((el) => {
  const rows = GRIDS[el.dataset.icon];
  if (!rows) return;
  el.innerHTML = dotSvg(rows, el.dataset.icon === 'Card' ? 0.32 : 0.4);
  if (rows.length !== rows[0].length) el.style.aspectRatio = `${rows[0].length} / ${rows.length}`;
});

// Apparition au défilement : fondu et montée, en cascade dans une même grille ; les téléphones
// glissent en se redressant, les grandes images grossissent légèrement, les chiffres défilent.
const REVEALS = [
  ['.section-head, .split > div:not(.shots):not(.scan-art)', '', 0],
  ['.feature, .step', '', 90],
  ['.stat', '', 90],
  ['.faq details', '', 60],
  ['.rail-item', '', 80],
  ['.shots .phone', 'reveal-phone', 160],
  ['.browser, .scan-art, .chips', 'reveal-zoom', 0],
];

function countUp(el) {
  const m = /^(\d+)(.*)$/.exec(el.textContent.trim());
  if (!m || m[1] === '0') return;
  const target = Number(m[1]);
  const t0 = performance.now();
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / 1100);
    el.textContent = `${Math.round(target * (1 - (1 - k) ** 3))}${m[2]}`;
    if (k < 1) requestAnimationFrame(tick);
  };
  el.textContent = `0${m[2]}`;
  requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      const num = e.target.matches('.stat') && e.target.querySelector('.dot-num');
      if (num) setTimeout(() => countUp(num), parseFloat(e.target.style.transitionDelay) || 0);
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  for (const [selector, variant, step] of REVEALS) {
    // Le décalage repart de zéro dans chaque groupe (grille, rangée, paire de téléphones).
    const groups = new Map();
    document.querySelectorAll(selector).forEach((el) => {
      const i = groups.get(el.parentElement) ?? 0;
      groups.set(el.parentElement, i + 1);
      el.classList.add('reveal');
      if (variant) el.classList.add(variant);
      if (step) el.style.transitionDelay = `${Math.min(i, 6) * step}ms`;
      io.observe(el);
    });
  }
}

// ── Aperçu : onglets Téléphone / Ordinateur, défilement des téléphones, écran du navigateur ──
const seg = document.querySelector('#apercu .seg');
if (seg) {
  const tabs = [...seg.querySelectorAll('[role=tab]')];
  const select = (tab) => {
    tabs.forEach((t, i) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      if (on) seg.style.setProperty('--i', i);
    });
  };
  tabs.forEach((t) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const next = tabs[(tabs.indexOf(t) + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });
}

const rail = document.querySelector('.rail');
document.querySelectorAll('[data-rail]').forEach((btn) => btn.addEventListener('click', () => {
  const step = rail.querySelector('.rail-item').getBoundingClientRect().width + 22;
  rail.scrollBy({ left: Number(btn.dataset.rail) * step * 2, behavior: 'smooth' });
}));

const desk = document.getElementById('desk-shot');
document.querySelectorAll('.chip[data-shot]').forEach((chip, _, chips) => chip.addEventListener('click', () => {
  chips.forEach((c) => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', c === chip); });
  const src = `assets/screens/desktop-${chip.dataset.shot}.webp`;
  if (desk.getAttribute('src') === src) return;
  const next = new Image();
  next.src = src;
  desk.classList.add('is-swapping');
  next.decode().catch(() => {}).then(() => setTimeout(() => {
    desk.src = src;
    desk.alt = chip.dataset.caption;
    desk.classList.remove('is-swapping');
  }, 180));
}));
