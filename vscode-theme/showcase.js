// ============================================================
// Supabase VS Code Theme — showcase (state, preview, wiring)
// ============================================================

const DEFAULT_STATE = {
  preset: 'studio',
  mood: 'brand',
  // Syntax
  keywordHue: 'violet',
  italicComments: 'on',
  italicKeywords: 'off',
  boldFunctions: 'on',
  bracketPairColors: 'on',
  indentGuides: 'visible',
  semanticHighlighting: 'on',
  // Chrome
  activityAccent: 'brand',
  tabStyle: 'underline',
  sidebarContrast: 'flush',
  cursorColor: 'green',
  statusBarEmphasis: 'neutral',
  // Preview
  sample: 'typescript',  // typescript | sql | edge-function | react
  cycleSamples: 'off',
};

let state = { ...DEFAULT_STATE };
let cycleTimer = null;

// ---------- URL state ----------
function encodeState(s) {
  const p = new URLSearchParams();
  for (const [k,v] of Object.entries(s)) p.set(k,v);
  return p.toString();
}
function decodeState() {
  const hash = (location.hash||'').replace(/^#/,'');
  const qs = hash.startsWith('build?') ? hash.slice('build?'.length) : '';
  if (!qs) return null;
  const p = new URLSearchParams(qs);
  const out = { ...DEFAULT_STATE };
  for (const k of Object.keys(DEFAULT_STATE)) { const v = p.get(k); if (v) out[k] = v; }
  return out;
}
function pushHash() { history.replaceState(null,'', '#build?' + encodeState(state)); }

// ---------- Code samples ----------
// Each sample is an array of token-typed line segments: [kind, text].
// kinds: kw, st, num, co, fn, ty, va, pr, pu, op, tag, attr, dec, esc, bi, const, nl, ws, sqlkw, sqlfn
const SAMPLES = {
  typescript: {
    file: 'app/lib/supabase.ts',
    lang: 'typescript',
    lines: [
      [['co', '// Supabase client — typed with generated Database types']],
      [['kw', 'import'], ['pu',' { '], ['va','createClient'], ['pu',' } '], ['kw','from'], ['ws',' '], ['st',"'@supabase/supabase-js'"]],
      [['kw', 'import'], ['ws',' '], ['kw','type'], ['ws',' '], ['pu','{ '], ['ty','Database'], ['pu',' } '], ['kw','from'], ['ws',' '], ['st',"'./database.types'"]],
      [],
      [['kw','const'], ['ws',' '], ['va','SUPABASE_URL'], ['ws',' '], ['op','='], ['ws',' '], ['bi','process'], ['pu','.'], ['pr','env'], ['pu','.'], ['pr','SUPABASE_URL'], ['op','!']],
      [['kw','const'], ['ws',' '], ['va','SUPABASE_KEY'], ['ws',' '], ['op','='], ['ws',' '], ['bi','process'], ['pu','.'], ['pr','env'], ['pu','.'], ['pr','SUPABASE_ANON_KEY'], ['op','!']],
      [],
      [['kw','export'], ['ws',' '], ['kw','const'], ['ws',' '], ['fn','supabase'], ['ws',' '], ['op','='], ['ws',' '], ['fn','createClient'], ['op','<'], ['ty','Database'], ['op','>'], ['pu','('], ['va','SUPABASE_URL'], ['pu',', '], ['va','SUPABASE_KEY'], ['pu',')']],
      [],
      [['co','/** Fetch published posts with author join. */']],
      [['kw','export'], ['ws',' '], ['kw','async'], ['ws',' '], ['kw','function'], ['ws',' '], ['fn','listPosts'], ['pu','('], ['va','limit'], ['op',':'], ['ws',' '], ['ty','number'], ['ws',' '], ['op','='], ['ws',' '], ['num','20'], ['pu',') {']],
      [['ws','  '], ['kw','const'], ['ws',' '], ['pu','{ '], ['va','data'], ['pu',', '], ['va','error'], ['pu',' } '], ['op','='], ['ws',' '], ['kw','await'], ['ws',' '], ['va','supabase']],
      [['ws','    '], ['pu','.'], ['fn','from'], ['pu','('], ['st',"'posts'"], ['pu',')']],
      [['ws','    '], ['pu','.'], ['fn','select'], ['pu','('], ['st',"'id, title, author:profiles(name, avatar_url)'"], ['pu',')']],
      [['ws','    '], ['pu','.'], ['fn','eq'], ['pu','('], ['st',"'status'"], ['pu',', '], ['st',"'published'"], ['pu',')']],
      [['ws','    '], ['pu','.'], ['fn','order'], ['pu','('], ['st',"'created_at'"], ['pu',', '], ['pu','{ '], ['pr','ascending'], ['op',':'], ['ws',' '], ['const','false'], ['pu',' })']],
      [['ws','    '], ['pu','.'], ['fn','limit'], ['pu','('], ['va','limit'], ['pu',')']],
      [['ws','  '], ['kw','if'], ['ws',' '], ['pu','('], ['va','error'], ['pu',') '], ['kw','throw'], ['ws',' '], ['va','error']],
      [['ws','  '], ['kw','return'], ['ws',' '], ['va','data']],
      [['pu','}']],
    ],
  },
  sql: {
    file: 'supabase/migrations/20260418_billing.sql',
    lang: 'sql',
    lines: [
      [['sqlcomm','-- Create billing tables + RLS policy for tenant isolation.']],
      [],
      [['sqlkw','create table'], ['ws',' '], ['ty','public'], ['pu','.'], ['fn','invoices'], ['ws',' '], ['pu','(']],
      [['ws','  '], ['va','id'], ['ws','          '], ['ty','uuid'], ['ws','         '], ['sqlkw','primary key'], ['ws',' '], ['sqlkw','default'], ['ws',' '], ['fn','gen_random_uuid'], ['pu','()'], ['pu',',']],
      [['ws','  '], ['va','org_id'], ['ws','      '], ['ty','uuid'], ['ws','         '], ['sqlkw','not null'], ['ws',' '], ['sqlkw','references'], ['ws',' '], ['fn','organizations'], ['pu','('], ['va','id'], ['pu',') '], ['sqlkw','on delete cascade'], ['pu',',']],
      [['ws','  '], ['va','amount_cents'], ['ws',' '], ['ty','integer'], ['ws','      '], ['sqlkw','not null'], ['ws',' '], ['sqlkw','check'], ['ws',' '], ['pu','('], ['va','amount_cents'], ['ws',' '], ['op','>='], ['ws',' '], ['num','0'], ['pu','),']],
      [['ws','  '], ['va','currency'], ['ws','    '], ['ty','text'], ['ws','         '], ['sqlkw','not null'], ['ws',' '], ['sqlkw','default'], ['ws',' '], ['st',"'usd'"], ['pu',',']],
      [['ws','  '], ['va','status'], ['ws','      '], ['ty','text'], ['ws','         '], ['sqlkw','not null'], ['ws',' '], ['sqlkw','default'], ['ws',' '], ['st',"'pending'"], ['pu',',']],
      [['ws','  '], ['va','created_at'], ['ws','  '], ['ty','timestamptz'], ['ws','  '], ['sqlkw','not null'], ['ws',' '], ['sqlkw','default'], ['ws',' '], ['fn','now'], ['pu','()']],
      [['pu',');']],
      [],
      [['sqlcomm','-- Row-level security: members of the org can read their invoices.']],
      [['sqlkw','alter table'], ['ws',' '], ['fn','invoices'], ['ws',' '], ['sqlkw','enable row level security'], ['pu',';']],
      [],
      [['sqlkw','create policy'], ['ws',' '], ['st',"\"invoices_read_same_org\""], ['ws',' '], ['sqlkw','on'], ['ws',' '], ['fn','invoices']],
      [['ws','  '], ['sqlkw','for'], ['ws',' '], ['sqlkw','select'], ['ws',' '], ['sqlkw','using'], ['ws',' '], ['pu','(']],
      [['ws','    '], ['va','org_id'], ['ws',' '], ['op','in'], ['ws',' '], ['pu','('], ['sqlkw','select'], ['ws',' '], ['va','org_id'], ['ws',' '], ['sqlkw','from'], ['ws',' '], ['fn','members'], ['ws',' '], ['sqlkw','where'], ['ws',' '], ['va','user_id'], ['ws',' '], ['op','='], ['ws',' '], ['fn','auth.uid'], ['pu','())']],
      [['ws','  '], ['pu',');']],
    ],
  },
  'edge-function': {
    file: 'supabase/functions/charge/index.ts',
    lang: 'typescript',
    lines: [
      [['co', '// Edge Function — runs on Deno, settles an invoice via Stripe.']],
      [['kw','import'], ['ws',' '], ['pu','{ '], ['va','serve'], ['pu',' } '], ['kw','from'], ['ws',' '], ['st',"'https://deno.land/std/http/server.ts'"]],
      [['kw','import'], ['ws',' '], ['pu','{ '], ['va','createClient'], ['pu',' } '], ['kw','from'], ['ws',' '], ['st',"'https://esm.sh/@supabase/supabase-js@2'"]],
      [['kw','import'], ['ws',' '], ['va','Stripe'], ['ws',' '], ['kw','from'], ['ws',' '], ['st',"'https://esm.sh/stripe@15'"]],
      [],
      [['kw','const'], ['ws',' '], ['va','stripe'], ['ws',' '], ['op','='], ['ws',' '], ['kw','new'], ['ws',' '], ['fn','Stripe'], ['pu','('], ['bi','Deno'], ['pu','.'], ['pr','env'], ['pu','.'], ['fn','get'], ['pu','('], ['st',"'STRIPE_KEY'"], ['pu',')!, { '], ['pr','apiVersion'], ['op',':'], ['ws',' '], ['st',"'2024-10-28'"], ['pu',' })']],
      [],
      [['fn','serve'], ['pu','('], ['kw','async'], ['ws',' '], ['pu','('], ['va','req'], ['pu',') '], ['op','=>'], ['ws',' '], ['pu','{']],
      [['ws','  '], ['kw','const'], ['ws',' '], ['pu','{ '], ['va','invoiceId'], ['pu',' } '], ['op','='], ['ws',' '], ['kw','await'], ['ws',' '], ['va','req'], ['pu','.'], ['fn','json'], ['pu','()']],
      [['ws','  '], ['kw','const'], ['ws',' '], ['va','db'], ['ws',' '], ['op','='], ['ws',' '], ['fn','createClient'], ['pu','('], ['bi','Deno'], ['pu','.'], ['pr','env'], ['pu','.'], ['fn','get'], ['pu','('], ['st',"'SUPABASE_URL'"], ['pu',')!, '], ['bi','Deno'], ['pu','.'], ['pr','env'], ['pu','.'], ['fn','get'], ['pu','('], ['st',"'SERVICE_KEY'"], ['pu',')!)']],
      [],
      [['ws','  '], ['kw','const'], ['ws',' '], ['pu','{ '], ['va','data'], ['op',':'], ['ws',' '], ['va','invoice'], ['pu',' } '], ['op','='], ['ws',' '], ['kw','await'], ['ws',' '], ['va','db'], ['pu','.'], ['fn','from'], ['pu','('], ['st',"'invoices'"], ['pu',')'], ['pu','.'], ['fn','select'], ['pu','()'], ['pu','.'], ['fn','eq'], ['pu','('], ['st',"'id'"], ['pu',', '], ['va','invoiceId'], ['pu',')'], ['pu','.'], ['fn','single'], ['pu','()']],
      [['ws','  '], ['kw','const'], ['ws',' '], ['va','charge'], ['ws',' '], ['op','='], ['ws',' '], ['kw','await'], ['ws',' '], ['va','stripe'], ['pu','.'], ['pr','charges'], ['pu','.'], ['fn','create'], ['pu','({ '], ['pr','amount'], ['op',':'], ['ws',' '], ['va','invoice'], ['pu','.'], ['pr','amount_cents'], ['pu',', '], ['pr','currency'], ['op',':'], ['ws',' '], ['va','invoice'], ['pu','.'], ['pr','currency'], ['pu',' })']],
      [],
      [['ws','  '], ['kw','return'], ['ws',' '], ['kw','new'], ['ws',' '], ['fn','Response'], ['pu','('], ['fn','JSON.stringify'], ['pu','('], ['pu','{ '], ['pr','ok'], ['op',':'], ['ws',' '], ['const','true'], ['pu',', '], ['pr','id'], ['op',':'], ['ws',' '], ['va','charge'], ['pu','.'], ['pr','id'], ['pu',' }), { '], ['pr','status'], ['op',':'], ['ws',' '], ['num','200'], ['pu',' })']],
      [['pu','})']],
    ],
  },
  react: {
    file: 'app/(dashboard)/posts/page.tsx',
    lang: 'tsx',
    lines: [
      [['co','// Server Component — list posts from Supabase.']],
      [['kw','import'], ['ws',' '], ['pu','{ '], ['va','supabase'], ['pu',' } '], ['kw','from'], ['ws',' '], ['st',"'@/lib/supabase'"]],
      [['kw','import'], ['ws',' '], ['va','Link'], ['ws',' '], ['kw','from'], ['ws',' '], ['st',"'next/link'"]],
      [],
      [['kw','export'], ['ws',' '], ['kw','default'], ['ws',' '], ['kw','async'], ['ws',' '], ['kw','function'], ['ws',' '], ['fn','PostsPage'], ['pu','() {']],
      [['ws','  '], ['kw','const'], ['ws',' '], ['pu','{ '], ['va','data'], ['op',':'], ['ws',' '], ['va','posts'], ['pu',' } '], ['op','='], ['ws',' '], ['kw','await'], ['ws',' '], ['va','supabase'], ['pu','.'], ['fn','from'], ['pu','('], ['st',"'posts'"], ['pu',')'], ['pu','.'], ['fn','select'], ['pu','()']],
      [],
      [['ws','  '], ['kw','return'], ['ws',' '], ['pu','('],],
      [['ws','    '], ['tag','<section'], ['ws',' '], ['attr','className'], ['op','='], ['st','"mx-auto max-w-2xl py-12"'], ['tag','>']],
      [['ws','      '], ['tag','<h1'], ['ws',' '], ['attr','className'], ['op','='], ['st','"text-4xl font-medium"'], ['tag','>'], ['va','Posts'], ['tag','</h1>']],
      [['ws','      '], ['tag','<ul'], ['ws',' '], ['attr','className'], ['op','='], ['st','"mt-6 space-y-2"'], ['tag','>']],
      [['ws','        '], ['pu','{'], ['va','posts'], ['op','?.'], ['fn','map'], ['pu','(('], ['va','p'], ['pu',') '], ['op','=>'], ['ws',' '], ['pu','('],],
      [['ws','          '], ['tag','<li'], ['ws',' '], ['attr','key'], ['op','='], ['pu','{'], ['va','p'], ['pu','.'], ['pr','id'], ['pu','}>']],
      [['ws','            '], ['tag','<Link'], ['ws',' '], ['attr','href'], ['op','='], ['pu','{`/posts/${'], ['va','p'], ['pu','.'], ['pr','slug'], ['pu','}`}>'], ['pu','{'], ['va','p'], ['pu','.'], ['pr','title'], ['pu','}'], ['tag','</Link>']],
      [['ws','          '], ['tag','</li>']],
      [['ws','        '], ['pu','))}']],
      [['ws','      '], ['tag','</ul>']],
      [['ws','    '], ['tag','</section>']],
      [['ws','  '], ['pu',')']],
      [['pu','}']],
    ],
  },
};

// Token kind → syntax role
const KIND_TO_ROLE = {
  kw: 'keyword', st: 'string', num: 'number', co: 'comment',
  fn: 'function', ty: 'type', va: 'variable', pr: 'property',
  pu: 'punctuation', op: 'operator', tag: 'tag', attr: 'attribute',
  dec: 'decorator', esc: 'escape', bi: 'builtin', const: 'constant',
  ws: 'whitespace',
  sqlkw: 'sqlKeyword', sqlcomm: 'sqlComment',
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Render one code line as styled spans
function renderLine(segments, syntax) {
  if (!segments || segments.length === 0) return '&nbsp;';
  return segments.map(([kind, text]) => {
    const role = KIND_TO_ROLE[kind] || 'variable';
    if (role === 'whitespace') return escapeHtml(text);
    const hex = syntax[role] || syntax.variable;
    const styles = [`color:${hex}`];
    if ((kind === 'kw' || kind === 'sqlkw' || kind === 'dec') && state.italicKeywords === 'on') styles.push('font-style:italic');
    if (kind === 'co' && state.italicComments === 'on') styles.push('font-style:italic');
    if (kind === 'sqlcomm') styles.push('font-style:italic');
    if (kind === 'fn' && state.boldFunctions === 'on') styles.push('font-weight:700');
    return `<span style="${styles.join(';')}" data-role="${role}">${escapeHtml(text)}</span>`;
  }).join('');
}

// ---------- Build preview (full fake IDE) ----------
function buildPreview() {
  const theme = resolveTheme(state);
  const { preset, ansi, syntax, chrome } = theme;
  const sample = SAMPLES[state.sample] || SAMPLES.typescript;
  const bracketsOn = state.bracketPairColors === 'on';

  // File tree
  const tree = `
    <div class="vs-tree">
      <div class="vs-tree-section">SUPABASE-APP</div>
      <div class="vs-tree-row open"><span class="chev">▾</span><span class="folder">app</span></div>
      <div class="vs-tree-row nested open"><span class="chev">▾</span><span class="folder">(dashboard)</span></div>
      <div class="vs-tree-row nested-2 ${state.sample==='react'?'is-active':''}"><span class="file tsx">page.tsx</span><span class="gdot m">M</span></div>
      <div class="vs-tree-row nested open"><span class="chev">▾</span><span class="folder">lib</span></div>
      <div class="vs-tree-row nested-2 ${state.sample==='typescript'?'is-active':''}"><span class="file ts">supabase.ts</span></div>
      <div class="vs-tree-row nested-2"><span class="file ts">database.types.ts</span></div>
      <div class="vs-tree-row open"><span class="chev">▾</span><span class="folder">supabase</span></div>
      <div class="vs-tree-row nested open"><span class="chev">▾</span><span class="folder">migrations</span></div>
      <div class="vs-tree-row nested-2 ${state.sample==='sql'?'is-active':''}"><span class="file sql">20260418_billing.sql</span><span class="gdot u">U</span></div>
      <div class="vs-tree-row nested open"><span class="chev">▾</span><span class="folder">functions</span></div>
      <div class="vs-tree-row nested-2 open"><span class="chev">▾</span><span class="folder">charge</span></div>
      <div class="vs-tree-row nested-3 ${state.sample==='edge-function'?'is-active':''}"><span class="file ts">index.ts</span></div>
      <div class="vs-tree-row"><span class="chev">▸</span><span class="folder">node_modules</span></div>
      <div class="vs-tree-row"><span class="file env">.env.local</span><span class="gdot i">•</span></div>
      <div class="vs-tree-row"><span class="file md">README.md</span></div>
    </div>`;

  // Activity bar
  const activityBar = `
    <div class="vs-activity" style="background:${chrome.activityBarBg}; border-right:1px solid ${chrome.activityBarBorder};">
      ${[
        {k:'files', on:true, badge:3},
        {k:'search'},
        {k:'source'},
        {k:'debug'},
        {k:'ext'},
        {k:'supa', brand:true},
      ].map((it)=>`
        <div class="vs-ab-item ${it.on?'is-on':''}" style="color:${it.on?chrome.activityBarActiveFg:chrome.activityBarFg}">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            ${({
              files:'<path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z"/><path d="M13 3v7h7"/>',
              search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
              source:'<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 8v8M8 6h8a2 2 0 0 1 2 2v2"/>',
              debug:'<path d="M8 6h8v4a4 4 0 0 1-8 0z"/><path d="M4 12h4M16 12h4M4 8l3 2M20 8l-3 2M4 16l3-2M20 16l-3-2M12 14v6"/>',
              ext:'<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><path d="M17 13v4h-4"/>',
              supa:'',
            })[it.k] || ''}
          </svg>
          ${it.k==='supa' ? `<svg viewBox="0 0 109 113" width="18" height="18" style="position:absolute"><path d="M63.7 110.3c-2.9 3.6-8.7 1.6-8.7-3L54 40h45.2c8.2 0 12.8 9.5 7.7 15.9z" fill="${chrome.activityBarActiveFg}"/><path d="M45.3 2.1c2.9-3.6 8.7-1.6 8.7 3l.5 67.2H9.8c-8.2 0-12.8-9.5-7.7-15.9z" fill="${chrome.activityBarActiveFg}" opacity="0.6"/></svg>` : ''}
          ${it.badge ? `<span class="vs-ab-badge" style="background:${chrome.activityBarBadgeBg};color:${chrome.activityBarBadgeFg}">${it.badge}</span>`:''}
        </div>`).join('')}
    </div>`;

  // Sidebar wrapper
  const sidebar = `
    <div class="vs-sidebar" style="background:${chrome.sidebarBg}; color:${chrome.sidebarFg}; border-right:1px solid ${chrome.sidebarBorder};">
      <div class="vs-sidebar-title">EXPLORER</div>
      ${tree}
    </div>`;

  // Tab strip — active tab reflects current sample
  const tabs = [
    { id: 'typescript', file: 'supabase.ts', icon: 'ts', dirty: false },
    { id: 'sql', file: '20260418_billing.sql', icon: 'sql', dirty: false },
    { id: 'edge-function', file: 'index.ts', icon: 'ts', dirty: true },
    { id: 'react', file: 'page.tsx', icon: 'tsx', dirty: false },
  ];
  const tabModeClass = `tab-mode-${state.tabStyle}`;
  const tabStrip = `
    <div class="vs-tabs ${tabModeClass}" style="background:${chrome.tabsBg}; border-bottom:1px solid ${chrome.tabBorder};">
      ${tabs.map(t => {
        const active = t.id === state.sample;
        const bg = active ? chrome.tabActiveBg : 'transparent';
        const fg = active ? chrome.tabActiveFg : chrome.tabInactiveFg;
        const border = active ? chrome.tabActiveBorderTop : 'transparent';
        return `
          <div class="vs-tab ${active?'is-active':''}" data-tab="${t.id}"
               style="background:${bg};color:${fg};--tab-border:${border};">
            <span class="vs-tab-icon icon-${t.icon}"></span>
            <span class="vs-tab-label">${escapeHtml(t.file)}</span>
            ${t.dirty ? `<span class="vs-tab-dirty">●</span>` : `<span class="vs-tab-x">×</span>`}
          </div>`;
      }).join('')}
    </div>`;

  // Breadcrumb
  const crumbs = sample.file.split('/');
  const breadcrumb = `
    <div class="vs-breadcrumbs" style="background:${chrome.editorBg}; color:${chrome.breadcrumbFg}; border-bottom:1px solid ${chrome.sidebarBorder};">
      ${crumbs.map((p,i) => `<span class="${i===crumbs.length-1?'bc-last':''}" style="${i===crumbs.length-1?'color:'+chrome.breadcrumbActive:''}">${escapeHtml(p)}</span>`).join('<span class="bc-sep">›</span>')}
    </div>`;

  // Editor body — code lines with line numbers + optional bracket rainbow on punctuation
  const bracketRainbow = ['bracket1','bracket2','bracket3','bracket4','bracket5','bracket6'];
  let bracketDepth = 0;

  const indentOn = state.indentGuides !== 'hidden';
  const semanticOn = state.semanticHighlighting === 'on';
  const cursorHex = state.cursorColor === 'white' ? (chrome.editorFg || '#EDEDED')
                  : state.cursorColor === 'inverse' ? '#FFFFFF'
                  : chrome.cursor;

  const codeLines = sample.lines.map((segs, i) => {
    const ln = i + 1;
    const active = (ln === 7);
    // indent level: count leading whitespace segment chars / 2
    let indentChars = 0;
    if (segs.length && segs[0][0] === 'ws') indentChars = segs[0][1].length;
    const indentLevels = Math.floor(indentChars / 2);

    let html;
    if (segs.length === 0) {
      html = '&nbsp;';
    } else {
      // Walk segments; if bracket colorization is on, recolor {}[]() punctuation
      html = segs.map(([kind, text]) => {
        const role = KIND_TO_ROLE[kind] || 'variable';
        if (role === 'whitespace') return escapeHtml(text);

        // Bracket colorization override for punctuation characters
        if (bracketsOn && kind === 'pu') {
          let out = '';
          for (const ch of text) {
            if ('([{'.includes(ch)) {
              const hex = chrome[bracketRainbow[bracketDepth % 6]];
              bracketDepth++;
              out += `<span style="color:${hex}">${escapeHtml(ch)}</span>`;
            } else if (')]}'.includes(ch)) {
              bracketDepth = Math.max(0, bracketDepth - 1);
              const hex = chrome[bracketRainbow[bracketDepth % 6]];
              out += `<span style="color:${hex}">${escapeHtml(ch)}</span>`;
            } else {
              out += `<span style="color:${syntax.punctuation}">${escapeHtml(ch)}</span>`;
            }
          }
          return out;
        }

        // Semantic highlighting: when OFF, collapse property→variable and method→function,
        // so distinct scopes visibly merge. When ON, preserve the preset's distinctions.
        let effectiveRole = role;
        if (!semanticOn) {
          if (role === 'property') effectiveRole = 'variable';
          if (role === 'method') effectiveRole = 'function';
          if (role === 'parameter') effectiveRole = 'variable';
          if (role === 'classDef') effectiveRole = 'type';
        }

        const hex = syntax[effectiveRole] || syntax.variable;
        const styles = [`color:${hex}`];
        if ((kind === 'kw' || kind === 'sqlkw' || kind === 'dec') && state.italicKeywords === 'on') styles.push('font-style:italic');
        if (kind === 'co' && state.italicComments === 'on') styles.push('font-style:italic');
        if (kind === 'sqlcomm') styles.push('font-style:italic');
        if (kind === 'fn' && state.boldFunctions === 'on') styles.push('font-weight:700');
        return `<span style="${styles.join(';')}" data-role="${effectiveRole}">${escapeHtml(text)}</span>`;
      }).join('');
    }

    // Indent guides — vertical ticks, one per 2-space level, anchored in the code column
    let guides = '';
    if (indentOn && indentLevels > 0) {
      for (let g = 0; g < indentLevels; g++) {
        const color = (active && g === indentLevels - 1) ? chrome.indentGuideActive : chrome.indentGuide;
        // 7.2px per char roughly at 13px mono + 0.3 tracking → use ch units
        guides += `<span class="vs-ig" style="left:calc(${g * 2}ch + 0.5ch); background:${color}"></span>`;
      }
    }

    // Cursor on active line, at end of visible text
    const caret = active
      ? `<span class="vs-caret" style="background:${cursorHex}"></span>`
      : '';

    return `
      <div class="vs-line ${active?'is-active':''}" data-ln="${ln}">
        <span class="vs-ln" style="color:${active?chrome.lineNumberActive:chrome.lineNumber}">${ln}</span>
        <span class="vs-code-line">${guides}${html}${caret}</span>
      </div>`;
  }).join('');

  // Minimap (tiny blocks per line)
  const minimap = sample.lines.map((segs, i) => {
    if (!segs.length) return `<div class="mm-line empty"></div>`;
    const blocks = segs.slice(0, 12).map(([kind, text]) => {
      const role = KIND_TO_ROLE[kind] || 'variable';
      if (role === 'whitespace') return `<span class="mm-w" style="width:${Math.min(20, text.length*2)}px"></span>`;
      const hex = syntax[role] || syntax.variable;
      return `<span class="mm-b" style="background:${hex};width:${Math.min(30, Math.max(4, text.length*1.5))}px"></span>`;
    }).join('');
    return `<div class="mm-line ${i===6?'is-active':''}">${blocks}</div>`;
  }).join('');

  // Terminal panel (bottom) — shows `supabase start` output with ANSI colors
  const termBody = [
    `<span style="color:${ansi.cyan};font-weight:700">alex</span><span style="color:${ansi.white};opacity:0.7">@</span><span style="color:${ansi.magenta}">studio</span> <span style="color:${ansi.blue};font-weight:700">~/supabase-app</span> <span style="color:${ansi.green};font-weight:700">❯</span> <span style="color:${ansi.fg}">supabase start</span>`,
    `<span style="color:${ansi.white}">Started supabase local development setup.</span>`,
    `  <span style="color:${ansi.green}">✓</span> <span style="color:${ansi.fg}">API</span>      <span style="color:${ansi.white}">http://127.0.0.1:</span><span style="color:${ansi.yellow};font-weight:700">54321</span>`,
    `  <span style="color:${ansi.green}">✓</span> <span style="color:${ansi.fg}">DB </span>      <span style="color:${ansi.white}">postgresql://postgres@127.0.0.1:</span><span style="color:${ansi.yellow};font-weight:700">54322</span>`,
    `  <span style="color:${ansi.green}">✓</span> <span style="color:${ansi.fg}">Studio</span>   <span style="color:${ansi.white}">http://127.0.0.1:</span><span style="color:${ansi.yellow};font-weight:700">54323</span>`,
    `<span style="color:${ansi.cyan};font-weight:700">alex</span><span style="color:${ansi.white};opacity:0.7">@</span><span style="color:${ansi.magenta}">studio</span> <span style="color:${ansi.blue};font-weight:700">~/supabase-app</span> <span style="color:${ansi.green};font-weight:700">❯</span> <span class="vs-term-cursor" style="background:${ansi.cursor}">&nbsp;</span>`,
  ].map(l=>`<div class="vs-term-line">${l}</div>`).join('');

  const terminalPanel = `
    <div class="vs-panel" style="background:${chrome.panelBg}; border-top:1px solid ${chrome.panelBorder};">
      <div class="vs-panel-tabs" style="border-bottom:1px solid ${chrome.panelBorder}; color:${chrome.activityBarFg};">
        <span>PROBLEMS <span class="vs-count" style="background:${chrome.sidebarBg}">1</span></span>
        <span>OUTPUT</span>
        <span>DEBUG CONSOLE</span>
        <span class="is-on" style="color:${chrome.editorFg}; border-bottom-color:${chrome.activityBarActiveFg}">TERMINAL</span>
        <span>PORTS</span>
      </div>
      <div class="vs-term" style="background:${ansi.bg};color:${ansi.fg}">
        ${termBody}
      </div>
    </div>`;

  // Status bar
  const statusBar = `
    <div class="vs-status" style="background:${chrome.statusBarBg};color:${chrome.statusBarFg};border-top:1px solid ${chrome.statusBarBorder};">
      <div class="vs-status-left">
        <span class="vs-st-item"><span class="vs-st-ico">⎇</span>main</span>
        <span class="vs-st-item">↓ 0 ↑ 2</span>
        <span class="vs-st-item">⨯ 0</span>
        <span class="vs-st-item">⚠ 1</span>
      </div>
      <div class="vs-status-right">
        <span class="vs-st-item">Ln 7, Col 18</span>
        <span class="vs-st-item">UTF-8</span>
        <span class="vs-st-item">LF</span>
        <span class="vs-st-item">${sample.lang === 'tsx' ? 'TypeScript JSX' : sample.lang === 'sql' ? 'SQL' : 'TypeScript'}</span>
        <span class="vs-st-item vs-st-brand" style="background:${chrome.activityBarBadgeBg};color:${chrome.activityBarBadgeFg}">
          <svg viewBox="0 0 109 113" width="10" height="10"><path d="M63.7 110.3c-2.9 3.6-8.7 1.6-8.7-3L54 40h45.2c8.2 0 12.8 9.5 7.7 15.9z" fill="currentColor"/><path d="M45.3 2.1c2.9-3.6 8.7-1.6 8.7 3l.5 67.2H9.8c-8.2 0-12.8-9.5-7.7-15.9z" fill="currentColor" opacity="0.7"/></svg>
          Supabase
        </span>
      </div>
    </div>`;

  // Title bar
  const titleBar = `
    <div class="vs-titlebar" style="background:${chrome.titleBarBg};color:${chrome.titleBarFg};border-bottom:1px solid ${chrome.sidebarBorder};">
      <div class="vs-traffic"><span class="td r"></span><span class="td y"></span><span class="td g"></span></div>
      <div class="vs-title">${escapeHtml(preset.name)} — supabase-app</div>
      <div class="vs-title-spacer"></div>
    </div>`;

  return `
    <div class="vscode" style="background:${chrome.editorBg};">
      ${titleBar}
      <div class="vs-main">
        ${activityBar}
        ${sidebar}
        <div class="vs-editor-col">
          ${tabStrip}
          ${breadcrumb}
          <div class="vs-editor" style="background:${chrome.editorBg};color:${chrome.editorFg}">
            <div class="vs-code">${codeLines}</div>
            <div class="vs-minimap" style="background:${chrome.minimapBg}">${minimap}</div>
          </div>
          ${terminalPanel}
        </div>
      </div>
      ${statusBar}
    </div>`;
}

// ---------- Palette viz ----------
function buildPaletteViz() {
  const { ansi, syntax, chrome } = resolveTheme(state);
  const rowSyntax = [
    ['keyword', syntax.keyword], ['string', syntax.string], ['number', syntax.number],
    ['function', syntax.function], ['type', syntax.type], ['comment', syntax.comment],
    ['operator', syntax.operator], ['tag', syntax.tag],
  ];
  const rowChrome = [
    ['editor.bg', chrome.editorBg], ['sidebar.bg', chrome.sidebarBg], ['tab.active', chrome.tabActiveBg],
    ['cursor', chrome.cursor], ['selection', chrome.selectionBg], ['accent', chrome.activityBarActiveFg],
    ['status.bg', chrome.statusBarBg], ['bracket.1', chrome.bracket1],
  ];
  const rowAnsi = [
    ['ansi.black', ansi.black], ['ansi.red', ansi.red], ['ansi.green', ansi.green], ['ansi.yellow', ansi.yellow],
    ['ansi.blue', ansi.blue], ['ansi.magenta', ansi.magenta], ['ansi.cyan', ansi.cyan], ['ansi.white', ansi.white],
  ];
  const renderRow = (row, label, group) => `
    <div class="pv-row" data-pv-group="${group}">
      <div class="pv-row-label">${label}</div>
      <div class="pv-swatches">
        ${row.map(([name,hex]) => `
          <div class="pv-swatch" title="${name} · ${hex}" data-role="${name}">
            <div class="pv-color" style="background:${hex}"></div>
            <div class="pv-name">${name}</div>
            <div class="pv-hex">${(hex+'').toUpperCase()}</div>
          </div>`).join('')}
      </div>
    </div>`;
  return renderRow(rowSyntax, 'syntax', 'syntax') +
         renderRow(rowChrome, 'chrome', 'chrome') +
         renderRow(rowAnsi,   'terminal', 'ansi');
}

// ---------- Controls ----------
function buildControls() {
  const { preset } = resolveTheme(state);
  const drifting = preset.canonical && state.mood !== 'brand';

  const sections = [
    { group: 'Palette', controls: [
      { id:'preset', name:'Preset', hint: PRESETS[state.preset].name,
        desc: PRESETS[state.preset].blurb,
        options: [
          ['studio','Studio Dark', SB.bgStudio, '· canonical'],
          ['deep-dark','Deep Dark', '#0A0A0A'],
          ['midnight-green','Midnight Green', '#0A1512'],
          ['classic-dark','Classic Dark', '#0F1115'],
          ['high-contrast','High Contrast', '#000000'],
          ['mono-green','Monochrome + Green', '#0D0D0D'],
        ] },
      { id:'mood', name:'Palette mood', hint: state.mood,
        desc: state.mood==='brand'
          ? 'No transform. Studio Dark + brand = exact Supabase design-system palette.'
          : 'Saturation/lightness transform applied globally. Brand green stays recognizable.',
        options: [['brand','brand'],['vibrant','vibrant'],['muted','muted'],['pastel','pastel'],['mono-green','mono+green']] },
    ] },
    { group: 'Syntax', controls: [
      { id:'keywordHue', name:'Keyword hue', hint: state.keywordHue,
        desc: 'Which code-block slot drives keywords, storage, control-flow and decorators.',
        options: [
          ['violet','violet','#CEA5E8'],['green','green','#3ECF8E'],['amber','amber','#F5C07A'],
          ['teal','teal','#7FCFC0'],['orange','orange','#EE8C68'],['lime','lime','#C4DB7C'],
        ] },
      { id:'italicComments', name:'Italic comments', hint: state.italicComments,
        desc:'Comments and doc comments render in italics.',
        options: [['on','on'],['off','off']] },
      { id:'italicKeywords', name:'Italic keywords', hint: state.italicKeywords,
        desc:'Keywords, storage, control-flow and decorators render in italics.',
        options: [['on','on'],['off','off']] },
      { id:'boldFunctions', name:'Bold functions', hint: state.boldFunctions,
        desc:'Function and method declarations render bold.',
        options: [['on','on'],['off','off']] },
      { id:'bracketPairColors', name:'Bracket pair colors', hint: state.bracketPairColors,
        desc:'Matching brackets get rainbow colors (VS Code 1.60+).',
        options: [['on','on'],['off','off']] },
      { id:'indentGuides', name:'Indent guides', hint: state.indentGuides,
        desc:'Vertical lines marking indent levels in the editor.',
        options: [['visible','visible'],['hidden','hidden']] },
      { id:'semanticHighlighting', name:'Semantic highlighting', hint: state.semanticHighlighting,
        desc:'Let the language server distinguish types from variables, methods from properties.',
        options: [['on','on'],['off','off']] },
    ] },
    { group: 'Editor chrome', controls: [
      { id:'activityAccent', name:'Activity bar accent', hint: state.activityAccent,
        desc:'How loud the active item in the far-left icon rail is.',
        options: [['brand','brand'],['subtle','subtle'],['hidden','hidden']] },
      { id:'tabStyle', name:'Tab style', hint: state.tabStyle,
        desc:'Active tab treatment — top underline, soft fill, or full box.',
        options: [['underline','underline'],['filled','filled'],['boxed','boxed']] },
      { id:'sidebarContrast', name:'Sidebar contrast', hint: state.sidebarContrast,
        desc:'Sidebar at same level as editor (flush) or slightly raised.',
        options: [['flush','flush'],['raised','raised']] },
      { id:'cursorColor', name:'Cursor color', hint: state.cursorColor,
        desc:'Text cursor color — brand green, foreground-white, or inverse.',
        options: [['green','green'],['white','white'],['inverse','inverse']] },
      { id:'statusBarEmphasis', name:'Status bar', hint: state.statusBarEmphasis,
        desc:'Neutral near-black status bar or full brand-green bar.',
        options: [['neutral','neutral'],['brand','brand']] },
    ] },
    { group: 'Preview sample', controls: [
      { id:'sample', name:'Code sample', hint: state.sample,
        desc:'Which Supabase file to show in the editor.',
        options: [
          ['typescript','TypeScript'],
          ['sql','SQL migration'],
          ['edge-function','Edge function'],
          ['react','React (TSX)'],
        ] },
      { id:'cycleSamples', name:'Auto-cycle', hint: state.cycleSamples,
        desc:'Cycle through all four samples every 4 seconds.',
        options: [['off','off'],['on','on']] },
    ] },
  ];

  const chip = drifting
    ? `<div class="drift-chip" title="Studio Dark is canonical. Non-brand moods transform its colors.">
         <span class="drift-dot"></span>drifting from system
       </div>`
    : preset.canonical
      ? `<div class="brand-chip" title="Exact Supabase design-system palette. Guaranteed.">
           <span class="brand-dot"></span>matches design system
         </div>`
      : '';

  const sectionsHtml = sections.map(s=>`
    <div class="ctrl-section">
      <div class="ctrl-group-label">${s.group}</div>
      ${s.controls.map(r=>`
        <div class="control">
          <div class="control-label">
            <span class="name">${r.name}</span>
            <span class="hint">${r.hint}</span>
          </div>
          <p class="control-desc">${r.desc}</p>
          <div class="seg" data-control="${r.id}">
            ${r.options.map(opt=>{
              const [v,l,sw,suf] = opt;
              const swHtml = sw ? `<span class="seg-swatch" style="background:${sw}"></span>`:'';
              const sufHtml = suf ? `<span class="seg-suffix">${suf}</span>`:'';
              return `<button data-value="${v}" class="${state[r.id]===v?'is-on':''}">${swHtml}<span>${l}</span>${sufHtml}</button>`;
            }).join('')}
          </div>
        </div>`).join('')}
    </div>`).join('');

  return chip + sectionsHtml;
}

function buildConfigSummary() {
  const order = ['preset','mood','keywordHue','italicComments','italicKeywords','boldFunctions',
                 'bracketPairColors','indentGuides','semanticHighlighting',
                 'activityAccent','tabStyle','sidebarContrast','cursorColor','statusBarEmphasis','sample'];
  return order.map(k => `<span class="k">${k}:</span> <span class="v">${state[k]}</span>`).join(' &nbsp;·&nbsp; ');
}

// ---------- Render + wire ----------
function render() {
  document.getElementById('previewMount').innerHTML = buildPreview();
  document.getElementById('paletteViz').innerHTML = buildPaletteViz();
  document.getElementById('builderControls').innerHTML = buildControls();
  document.getElementById('configSummary').innerHTML = buildConfigSummary();
  wireControls();
  wirePaletteHover();
  wireTabClicks();
  pushHash();
  updateCycleTimer();
}

function wireControls() {
  document.querySelectorAll('#builderControls .seg').forEach(seg => {
    seg.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        state[seg.dataset.control] = btn.dataset.value;
        render();
      });
    });
  });
}

function wireTabClicks() {
  document.querySelectorAll('#previewMount .vs-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tab;
      if (id && SAMPLES[id]) { state.sample = id; render(); }
    });
  });
}

// Hover a palette swatch → highlight all matching tokens in the preview.
function wirePaletteHover() {
  const swatches = document.querySelectorAll('#paletteViz .pv-swatch');
  swatches.forEach(sw => {
    sw.addEventListener('mouseenter', () => {
      const role = sw.dataset.role;
      const mount = document.getElementById('previewMount');
      if (!mount) return;
      mount.querySelectorAll('[data-role]').forEach(el => {
        if (el.dataset.role === role) el.classList.add('pv-hover-hit');
        else el.classList.add('pv-hover-dim');
      });
    });
    sw.addEventListener('mouseleave', () => {
      document.querySelectorAll('.pv-hover-hit, .pv-hover-dim').forEach(el => {
        el.classList.remove('pv-hover-hit','pv-hover-dim');
      });
    });
  });
}

function updateCycleTimer() {
  if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
  if (state.cycleSamples !== 'on') return;
  const order = ['typescript','sql','edge-function','react'];
  cycleTimer = setInterval(() => {
    const i = order.indexOf(state.sample);
    state.sample = order[(i+1) % order.length];
    document.getElementById('previewMount').innerHTML = buildPreview();
    document.getElementById('paletteViz').innerHTML = buildPaletteViz();
    document.getElementById('configSummary').innerHTML = buildConfigSummary();
    // Update just the sample button highlights in controls
    const seg = document.querySelector('.seg[data-control="sample"]');
    if (seg) seg.querySelectorAll('button').forEach(b => b.classList.toggle('is-on', b.dataset.value===state.sample));
    wirePaletteHover();
    wireTabClicks();
    pushHash();
  }, 4200);
}

// ---------- Share URL ----------
document.getElementById('copyUrlBtn').addEventListener('click', async () => {
  const url = `${location.origin}${location.pathname}#build?${encodeState(state)}`;
  try { await navigator.clipboard.writeText(url); } catch(e) {}
  const lbl = document.getElementById('copyUrlLabel');
  const btn = document.getElementById('copyUrlBtn');
  const original = lbl.textContent;
  lbl.textContent = 'copied ✓';
  btn.classList.add('is-flashed');
  setTimeout(() => { lbl.textContent = original; btn.classList.remove('is-flashed'); }, 1400);
});

// ---------- Download VSIX bundle ----------
function themeName() {
  const p = PRESETS[state.preset].name;
  if (state.mood === 'brand') return `Supabase ${p}`;
  const niceMood = state.mood === 'mono-green' ? 'Mono+Green' : state.mood.charAt(0).toUpperCase() + state.mood.slice(1);
  return `Supabase ${p} — ${niceMood}`;
}
function slugName() {
  return themeName().toLowerCase().replace(/[+—]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

// Build a small PNG icon (128x128) for the extension, using a canvas.
function buildIconPng() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#121212';
  ctx.fillRect(0,0,128,128);
  // brand bolt
  const path1 = new Path2D('M63.71 110.28C60.85 113.89 55.05 111.91 54.98 107.31L53.97 40.06H99.19C107.38 40.06 111.95 49.52 106.86 55.94L63.71 110.28Z');
  const path2 = new Path2D('M45.32 2.07C48.18 -1.53 53.97 0.44 54.04 5.04L54.48 72.29H9.83C1.64 72.29 -2.93 62.83 2.17 56.42L45.32 2.07Z');
  ctx.save();
  ctx.translate(10, 8);
  ctx.fillStyle = '#249361'; ctx.fill(path1);
  ctx.fillStyle = '#3ECF8E'; ctx.fill(path2);
  ctx.restore();
  return new Promise(res => c.toBlob(res, 'image/png'));
}

document.getElementById('downloadBtn').addEventListener('click', async () => {
  const btn = document.getElementById('downloadBtn');
  btn.disabled = true;
  try {
    if (typeof JSZip === 'undefined') throw new Error('JSZip not loaded');
    const theme = resolveTheme(state);
    const name = themeName();
    const slug = slugName();
    const E = window.__vscodeExporters;

    const colorTheme = E.buildColorThemeJson(theme, state, name);
    const pkg = E.buildPackageJson(name, slug, state);
    const readme = E.buildReadme(name, slug, state);
    const snippet = E.buildSettingsSnippet(theme, state);
    const tokens = E.buildTokensJson(theme, name, state);
    const iconBlob = await buildIconPng();

    // Build the .vsix (a ZIP with the VSCE layout)
    const vsix = new JSZip();
    // VS Code extension content goes under extension/
    const ext = vsix.folder('extension');
    ext.file('package.json', pkg);
    ext.file('README.md', readme);
    ext.folder('themes').file(`${slug}-color-theme.json`, colorTheme);
    if (iconBlob) ext.file('icon.png', iconBlob);
    // Minimal [Content_Types].xml + extension manifest for VSIX recognition
    vsix.file('[Content_Types].xml',
`<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json"/>
  <Default Extension="md" ContentType="text/markdown"/>
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="vsixmanifest" ContentType="text/xml"/>
</Types>`);
    vsix.file('extension.vsixmanifest',
`<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
  <Metadata>
    <Identity Language="en-US" Id="${slug}" Version="1.0.0" Publisher="supabase-desktop-kits"/>
    <DisplayName>${name}</DisplayName>
    <Description xml:space="preserve">Unofficial Supabase-inspired VS Code color theme.</Description>
    <Tags>theme,supabase,dark,color-theme</Tags>
    <Categories>Themes</Categories>
    <GalleryFlags>Public</GalleryFlags>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code"/>
  </Installation>
  <Dependencies/>
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true"/>
  </Assets>
</PackageManifest>`);
    const vsixBlob = await vsix.generateAsync({ type:'blob', mimeType:'application/vsix' });

    // Outer ZIP with everything so users get the vsix + raw files + readme
    const outer = new JSZip();
    const root = outer.folder(`supabase-vscode-${slug}`);
    root.file(`${slug}-1.0.0.vsix`, vsixBlob);
    root.file('package.json', pkg);
    root.folder('themes').file(`${slug}-color-theme.json`, colorTheme);
    root.file('settings-snippet.json', snippet);
    root.file('tokens.json', tokens);
    root.file('README.md', readme);
    root.file('build.json', JSON.stringify(state, null, 2));
    if (iconBlob) root.file('icon.png', iconBlob);

    const blob = await outer.generateAsync({ type:'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `supabase-vscode-${slug}.zip`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  } catch (e) { console.error(e); alert('Download failed; see console.'); }
  finally { btn.disabled = false; }
});

// ---------- Install tabs ----------
document.querySelectorAll('.install-tabs [data-tab]').forEach(tab => {
  tab.addEventListener('click', () => {
    const id = tab.dataset.tab;
    document.querySelectorAll('.install-tabs [data-tab]').forEach(t => t.classList.toggle('is-on', t===tab));
    document.querySelectorAll('.install-pane').forEach(p => p.classList.toggle('is-on', p.dataset.pane===id));
  });
});

// ---------- Smooth scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#' || href.startsWith('#build?')) return;
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth' }); }
  });
});

// ---------- Token grid ----------
const TOKENS = [
  { name: 'brand-default',       hex: '#3ECF8E', desc: 'functions, cursor, accent' },
  { name: 'brand-600',           hex: '#65DDAB', desc: 'bright green' },
  { name: 'brand-link',          hex: '#00C58E', desc: 'markdown links' },
  { name: 'code-block-1',        hex: '#7FCFC0', desc: 'strings / regex' },
  { name: 'code-block-2',        hex: '#F5C07A', desc: 'numbers / constants' },
  { name: 'code-block-3',        hex: '#C4DB7C', desc: 'types / classes' },
  { name: 'code-block-4',        hex: '#CEA5E8', desc: 'keywords / storage' },
  { name: 'code-block-5',        hex: '#EE8C68', desc: 'operators / tags' },
  { name: 'destructive-default', hex: '#E15A3C', desc: 'errors / deletions' },
  { name: 'warning-default',     hex: '#DB9800', desc: 'warnings' },
  { name: 'background-default',  hex: '#121212', desc: 'editor bg' },
  { name: 'background-alt',      hex: '#0F0F0F', desc: 'sidebar / panels' },
  { name: 'border-strong',       hex: '#363636', desc: 'dividers / bright-black' },
  { name: 'foreground-default',  hex: '#FAFAFA', desc: 'primary text' },
  { name: 'foreground-light',    hex: '#B4B4B4', desc: 'secondary text' },
  { name: 'foreground-lighter',  hex: '#898989', desc: 'tertiary / line numbers' },
  { name: 'foreground-muted',    hex: '#4D4D4D', desc: 'comments' },
];
const tg = document.getElementById('tokenGrid');
if (tg) {
  tg.innerHTML = TOKENS.map(t => `
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
