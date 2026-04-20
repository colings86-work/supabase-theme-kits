// ============================================================
// Supabase Terminal Theme — showcase (state, preview, wiring)
// ============================================================

const DEFAULT_STATE = {
  preset: 'studio',       // studio | deep-dark | midnight-green | classic-dark | high-contrast | mono-green
  mood: 'brand',          // brand | vibrant | muted | pastel | mono-green
  fgBrightness: 'normal', // dim | normal | bright
  cursorStyle: 'block',   // block | bar | underline
  cursorBlink: 'on',      // on | off
  boldAsBright: 'off',    // on | off
  promptSymbol: '❯',      // ❯ | $ | → | λ
  promptColor: 'green',   // green | cyan | fg
  gitSegment: 'on',       // on | off
};

let state = { ...DEFAULT_STATE };

// ---------- URL state ----------
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

// ---------- Live preview ------------------------------------------------
// Builds the terminal window HTML + inline styles for the current resolved theme.
function escapeHtml(s) { return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

function buildPreview() {
  const { preset, ansi } = resolveTheme(state);
  const bAB = state.boldAsBright === 'on';
  const promptColorHex = ({
    green: ansi.promptFg || ansi.green,
    cyan:  ansi.cyan,
    fg:    ansi.fg,
  })[state.promptColor];

  // Session content — Supabase-themed. Uses inline color spans for every ANSI slot
  // so any mood/preset change is instantly visible. Roles map to ANSI keys so the
  // bold-as-bright toggle can redirect the `bold` class to the `br*` variants.
  // We render:
  //   - supabase start  (several port lines)
  //   - a ls --color
  //   - a psql row with numeric columns
  //   - a migration apply with a warning line
  //   - an error line
  //   - a success/✔ line
  //   - final prompt with cursor
  const c = (role, text, opts = {}) => {
    const bold = opts.bold;
    const key = (bold && bAB) ? ('br' + role.charAt(0).toUpperCase() + role.slice(1)) : role;
    const hex = ansi[key] || ansi[role] || ansi.fg;
    return `<span style="color:${hex}${bold ? ';font-weight:700' : ''}">${escapeHtml(text)}</span>`;
  };
  const fg = (text) => `<span style="color:${ansi.fg}">${escapeHtml(text)}</span>`;
  const dim = (text) => `<span style="color:${ansi.white};opacity:0.8">${escapeHtml(text)}</span>`;

  // Prompt parts (each line starts with): user@host dir (branch) ❯
  const promptLine = (cmd) => {
    const user = c('cyan', 'alex', { bold: true });
    const at = dim('@');
    const host = c('magenta', 'studio');
    const path = c('blue', '~/acme/supabase', { bold: true });
    const branch = state.gitSegment === 'on'
      ? ` ${c('yellow','git:(')}${c('red','main')}${c('yellow',')')}`
      : '';
    const sym = `<span style="color:${promptColorHex};font-weight:700">${escapeHtml(state.promptSymbol)}</span>`;
    return `${user}${at}${host} ${path}${branch} ${sym}${cmd ? ' ' + cmd : ''}`;
  };

  const lines = [];

  // 1. supabase start
  lines.push(promptLine(fg('supabase start')));
  lines.push(`<span style="color:${ansi.white}">Started supabase local development setup.</span>`);
  lines.push(`  ${c('green','✓')} ${fg('Postgres  ')}${c('white','running on ')}${c('cyan','127.0.0.1')}${fg(':')}${c('yellow','54322',{bold:true})}`);
  lines.push(`  ${c('green','✓')} ${fg('API       ')}${c('white','running on ')}${c('cyan','127.0.0.1')}${fg(':')}${c('yellow','54321',{bold:true})}`);
  lines.push(`  ${c('green','✓')} ${fg('Studio    ')}${c('white','running on ')}${c('cyan','127.0.0.1')}${fg(':')}${c('yellow','54323',{bold:true})}`);
  lines.push(`  ${c('green','✓')} ${fg('Inbucket  ')}${c('white','running on ')}${c('cyan','127.0.0.1')}${fg(':')}${c('yellow','54324',{bold:true})}`);
  lines.push('');

  // 2. psql query
  lines.push(promptLine(fg('psql -c "select * from projects limit 3;"')));
  lines.push(`${c('white',' id ')}${dim('|')}${c('white','      name      ')}${dim('|')}${c('white','   created   ')}${dim('|')}${c('white',' active')}`);
  lines.push(`${dim('----+----------------+-------------+--------')}`);
  lines.push(` ${c('yellow','42')} ${dim('|')} ${c('green','acme-prod')}      ${dim('|')} ${c('magenta','2025-11-02')}  ${dim('|')} ${c('green','t',{bold:true})}`);
  lines.push(` ${c('yellow','43')} ${dim('|')} ${c('green','acme-staging')}   ${dim('|')} ${c('magenta','2025-11-18')}  ${dim('|')} ${c('green','t',{bold:true})}`);
  lines.push(` ${c('yellow','44')} ${dim('|')} ${c('green','billing-v2')}     ${dim('|')} ${c('magenta','2026-03-04')}  ${dim('|')} ${c('red','f',{bold:true})}`);
  lines.push(`${dim('(3 rows)')}`);
  lines.push('');

  // 3. migrations with a warning + an error + success
  lines.push(promptLine(fg('supabase migration up')));
  lines.push(`${c('cyan','→')} ${fg('Applying migration ')}${c('magenta','20260312_add_billing.sql')}`);
  lines.push(`${c('yellow','⚠')} ${c('yellow','warning:')} ${fg('column ')}${c('cyan','legacy_plan')}${fg(' deprecated, will be dropped in next migration')}`);
  lines.push(`${c('red','✗')} ${c('red','error:')} ${fg('relation ')}${c('cyan','invoices')}${fg(' already exists')}`);
  lines.push(`  ${c('white','at ')}${c('magenta','20260312_add_billing.sql:42')}`);
  lines.push('');

  // 4. quick recovery — another prompt with cursor
  const cursorHex = ansi.cursor;
  const cursorSpan = ({
    block:     `<span class="cursor cursor--block" style="background:${cursorHex};color:${ansi.cursorText || ansi.bg}">&nbsp;</span>`,
    bar:       `<span class="cursor cursor--bar" style="background:${cursorHex}"></span>`,
    underline: `<span class="cursor cursor--underline" style="background:${cursorHex}"></span>`,
  })[state.cursorStyle];

  lines.push(promptLine(cursorSpan));

  const bodyHtml = lines.map(l => `<div class="tline">${l || '&nbsp;'}</div>`).join('');

  // Window chrome — original generic macOS-style
  return `
    <div class="term" style="background:${ansi.bg}; color:${ansi.fg};">
      <div class="term-titlebar" style="background:${adjustForTitlebar(ansi.bg)}; color:${ansi.fgLighter || '#888'};">
        <div class="tl-traffic">
          <span class="tl-dot tl-r"></span>
          <span class="tl-dot tl-y"></span>
          <span class="tl-dot tl-g"></span>
        </div>
        <div class="tl-title">${escapeHtml(preset.name)} — zsh</div>
        <div class="tl-spacer"></div>
      </div>
      <div class="term-tabs" style="background:${adjustForTabs(ansi.bg)};">
        <div class="term-tab is-active" style="background:${ansi.bg}; color:${ansi.fg};">
          <span class="term-tab-dot" style="background:${ansi.green}"></span>
          <span>~/acme/supabase</span>
          <span class="term-tab-x">×</span>
        </div>
        <span class="term-tab-plus">+</span>
      </div>
      <div class="term-body ${state.cursorBlink === 'on' ? 'blink-on' : 'blink-off'}" style="color:${ansi.fg};">
        ${bodyHtml}
      </div>
    </div>`;
}

// Slightly lift/lower a hex for chrome surfaces — keeps the window legible against the terminal body.
function adjustForTitlebar(bgHex) {
  const { adjustSL } = window.__colorHelpers;
  // Titlebar: about 30% darker than bg if bg is already dark, else subtly lighter
  const { hexToHsl } = window.__colorHelpers;
  const hsl = hexToHsl(bgHex);
  if (hsl.l < 0.5) return adjustSL(bgHex, 1.0, 0.7);
  return adjustSL(bgHex, 1.0, 0.9);
}
function adjustForTabs(bgHex) {
  const { adjustSL, hexToHsl } = window.__colorHelpers;
  const hsl = hexToHsl(bgHex);
  if (hsl.l < 0.5) return adjustSL(bgHex, 1.0, 0.82);
  return adjustSL(bgHex, 1.0, 0.95);
}

// ---------- Palette viz strip ------------------------------------------
// Shows all 16 ANSI slots + fg/bg/cursor/selection as swatches.
function buildPaletteViz() {
  const { ansi } = resolveTheme(state);
  const rowNormal = [
    ['black',ansi.black], ['red',ansi.red], ['green',ansi.green], ['yellow',ansi.yellow],
    ['blue',ansi.blue], ['magenta',ansi.magenta], ['cyan',ansi.cyan], ['white',ansi.white],
  ];
  const rowBright = [
    ['br.black',ansi.brBlack], ['br.red',ansi.brRed], ['br.green',ansi.brGreen], ['br.yellow',ansi.brYellow],
    ['br.blue',ansi.brBlue], ['br.magenta',ansi.brMagenta], ['br.cyan',ansi.brCyan], ['br.white',ansi.brWhite],
  ];
  const extras = [
    ['bg', ansi.bg], ['fg', ansi.fg], ['cursor', ansi.cursor],
    ['selection', ansi.selBg], ['prompt', ansi.promptFg || ansi.green],
  ];
  const renderRow = (row, label) => `
    <div class="pv-row">
      <div class="pv-row-label">${label}</div>
      <div class="pv-swatches">
        ${row.map(([name,hex]) => `
          <div class="pv-swatch" title="${name} · ${hex}">
            <div class="pv-color" style="background:${hex}"></div>
            <div class="pv-name">${name}</div>
            <div class="pv-hex">${hex.toUpperCase()}</div>
          </div>`).join('')}
      </div>
    </div>`;
  return renderRow(rowNormal, 'ansi 0-7') +
         renderRow(rowBright, 'ansi 8-15') +
         renderRow(extras,   'semantic');
}

// ---------- Controls ---------------------------------------------------
function buildControls() {
  const { preset } = resolveTheme(state);
  const drifting = preset.canonical && state.mood !== 'brand';

  const sections = [
    { group: 'Palette',
      controls: [
        { id: 'preset', name: 'Preset', hint: PRESETS[state.preset].name,
          desc: PRESETS[state.preset].blurb,
          options: [
            ['studio', 'Studio Dark', SB.bgStudio, '· brand-canonical'],
            ['deep-dark', 'Deep Dark', '#0A0A0A'],
            ['midnight-green', 'Midnight Green', '#0A1512'],
            ['classic-dark', 'Classic Dark', '#0F1115'],
            ['high-contrast', 'High Contrast', '#000000'],
            ['mono-green', 'Monochrome + Green', '#0D0D0D'],
          ] },
        { id: 'mood', name: 'Palette mood', hint: state.mood,
          desc: state.mood === 'brand'
            ? 'No transform — preset colors used as-is. On Studio Dark this is the exact Supabase design-system palette.'
            : 'Saturation/lightness transform applied to all 16 ANSI slots. Green stays recognizably Supabase.',
          options: [
            ['brand','brand'],
            ['vibrant','vibrant'],
            ['muted','muted'],
            ['pastel','pastel'],
            ['mono-green','mono+green'],
          ] },
        { id: 'fgBrightness', name: 'Foreground', hint: state.fgBrightness,
          desc: 'Brightness of plain text (ANSI white and fg).',
          options: [['dim','dim'],['normal','normal'],['bright','bright']] },
      ] },
    { group: 'Cursor',
      controls: [
        { id: 'cursorStyle', name: 'Style', hint: state.cursorStyle,
          desc: 'Cursor shape — block, vertical bar, or underline.',
          options: [['block','block'],['bar','bar'],['underline','underline']] },
        { id: 'cursorBlink', name: 'Blink', hint: state.cursorBlink,
          desc: 'Blink on/off.',
          options: [['on','on'],['off','off']] },
        { id: 'boldAsBright', name: 'Bold as bright', hint: state.boldAsBright,
          desc: 'When on, bold normal-ANSI colors render as their bright variants.',
          options: [['off','off'],['on','on']] },
      ] },
    { group: 'Prompt (preview only)',
      controls: [
        { id: 'promptSymbol', name: 'Symbol', hint: state.promptSymbol,
          desc: 'The glyph at the end of your prompt.',
          options: [['❯','❯'],['$','$'],['→','→'],['λ','λ']] },
        { id: 'promptColor', name: 'Prompt color', hint: state.promptColor,
          desc: 'Color of the prompt symbol.',
          options: [['green','green'],['cyan','cyan'],['fg','fg']] },
        { id: 'gitSegment', name: 'Git segment', hint: state.gitSegment,
          desc: 'Show the <code>git:(main)</code> segment in the preview prompt.',
          options: [['on','on'],['off','off']] },
      ] },
  ];

  const driftingChipHtml = drifting
    ? `<div class="drift-chip" title="Studio Dark is the canonical preset. On moods other than 'brand' its colors are transformed and no longer match the Supabase design system exactly.">
         <span class="drift-dot"></span>
         drifting from system
       </div>`
    : preset.canonical
      ? `<div class="brand-chip" title="Exact Supabase design-system palette. Guaranteed.">
           <span class="brand-dot"></span>
           matches design system
         </div>`
      : '';

  const sectionsHtml = sections.map(s => `
    <div class="ctrl-section">
      <div class="ctrl-group-label">${s.group}</div>
      ${s.controls.map(r => `
        <div class="control">
          <div class="control-label">
            <span class="name">${r.name}</span>
            <span class="hint">${r.hint}</span>
          </div>
          <p class="control-desc">${r.desc}</p>
          <div class="seg" data-control="${r.id}">
            ${r.options.map(opt => {
              const [v, l, sw, suffix] = opt;
              const swHtml = sw ? `<span class="seg-swatch" style="background:${sw}"></span>` : '';
              const sufHtml = suffix ? `<span class="seg-suffix">${suffix}</span>` : '';
              return `<button data-value="${v}" class="${state[r.id]===v?'is-on':''}">${swHtml}<span>${l}</span>${sufHtml}</button>`;
            }).join('')}
          </div>
        </div>`).join('')}
    </div>`).join('');

  return driftingChipHtml + sectionsHtml;
}

function buildConfigSummary() {
  const parts = Object.entries(state).map(([k,v]) => `<span class="k">${k}:</span> <span class="v">${v}</span>`);
  return parts.join(' &nbsp;·&nbsp; ');
}

// ---------- Render ----------
function render() {
  document.getElementById('previewMount').innerHTML = buildPreview();
  document.getElementById('paletteViz').innerHTML = buildPaletteViz();
  document.getElementById('builderControls').innerHTML = buildControls();
  document.getElementById('configSummary').innerHTML = buildConfigSummary();
  wireControls();
  pushHash();
}
function wireControls() {
  document.querySelectorAll('#builderControls .seg').forEach(seg => {
    seg.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        state[seg.dataset.control] = btn.dataset.value;
        // Mood 'mono-green' conflicts with preset 'mono-green' conceptually — still fine, just a naming overlap
        render();
      });
    });
  });
}

// ---------- Share URL ----------
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

// ---------- Download ZIP ----------
function themeName() {
  const p = PRESETS[state.preset].name;
  if (state.mood === 'brand') return `Supabase ${p}`;
  const niceMood = state.mood === 'mono-green' ? 'Mono+Green' : state.mood.charAt(0).toUpperCase() + state.mood.slice(1);
  return `Supabase ${p} — ${niceMood}`;
}
function slugName() {
  return themeName().toLowerCase()
    .replace(/[+—]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

document.getElementById('downloadBtn').addEventListener('click', async () => {
  const btn = document.getElementById('downloadBtn');
  btn.disabled = true;
  try {
    if (typeof JSZip === 'undefined') throw new Error('JSZip not loaded');
    const { ansi } = resolveTheme(state);
    const name = themeName();
    const slug = slugName();
    const E = window.__exporters;

    const zip = new JSZip();
    const root = zip.folder(`supabase-terminal-${slug}`);
    root.file(`${slug}.itermcolors`,  E.exportIterm(ansi, name));
    root.file(`${slug}.terminal`,     E.exportTerminalApp(ansi, name));
    root.file(`${slug}.conf`,         E.exportKitty(ansi, name));
    root.file(`${slug}.toml`,         E.exportAlacritty(ansi, name));
    root.file(`${slug}-ghostty.conf`, E.exportGhostty(ansi, name));
    root.file(`${slug}.yaml`,         E.exportWarp(ansi, name));
    root.file(`tokens.json`,          E.exportJsonTokens(ansi, name, state));
    root.file(`README.txt`,           E.exportReadme(name, state));
    root.file(`build.json`,           JSON.stringify(state, null, 2));

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `supabase-terminal-${slug}.zip`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  } catch (e) { console.error(e); alert('Download failed; see console.'); }
  finally { btn.disabled = false; }
});

// ---------- Install tabs ----------
document.querySelectorAll('.install-tabs [data-tab]').forEach(tab => {
  tab.addEventListener('click', () => {
    const id = tab.dataset.tab;
    document.querySelectorAll('.install-tabs [data-tab]').forEach(t => t.classList.toggle('is-on', t === tab));
    document.querySelectorAll('.install-pane').forEach(p => p.classList.toggle('is-on', p.dataset.pane === id));
  });
});

// ---------- Smooth scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#' || href.startsWith('#build?')) return;
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
  });
});

// ---------- Token grid (display-only) ----------
const TOKENS = [
  { name: 'brand-default',       hex: '#3ECF8E', desc: 'ANSI green / prompt' },
  { name: 'brand-600',           hex: '#65DDAB', desc: 'bright green' },
  { name: 'destructive-default', hex: '#E15A3C', desc: 'ANSI red' },
  { name: 'warning-default',     hex: '#DB9800', desc: 'ANSI yellow' },
  { name: 'secondary-default',   hex: '#9C97FF', desc: 'ANSI blue (indigo)' },
  { name: 'code-block-1',        hex: '#7FCFC0', desc: 'ANSI cyan (teal)' },
  { name: 'code-block-4',        hex: '#CEA5E8', desc: 'ANSI magenta (violet)' },
  { name: 'background-default',  hex: '#121212', desc: 'Studio Dark bg' },
  { name: 'border-strong',       hex: '#363636', desc: 'bright black' },
  { name: 'foreground-default',  hex: '#FAFAFA', desc: 'primary text' },
  { name: 'foreground-light',    hex: '#B4B4B4', desc: 'ANSI white' },
  { name: 'foreground-lighter',  hex: '#898989', desc: 'muted text' },
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

// ---------- Init ----------
const restored = decodeState();
if (restored) state = restored;
render();
