// ============================================================
// Supabase Raycast Theme — presets + palette engine
// ============================================================
//
// Raycast's theming surface is small but expressive:
//   - 8 core UI color slots (background, backgroundSecondary, text,
//     selection, loader, popto, + semantic accents)
//   - 7 semantic accents: red, orange, yellow, green, blue, purple, magenta
//   - Window background: solid | gradient | textured
//   - Corner radius on the root window
//   - Appearance: light | dark
//
// Each preset declares its CORE UI palette and ACCENT palette.
// A MOOD transform (brand/vibrant/muted/pastel/mono+green) reshapes the
// accents globally. Brand mood is the identity transform — Studio Dark +
// brand = exact Supabase design-system tokens. Guaranteed.

// --------- Exact Supabase design-system hex values ----------------------
const SB = {
  brandGreen:    '#3ECF8E',
  brandGreenAlt: '#65DDAB',
  brandLink:     '#00C58E',
  indigo:        '#9C97FF',
  warning:       '#DB9800',
  destructive:   '#E15A3C',

  // Dark
  fg:            '#FAFAFA',
  fgLight:       '#B4B4B4',
  fgLighter:     '#898989',
  fgMuted:       '#4D4D4D',
  bgStudio:      '#121212',
  bgAlt:         '#0F0F0F',
  surface100:    '#1F1F1F',
  surface200:    '#202020',
  borderStrong:  '#363636',

  codeBlock1:    '#7FCFC0', // teal
  codeBlock2:    '#F5C07A', // amber
  codeBlock3:    '#C4DB7C', // lime
  codeBlock4:    '#CEA5E8', // violet
  codeBlock5:    '#EE8C68', // orange

  // Light
  fgLightMode:   '#171717',
  fgLightL:      '#525252',
  fgLightLL:     '#707070',
  fgLightMut:    '#B2B2B2',
  bgLight:       '#FCFCFC',
  bgLightAlt:    '#FDFDFD',
  surfaceLight:  '#F6F6F6',
  borderLight:   '#DEDEDE',
};

// Canonical Studio Dark ACCENT palette (brand-aligned semantic colors).
// These map to Raycast's 7 hue slots used across command icons/tags.
const STUDIO_DARK_ACCENTS = {
  red:     SB.destructive,   // #E15A3C
  orange:  SB.codeBlock5,    // #EE8C68
  yellow:  SB.warning,       // #DB9800
  green:   SB.brandGreen,    // #3ECF8E  — the brand hue wins
  blue:    SB.indigo,        // #9C97FF  — secondary-default
  purple:  SB.codeBlock4,    // #CEA5E8
  magenta: '#E891C8',
};

// Canonical Studio Dark CORE palette (UI chrome slots).
const STUDIO_DARK_CORE = {
  appearance:         'dark',
  background:         SB.bgStudio,    // main window bg
  backgroundSecondary:SB.bgAlt,       // detail pane, form fields
  text:               SB.fg,
  textSecondary:      SB.fgLight,
  textMuted:          SB.fgLighter,
  selection:          '#2A4B3A',      // brand green @ low alpha feel
  selectionText:      SB.fg,
  loader:             SB.brandGreen,
  popto:              SB.brandGreen,  // action-hint pill "↵"
  poptoText:          '#0A2015',
  border:             SB.borderStrong,
  borderSubtle:       '#232323',
  icon:               SB.fgLight,
};

// --------- Presets ------------------------------------------------------
// `bgMode` is the default window-background treatment for this preset
// (user can override via controls): 'solid' | 'gradient' | 'textured'.
const PRESETS = {
  studio: {
    name: 'Studio Dark',
    canonical: true,
    blurb: 'Exact Supabase design-system tokens. The canonical preset.',
    bgMode: 'solid',
    core: { ...STUDIO_DARK_CORE },
    accents: { ...STUDIO_DARK_ACCENTS },
    gradient: { from: SB.bgStudio, to: '#0A1512', angle: 135 },
  },

  'classic-dark': {
    name: 'Classic Dark',
    blurb: 'Slate-tinted dark. Cooler than Studio, with a blue-gray cast.',
    bgMode: 'solid',
    core: {
      ...STUDIO_DARK_CORE,
      background:         '#171A20',
      backgroundSecondary:'#0F1115',
      text:               '#F5F7FA',
      textSecondary:      '#A6ADB8',
      textMuted:          '#6B7280',
      selection:          '#1F2A3A',
      border:             '#2A313B',
      borderSubtle:       '#1A1E25',
    },
    accents: {
      ...STUDIO_DARK_ACCENTS,
      blue: '#8FA1FF',
    },
    gradient: { from: '#171A20', to: '#0F1115', angle: 135 },
  },

  'deep-dark': {
    name: 'Deep Dark',
    blurb: 'Pure near-black. Punchier tokens against a void background.',
    bgMode: 'solid',
    core: {
      ...STUDIO_DARK_CORE,
      background:         '#0A0A0A',
      backgroundSecondary:'#050505',
      selection:          '#1E4534',
      border:             '#2B2B2B',
      borderSubtle:       '#151515',
    },
    accents: {
      ...STUDIO_DARK_ACCENTS,
      red:    '#E85F3F',
      yellow: '#E5A005',
    },
    gradient: { from: '#0A0A0A', to: '#000000', angle: 135 },
  },

  'midnight-green': {
    name: 'Midnight Green',
    blurb: 'Tinted dark-green. Defaults to a subtle brand gradient.',
    bgMode: 'gradient', // <-- signature gradient default
    core: {
      ...STUDIO_DARK_CORE,
      background:         '#0A1512',
      backgroundSecondary:'#07110E',
      text:               '#E8F5EE',
      textSecondary:      '#A8C7B9',
      textMuted:          '#6F8C80',
      selection:          '#19382D',
      selectionText:      '#E8F5EE',
      loader:             SB.brandGreenAlt,
      border:             '#1E332B',
      borderSubtle:       '#132721',
      icon:               '#A8C7B9',
    },
    accents: {
      ...STUDIO_DARK_ACCENTS,
      green: SB.brandGreenAlt,
    },
    gradient: { from: '#0A1F19', to: '#071210', angle: 135 },
  },

  'high-contrast': {
    name: 'High Contrast',
    blurb: 'Maximum legibility. Bold accents on pure black.',
    bgMode: 'solid',
    core: {
      ...STUDIO_DARK_CORE,
      background:         '#000000',
      backgroundSecondary:'#000000',
      text:               '#FFFFFF',
      textSecondary:      '#DADADA',
      textMuted:          '#9A9A9A',
      selection:          '#1F4532',
      border:             '#4A4A4A',
      borderSubtle:       '#2A2A2A',
      icon:               '#FFFFFF',
    },
    accents: {
      red:    '#FF5C3A',
      orange: '#FFA080',
      yellow: '#FFB020',
      green:  SB.brandGreen,
      blue:   '#B2ACFF',
      purple: '#E3B8FF',
      magenta:'#FF9FD8',
    },
    gradient: { from: '#000000', to: '#0A0A0A', angle: 135 },
  },

  'mono-green': {
    name: 'Monochrome + Green',
    blurb: 'Grayscale palette. Brand green is the only hue anywhere.',
    bgMode: 'solid',
    core: {
      ...STUDIO_DARK_CORE,
      background:         '#0D0D0D',
      backgroundSecondary:'#0A0A0A',
      text:               '#EDEDED',
      textSecondary:      '#CFCFCF',
      textMuted:          '#8A8A8A',
      selection:          '#262626',
      border:             '#3A3A3A',
      borderSubtle:       '#1C1C1C',
    },
    accents: {
      red:    '#8A8A8A',
      orange: '#A0A0A0',
      yellow: '#B8B8B8',
      green:  SB.brandGreen,
      blue:   '#9A9A9A',
      purple: '#A8A8A8',
      magenta:'#B0B0B0',
    },
    gradient: { from: '#0D0D0D', to: '#050505', angle: 135 },
  },

};

// --------- Color helpers (shared recipe across kits) --------------------
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
}
function rgbToHex({r,g,b}) {
  const to2 = n => Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');
  return '#' + to2(r)+to2(g)+to2(b);
}
function rgbToHsl({r,g,b}) {
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if (max===min) { h=0;s=0; }
  else {
    const d=max-min;
    s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4;}
    h/=6;
  }
  return {h:h*360,s,l};
}
function hslToRgb({h,s,l}) {
  h=((h%360)+360)%360/360;
  if (s===0){const v=l*255;return {r:v,g:v,b:v};}
  const hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
  const q=l<0.5?l*(1+s):l+s-l*s;
  const p=2*l-q;
  return {r:hue2rgb(p,q,h+1/3)*255,g:hue2rgb(p,q,h)*255,b:hue2rgb(p,q,h-1/3)*255};
}
function hexToHsl(hex) { return rgbToHsl(hexToRgb(hex)); }
function hslToHex(hsl) { return rgbToHex(hslToRgb(hsl)); }
function mix(a,b,t) {
  const A=hexToRgb(a),B=hexToRgb(b);
  return rgbToHex({r:A.r+(B.r-A.r)*t,g:A.g+(B.g-A.g)*t,b:A.b+(B.b-A.b)*t});
}
function grayscale(hex) {
  const {r,g,b}=hexToRgb(hex);
  const y=0.299*r+0.587*g+0.114*b;
  return rgbToHex({r:y,g:y,b:y});
}
function adjustSL(hex,sMul,lMul,lOffset=0) {
  const hsl=hexToHsl(hex);
  hsl.s=Math.max(0,Math.min(1,hsl.s*sMul));
  hsl.l=Math.max(0,Math.min(1,hsl.l*lMul+lOffset));
  return hslToHex(hsl);
}

// --------- Mood transform ----------------------------------------------
const BRAND_GREEN = SB.brandGreen;
const BRAND_GREEN_ALT = SB.brandGreenAlt;

const ACCENT_KEYS = ['red','orange','yellow','green','blue','purple','magenta'];

function applyMoodAccents(accents, mood, fg) {
  const out = { ...accents };
  if (mood === 'brand') return out;

  if (mood === 'vibrant') {
    for (const k of ACCENT_KEYS) out[k] = adjustSL(accents[k], 1.25, 1.0, 0.02);
    out.green = BRAND_GREEN;
  } else if (mood === 'muted') {
    for (const k of ACCENT_KEYS) out[k] = adjustSL(accents[k], 0.6, 0.92);
    out.green = adjustSL(BRAND_GREEN, 0.8, 0.95);
  } else if (mood === 'pastel') {
    const target = fg || '#EDEDED';
    for (const k of ACCENT_KEYS) {
      const lifted = adjustSL(accents[k], 0.75, 1.0, 0.12);
      out[k] = mix(lifted, target, 0.08);
    }
    out.green = mix(adjustSL(BRAND_GREEN, 0.85, 1.0, 0.08), target, 0.08);
  } else if (mood === 'mono-green') {
    for (const k of ACCENT_KEYS) out[k] = grayscale(accents[k]);
    out.green = BRAND_GREEN;
  }
  return out;
}

// --------- Resolve full theme given state ------------------------------
function resolveTheme(state) {
  const preset = PRESETS[state.preset] || PRESETS.studio;
  const accents = applyMoodAccents(preset.accents, state.mood, preset.core.text);
  const core = { ...preset.core };

  // Raycast has no "gradient" flag — gradient is implicit: if background and
  // backgroundSecondary differ, Raycast renders them as a gradient; if they
  // match, it renders solid. The user's bgMode choice controls which we do.
  const bgMode = state.bgMode || preset.bgMode || 'solid';
  if (bgMode === 'solid') {
    core.backgroundSecondary = core.background;
  } else {
    // Keep the preset-defined backgroundSecondary distinct from background.
    // If the preset happened to set them equal, nudge secondary darker/lighter
    // so Raycast actually produces a gradient.
    if (core.backgroundSecondary === core.background) {
      core.backgroundSecondary = core.appearance === 'light'
        ? adjustSL(core.background, 1.0, 0.97)
        : adjustSL(core.background, 1.2, 1.15, 0.02);
    }
  }

  return { preset, core, accents, bgMode };
}

// Expose
window.SB = SB;
window.PRESETS = PRESETS;
window.resolveTheme = resolveTheme;
window.__rcColorHelpers = { hexToRgb, rgbToHex, mix, adjustSL, grayscale };
