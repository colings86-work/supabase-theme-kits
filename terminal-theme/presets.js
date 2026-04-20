// ============================================================
// Supabase Terminal Theme — presets + ANSI palette engine
// ============================================================
//
// The ANSI palette for every preset is computed from:
//   1. The preset's BASE COLORS (hues and reference lightness/saturation)
//   2. The selected MOOD (brand / vibrant / muted / pastel / mono+green)
//
// "brand" mood means: DO NOT TRANSFORM. The preset's base colors win.
// Studio Dark + brand = exact Supabase design-system tokens. Guaranteed.
//

// --------- Exact Supabase design-system hex values ----------------------
// Pulled from chrome-theme/shared/colors_and_type.css (dark theme).
// These are the "canonical" colors Studio Dark must match exactly on brand mood.
const SB = {
  brandGreen:    '#3ECF8E', // brand-default  153.1° 60.2% 52.7%
  brandGreenAlt: '#65DDAB', // brand-600      154.9° 59.5% 70%
  brandLink:     '#00C58E', // brand-link     155°   100%  38.6%
  indigo:        '#9C97FF', // secondary-default
  warning:       '#DB9800', // warning-default
  destructive:   '#E15A3C', // destructive-default
  fg:            '#FAFAFA', // foreground-default
  fgLight:       '#B4B4B4', // foreground-light  (0 0% 70.6%)
  fgLighter:     '#898989', // foreground-lighter
  fgMuted:       '#4D4D4D', // foreground-muted
  bgStudio:      '#121212', // background-default dark
  bgAlt:         '#0F0F0F', // background-alternative dark
  borderStrong:  '#363636', // border-strong
  codeBlock1:    '#7FCFC0', // code-block-1  (teal)
  codeBlock2:    '#F5C07A', // code-block-2  (warm amber)
  codeBlock3:    '#C4DB7C', // code-block-3  (lime)
  codeBlock4:    '#CEA5E8', // code-block-4  (violet)
  codeBlock5:    '#EE8C68', // code-block-5  (orange)
};

// --------- 16-slot ANSI role map ----------------------------------------
// Standard index: 0=black 1=red 2=green 3=yellow 4=blue 5=magenta 6=cyan 7=white
//                 8..15 = bright variants
// We author this as a role→hex map per preset; we transform it per mood.

/**
 * Build the canonical (Studio Dark + brand) ANSI palette
 * directly from Supabase design-system tokens.
 */
const STUDIO_BRAND_ANSI = {
  black:    '#121212', // bg (matches background-default)
  red:      SB.destructive,
  green:    SB.brandGreen,
  yellow:   SB.warning,
  blue:     SB.indigo,       // secondary-default (indigo) in the blue slot
  magenta:  SB.codeBlock4,   // violet from code tokens
  cyan:     SB.codeBlock1,   // teal from code tokens
  white:    SB.fgLight,

  brBlack:   '#474747',       // ≈ black + 20% L — visible divider
  brRed:     '#F07960',       // lighter destructive
  brGreen:   SB.brandGreenAlt, // brand-600
  brYellow:  '#F5C07A',        // code-block-2
  brBlue:    '#C0BBFF',        // lighter indigo
  brMagenta: '#E3C7F5',        // lighter violet
  brCyan:    '#A9E0D4',        // lighter teal
  brWhite:   SB.fg,

  // Non-ANSI slots
  fg:        SB.fg,
  bg:        SB.bgStudio,
  cursor:    SB.brandGreen,
  cursorText:'#0A2015',
  selBg:     '#2A4B3A',
  selFg:     SB.fg,
  promptFg:  SB.brandGreen,
};

// --------- Presets ------------------------------------------------------
// Each preset declares BASE hex values. Mood transforms are applied in
// applyMood() below. For the canonical preset (`studio`), the brand mood
// must equal exactly the Supabase design-system tokens.
const PRESETS = {
  studio: {
    name: 'Studio Dark',
    canonical: true,
    blurb: 'Exact Supabase design-system tokens. The canonical preset.',
    bg: SB.bgStudio,
    fg: SB.fg,
    ansi: { ...STUDIO_BRAND_ANSI },
  },
  'deep-dark': {
    name: 'Deep Dark',
    blurb: 'Pure near-black. Vibrant brand green in the prompt and success lines.',
    bg: '#0A0A0A',
    fg: '#FAFAFA',
    ansi: {
      ...STUDIO_BRAND_ANSI,
      black:  '#0A0A0A',
      bg:     '#0A0A0A',
      brBlack:'#383838',
      // Slightly punchier primary colors on true black
      red:    '#E85F3F',
      yellow: '#E5A005',
      cursor: SB.brandGreen,
      selBg:  '#1E4534',
    },
  },
  'midnight-green': {
    name: 'Midnight Green',
    blurb: 'A tinted dark-green background. Everything whispers Supabase.',
    bg: '#0A1512',
    fg: '#E8F5EE',
    ansi: {
      ...STUDIO_BRAND_ANSI,
      black:  '#0A1512',
      bg:     '#0A1512',
      brBlack:'#2A4639',
      fg:     '#E8F5EE',
      white:  '#A8C7B9',
      // Cool-leaning reds to stay in the green ecosystem
      red:    '#E15A3C',
      brRed:  '#F0775D',
      cursor: SB.brandGreen,
      cursorText: '#0A1512',
      selBg:  '#19382D',
      selFg:  '#E8F5EE',
      promptFg: SB.brandGreenAlt,
    },
  },
  'high-contrast': {
    name: 'High Contrast',
    blurb: 'Maximum legibility. Bold ANSI on pure black, brand green held steady.',
    bg: '#000000',
    fg: '#FFFFFF',
    ansi: {
      ...STUDIO_BRAND_ANSI,
      black:   '#000000',
      bg:      '#000000',
      brBlack: '#4A4A4A',
      fg:      '#FFFFFF',
      white:   '#DADADA',
      red:     '#FF5C3A',
      green:   SB.brandGreen,
      yellow:  '#FFB020',
      blue:    '#B2ACFF',
      magenta: '#E3B8FF',
      cyan:    '#8DE8D6',
      brRed:   '#FF8A6F',
      brGreen: '#6FE8B5',
      brYellow:'#FFCB6B',
      brBlue:  '#D7D3FF',
      brMagenta:'#F3DEFF',
      brCyan:  '#B6F0E1',
      brWhite: '#FFFFFF',
      cursor:  SB.brandGreen,
      selBg:   '#1F4532',
      selFg:   '#FFFFFF',
      promptFg: SB.brandGreen,
    },
  },
  'classic-dark': {
    name: 'Classic Dark',
    blurb: 'Slate-tinted dark. Cool-gray neutrals with brand green holding the accent slot.',
    bg: '#0F1115',
    fg: '#FAFAFA',
    ansi: {
      ...STUDIO_BRAND_ANSI,
      black:   '#0F1115',
      bg:      '#0F1115',
      brBlack: '#2A2E38', // slate-tinted bright black — visible divider
      fg:      '#FAFAFA',
      white:   '#AFB4BE', // slate-tinted light neutral (matches Chrome bookmark_text)
      // Cool-leaning ANSI colors to harmonize with the slate background
      red:     '#E15A3C',
      yellow:  '#DB9800',
      blue:    '#9C97FF',
      magenta: '#CEA5E8',
      cyan:    '#7FCFC0',
      brRed:   '#F07960',
      brGreen: SB.brandGreenAlt,
      brYellow:'#F5C07A',
      brBlue:  '#C0BBFF',
      brMagenta:'#E3C7F5',
      brCyan:  '#A9E0D4',
      brWhite: '#FAFAFA',
      cursor:  SB.brandGreen,
      cursorText: '#0A2015',
      selBg:   '#1E2634', // slate-tinted selection
      selFg:   '#FAFAFA',
      promptFg: SB.brandGreen,
    },
  },
  'mono-green': {
    name: 'Monochrome + Green',
    blurb: 'Grayscale ANSI. Brand green is the only colored accent anywhere.',
    bg: '#0D0D0D',
    fg: '#EDEDED',
    ansi: {
      black:    '#0D0D0D',
      red:      '#8A8A8A',
      green:    SB.brandGreen, // the only color in the entire palette
      yellow:   '#A8A8A8',
      blue:     '#9A9A9A',
      magenta:  '#9A9A9A',
      cyan:     '#A0A0A0',
      white:    '#CFCFCF',

      brBlack:   '#3A3A3A',
      brRed:     '#B8B8B8',
      brGreen:   SB.brandGreenAlt,
      brYellow:  '#C8C8C8',
      brBlue:    '#B0B0B0',
      brMagenta: '#B0B0B0',
      brCyan:    '#C0C0C0',
      brWhite:   '#EDEDED',

      fg:        '#EDEDED',
      bg:        '#0D0D0D',
      cursor:    SB.brandGreen,
      cursorText:'#0A2015',
      selBg:     '#262626',
      selFg:     '#EDEDED',
      promptFg:  SB.brandGreen,
    },
  },
};

// --------- Color helpers ------------------------------------------------
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
function rgbToHex({ r, g, b }) {
  const to2 = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return '#' + to2(r) + to2(g) + to2(b);
}
function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = 0; s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}
function hslToRgb({ h, s, l }) {
  h = ((h % 360) + 360) % 360 / 360;
  if (s === 0) { const v = l * 255; return { r: v, g: v, b: v }; }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: hue2rgb(p, q, h + 1 / 3) * 255,
    g: hue2rgb(p, q, h) * 255,
    b: hue2rgb(p, q, h - 1 / 3) * 255,
  };
}
function hexToHsl(hex) { return rgbToHsl(hexToRgb(hex)); }
function hslToHex(hsl) { return rgbToHex(hslToRgb(hsl)); }

// Mix hex `a` toward `b` by amount t (0..1).
function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex({
    r: A.r + (B.r - A.r) * t,
    g: A.g + (B.g - A.g) * t,
    b: A.b + (B.b - A.b) * t,
  });
}
function grayscale(hex) {
  const { r, g, b } = hexToRgb(hex);
  // Perceptual luma
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  return rgbToHex({ r: y, g: y, b: y });
}
// Scale saturation/lightness of a hex by factors.
function adjustSL(hex, sMul, lMul, lOffset = 0) {
  const hsl = hexToHsl(hex);
  hsl.s = Math.max(0, Math.min(1, hsl.s * sMul));
  hsl.l = Math.max(0, Math.min(1, hsl.l * lMul + lOffset));
  return hslToHex(hsl);
}

// --------- Mood transform ----------------------------------------------
// Input: a preset's base ANSI map. Output: transformed ANSI map.
// 'brand' is the identity (no transform). That's the promise.
const BRAND_GREEN = SB.brandGreen;
const BRAND_GREEN_ALT = SB.brandGreenAlt;

function applyMood(ansi, mood) {
  // Copy so we don't mutate the preset
  const out = { ...ansi };
  const COLOR_KEYS = ['red','green','yellow','blue','magenta','cyan',
                      'brRed','brGreen','brYellow','brBlue','brMagenta','brCyan'];

  if (mood === 'brand') {
    return out; // identity — guarantees design-system fidelity for Studio Dark
  }

  if (mood === 'vibrant') {
    // Boost saturation, slight lightness bump on normal, keep brights the same.
    for (const k of COLOR_KEYS) {
      const isBright = k.startsWith('br');
      out[k] = adjustSL(ansi[k], isBright ? 1.1 : 1.25, 1.0, isBright ? 0 : 0.02);
    }
    // Brand green always wins in the green slot
    out.green = BRAND_GREEN;
    out.brGreen = BRAND_GREEN_ALT;
  } else if (mood === 'muted') {
    // Desaturate, slight darken on normals.
    for (const k of COLOR_KEYS) {
      out[k] = adjustSL(ansi[k], 0.6, 0.92, 0);
    }
    // Green stays recognizably Supabase — half-muted, not fully
    out.green = adjustSL(BRAND_GREEN, 0.8, 0.95, 0);
    out.brGreen = adjustSL(BRAND_GREEN_ALT, 0.8, 0.95, 0);
  } else if (mood === 'pastel') {
    // Lift lightness, hold saturation moderate, push toward fg.
    const fg = ansi.fg || '#EDEDED';
    for (const k of COLOR_KEYS) {
      const lifted = adjustSL(ansi[k], 0.75, 1.0, 0.12);
      out[k] = mix(lifted, fg, 0.08);
    }
    out.green = mix(adjustSL(BRAND_GREEN, 0.85, 1.0, 0.08), fg, 0.08);
    out.brGreen = mix(adjustSL(BRAND_GREEN_ALT, 0.85, 1.0, 0.06), fg, 0.08);
  } else if (mood === 'mono-green') {
    // Grayscale everything, then force green to brand green.
    for (const k of COLOR_KEYS) {
      out[k] = grayscale(ansi[k]);
    }
    out.green = BRAND_GREEN;
    out.brGreen = BRAND_GREEN_ALT;
  }

  return out;
}

// --------- Derive a full resolved theme given state --------------------
function resolveTheme(state) {
  const preset = PRESETS[state.preset] || PRESETS.studio;
  // Start from preset base, apply mood transform.
  const ansi = applyMood(preset.ansi, state.mood);

  // Foreground brightness adjustment
  if (state.fgBrightness === 'dim') {
    ansi.fg = adjustSL(ansi.fg, 0.9, 0.86);
    ansi.white = adjustSL(ansi.white, 0.9, 0.9);
  } else if (state.fgBrightness === 'bright') {
    ansi.fg = adjustSL(ansi.fg, 1.0, 1.05, 0.01);
    ansi.white = adjustSL(ansi.white, 1.0, 1.06, 0.01);
  }

  // Bold-as-bright: renders bold normal-ANSI as their `br*` variants.
  // We don't mutate hex here — the preview checks state.boldAsBright directly.

  return { preset, ansi };
}

// Expose
window.SB = SB;
window.PRESETS = PRESETS;
window.applyMood = applyMood;
window.resolveTheme = resolveTheme;
window.__colorHelpers = { hexToRgb, rgbToHex, hexToHsl, hslToHex, mix, adjustSL, grayscale };
