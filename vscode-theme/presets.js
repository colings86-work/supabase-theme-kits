// ============================================================
// Supabase VS Code Theme — presets + palette engine
// ============================================================
//
// Mirrors terminal-theme/presets.js conceptually:
//   1. Each preset declares BASE colors (editor bg/fg + syntax hues).
//   2. A MOOD transform adjusts saturation/lightness globally.
//   3. Studio Dark + brand mood = EXACT Supabase design-system tokens.
//
// In addition to the 16 ANSI slots (for VS Code's integrated terminal,
// which auto-matches the preset), we author a full UI chrome palette
// AND a syntax scope map. Together those compose the VS Code theme JSON.

// --------- Exact Supabase design-system hex values ----------------------
// From chrome-theme/shared/colors_and_type.css (dark theme).
const SB = {
  brandGreen:    '#3ECF8E',
  brandGreenAlt: '#65DDAB',
  brandLink:     '#00C58E',
  indigo:        '#9C97FF',
  warning:       '#DB9800',
  destructive:   '#E15A3C',
  fg:            '#FAFAFA',
  fgLight:       '#B4B4B4',
  fgLighter:     '#898989',
  fgMuted:       '#4D4D4D',
  bgStudio:      '#121212',
  bgAlt:         '#0F0F0F',
  surface100:    '#1A1A1A',
  surface200:    '#232323',
  borderStrong:  '#363636',
  borderDefault: '#292929',
  codeBlock1:    '#7FCFC0', // teal   — strings
  codeBlock2:    '#F5C07A', // amber  — numbers / constants
  codeBlock3:    '#C4DB7C', // lime   — types / classes
  codeBlock4:    '#CEA5E8', // violet — keywords
  codeBlock5:    '#EE8C68', // orange — operators / tags
};

// --------- ANSI palette (same shape as terminal kit) --------------------
const STUDIO_BRAND_ANSI = {
  black:    '#121212',
  red:      SB.destructive,
  green:    SB.brandGreen,
  yellow:   SB.warning,
  blue:     SB.indigo,
  magenta:  SB.codeBlock4,
  cyan:     SB.codeBlock1,
  white:    SB.fgLight,
  brBlack:   '#363636',
  brRed:     '#F07960',
  brGreen:   SB.brandGreenAlt,
  brYellow:  '#F5C07A',
  brBlue:    '#C0BBFF',
  brMagenta: '#E3C7F5',
  brCyan:    '#A9E0D4',
  brWhite:   SB.fg,
  fg:        SB.fg,
  bg:        SB.bgStudio,
  cursor:    SB.brandGreen,
  cursorText:'#0A2015',
  selBg:     '#2A4B3A',
  selFg:     SB.fg,
  promptFg:  SB.brandGreen,
};

// --------- Syntax scope palette -----------------------------------------
// Maps token roles → hex. Presets override these; moods transform them.
// Roles are intentionally coarse — more scopes than this all collapse into
// one of these buckets during export.
const STUDIO_BRAND_SYNTAX = {
  keyword:    SB.codeBlock4,   // violet — if / const / import / return
  storage:    SB.codeBlock4,   // function / class / let / var
  controlFlow:SB.codeBlock4,   // if / for / await
  string:     SB.codeBlock1,   // 'hello' / `world` / "foo"
  number:     SB.codeBlock2,   // 42 / 3.14 / 0xff
  constant:   SB.codeBlock2,   // true / null / UPPER_CASE
  builtin:    SB.codeBlock2,   // console / window / process
  type:       SB.codeBlock3,   // Number / User / Record<>
  classDef:   SB.codeBlock3,
  function:   SB.brandGreen,   // named functions — brand green
  method:     SB.brandGreen,
  property:   SB.fgLight,       // foo.bar — DS secondary tier (#B4B4B4) so JSON keys / props recede
  variable:   SB.fgLight,       // identifiers — DS secondary tier
  parameter:  SB.fgLight,       // params — DS secondary tier (was #C8C8C8)
  punctuation: SB.fgLight,     // braces, semicolons
  operator:   SB.codeBlock5,   // + - * = => — warm orange
  tag:        SB.codeBlock5,   // <div>
  attribute:  SB.codeBlock3,   // class=""
  comment:    SB.fgMuted,      // // line / /* block */
  docComment: SB.fgLighter,    // /** jsdoc */
  regex:      SB.codeBlock1,
  escape:     SB.codeBlock2,
  decorator:  SB.codeBlock4,
  invalid:    SB.destructive,
  heading:    SB.brandGreen,
  link:       SB.brandLink,
  // SQL-specific roles (SQL is a huge chunk of Supabase code samples)
  sqlKeyword: SB.codeBlock4,   // SELECT / INSERT / RETURNING
  sqlFn:      SB.brandGreen,   // count() / now()
  sqlString:  SB.codeBlock1,
  sqlComment: SB.fgMuted,
};

// --------- UI chrome palette --------------------------------------------
// Every slot VS Code lets us colorize that actually shows up in our preview
// or is likely to be visible day-to-day. Presets override.
const STUDIO_BRAND_CHROME = {
  editorBg:         SB.bgStudio,     // #121212
  editorFg:         SB.fg,
  sidebarBg:        SB.bgAlt,        // #0F0F0F — subtly lower than editor
  sidebarFg:        SB.fgLight,
  sidebarBorder:    SB.borderDefault,
  activityBarBg:    SB.bgAlt,
  activityBarFg:    SB.fgLighter,
  activityBarActiveFg: SB.brandGreen,
  activityBarBorder: SB.borderDefault,
  activityBarBadgeBg: SB.brandGreen,
  activityBarBadgeFg: '#0A2015',
  titleBarBg:       SB.bgAlt,
  titleBarFg:       SB.fgLight,
  statusBarBg:      SB.bgAlt,
  statusBarFg:      SB.fgLight,
  statusBarBorder:  SB.borderDefault,
  tabsBg:           SB.bgAlt,
  tabActiveBg:      SB.bgStudio,
  tabActiveFg:      SB.fg,
  tabInactiveBg:    SB.bgAlt,
  tabInactiveFg:    SB.fgLighter,
  tabBorder:        SB.borderDefault,
  tabActiveBorderTop: SB.brandGreen,
  breadcrumbFg:     SB.fgLighter,
  breadcrumbActive: SB.fgLight,
  lineNumber:       '#3A3A3A',
  lineNumberActive: SB.fgLighter,
  cursor:           SB.brandGreen,
  selectionBg:      '#2A4B3A',
  selectionHighlight: '#1F3A2C',
  findMatchBg:      '#3ECF8E2E',
  findMatchBorder:  SB.brandGreen,
  indentGuide:      '#252525',
  indentGuideActive: SB.fgMuted,
  bracketMatch:     SB.brandGreen,
  minimapBg:        SB.bgAlt,
  panelBg:          SB.bgAlt,
  panelBorder:      SB.borderDefault,
  scrollbarThumb:   '#FFFFFF0F',
  gutterAdd:        SB.brandGreen,
  gutterModify:     SB.warning,
  gutterDelete:     SB.destructive,
  focusBorder:      SB.brandGreen,
  // Bracket pair colorization (6 levels)
  bracket1: SB.brandGreen,
  bracket2: SB.codeBlock4,
  bracket3: SB.codeBlock2,
  bracket4: SB.codeBlock1,
  bracket5: SB.codeBlock5,
  bracket6: SB.codeBlock3,
};

// --------- Presets ------------------------------------------------------
const PRESETS = {
  studio: {
    name: 'Studio Dark',
    canonical: true,
    blurb: 'Exact Supabase design-system tokens. The canonical preset.',
    ansi: { ...STUDIO_BRAND_ANSI },
    syntax: { ...STUDIO_BRAND_SYNTAX },
    chrome: { ...STUDIO_BRAND_CHROME },
  },
  'deep-dark': {
    name: 'Deep Dark',
    blurb: 'Pure near-black editor. Punchier tokens.',
    ansi: {
      ...STUDIO_BRAND_ANSI,
      black: '#0A0A0A', bg: '#0A0A0A', brBlack: '#2B2B2B',
      red: '#E85F3F', yellow: '#E5A005',
    },
    syntax: { ...STUDIO_BRAND_SYNTAX },
    chrome: {
      ...STUDIO_BRAND_CHROME,
      editorBg: '#0A0A0A',
      sidebarBg: '#050505', activityBarBg: '#050505',
      titleBarBg: '#050505', statusBarBg: '#050505',
      tabsBg: '#050505', tabActiveBg: '#0A0A0A', tabInactiveBg: '#050505',
      minimapBg: '#050505', panelBg: '#050505',
      lineNumber: '#2B2B2B',
      indentGuide: '#181818',
      sidebarBorder: '#1A1A1A', activityBarBorder: '#1A1A1A',
      tabBorder: '#1A1A1A', statusBarBorder: '#1A1A1A', panelBorder: '#1A1A1A',
    },
  },
  'midnight-green': {
    name: 'Midnight Green',
    blurb: 'A tinted dark-green editor. Everything whispers Supabase.',
    ansi: {
      ...STUDIO_BRAND_ANSI,
      black: '#0A1512', bg: '#0A1512', brBlack: '#1E332B',
      fg: '#E8F5EE', white: '#A8C7B9',
      red: '#E15A3C', brRed: '#F0775D',
      cursorText: '#0A1512', selBg: '#19382D', selFg: '#E8F5EE',
      promptFg: SB.brandGreenAlt,
    },
    syntax: {
      ...STUDIO_BRAND_SYNTAX,
      function: SB.brandGreenAlt,
      method: SB.brandGreenAlt,
      variable: '#C8DDD0',
      property: '#C8DDD0',
      punctuation: '#A8C7B9',
      comment: '#4A6B5E',
      sqlFn: SB.brandGreenAlt,
    },
    chrome: {
      ...STUDIO_BRAND_CHROME,
      editorBg: '#0A1512', editorFg: '#E8F5EE',
      sidebarBg: '#07110E', activityBarBg: '#07110E',
      titleBarBg: '#07110E', statusBarBg: '#07110E',
      tabsBg: '#07110E', tabActiveBg: '#0A1512', tabInactiveBg: '#07110E',
      tabActiveFg: '#E8F5EE', tabInactiveFg: '#6F8C80',
      minimapBg: '#07110E', panelBg: '#07110E',
      sidebarFg: '#A8C7B9',
      lineNumber: '#1E332B', lineNumberActive: '#6F8C80',
      indentGuide: '#132721', indentGuideActive: '#2A4B3E',
      sidebarBorder: '#132721', activityBarBorder: '#132721',
      tabBorder: '#132721', statusBarBorder: '#132721', panelBorder: '#132721',
      selectionBg: '#19382D', selectionHighlight: '#12291F',
      activityBarFg: '#6F8C80',
    },
  },
  'high-contrast': {
    name: 'High Contrast',
    blurb: 'Maximum legibility. Bold tokens on pure black, brand green held steady.',
    ansi: {
      ...STUDIO_BRAND_ANSI,
      black: '#000000', bg: '#000000', brBlack: '#4A4A4A',
      fg: '#FFFFFF', white: '#DADADA',
      red: '#FF5C3A', yellow: '#FFB020', blue: '#B2ACFF',
      magenta: '#E3B8FF', cyan: '#8DE8D6',
      brRed: '#FF8A6F', brGreen: '#6FE8B5', brYellow: '#FFCB6B',
      brBlue: '#D7D3FF', brMagenta: '#F3DEFF', brCyan: '#B6F0E1',
      brWhite: '#FFFFFF',
      selBg: '#1F4532', selFg: '#FFFFFF',
    },
    syntax: {
      ...STUDIO_BRAND_SYNTAX,
      keyword: '#E3B8FF', storage: '#E3B8FF', controlFlow: '#E3B8FF', decorator: '#E3B8FF',
      string: '#8DE8D6', sqlString: '#8DE8D6', regex: '#8DE8D6',
      number: '#FFCB6B', constant: '#FFCB6B', builtin: '#FFCB6B', escape: '#FFCB6B',
      type: '#D7E8A0', classDef: '#D7E8A0', attribute: '#D7E8A0',
      function: SB.brandGreen, method: SB.brandGreen, heading: SB.brandGreen, sqlFn: SB.brandGreen,
      operator: '#FFA080', tag: '#FFA080',
      comment: '#707070', docComment: '#909090', sqlComment: '#707070',
      punctuation: '#DADADA', variable: '#E8E8E8', property: '#E8E8E8', parameter: '#D4D4D4',
      sqlKeyword: '#E3B8FF',
    },
    chrome: {
      ...STUDIO_BRAND_CHROME,
      editorBg: '#000000', editorFg: '#FFFFFF',
      sidebarBg: '#000000', activityBarBg: '#000000',
      titleBarBg: '#000000', statusBarBg: '#000000',
      tabsBg: '#000000', tabActiveBg: '#0A0A0A', tabInactiveBg: '#000000',
      minimapBg: '#000000', panelBg: '#000000',
      lineNumber: '#4A4A4A', lineNumberActive: '#FFFFFF',
      indentGuide: '#1F1F1F', indentGuideActive: '#5A5A5A',
      sidebarBorder: '#2A2A2A', activityBarBorder: '#2A2A2A',
      tabBorder: '#2A2A2A', statusBarBorder: '#2A2A2A', panelBorder: '#2A2A2A',
      selectionBg: '#1F4532', selectionHighlight: '#153B26',
      bracket1: SB.brandGreen, bracket2: '#E3B8FF', bracket3: '#FFCB6B',
      bracket4: '#8DE8D6', bracket5: '#FFA080', bracket6: '#D7E8A0',
    },
  },
  'classic-dark': {
    name: 'Classic Dark',
    blurb: 'Slate-tinted dark. Cool-gray chrome with brand green holding the accent.',
    ansi: {
      ...STUDIO_BRAND_ANSI,
      black: '#0F1115', bg: '#0F1115', brBlack: '#2A2E38',
      fg: '#FAFAFA', white: '#AFB4BE',
      red: '#E15A3C', brRed: '#F07960',
      cursorText: '#0A2015', selBg: '#1E2634', selFg: '#FAFAFA',
      promptFg: SB.brandGreen,
    },
    syntax: {
      ...STUDIO_BRAND_SYNTAX,
      // Cool-gray neutrals so JSON keys / identifiers recede against slate
      variable: '#AFB4BE',
      property: '#AFB4BE',
      parameter: '#C6CBD4',
      punctuation: '#AFB4BE',
      comment: '#5A6070',
      docComment: '#828791',
      sqlComment: '#5A6070',
    },
    chrome: {
      ...STUDIO_BRAND_CHROME,
      editorBg: '#0F1115', editorFg: '#FAFAFA',
      sidebarBg: '#0C0E12', activityBarBg: '#0C0E12',
      titleBarBg: '#0C0E12', statusBarBg: '#0C0E12',
      tabsBg: '#0C0E12', tabActiveBg: '#171A20', tabInactiveBg: '#0C0E12',
      tabActiveFg: '#FAFAFA', tabInactiveFg: '#828791',
      minimapBg: '#0C0E12', panelBg: '#0C0E12',
      sidebarFg: '#AFB4BE',
      statusBarFg: '#AFB4BE',
      breadcrumbFg: '#828791', breadcrumbActive: '#AFB4BE',
      lineNumber: '#2A2E38', lineNumberActive: '#AFB4BE',
      indentGuide: '#181B22', indentGuideActive: '#3A3F4B',
      sidebarBorder: '#1A1D24', activityBarBorder: '#1A1D24',
      tabBorder: '#1A1D24', statusBarBorder: '#1A1D24', panelBorder: '#1A1D24',
      selectionBg: '#1E2634', selectionHighlight: '#161C28',
      activityBarFg: '#6B7180',
    },
  },
  'mono-green': {
    name: 'Monochrome + Green',
    blurb: 'Grayscale syntax. Brand green is the only hue anywhere.',
    ansi: {
      black: '#0D0D0D', red: '#8A8A8A', green: SB.brandGreen, yellow: '#A8A8A8',
      blue: '#9A9A9A', magenta: '#9A9A9A', cyan: '#A0A0A0', white: SB.fgLight,
      brBlack: '#3A3A3A', brRed: '#B8B8B8', brGreen: SB.brandGreenAlt, brYellow: '#C8C8C8',
      brBlue: '#B0B0B0', brMagenta: '#B0B0B0', brCyan: '#C0C0C0', brWhite: SB.fg,
      fg: SB.fg, bg: '#0D0D0D',
      cursor: SB.brandGreen, cursorText: '#0A2015',
      selBg: '#262626', selFg: SB.fg, promptFg: SB.brandGreen,
    },
    syntax: {
      keyword: SB.brandGreen, storage: SB.brandGreen, controlFlow: SB.brandGreen, decorator: SB.brandGreen,
      string: '#B8B8B8', sqlString: '#B8B8B8', regex: '#B8B8B8',
      number: '#D4D4D4', constant: '#D4D4D4', builtin: '#D4D4D4', escape: '#D4D4D4',
      type: '#A8A8A8', classDef: '#A8A8A8', attribute: '#A8A8A8',
      function: SB.brandGreen, method: SB.brandGreen, heading: SB.brandGreen,
      operator: '#8A8A8A', tag: '#8A8A8A', punctuation: '#6A6A6A',
      comment: '#5A5A5A', docComment: '#707070', sqlComment: '#5A5A5A',
      variable: '#D4D4D4', property: '#D4D4D4', parameter: '#C0C0C0',
      sqlKeyword: SB.brandGreen, sqlFn: SB.brandGreen,
      invalid: '#A8A8A8', link: SB.brandGreen,
    },
    chrome: {
      ...STUDIO_BRAND_CHROME,
      editorBg: '#0D0D0D', editorFg: SB.fg,
      sidebarBg: '#0A0A0A', activityBarBg: '#0A0A0A',
      titleBarBg: '#0A0A0A', statusBarBg: '#0A0A0A',
      tabsBg: '#0A0A0A', tabActiveBg: '#0D0D0D', tabInactiveBg: '#0A0A0A',
      tabActiveFg: SB.fg,
      minimapBg: '#0A0A0A', panelBg: '#0A0A0A',
      lineNumber: '#3A3A3A', lineNumberActive: SB.fgLight,
      indentGuide: '#1A1A1A', indentGuideActive: '#4A4A4A',
      sidebarBorder: '#1C1C1C', activityBarBorder: '#1C1C1C',
      tabBorder: '#1C1C1C', statusBarBorder: '#1C1C1C', panelBorder: '#1C1C1C',
      selectionBg: '#262626', selectionHighlight: '#1D1D1D',
      bracket1: SB.brandGreen, bracket2: '#8A8A8A', bracket3: SB.fgLight,
      bracket4: '#707070', bracket5: '#B8B8B8', bracket6: '#5A5A5A',
      activityBarFg: SB.fgLighter, sidebarFg: SB.fgLight,
      statusBarFg: SB.fgLight, tabInactiveFg: SB.fgLighter,
    },
  },
};

// --------- Color helpers (same as terminal) -----------------------------
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

// ANSI mood (same logic as terminal kit — so the VS Code terminal matches perfectly)
function applyMoodAnsi(ansi, mood) {
  const out = { ...ansi };
  const KEYS = ['red','green','yellow','blue','magenta','cyan',
                'brRed','brGreen','brYellow','brBlue','brMagenta','brCyan'];
  if (mood === 'brand') return out;
  if (mood === 'vibrant') {
    for (const k of KEYS) { const br = k.startsWith('br'); out[k] = adjustSL(ansi[k], br?1.1:1.25, 1.0, br?0:0.02); }
    out.green = BRAND_GREEN; out.brGreen = BRAND_GREEN_ALT;
  } else if (mood === 'muted') {
    for (const k of KEYS) out[k] = adjustSL(ansi[k], 0.6, 0.92, 0);
    out.green = adjustSL(BRAND_GREEN, 0.8, 0.95); out.brGreen = adjustSL(BRAND_GREEN_ALT, 0.8, 0.95);
  } else if (mood === 'pastel') {
    const fg = ansi.fg || '#EDEDED';
    for (const k of KEYS) { const lifted = adjustSL(ansi[k], 0.75, 1.0, 0.12); out[k] = mix(lifted, fg, 0.08); }
    out.green = mix(adjustSL(BRAND_GREEN, 0.85, 1.0, 0.08), fg, 0.08);
    out.brGreen = mix(adjustSL(BRAND_GREEN_ALT, 0.85, 1.0, 0.06), fg, 0.08);
  } else if (mood === 'mono-green') {
    for (const k of KEYS) out[k] = grayscale(ansi[k]);
    out.green = BRAND_GREEN; out.brGreen = BRAND_GREEN_ALT;
  }
  return out;
}

// Syntax mood — same energy applied to syntax roles.
// brand is identity; other moods transform every colored token.
function applyMoodSyntax(syntax, mood, editorFg) {
  const out = { ...syntax };
  const COLORED = ['keyword','storage','controlFlow','string','number','constant',
                   'builtin','type','classDef','function','method','operator',
                   'tag','attribute','regex','escape','decorator','heading',
                   'docComment','sqlKeyword','sqlFn','sqlString','link'];
  if (mood === 'brand') return out;

  const applyOne = (hex) => {
    if (mood === 'vibrant') return adjustSL(hex, 1.25, 1.0, 0.02);
    if (mood === 'muted')   return adjustSL(hex, 0.55, 0.9);
    if (mood === 'pastel')  return mix(adjustSL(hex, 0.75, 1.0, 0.1), editorFg || '#FAFAFA', 0.1);
    if (mood === 'mono-green') return grayscale(hex);
    return hex;
  };

  for (const k of COLORED) if (syntax[k]) out[k] = applyOne(syntax[k]);

  // Brand green always wins in the brand-green slot for non-mono moods.
  if (mood !== 'muted' && mood !== 'mono-green') {
    // Function stays brand-recognizable
    out.function = BRAND_GREEN;
    out.method = BRAND_GREEN;
    out.sqlFn = BRAND_GREEN;
    out.heading = BRAND_GREEN;
    out.link = SB.brandLink;
  }
  if (mood === 'mono-green') {
    out.function = BRAND_GREEN; out.method = BRAND_GREEN;
    out.keyword = BRAND_GREEN;  out.storage = BRAND_GREEN;
    out.controlFlow = BRAND_GREEN; out.decorator = BRAND_GREEN;
    out.sqlKeyword = BRAND_GREEN; out.sqlFn = BRAND_GREEN;
    out.heading = BRAND_GREEN; out.link = BRAND_GREEN;
  }
  return out;
}

// --------- Keyword-hue override -----------------------------------------
// Shifts which code-block slot drives keyword-like tokens.
function applyKeywordHue(syntax, hue) {
  const out = { ...syntax };
  const map = {
    violet: SB.codeBlock4, // default
    green:  SB.brandGreen,
    amber:  SB.codeBlock2,
    teal:   SB.codeBlock1,
    orange: SB.codeBlock5,
    lime:   SB.codeBlock3,
  };
  const hex = map[hue];
  if (!hex) return out;
  out.keyword = hex; out.storage = hex; out.controlFlow = hex;
  out.decorator = hex; out.sqlKeyword = hex;
  return out;
}

// --------- Resolve full theme given state ------------------------------
function resolveTheme(state) {
  const preset = PRESETS[state.preset] || PRESETS.studio;

  let ansi = applyMoodAnsi(preset.ansi, state.mood);
  let syntax = applyMoodSyntax(preset.syntax, state.mood, preset.chrome.editorFg);
  syntax = applyKeywordHue(syntax, state.keywordHue);

  const chrome = { ...preset.chrome };

  // Cursor color override
  if (state.cursorColor === 'white') chrome.cursor = preset.chrome.editorFg;
  else if (state.cursorColor === 'inverse') chrome.cursor = mix(preset.chrome.editorFg, preset.chrome.editorBg, 0.2);
  // else 'green' — leave as preset default

  // Activity bar accent
  if (state.activityAccent === 'subtle') {
    chrome.activityBarActiveFg = preset.chrome.editorFg;
    chrome.activityBarBadgeBg = preset.chrome.editorFg;
    chrome.activityBarBadgeFg = preset.chrome.editorBg;
  } else if (state.activityAccent === 'hidden') {
    chrome.activityBarActiveFg = preset.chrome.sidebarFg;
  }

  // Sidebar contrast
  if (state.sidebarContrast === 'raised') {
    chrome.sidebarBg = mix(preset.chrome.sidebarBg, '#FFFFFF', 0.035);
    chrome.activityBarBg = mix(preset.chrome.activityBarBg, '#FFFFFF', 0.025);
  }

  // Status bar emphasis
  if (state.statusBarEmphasis === 'brand') {
    chrome.statusBarBg = BRAND_GREEN;
    chrome.statusBarFg = '#0A2015';
    chrome.statusBarBorder = BRAND_GREEN;
  }

  return { preset, ansi, syntax, chrome };
}

// Expose
window.SB = SB;
window.PRESETS = PRESETS;
window.resolveTheme = resolveTheme;
window.__colorHelpers = { hexToRgb, rgbToHex, hexToHsl, hslToHex, mix, adjustSL, grayscale };
