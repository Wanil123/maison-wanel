// Generates a beautiful branded SVG placeholder when a product image fails.
// 100% deterministic, no external dependency, always loads.

const PALETTES = [
  { from: "#6B2D4A", to: "#2D1B30", accent: "#C9A96E" }, // wine → charcoal
  { from: "#4A1E3A", to: "#1E0F21", accent: "#E8D5B0" }, // plum → noir
  { from: "#2D1B30", to: "#1E0F21", accent: "#C9A96E" }, // charcoal → noir
  { from: "#6B2D4A", to: "#4A1E3A", accent: "#F5E6CC" }, // wine → plum
];

const safe = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const initial = (name) => {
  const t = String(name || "L").trim();
  return t.charAt(0).toUpperCase();
};

const utf8ToB64 = (str) => {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return btoa(str);
  }
};

/**
 * Build a branded SVG placeholder.
 * @param {object} opts
 * @param {number|string} opts.seed   stable seed (product id)
 * @param {string}        opts.label  product name (uses first letter only)
 * @param {string}        opts.category category text (small caption)
 * @param {number}        [opts.w]    width
 * @param {number}        [opts.h]    height
 * @returns {string} data URI
 */
export function getProductFallback({ seed = 0, label = "Maison Wanél", category = "", w = 600, h = 800 }) {
  const palette = PALETTES[Math.abs(Number.parseInt(seed, 10) || 0) % PALETTES.length];
  const letter = initial(label);
  const cat = safe(category).toUpperCase();
  const gradId = `g${seed}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.from}"/>
      <stop offset="100%" stop-color="${palette.to}"/>
    </linearGradient>
    <radialGradient id="${gradId}h" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${gradId})"/>
  <rect width="${w}" height="${h}" fill="url(#${gradId}h)"/>
  <g opacity="0.06">
    <circle cx="${w * 0.15}" cy="${h * 0.2}" r="${w * 0.4}" fill="${palette.accent}"/>
    <circle cx="${w * 0.9}" cy="${h * 0.85}" r="${w * 0.5}" fill="${palette.accent}"/>
  </g>
  <text x="50%" y="48%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, 'Playfair Display', serif" font-weight="700"
        font-size="${w * 0.55}" fill="${palette.accent}" opacity="0.85">${letter}</text>
  ${cat
    ? `<text x="50%" y="78%" text-anchor="middle" dominant-baseline="middle"
            font-family="Inter, system-ui, sans-serif" font-weight="500"
            font-size="${w * 0.035}" letter-spacing="${w * 0.008}"
            fill="${palette.accent}" opacity="0.7">${cat}</text>`
    : ""}
  <text x="50%" y="92%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, serif" font-weight="700"
        font-size="${w * 0.04}" fill="${palette.accent}" opacity="0.6">Maison Wanél</text>
</svg>`;

  return `data:image/svg+xml;base64,${utf8ToB64(svg)}`;
}
