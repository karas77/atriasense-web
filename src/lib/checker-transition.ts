/**
 * kgunes.com "chapter-checker-transition" mantığı: tıklanan noktadan dışa doğru
 * gecikmeli büyüyen kareler ekranı kaplar, kaplandığında sayfa hedefe atlar,
 * sonra kareler biraz daha hızlı (0.9x gecikme, 300 ms) küçülerek açılır.
 */
type Options = {
  origin: { x: number; y: number };
  color: string;
  onCovered: () => void;
  onComplete?: () => void;
};

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

export function runCheckerTransition({ origin, color, onCovered, onComplete }: Options) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onCovered();
    onComplete?.();
    return () => {};
  }

  const w = window.innerWidth;
  const h = window.innerHeight;
  const tile = w < 640 ? 64 : 96;
  const cols = Math.ceil(w / tile);
  const rows = Math.ceil(h / tile);
  const cw = w / cols;
  const rh = h / rows;
  const px = Math.min(w, Math.max(0, origin.x));
  const py = Math.min(h, Math.max(0, origin.y));
  const maxDist = Math.max(
    Math.hypot(px, py),
    Math.hypot(w - px, py),
    Math.hypot(px, h - py),
    Math.hypot(w - px, h - py),
    1,
  );

  const root = document.createElement("div");
  root.className = "checker-transition";
  root.setAttribute("aria-hidden", "true");
  root.style.setProperty("--checker-columns", String(cols));
  root.style.setProperty("--checker-rows", String(rows));
  root.style.setProperty("--checker-color", color);

  const tiles: { el: HTMLSpanElement; delay: number }[] = [];
  const frag = document.createDocumentFragment();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const el = document.createElement("span");
      el.className = "checker-transition__tile";
      const dist = Math.hypot((c + 0.5) * cw - px, (r + 0.5) * rh - py) / maxDist;
      const delay = dist * 190 + ((r + c) % 2 ? 34 : 0) + (((13 * r + 7 * c) % 5) * 9);
      frag.appendChild(el);
      tiles.push({ el, delay });
    }
  }
  root.appendChild(frag);
  document.body.appendChild(root);

  let cancelled = false;
  let anims: Animation[] = [];
  const cleanup = () => {
    if (cancelled) return;
    cancelled = true;
    anims.forEach((a) => a.cancel());
    root.remove();
  };

  const play = (from: string, to: string, scaleDelay: number, duration: number) => {
    anims = tiles.map(({ el, delay }) =>
      el.animate([{ transform: from }, { transform: to }], {
        delay: delay * scaleDelay,
        duration,
        easing: EASE,
        fill: "forwards",
      }),
    );
    return Promise.all(anims.map((a) => a.finished));
  };

  play("scale(0.001)", "scale(1.055)", 1, 330)
    .then(() => {
      if (cancelled) return;
      onCovered();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled) return;
          play("scale(1.055)", "scale(0.001)", 0.9, 300).then(() => {
            cleanup();
            onComplete?.();
          });
        }),
      );
    })
    .catch(cleanup);

  return cleanup;
}
