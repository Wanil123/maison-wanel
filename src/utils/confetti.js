// Lightweight canvas confetti — brand palette (gold/champagne/bordeaux), GPU friendly.
// Respects prefers-reduced-motion. Idempotent: starts a single animation per call.

const PALETTE = ["#C9A96E", "#E8D5B0", "#6B2D4A", "#4A1E3A", "#F5E6CC", "#A68B5B"];
const PARTICLE_COUNT = 110;
const DURATION_MS = 3200;

export default function confetti(options = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const colors = options.colors || PALETTE;
  const count = options.count ?? PARTICLE_COUNT;
  const duration = options.duration ?? DURATION_MS;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = `position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;`;
  document.body.appendChild(canvas);

  const dpr = window.devicePixelRatio || 1;
  const ctx = canvas.getContext("2d");
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  };
  resize();

  const W = window.innerWidth;
  const particles = Array.from({ length: count }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.4,
    y: -20 - Math.random() * 60,
    vx: (Math.random() - 0.5) * 6,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.25,
    size: 4 + Math.random() * 6,
    color: colors[(Math.random() * colors.length) | 0],
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));

  const start = performance.now();
  let raf;

  const tick = (now) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.vy += 0.12;            // gravity
      p.vx *= 0.995;           // air drag
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (elapsed < duration) {
      raf = requestAnimationFrame(tick);
    } else {
      cleanup();
    }
  };

  const cleanup = () => {
    cancelAnimationFrame(raf);
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  };

  raf = requestAnimationFrame(tick);
  return cleanup;
}
