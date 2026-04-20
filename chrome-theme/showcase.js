// ============================================================
// Supabase Chrome Theme — BUILDER (real-Chrome edition)
// Only includes controls Chrome themes actually support.
// ============================================================

const PRESETS = {
  'studio-dark': {
    name: 'Studio Dark',
    frameBg: '#121212', frameBgInactive: '#0f0f0f',
    toolbarBg: '#1f1f1f', omniboxBg: '#171717',
    ntpBg: '#121212',
    tabText: '#fafafa', tabBgText: '#898989', bookmarkText: '#b4b4b4',
    defaults: { pattern: 'dotted', glow: true, accent: 'medium' },
  },
  'deep-dark': {
    name: 'Deep Dark',
    frameBg: '#0a0a0a', frameBgInactive: '#050505',
    toolbarBg: '#121212', omniboxBg: '#0a0a0a',
    ntpBg: '#0a0a0a',
    tabText: '#fafafa', tabBgText: '#898989', bookmarkText: '#b4b4b4',
    defaults: { pattern: 'dotted', glow: true, accent: 'medium' },
  },
  'classic-dark': {
    name: 'Classic Dark',
    frameBg: '#0f1115', frameBgInactive: '#0c0e12',
    toolbarBg: '#171a20', omniboxBg: '#12141a',
    ntpBg: '#0f1115',
    tabText: '#fafafa', tabBgText: '#828791', bookmarkText: '#afb4be',
    defaults: { pattern: 'dotted', glow: false, accent: 'subtle' },
  },
  'midnight-green': {
    name: 'Midnight Green',
    frameBg: '#0a1512', frameBgInactive: '#081512',
    toolbarBg: '#0f1d19', omniboxBg: '#0c1814',
    ntpBg: '#0a1512',
    tabText: '#fafafa', tabBgText: '#7d9b8c', bookmarkText: '#afc3b9',
    defaults: { pattern: 'dotted', glow: true, accent: 'loud' },
  },
  'high-contrast': {
    name: 'High Contrast',
    frameBg: '#000000', frameBgInactive: '#000000',
    toolbarBg: '#0a0a0a', omniboxBg: '#000000',
    ntpBg: '#000000',
    tabText: '#ffffff', tabBgText: '#9a9a9a', bookmarkText: '#dadada',
    defaults: { pattern: 'blank', glow: false, accent: 'loud' },
  },
  'mono-green': {
    name: 'Monochrome + Green',
    frameBg: '#0d0d0d', frameBgInactive: '#0a0a0a',
    toolbarBg: '#141414', omniboxBg: '#0d0d0d',
    ntpBg: '#0d0d0d',
    tabText: '#ededed', tabBgText: '#8a8a8a', bookmarkText: '#cfcfcf',
    defaults: { pattern: 'dotted', glow: true, accent: 'medium' },
  },
};

const BOLT_SVG = `<svg viewBox="0 0 109 113" fill="none" aria-hidden="true">
  <path d="M63.71 110.28C60.85 113.89 55.05 111.91 54.98 107.31L53.97 40.06H99.19C107.38 40.06 111.95 49.52 106.86 55.94L63.71 110.28Z" fill="#249361"/>
  <path d="M45.32 2.07C48.18 -1.53 53.97 0.44 54.04 5.04L54.48 72.29H9.83C1.64 72.29 -2.93 62.83 2.17 56.42L45.32 2.07Z" fill="#3ECF8E"/>
</svg>`;

const FAVICONS = {
  supabase: BOLT_SVG,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.67 5.58.67 11.85c0 5.01 3.24 9.26 7.74 10.76.57.1.78-.25.78-.55 0-.27-.01-.99-.02-1.94-3.15.68-3.81-1.52-3.81-1.52-.51-1.31-1.26-1.66-1.26-1.66-1.03-.71.08-.69.08-.69 1.14.08 1.74 1.18 1.74 1.18 1.01 1.74 2.66 1.24 3.31.95.1-.74.4-1.24.72-1.52-2.51-.29-5.15-1.27-5.15-5.65 0-1.25.44-2.27 1.17-3.07-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.14 1.17a10.9 10.9 0 012.86-.39c.97.01 1.95.13 2.86.39 2.18-1.48 3.14-1.17 3.14-1.17.62 1.58.23 2.74.11 3.03.73.8 1.17 1.82 1.17 3.07 0 4.39-2.65 5.36-5.17 5.64.41.36.77 1.06.77 2.13 0 1.54-.01 2.78-.01 3.16 0 .3.21.66.79.55 4.5-1.5 7.73-5.76 7.73-10.76C23.33 5.58 18.27.5 12 .5z"/></svg>`,
  linear: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.4 15.6A11.99 11.99 0 008.4 23.6L.4 15.6zM.05 12.34l11.61 11.61c1.1.08 2.19.02 3.25-.17L.22 9.09c-.19 1.06-.25 2.15-.17 3.25z"/></svg>`,
  docs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>`,
};

// ============================================================
// State
// ============================================================
const DEFAULT_STATE = {
  preset: 'studio-dark',
  pattern: 'dotted',  // dotted | diagonal | sheen | blank
  glow: 'on',         // on | off   (green radial glow from top, carries through NTP)
  accent: 'medium',   // subtle | medium | loud
};
let state = { ...DEFAULT_STATE };

function encodeState(s) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(s)) params.set(k, v);
  return params.toString();
}
function decodeState() {
  const hash = (location.hash || '').replace(/^#/, '');
  const qs = hash.startsWith('build?') ? hash.slice('build?'.length) : '';
  if (!qs) return null;
  const params = new URLSearchParams(qs);
  const out = { ...DEFAULT_STATE };
  for (const k of Object.keys(DEFAULT_STATE)) {
    const v = params.get(k);
    if (v) out[k] = v;
  }
  return out;
}
function pushHash() { history.replaceState(null, '', '#build?' + encodeState(state)); }
function accentLevel() { return { subtle: 0.5, medium: 1.0, loud: 1.8 }[state.accent] || 1.0; }

// ============================================================
// PATTERN PAINTING — shared between live preview (CSS) and PNG bake (Canvas)
// ============================================================

// Resolve --brand-default (stored as "H S% L%" on :root) to a literal triple.
// Canvas color parsers don't understand var(), so we bake the value at startup.
const BRAND_HSL = (() => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--brand-default').trim();
  return raw || '153.1deg 60.2% 52.7%'; // fallback matches shared/colors_and_type.css
})();
const brandA = (alpha) => `hsl(${BRAND_HSL} / ${alpha})`;

function paintPatternToCanvas(ctx, w, h, opts) {
  // opts: { pattern, accent (number), bgHex, glow (bool), glowOriginY (px from top where glow peaks), glowRadius (px) }
  ctx.fillStyle = opts.bgHex;
  ctx.fillRect(0, 0, w, h);
  const a = opts.accent;
  if (opts.pattern === 'dotted') {
    // 40px accent grid + 20px neutral grid, both anchored to (10,10), tiny dots
    const accentAlpha = 0.04 + 0.08 * a;
    const dotAlpha    = 0.05 + 0.05 * a;
    for (let y = 10; y < h; y += 20) {
      for (let x = 10; x < w; x += 20) {
        const onAccent = (x % 40 === 10) && (y % 40 === 10);
        ctx.fillStyle = onAccent
          ? brandA(accentAlpha.toFixed(3))
          : `rgba(255,255,255,${dotAlpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (opts.pattern === 'diagonal') {
    const lineAlpha = 0.03 + 0.03 * a;
    ctx.strokeStyle = brandA(lineAlpha.toFixed(3));
    ctx.lineWidth = 1;
    const step = 8;
    for (let i = -h; i < w + h; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
  } else if (opts.pattern === 'sheen') {
    // Top-edge sheen — a crisp 2px highlight line along the top, fading rapidly.
    // Gives the frame a subtle bevelled, metallic feel without drawing attention to itself.
    const sheenAlpha = 0.18 + 0.10 * a; // 0.23 subtle → 0.36 loud
    const grad = ctx.createLinearGradient(0, 0, 0, Math.min(h, 60));
    grad.addColorStop(0,     `rgba(255,255,255,${sheenAlpha})`);
    grad.addColorStop(0.06,  `rgba(255,255,255,${(sheenAlpha * 0.4).toFixed(3)})`);
    grad.addColorStop(0.35,  'rgba(255,255,255,0.02)');
    grad.addColorStop(1,     'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, Math.min(h, 60));
  }
  // 'blank' = nothing extra

  // GLOW — green glow from top center, scaled by accent intensity.
  // We want a wide-and-short ellipse (like the CSS preview's `ellipse 120% 80%`).
  // Canvas radial gradients are circular, so we paint into a scaled context.
  if (opts.glow) {
    ctx.save();
    const ellipseW = w * 1.2;         // horizontal radius
    const ellipseH = (opts.glowRadius ?? Math.max(w, h) * 0.9); // vertical radius
    const scaleX = ellipseW / ellipseH; // stretch horizontally so circle -> ellipse
    const cx = w / 2;
    const cy = opts.glowOriginY ?? 0;
    const glowAlpha = 0.10 + 0.18 * a;
    // Translate to center, scale, translate back
    ctx.translate(cx, cy);
    ctx.scale(scaleX, 1);
    ctx.translate(-cx, -cy);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, ellipseH);
    g.addColorStop(0,    brandA(glowAlpha.toFixed(3)));
    g.addColorStop(0.35, brandA((glowAlpha * 0.35).toFixed(3)));
    g.addColorStop(1,    brandA(0));
    ctx.fillStyle = g;
    // Fill a generous rect (accounting for scale)
    ctx.fillRect(-w, -h, w * 3, h * 3);
    ctx.restore();
  }
}

// CSS version (used in the live preview only; mirrors the canvas painter at low fidelity).
// originY: glow origin in % relative to this surface's height (0 = top, negative = above the top edge so glow peaks offstage)
function patternCss(p, a, originYPct) {
  const accentAlpha = (0.04 + 0.08 * a).toFixed(3);
  const dotAlpha    = (0.05 + 0.05 * a).toFixed(3);
  const layers = [];
  const sizes = [];
  const positions = [];
  const repeats = [];

  // Glow layer FIRST so the dots/lines sit on top
  if (state.glow === 'on') {
    const glowAlpha = (0.10 + 0.18 * a).toFixed(3);
    const oy = originYPct ?? 0;
    layers.push(`radial-gradient(ellipse 120% 80% at 50% ${oy}%, ${brandA(glowAlpha)}, ${brandA(0)} 60%)`);
    sizes.push('100% 100%');
    positions.push('0 0');
    repeats.push('no-repeat');
  }

  if (state.pattern === 'dotted') {
    layers.push(`radial-gradient(circle at 10px 10px, ${brandA(accentAlpha)} 0.6px, transparent 1.1px)`);
    layers.push(`radial-gradient(circle at 10px 10px, rgba(255,255,255,${dotAlpha}) 0.6px, transparent 1.1px)`);
    sizes.push('40px 40px', '20px 20px');
    positions.push('0 0', '0 0');
    repeats.push('repeat', 'repeat');
  } else if (state.pattern === 'diagonal') {
    const la = (0.03 + 0.03 * a).toFixed(3);
    layers.push(`repeating-linear-gradient(135deg, transparent 0 7px, ${brandA(la)} 7px 8px)`);
    sizes.push('auto');
    positions.push('0 0');
    repeats.push('repeat');
  } else if (state.pattern === 'sheen') {
    const sheenAlpha = (0.18 + 0.10 * a).toFixed(3);
    // 60px tall sheen starting from the top — crisp hairline that fades rapidly.
    layers.push(`linear-gradient(180deg, rgba(255,255,255,${sheenAlpha}) 0, rgba(255,255,255,${(0.18 + 0.10 * a) * 0.4}) 2px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0) 60px)`);
    sizes.push('100% 60px');
    positions.push('0 0');
    repeats.push('no-repeat');
  }

  if (!layers.length) return '';
  return `background-image: ${layers.join(', ')};
          background-size: ${sizes.join(', ')};
          background-position: ${positions.join(', ')};
          background-repeat: ${repeats.join(', ')};`;
}

// ============================================================
// LIVE PREVIEW — chrome view (mock browser) and ntp view (default Chrome NTP mock)
// ============================================================
function buildPreview() {
  const p = PRESETS[state.preset];
  const a = accentLevel();
  // Frame is short (~80px tall); glow origin sits at 0% (top) and radiates down.
  const framePatternCSS = patternCss(p, a, 0);
  // NTP body sits just below the frame; glow origin slightly above its top edge so the
  // two halves meet seamlessly at the bookmark bar.
  const ntpBgCss = patternCss(p, a, -10);

  const tabs = [
    { title: 'New Tab',         favicon: BOLT_SVG, active: true },
    { title: 'supabase/supabase', favicon: FAVICONS.github },
    { title: 'ENG-2391',          favicon: FAVICONS.linear },
    { title: 'Docs · RLS',        favicon: FAVICONS.docs },
  ];
  const tabsHtml = tabs.map(t => `
    <div class="tab ${t.active ? 'active' : 'inactive'}" data-style="top-border">
      <span class="favicon">${t.favicon}</span><span>${t.title}</span>
    </div>`).join('') + `<span class="tab-new">＋</span>`;
  const bookmarks = [
    { title: 'Supabase', favicon: FAVICONS.supabase },
    { title: 'GitHub',   favicon: FAVICONS.github },
    { title: 'Linear',   favicon: FAVICONS.linear },
    { title: 'Docs',     favicon: FAVICONS.docs },
  ];
  const bookmarksHtml = bookmarks.map(b => `
    <span class="bookmark"><span class="favicon">${b.favicon}</span><span>${b.title}</span></span>`).join('');

  return `
    <div class="browser" style="--toolbar-bg:${p.toolbarBg};--omnibox-bg:${p.omniboxBg};--tab-bg-text:${p.tabBgText};--bookmark-text:${p.bookmarkText};--ntp-bg:${p.ntpBg};">
      <div class="browser-frame" style="background-color:${p.frameBg};${framePatternCSS}">
        <div class="traffic"><span></span><span></span><span></span></div>
        <div class="tabs">${tabsHtml}</div>
      </div>
      <div class="toolbar-row" style="background:${p.toolbarBg};">
        <span class="ctl-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg></span>
        <span class="ctl-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></span>
        <span class="ctl-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0114.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0020.5 15"/></svg></span>
        <span class="omnibox" style="background:${p.omniboxBg}; color:${p.bookmarkText}; opacity:0.75;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px; opacity:0.7;"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          Search Google or type a URL
        </span>
      </div>
      <div class="bookmark-bar" style="background:${p.toolbarBg};">${bookmarksHtml}</div>
      <div style="position:relative; background:${p.ntpBg}; ${ntpBgCss} height: 360px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <div style="position:relative; z-index:1; text-align:center; color:#fff; display:flex; flex-direction:column; align-items:center;">
          <div style="font:500 64px/1 var(--font-sans); letter-spacing:-0.03em; opacity:0.85;">Google</div>
          <div style="margin-top:24px; width:520px; max-width:80vw; padding:12px 18px; border-radius: 999px; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); display:inline-flex; align-items:center; gap:10px; color:rgba(255,255,255,0.5); font-size:13px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            Search Google or type a URL
          </div>
        </div>
      </div>
    </div>`;
}

function buildNtpPreview(p, a) {
  // Mock the *real* Chrome NTP: centered "Google" wordmark, fake search bar, on top of our painted ntp_background.
  // Frame glow peaks offstage above the NTP (since glow originates from the top of the browser frame).
  const frameCssForNtp = patternCss(p, a, -30);
  // NTP uses the same pattern+glow, with the glow origin sitting just above its top edge
  // so it meets the frame glow at the seam.
  const ntpBgCss = patternCss(p, a, -10);
  const tabsHtml = `
    <div class="tab active" data-style="top-border"><span class="favicon">${BOLT_SVG}</span><span>New Tab</span></div>
    <div class="tab inactive" data-style="top-border"><span class="favicon">${FAVICONS.docs}</span><span>Docs</span></div>
    <span class="tab-new">＋</span>`;
  return `
    <div class="browser" style="--toolbar-bg:${p.toolbarBg};--omnibox-bg:${p.omniboxBg};--tab-bg-text:${p.tabBgText};--bookmark-text:${p.bookmarkText};--ntp-bg:${p.ntpBg};">
      <div class="browser-frame" style="background-color:${p.frameBg};${frameCssForNtp}">
        <div class="traffic"><span></span><span></span><span></span></div>
        <div class="tabs">${tabsHtml}</div>
      </div>
      <div class="toolbar-row" style="background:${p.toolbarBg};">
        <span class="omnibox" style="background:${p.omniboxBg}; color:${p.bookmarkText};">
          <span class="lock" style="color:var(--brand)">●</span> chrome://newtab
        </span>
      </div>
      <div style="position:relative; background:${p.ntpBg}; ${ntpBgCss} height: 360px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <div style="position:relative; z-index:1; text-align:center; color:#fff; display:flex; flex-direction:column; align-items:center;">
          <div style="font:500 64px/1 var(--font-sans); letter-spacing:-0.03em; opacity:0.85;">Google</div>
          <div style="margin-top:24px; width:520px; max-width:80vw; padding:12px 18px; border-radius: 999px; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); display:inline-flex; align-items:center; gap:10px; color:rgba(255,255,255,0.5); font-size:13px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            Search Google or type a URL
          </div>
        </div>
      </div>
    </div>`;
}

// ============================================================
// Controls
// ============================================================
function buildControls() {
  const rows = [
    { id: 'preset', name: 'Background', desc: 'Base colors for frame, toolbar, omnibox and new tab.',
      hint: PRESETS[state.preset].name,
      variant: 'swatches',
      options: [
        ['studio-dark','Studio Dark','#121212'],
        ['deep-dark','Deep Dark','#0a0a0a'],
        ['classic-dark','Classic Dark','#171a20'],
        ['midnight-green','Midnight Green','#0f1d19'],
        ['high-contrast','High Contrast','#000000'],
        ['mono-green','Mono + Green','#0d0d0d'],
      ] },
    { id: 'pattern', name: 'Frame pattern', desc: 'Texture baked into the tabstrip background.',
      hint: state.pattern,
      options: [['dotted','dotted'],['diagonal','diagonal'],['sheen','sheen'],['blank','blank']] },
    { id: 'glow', name: 'Green glow', desc: 'Radial brand glow from the top of the frame, carries into the new tab.',
      hint: state.glow,
      options: [['on','on'],['off','off']] },
    { id: 'accent', name: 'Accent intensity', desc: 'Scales the brand-green dot opacity in the frame pattern.',
      hint: state.accent,
      options: [['subtle','subtle'],['medium','medium'],['loud','loud']] },
  ];
  return rows.map(r => `
    <div class="control ${r.disabled ? 'is-disabled' : ''}">
      <div class="control-label"><span class="name">${r.name}</span><span class="hint">${r.hint}</span></div>
      <p class="control-desc">${r.desc}</p>
      ${r.variant === 'swatches' ? `
      <div class="seg-swatches" data-control="${r.id}">
        ${r.options.map(opt => {
          const [v, l, sw] = opt;
          return `<button data-value="${v}" ${r.disabled?'disabled':''} class="${state[r.id]===v?'is-on':''}">
            <span class="seg-swatches-chip" style="--chip-bg:${sw}"></span>
            <span class="seg-swatches-label">${l}</span>
          </button>`;
        }).join('')}
      </div>` : `
      <div class="seg" data-control="${r.id}">
        ${r.options.map(opt => {
          const [v, l, sw] = opt;
          const swHtml = sw ? `<span class="seg-swatch" style="background:${sw}"></span>` : '';
          return `<button data-value="${v}" ${r.disabled?'disabled':''} class="${state[r.id]===v?'is-on':''}">${swHtml}${l}</button>`;
        }).join('')}
      </div>`}
    </div>`).join('');
}

function buildConfigSummary() {
  const parts = [
    ['preset', state.preset],
    ['pattern', state.pattern],
    ['glow', state.glow],
    ['accent', state.accent],
  ];
  return parts.map(([k,v]) => `<span class="k">${k}:</span> <span class="v">${v}</span>`).join(' &nbsp;·&nbsp; ');
}

function render() {
  document.getElementById('previewMount').innerHTML = buildPreview();
  document.getElementById('builderControls').innerHTML = buildControls();
  document.getElementById('configSummary').innerHTML = buildConfigSummary();
  wireControls();
  pushHash();
}
function wireControls() {
  document.querySelectorAll('#builderControls .seg, #builderControls .seg-swatches').forEach(seg => {
    seg.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        state[seg.dataset.control] = btn.dataset.value;
        render();
      });
    });
  });
}

// Copy URL
document.getElementById('copyUrlBtn').addEventListener('click', async () => {
  const url = `${location.origin}${location.pathname}#build?${encodeState(state)}`;
  try { await navigator.clipboard.writeText(url); } catch (e) {}
  const lbl = document.getElementById('copyUrlLabel');
  const btn = document.getElementById('copyUrlBtn');
  const original = lbl.textContent;
  lbl.textContent = 'copied ✓';
  btn.classList.add('is-flashed');
  setTimeout(() => { lbl.textContent = original; btn.classList.remove('is-flashed'); }, 1400);
});

// ============================================================
// PNG BAKING
// ============================================================
function bakeFramePng() {
  // Chrome theme_frame.png — paint the pattern + glow over frameBg.
  // Glow originates at top center and radiates down.
  const w = 1100, h = 220;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  paintPatternToCanvas(ctx, w, h, {
    pattern: state.pattern,
    accent: accentLevel(),
    bgHex: PRESETS[state.preset].frameBg,
    glow: state.glow === 'on',
    glowOriginY: -20,  // peak just above the top edge, like the CSS preview
    glowRadius: h * 2.5, // concentrated at top; fades before reaching bottom
  });
  return canvas;
}
function bakeToolbarPng() {
  const canvas = document.createElement('canvas');
  canvas.width = 1100; canvas.height = 80;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = PRESETS[state.preset].toolbarBg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}
function bakeNtpPng() {
  // Single-monitor 1080p (1920×1080). Chrome renders the image at native pixel size on the NTP and
  // crops/centers — a wider canvas just means the visible browser window sees a narrow vertical
  // slice of the glow, which made the peak look mid-page. At 1920 wide the glow column covers the
  // whole visible width properly, with the peak anchored near the top as designed.
  const w = 1920, h = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const p = PRESETS[state.preset];
  ctx.fillStyle = p.ntpBg;
  ctx.fillRect(0, 0, w, h);
  paintPatternToCanvas(ctx, w, h, {
    pattern: state.pattern,
    accent: accentLevel(),
    bgHex: p.ntpBg,
    glow: state.glow === 'on',
    glowOriginY: -120,    // peak offstage above top edge
    glowRadius: h * 0.85, // concentrated near the top; faded well before bottom
  });
  return canvas;
}

// 1×1 colored PNG helper for icons
function bakeIconPng(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = PRESETS[state.preset].frameBg;
  ctx.fillRect(0, 0, size, size);
  // Centered bolt
  const boltSize = size * 0.62;
  drawBolt(ctx, (size - boltSize) / 2, (size - boltSize) / 2, boltSize, boltSize);
  return canvas;
}

function drawBolt(ctx, x, y, w, h) {
  // Scale 109×113 viewBox to (w,h)
  const sx = w / 109, sy = h / 113;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  // Dark green half (right)
  ctx.fillStyle = '#249361';
  let p = new Path2D('M63.71 110.28C60.85 113.89 55.05 111.91 54.98 107.31L53.97 40.06H99.19C107.38 40.06 111.95 49.52 106.86 55.94L63.71 110.28Z');
  ctx.fill(p);
  // Bright green half (left)
  ctx.fillStyle = '#3ECF8E';
  p = new Path2D('M45.32 2.07C48.18 -1.53 53.97 0.44 54.04 5.04L54.48 72.29H9.83C1.64 72.29 -2.93 62.83 2.17 56.42L45.32 2.07Z');
  ctx.fill(p);
  ctx.restore();
}

function canvasToBlob(canvas) {
  return new Promise(res => canvas.toBlob(b => res(b), 'image/png'));
}

// ============================================================
// Manifest + download
// ============================================================
function buildManifest() {
  const p = PRESETS[state.preset];
  const rgb = (hex) => {
    const h = hex.replace('#','');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  };
  return JSON.stringify({
    manifest_version: 3,
    version: '1.0.0',
    name: `Supabase — ${p.name} (Custom)`,
    description: `Custom Supabase Chrome theme · pattern:${state.pattern} · glow:${state.glow} · accent:${state.accent}`,
    icons: { '16':'icons/icon16.png','32':'icons/icon32.png','48':'icons/icon48.png','128':'icons/icon128.png' },
    theme: {
      images: {
        theme_frame:           'images/theme_frame.png',
        theme_toolbar:         'images/theme_toolbar.png',
        theme_ntp_background:  'images/theme_ntp_background.png',
      },
      colors: {
        frame:               rgb(p.frameBg),
        frame_inactive:      rgb(p.frameBgInactive),
        toolbar:             rgb(p.toolbarBg),
        tab_text:            rgb(p.tabText),
        tab_background_text: rgb(p.tabBgText),
        bookmark_text:       rgb(p.bookmarkText),
        ntp_background:      rgb(p.ntpBg),
        ntp_text:            [250,250,250],
        ntp_link:            [62,207,142],
        button_background:   rgb(p.toolbarBg),
        omnibox_background:  rgb(p.omniboxBg),
        omnibox_text:        [250,250,250],
      },
      tints: { buttons: [-1, -1, 0.85] },
      properties: {
        // Huge top-aligned image means the glow sits at the top-center on any display.
        // `no-repeat` + `ntp_background` color covers anything outside the 7680px span.
        ntp_background_alignment: 'top',
        ntp_background_repeat: 'no-repeat',
      },
    },
    _build_settings_visible_in_readme: true,
  }, null, 2);
}
function buildReadme() {
  return [
    `Supabase Chrome Theme — ${PRESETS[state.preset].name} (Custom build)`,
    `=====================================`,
    ``,
    `Build settings:`,
    ...Object.entries(state).map(([k,v]) => `  ${k}: ${v}`),
    ``,
    `INSTALL`,
    `1. Unzip somewhere stable (~/chrome-themes/supabase-${state.preset} is good).`,
    `2. Open chrome://extensions → toggle Developer mode → Load unpacked → pick the folder.`,
    `3. Reset via Settings → Appearance → Reset to default.`,
  ].join('\n');
}

document.getElementById('downloadBtn').addEventListener('click', async () => {
  const btn = document.getElementById('downloadBtn');
  btn.disabled = true;
  try {
    if (typeof JSZip === 'undefined') throw new Error('JSZip not loaded');
    const zip = new JSZip();
    const folderName = `supabase-${state.preset}-theme`;
    const root = zip.folder(folderName);
    root.file('manifest.json', buildManifest());
    root.file('README.txt', buildReadme());
    root.file('build.json', JSON.stringify(state, null, 2));
    const images = root.folder('images');
    images.file('theme_frame.png',          await canvasToBlob(bakeFramePng()));
    images.file('theme_toolbar.png',        await canvasToBlob(bakeToolbarPng()));
    images.file('theme_ntp_background.png', await canvasToBlob(bakeNtpPng()));
    const icons = root.folder('icons');
    icons.file('icon16.png',  await canvasToBlob(bakeIconPng(16)));
    icons.file('icon32.png',  await canvasToBlob(bakeIconPng(32)));
    icons.file('icon48.png',  await canvasToBlob(bakeIconPng(48)));
    icons.file('icon128.png', await canvasToBlob(bakeIconPng(128)));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${folderName}.zip`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  } catch (e) { console.error(e); alert('Download failed; see console.'); }
  finally { btn.disabled = false; }
});

// ============================================================
// Token grid (kept)
// ============================================================
const TOKENS = [
  { name: 'brand-default',      hex: '#3ECF8E', desc: 'primary accent' },
  { name: 'brand-link',         hex: '#00C58E', desc: 'hover / link'   },
  { name: 'secondary-default',  hex: '#9C97FF', desc: 'indigo'         },
  { name: 'warning-default',    hex: '#DB9800', desc: 'warning'        },
  { name: 'destructive-default',hex: '#E15A3C', desc: 'danger'         },
  { name: 'bg (deep-dark)',     hex: '#121212', desc: 'near-black'     },
  { name: 'bg (slate)',         hex: '#0F1115', desc: 'classic dark'   },
  { name: 'bg (midnight)',      hex: '#0A1512', desc: 'green-cast'     },
  { name: 'surface-100',        hex: '#1F1F1F', desc: 'card / toolbar' },
  { name: 'border-default',     hex: '#2E2E2E', desc: 'hairline'       },
  { name: 'fg-default',         hex: '#FAFAFA', desc: 'primary text'   },
  { name: 'fg-lighter',         hex: '#898989', desc: 'muted text'     },
];
const tokenGrid = document.getElementById('tokenGrid');
if (tokenGrid) {
  tokenGrid.innerHTML = TOKENS.map(t => `
    <div class="token">
      <div class="swatch" style="background:${t.hex}"></div>
      <div class="name">${t.name}</div>
      <div class="hex">${t.hex} · ${t.desc}</div>
    </div>`).join('');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#' || href.startsWith('#build?')) return;
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); }
  });
});

// Init
const restored = decodeState();
if (restored) state = restored;
render();
