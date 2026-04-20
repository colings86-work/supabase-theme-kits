// Shared constants — must load before sb-defs.jsx / wallpapers-all.jsx
// ─────────────────────────────────────────────────────────────────────
// Resolution / aspect model
// ─────────────────────────────────────────────────────────────────────
// Layout is aspect-ratio driven. Within an aspect ratio, changing 2K→4K→8K
// does not change the layout — it just scales the exported pixels.
// The viewBox we pick per aspect:
//   single  16:9  →  7680 × 4320
//   dual    32:9  →  7680 × 2160
//   ultra   21:9  →  7680 × 3291  (21/9 ≈ 2.3333 ratio)

const ASPECT_BASE = {
  single: { W: 7680, H: 4320, ratio: '16:9',  label: 'Single monitor'     },
  dual:   { W: 7680, H: 2160, ratio: '32:9',  label: 'Dual monitor'       },
  ultra:  { W: 7680, H: 3291, ratio: '21:9',  label: 'Ultrawide monitor'  },
  // Mobile / Tablet: cropped from the single-monitor source canvas.
  // sourceAspect='single' means the wallpaper is rendered at 16:9 and center-cropped.
  mobile: { W: 7680, H: 4320, ratio: 'portrait', label: 'Mobile', sourceAspect: 'single', portrait: true },
  tablet: { W: 7680, H: 4320, ratio: 'portrait', label: 'Tablet', sourceAspect: 'single', portrait: true },
};

// Tier multipliers against each aspect's *per-screen* native size.
// 4K single = 3840×2160 (1× the 4K-per-screen baseline).
// 2K =  0.666×, 4K = 1×, 8K = 2×    relative to the 4K per-screen baseline,
// but we want 8K single = 7680×4320, so scale the *viewBox-base* by:
//   2K → 0.333, 4K → 0.5, 8K → 1.0 against our viewBox base (7680×H).
// Simpler: pick target size directly per aspect × tier.
const RES_MATRIX = {
  single: {
    '2K': { w: 2560,  h: 1440 },
    '4K': { w: 3840,  h: 2160 },
    '8K': { w: 7680,  h: 4320 },
  },
  dual: {
    '2K': { w: 5120,  h: 1440 },
    '4K': { w: 7680,  h: 2160 },
    '8K': { w: 15360, h: 4320 },
  },
  ultra: {
    '2K': { w: 2560,  h: 1097 },
    '4K': { w: 3840,  h: 1646 },
    '8K': { w: 7680,  h: 3291 },
  },
};

// Backward-compatible global (old components read W/H directly). Components
// refactored to accept {W,H} props use their props; legacy ones fall back to these.
let W = ASPECT_BASE.dual.W;
let H = ASPECT_BASE.dual.H;

// Helper: resolve {W,H} for a component — uses explicit props, else aspect base, else globals.
function dims(props) {
  if (props && props.W && props.H) return { W: props.W, H: props.H };
  if (props && props.aspect && ASPECT_BASE[props.aspect]) return ASPECT_BASE[props.aspect];
  return { W, H };
}

const SB_GREEN = '#3ECF8E';
const SB_GREEN_DEEP = '#249361';
const BG = '#121212';
const BG_DEEP = '#0a0a0a';
const FG = '#FAFAFA';
const FG_LIGHT = 'hsl(0 0% 70.6%)';
const FG_LIGHTER = 'hsl(0 0% 53.7%)';
const FG_MUTED = 'hsl(0 0% 38%)';
const BORDER = 'hsl(0 0% 18%)';
const BORDER_MUTED = 'hsl(0 0% 14.1%)';
const SURFACE_100 = 'hsl(0 0% 12.2%)';
const SURFACE_75 = 'hsl(0 0% 9%)';

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

Object.assign(window, {
  W, H, ASPECT_BASE, RES_MATRIX, dims,
  SB_GREEN, SB_GREEN_DEEP, BG, BG_DEEP, FG, FG_LIGHT, FG_LIGHTER, FG_MUTED,
  BORDER, BORDER_MUTED, SURFACE_100, SURFACE_75, mulberry32,
});
