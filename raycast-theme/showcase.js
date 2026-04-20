// ============================================================
// Supabase Raycast Theme — preview + controls + exporter
// ============================================================

// Raycast sample command content (picker rotates through these views).
const SAMPLES = {
  root: {
    label: 'Root Search',
    placeholder: 'Search for apps and commands…',
    sections: [
      { title: 'Suggestions', items: [
        { icon: '●', accent: 'green',   name: 'AI Chat',                sub: 'Command',                    shortcut: '⌘ ⇧ A' },
        { icon: '◈', accent: 'blue',    name: 'Search Emoji & Symbols', sub: 'Command',                    shortcut: '⌃ ⌘ Space' },
        { icon: '◉', accent: 'purple',  name: 'Clipboard History',      sub: 'Command',                    shortcut: '⌘ ⇧ V' },
        { icon: '▤', accent: 'orange',  name: 'Snippets',               sub: 'Command',                    shortcut: '⌘ ⇧ S' },
      ]},
      { title: 'Commands', items: [
        { icon: '▣', accent: 'green',   name: 'Query Supabase Project', sub: 'Extension · Supabase',       shortcut: '↵' },
        { icon: '◐', accent: 'yellow',  name: 'Window Management',      sub: 'Extension',                  shortcut: '↵' },
        { icon: '≡', accent: 'magenta', name: 'Calculator',             sub: 'Command',                    shortcut: '↵' },
        { icon: '▦', accent: 'red',     name: 'Store',                  sub: 'Command',                    shortcut: '↵' },
      ]},
    ],
    actionHint: 'Open Command',
  },
  'ai-chat': {
    label: 'AI Chat',
    placeholder: 'Ask anything…',
    isChat: true,
    messages: [
      { role: 'user', text: 'Write a Supabase RLS policy for a posts table where only authors can update their own rows.' },
      { role: 'assistant', text: 'Here you go:',
        code: [
          "create policy \"Authors can update own posts\"",
          "on public.posts",
          "for update",
          "using (auth.uid() = author_id)",
          "with check (auth.uid() = author_id);",
        ] },
      { role: 'user', text: 'Now add a SELECT policy so posts are readable by anyone.' },
    ],
    actionHint: 'Send Message',
  },
  store: {
    label: 'Extension Store',
    placeholder: 'Search the Store…',
    sections: [
      { title: 'Featured', items: [
        { icon: '▣', accent: 'green',   name: 'Supabase',          sub: 'Query projects, tables, auth · 12k installs',  shortcut: '↵' },
        { icon: '◈', accent: 'blue',    name: 'GitHub',            sub: 'PRs, issues, repos · 240k installs',           shortcut: '↵' },
        { icon: '▦', accent: 'purple',  name: 'Linear',            sub: 'Issues, cycles, projects · 98k installs',      shortcut: '↵' },
      ]},
      { title: 'New', items: [
        { icon: '◉', accent: 'orange',  name: 'Vercel',            sub: 'Deployments, logs, env vars',                  shortcut: '↵' },
        { icon: '◐', accent: 'yellow',  name: 'PostgreSQL',        sub: 'Run queries against any Postgres',             shortcut: '↵' },
        { icon: '●', accent: 'magenta', name: 'Raindrop',          sub: 'Bookmark manager',                             shortcut: '↵' },
      ]},
    ],
    actionHint: 'Install Extension',
  },
  clipboard: {
    label: 'Clipboard History',
    placeholder: 'Search clipboard…',
    sections: [
      { title: 'Today', items: [
        { icon: '“', accent: 'green',   name: 'supabase.auth.signInWithPassword({ email, password })', sub: 'Text · 2m ago', shortcut: '↵' },
        { icon: '#', accent: 'blue',    name: '#3ECF8E',                              sub: 'Color · 14m ago',            shortcut: '↵' },
        { icon: '◨', accent: 'purple',  name: 'https://supabase.com/dashboard/project/abc', sub: 'Link · 38m ago',        shortcut: '↵' },
        { icon: '“', accent: 'orange',  name: 'SELECT count(*) FROM auth.users;',     sub: 'Text · 1h ago',               shortcut: '↵' },
      ]},
      { title: 'Yesterday', items: [
        { icon: '◈', accent: 'yellow',  name: 'logo-supabase.svg',                    sub: 'Image · yesterday',           shortcut: '↵' },
        { icon: '“', accent: 'magenta', name: 'DATABASE_URL=postgresql://postgres…',  sub: 'Text · yesterday',            shortcut: '↵' },
      ]},
    ],
    actionHint: 'Paste',
  },
  calculator: {
    label: 'Calculator',
    placeholder: '128 * 0.0875 + tax',
    sections: [
      { title: 'Result', items: [
        { icon: '=', accent: 'green',   name: '11.20',                                sub: '128 × 0.0875 = 11.20',        shortcut: '↵' },
      ]},
      { title: 'Recent', items: [
        { icon: '=', accent: 'blue',    name: '42 GB',                                sub: '32 GB + 10 GB',               shortcut: '↵' },
        { icon: '=', accent: 'purple',  name: '$1,249.99',                            sub: '$1,499.99 × 0.8333',          shortcut: '↵' },
        { icon: '=', accent: 'orange',  name: '2h 45m',                               sub: '8:15pm − 5:30pm',             shortcut: '↵' },
      ]},
    ],
    actionHint: 'Copy Result',
  },
  window: {
    label: 'Window Management',
    placeholder: 'Manage windows…',
    sections: [
      { title: 'Halves', items: [
        { icon: '◧', accent: 'green',   name: 'Left Half',       sub: 'Arrange',            shortcut: '⌃ ⌥ ←' },
        { icon: '◨', accent: 'green',   name: 'Right Half',      sub: 'Arrange',            shortcut: '⌃ ⌥ →' },
      ]},
      { title: 'Quarters', items: [
        { icon: '◰', accent: 'blue',    name: 'Top Left',        sub: 'Arrange',            shortcut: '⌃ ⌥ ⌘ ←' },
        { icon: '◱', accent: 'blue',    name: 'Bottom Left',     sub: 'Arrange',            shortcut: '⌃ ⇧ ⌥ ←' },
      ]},
      { title: 'Sizing', items: [
        { icon: '▣', accent: 'purple',  name: 'Maximize',        sub: 'Resize',             shortcut: '⌃ ⌥ ↵' },
        { icon: '◉', accent: 'orange',  name: 'Center',          sub: 'Arrange',            shortcut: '⌃ ⌥ C' },
      ]},
    ],
    actionHint: 'Run Command',
  },
};

// ---------- State ----------
// NOTE on scope: Raycast themes carry only a name, author, appearance, and
// 12 colors (bg, bgSecondary, text, selection, loader, + 7 accents). Anything
// else in this preview — window background mode, gradient direction, the
// sample view — is strictly local rendering help so you can see the palette
// in context. It is NOT exported and does NOT persist in Raycast.
const DEFAULT_STATE = {
  preset: 'studio',
  mood: 'brand',
  bgMode: '',          // preview + export. '' = preset default, else 'solid' | 'gradient'
  sample: 'root',      // preview-only.
};
const state = { ...DEFAULT_STATE };

// ---------- Preview ----------
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function resolveWindowBg(resolved) {
  const { core, bgMode } = resolved;
  const mode = bgMode || 'solid';
  if (mode === 'gradient') {
    // Raycast renders the gradient from background → backgroundSecondary.
    // Direction isn't user-configurable; Raycast picks it (roughly top-left
    // → bottom-right). We mirror that here.
    return { css: `linear-gradient(135deg, ${core.background} 0%, ${core.backgroundSecondary} 100%)`, mode };
  }
  return { css: core.background, mode };
}

// Raycast's window radius is fixed by the app/OS, not themeable.
const WINDOW_RADIUS_PX = 12;

function buildPreview() {
  const theme = resolveTheme(state);
  const { core, accents, preset } = theme;
  const sample = SAMPLES[state.sample] || SAMPLES.root;
  const bg = resolveWindowBg(theme);
  const radius = WINDOW_RADIUS_PX;

  const noiseSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`
  );

  const winStyle = `
    background: ${bg.css};
    color: ${core.text};
    border-radius: ${radius}px;
    border: 1px solid ${core.border};
    box-shadow: 0 40px 80px -20px rgba(0,0,0,${core.appearance==='light'?0.25:0.6}), 0 20px 40px -10px ${accents.green}22;
    position: relative; overflow: hidden;
  `;

  // Search bar
  const searchBar = `
    <div class="rc-search" style="
      border-bottom: 1px solid ${core.borderSubtle};
      padding: 14px 18px;
      display: flex; align-items: center; gap: 10px;
      font-size: 17px;
      color: ${core.textMuted};
      background: transparent;
    ">
      <span style="opacity:0.7;">⌕</span>
      <span style="color:${core.text};opacity:0.95;">${escapeHtml(sample.placeholder)}</span>
      <span style="margin-left:auto; font-size:11px; color:${core.textMuted}; font-family:var(--font-mono);">${escapeHtml(sample.label)}</span>
    </div>
  `;

  // Body
  let body = '';
  if (sample.isChat) {
    body = `<div class="rc-body" style="padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; flex: 1; overflow-y: auto;">` +
      sample.messages.map((m, i) => {
        if (m.role === 'user') {
          return `
            <div style="align-self: flex-end; max-width: 78%; padding: 8px 12px; border-radius: 10px;
                        background: ${accents.green}1F; color: ${core.text}; font-size: 13.5px; line-height: 1.45;">
              ${escapeHtml(m.text)}
            </div>`;
        } else {
          const codeBlock = m.code ? `
            <pre style="margin:8px 0 0; background:${core.backgroundSecondary}; border:1px solid ${core.borderSubtle};
                        border-radius:8px; padding:10px 12px; font-family: 'Source Code Pro', ui-monospace, monospace;
                        font-size:12px; line-height:1.5; color:${core.textSecondary}; white-space:pre-wrap;">${m.code.map(escapeHtml).join('\n')}</pre>` : '';
          return `
            <div style="align-self: flex-start; max-width: 86%;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:11px;color:${core.textMuted};font-family:var(--font-mono);letter-spacing:0.08em;text-transform:uppercase;">
                <span style="width:8px;height:8px;border-radius:50%;background:${accents.green};display:inline-block;"></span>
                Raycast AI
              </div>
              <div style="font-size:13.5px; line-height:1.5; color:${core.text};">${escapeHtml(m.text)}</div>
              ${codeBlock}
            </div>`;
        }
      }).join('') + `</div>`;
  } else {
    body = `<div class="rc-body" style="padding: 8px 0; flex: 1; overflow-y: auto;">` +
      sample.sections.map(sec => `
        <div class="rc-section">
          <div style="padding: 8px 18px 4px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
                      color: ${core.textMuted}; font-family: var(--font-mono);">${escapeHtml(sec.title)}</div>
          ${sec.items.map((item, i) => {
            const selected = i === 0 && sec === sample.sections[0];
            return renderRow(item, selected, core, accents);
          }).join('')}
        </div>
      `).join('') + `</div>`;
  }

  // Footer (action bar)
  const footer = `
    <div class="rc-footer" style="
      border-top: 1px solid ${core.borderSubtle};
      padding: 8px 12px; display: flex; align-items: center; gap: 12px;
      background: ${core.backgroundSecondary}; color: ${core.textSecondary};
      font-size: 12px;
    ">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="width:14px;height:14px;border-radius:3px;background:${accents.green};display:inline-flex;align-items:center;justify-content:center;color:#0A2015;font-weight:700;font-size:9px;">R</span>
        <span style="color:${core.text};font-weight:500;">Raycast</span>
      </div>
      <div style="margin-left:auto; display:flex; gap:10px; align-items:center;">
        <span style="color:${core.textSecondary};">${escapeHtml(sample.actionHint)}</span>
        <span class="rc-popto" style="
          display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:5px;
          background:${core.popto};color:${core.poptoText};font-family:var(--font-mono);font-size:11px;font-weight:600;
        ">↵</span>
        <span style="color:${core.textMuted};">Actions</span>
        <span class="rc-kbd" style="
          display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:4px;
          background:${core.border}66;color:${core.textSecondary};font-family:var(--font-mono);font-size:10.5px;
        ">⌘K</span>
      </div>
    </div>
  `;

  // Loader bar (top)
  const loaderBar = `
    <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; overflow: hidden; pointer-events: none;">
      <div class="rc-loader-track" style="position:absolute; inset:0; background:${core.loader}1F;"></div>
      <div class="rc-loader-bar" style="position:absolute; top:0; bottom:0; width:30%; background:${core.loader};"></div>
    </div>
  `;

  return `
    <div class="rc-window" style="${winStyle}">
      ${loaderBar}
      ${searchBar}
      ${body}
      ${footer}
    </div>
  `;
}

function renderRow(item, selected, core, accents) {
  const accentColor = accents[item.accent] || accents.green;
  const rowBg = selected ? core.selection : 'transparent';
  return `
    <div class="rc-row" style="
      padding: 7px 18px; margin: 0 6px; border-radius: 6px;
      display: flex; align-items: center; gap: 10px;
      background: ${rowBg};
      font-size: 13.5px; color: ${core.text};
    ">
      <span style="
        width: 22px; height: 22px; border-radius: 5px;
        background: ${accentColor}26; color: ${accentColor};
        display: inline-flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 600; flex-shrink: 0;
      ">${escapeHtml(item.icon)}</span>
      <div style="flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
        ${escapeHtml(item.name)}
      </div>
      <div style="color:${core.textMuted}; font-size: 11.5px; font-family:var(--font-mono); flex-shrink:0;">
        ${escapeHtml(item.sub)}
      </div>
      <div style="color:${core.textSecondary}; font-size: 11px; font-family:var(--font-mono); flex-shrink:0; opacity:${selected?1:0.5};">
        ${escapeHtml(item.shortcut || '')}
      </div>
    </div>
  `;
}

// ---------- Palette viz ----------
function buildPaletteViz() {
  const { core, accents } = resolveTheme(state);
  const swatch = (name, hex) => `
    <button class="pvz" data-hex="${hex}" style="background:${hex};" title="${name} · ${hex}">
      <span class="pvz-label">${name}</span>
      <span class="pvz-hex">${hex.toUpperCase()}</span>
    </button>`;
  const raycastSlots = [
    ['background',          core.background],
    ['bg secondary',        core.backgroundSecondary],
    ['text',                core.text],
    ['selection',           core.selection],
    ['loader',              core.loader],
  ];
  const derived = [
    ['popto',               core.popto],
    ['border',              core.border],
    ['text muted',          core.textMuted],
  ];
  const semantic = [
    ['red',     accents.red],
    ['orange',  accents.orange],
    ['yellow',  accents.yellow],
    ['green',   accents.green],
    ['blue',    accents.blue],
    ['purple',  accents.purple],
    ['magenta', accents.magenta],
  ];
  return `
    <div class="pvz-group">
      <div class="pvz-group-label">Raycast UI slots · 5 <span style="opacity:0.6;font-weight:400;">(exported)</span></div>
      <div class="pvz-row">${raycastSlots.map(([n,h]) => swatch(n,h)).join('')}</div>
    </div>
    <div class="pvz-group">
      <div class="pvz-group-label">Semantic accents · 7 <span style="opacity:0.6;font-weight:400;">(exported)</span></div>
      <div class="pvz-row">${semantic.map(([n,h]) => swatch(n,h)).join('')}</div>
    </div>
    <div class="pvz-group">
      <div class="pvz-group-label">Derived <span style="opacity:0.6;font-weight:400;">(preview chrome only — Raycast decides these at render time)</span></div>
      <div class="pvz-row">${derived.map(([n,h]) => swatch(n,h)).join('')}</div>
    </div>
  `;
}

// ---------- Controls ----------
function buildControls() {
  const { preset, bgMode } = resolveTheme(state);
  const drifting = preset.canonical && state.mood !== 'brand';
  const effectiveBg = bgMode || preset.bgMode;

  const sections = [
    { group: 'Palette', controls: [
      { id:'preset', name:'Preset', hint: PRESETS[state.preset].name,
        desc: PRESETS[state.preset].blurb,
        options: [
          ['studio','Studio Dark', '#121212', '· canonical'],
          ['classic-dark','Classic Dark', '#171A20'],
          ['deep-dark','Deep Dark', '#0A0A0A'],
          ['midnight-green','Midnight Green', '#0A1512', '· gradient'],
          ['high-contrast','High Contrast', '#000000'],
          ['mono-green','Monochrome + Green', '#0D0D0D'],
        ] },
      { id:'mood', name:'Palette mood', hint: state.mood,
        desc: state.mood==='brand'
          ? 'No transform. Studio Dark + brand = exact Supabase design-system palette.'
          : 'Saturation/lightness transform applied to the 7 semantic accents. Brand green stays recognizable.',
        options: [['brand','brand'],['vibrant','vibrant'],['muted','muted'],['pastel','pastel'],['mono-green','mono+green']] },
    ] },
    { group: 'Window', controls: [
      { id:'bgMode', name:'Background', hint: effectiveBg + (state.bgMode==='' ? ' (preset default)' : ''),
        desc:'Solid uses one background color; gradient sets backgroundSecondary to a different tone so Raycast renders a gradient between them. Direction isn\'t configurable — Raycast picks it.',
        options: [['','preset default'],['solid','solid'],['gradient','gradient']] },
    ] },
    { group: 'Preview sample', controls: [
      { id:'sample', name:'View', hint: SAMPLES[state.sample].label,
        desc:'Which Raycast command view to render.',
        options: [
          ['root','Root search'],
          ['ai-chat','AI Chat'],
          ['store','Store'],
          ['clipboard','Clipboard'],
          ['calculator','Calculator'],
          ['window','Window Mgmt'],
        ] },
    ] },
  ];

  const chip = drifting
    ? `<div class="drift-chip" title="Studio Dark is canonical. Non-brand moods transform its colors."><span class="drift-dot"></span>drifting from system</div>`
    : preset.canonical
      ? `<div class="brand-chip" title="Exact Supabase design-system palette. Guaranteed."><span class="brand-dot"></span>matches design system</div>`
      : '';

  const section = (s) => `
    <div class="ctrl-section">
      <div class="ctrl-group-label">${s.group}</div>
      ${s.controls.map(r => renderControl(r)).join('')}
    </div>`;

  return `${chip}${sections.map(section).join('')}`;
}

function renderControl(r) {
  const dis = r.disabled ? 'is-disabled' : '';
  if (r.slider) {
    return `
      <div class="control ${dis}">
        <div class="control-label"><span>${r.name}</span><span class="control-hint">${r.hint}</span></div>
        <input class="ctrl-slider" type="range" data-control="${r.id}"
               min="${r.slider.min}" max="${r.slider.max}" step="${r.slider.step}" value="${state[r.id]}"
               ${r.disabled?'disabled':''}>
        <div class="control-desc">${r.desc}</div>
      </div>`;
  }
  return `
    <div class="control ${dis}">
      <div class="control-label"><span>${r.name}</span><span class="control-hint">${r.hint}</span></div>
      <div class="seg" data-control="${r.id}">
        ${r.options.map(opt => {
          const [v, label, swatch, note] = opt;
          const active = state[r.id] === v;
          return `<button data-value="${v}" class="${active?'is-on':''}" ${r.disabled?'disabled':''}>
            ${swatch?`<span class="seg-swatch" style="background:${swatch}"></span>`:''}
            <span>${label}</span>${note?`<span class="seg-note">${note}</span>`:''}
          </button>`;
        }).join('')}
      </div>
      <div class="control-desc">${r.desc}</div>
    </div>`;
}

// ---------- Config summary ----------
function buildConfigSummary() {
  const order = ['preset','mood','bgMode','sample'];
  return order.map(k => {
    const v = state[k] === '' ? '(preset default)' : state[k];
    return `<span class="k">${k}:</span> <span class="v">${v}</span>`;
  }).join(' &nbsp;·&nbsp; ');
}

// ---------- Render root ----------
function rerender() {
  document.getElementById('previewMount').innerHTML = buildPreview();
  document.getElementById('paletteViz').innerHTML = buildPaletteViz();
  document.getElementById('builderControls').innerHTML = buildControls();
  document.getElementById('configSummary').innerHTML = buildConfigSummary();
  wireControls();
  updateTokenGrid();
}

function wireControls() {
  document.querySelectorAll('#builderControls .seg').forEach(seg => {
    seg.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const control = seg.dataset.control;
        state[control] = btn.dataset.value;
        rerender();
      });
    });
  });
  document.querySelectorAll('#builderControls .ctrl-slider').forEach(inp => {
    inp.addEventListener('input', () => {
      const control = inp.dataset.control;
      state[control] = parseFloat(inp.value);
      rerender();
    });
  });
}

// ---------- Token grid ----------
function updateTokenGrid() {
  const grid = document.getElementById('tokenGrid');
  if (!grid) return;
  const { core, accents } = resolveTheme(state);
  const items = [
    ...Object.entries(core).filter(([k])=>!['appearance'].includes(k)).map(([k,v])=>['core.'+k, v]),
    ...Object.entries(accents).map(([k,v])=>['accent.'+k, v]),
  ];
  grid.innerHTML = items.map(([k,v]) => `
    <div class="token-cell">
      <span class="tk-swatch" style="background:${v}"></span>
      <span class="tk-name">${k}</span>
      <span class="tk-hex">${String(v).toUpperCase()}</span>
    </div>
  `).join('');
}

// ---------- Export ----------
function themeName() {
  const p = PRESETS[state.preset].name;
  const moodSuffix = state.mood === 'brand' ? '' : ` — ${state.mood === 'mono-green' ? 'Mono+Green' : state.mood.charAt(0).toUpperCase() + state.mood.slice(1)}`;
  return `Supabase ${p}${moodSuffix}`;
}
function slugName() { return themeName().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

// NOTE: We intentionally don't build a JSON theme file. Raycast installs themes
// via a `raycast://theme?...` deeplink with a flat color list — that's the only
// format the app accepts for shareable/distributable themes.

function deeplinkURL() {
  const { core, accents, preset } = resolveTheme(state);
  // Raycast theme install deeplinks are flat query strings, not JSON.
  // The colors param is a comma-separated list in this fixed 12-slot order:
  //   background, backgroundSecondary, text, selection, loader,
  //   red, orange, yellow, green, blue, purple, magenta
  // (matches ray.so's share URL format).
  const colors = [
    core.background,
    core.backgroundSecondary,
    core.text,
    core.selection,
    core.loader,
    accents.red,
    accents.orange,
    accents.yellow,
    accents.green,
    accents.blue,
    accents.purple,
    accents.magenta,
  ].join(',');

  const params = new URLSearchParams({
    author: 'Supabase',
    authorUsername: 'supabase',
    version: '1',
    name: themeName(),
    appearance: core.appearance,
    colors,
  });

  return `raycast://theme?${params.toString()}`;
}

// Clipboard in the preview iframe is blocked by permissions policy — both
// navigator.clipboard AND document.execCommand('copy') trip the same violation.
// So instead of silently copying, we surface the text in a modal with a
// pre-selected textarea so the user can Cmd/Ctrl+C themselves. This works in
// any embedding context.
function showCopyModal(title, text) {
  // Remove any existing modal first
  document.querySelectorAll('.rc-copy-modal').forEach(el => el.remove());

  const backdrop = document.createElement('div');
  backdrop.className = 'rc-copy-modal';
  backdrop.innerHTML = `
    <div class="rc-cm-sheet">
      <div class="rc-cm-head">
        <div class="rc-cm-title">${title}</div>
        <button class="rc-cm-close" aria-label="Close">×</button>
      </div>
      <div class="rc-cm-hint">Clipboard access is blocked in this preview. Select all and copy with <kbd>⌘</kbd><kbd>C</kbd> (or <kbd>Ctrl</kbd><kbd>C</kbd>).</div>
      <textarea class="rc-cm-text" readonly spellcheck="false"></textarea>
      <div class="rc-cm-foot">
        <button class="btn rc-cm-select">Select all</button>
        <button class="btn primary rc-cm-done">Done</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  const ta = backdrop.querySelector('.rc-cm-text');
  ta.value = text;
  const selectAll = () => { ta.focus(); ta.select(); ta.setSelectionRange(0, text.length); };
  // Select immediately so Cmd+C works on first keystroke.
  setTimeout(selectAll, 0);

  const close = () => backdrop.remove();
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  backdrop.querySelector('.rc-cm-close').addEventListener('click', close);
  backdrop.querySelector('.rc-cm-done').addEventListener('click', close);
  backdrop.querySelector('.rc-cm-select').addEventListener('click', selectAll);
  document.addEventListener('keydown', function onKey(e){
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
  });
}

function copyDeeplink() {
  showCopyModal('Raycast install deeplink', deeplinkURL());
}

function openDeeplink() {
  const link = deeplinkURL();
  try {
    const w = window.open(link, '_blank');
    if (!w) {
      showCopyModal('Popup blocked — paste this deeplink in your browser', link);
      return;
    }
    toast('Opening Raycast…');
  } catch {
    showCopyModal('Raycast install deeplink', link);
  }
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'rc-toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(()=>el.classList.add('in'));
  setTimeout(()=>{ el.classList.remove('in'); setTimeout(()=>el.remove(), 300); }, 1800);
}

// ---------- Boot ----------
function boot() {
  rerender();
  document.getElementById('btnInstall')?.addEventListener('click', openDeeplink);
  document.getElementById('btnCopyLink')?.addEventListener('click', copyDeeplink);
}
document.addEventListener('DOMContentLoaded', boot);
