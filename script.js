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

// Les blocs apparaissent en fondu quand ils entrent à l'écran.
const targets = document.querySelectorAll('.feature, .step, .split > *, .stat, .faq details, .section-head');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 3) * 70}ms`;
    io.observe(el);
  });
}
