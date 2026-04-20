// ============================================================
// Supabase VS Code Theme — exporters
// ============================================================
// Given a resolved theme (ansi + syntax + chrome), build:
//   - color-theme.json : full VS Code color theme contribution
//   - package.json     : extension manifest
//   - README.md        : install notes
//   - tokens.json      : neutral role→hex map
//   - settings.json    : workbench.colorCustomizations snippet
// All assembled into a .vsix (ZIP with extension layout) at download time.

// ---------- Token color builder ----------------------------------------
// Given a resolved syntax palette, emit VS Code tokenColors entries.
// Each entry: { name, scope: string[], settings: { foreground, fontStyle? } }
function buildTokenColors(syntax, stateOptions) {
  const {
    italicComments = 'on',
    italicKeywords = 'off',
    boldFunctions = 'on',
  } = stateOptions || {};

  const fontStyle = (arr) => arr.filter(Boolean).join(' ') || undefined;
  const rules = [
    { name: 'Comment',
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: syntax.comment, fontStyle: fontStyle([italicComments==='on' && 'italic']) } },
    { name: 'Doc comment',
      scope: ['comment.block.documentation', 'comment.line.documentation'],
      settings: { foreground: syntax.docComment, fontStyle: fontStyle([italicComments==='on' && 'italic']) } },
    { name: 'Keyword',
      scope: ['keyword', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression',
              'keyword.operator.logical', 'keyword.operator.word'],
      settings: { foreground: syntax.keyword, fontStyle: fontStyle([italicKeywords==='on' && 'italic']) } },
    { name: 'Storage',
      scope: ['storage', 'storage.type', 'storage.modifier'],
      settings: { foreground: syntax.storage, fontStyle: fontStyle([italicKeywords==='on' && 'italic']) } },
    { name: 'Control flow',
      scope: ['keyword.control.flow', 'keyword.control.conditional', 'keyword.control.loop'],
      settings: { foreground: syntax.controlFlow, fontStyle: fontStyle([italicKeywords==='on' && 'italic']) } },
    { name: 'String',
      scope: ['string', 'string.quoted', 'string.template'],
      settings: { foreground: syntax.string } },
    { name: 'String escape',
      scope: ['constant.character.escape', 'string.regexp constant.character.escape'],
      settings: { foreground: syntax.escape } },
    { name: 'Regex',
      scope: ['string.regexp'],
      settings: { foreground: syntax.regex } },
    { name: 'Number',
      scope: ['constant.numeric'],
      settings: { foreground: syntax.number } },
    { name: 'Constant',
      scope: ['constant', 'constant.language', 'variable.other.constant', 'support.constant'],
      settings: { foreground: syntax.constant } },
    { name: 'Builtin / support',
      scope: ['support.function', 'support.type.builtin', 'support.variable',
              'variable.language', 'entity.name.type.builtin'],
      settings: { foreground: syntax.builtin } },
    { name: 'Type',
      scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'meta.return.type'],
      settings: { foreground: syntax.type } },
    { name: 'Function definition',
      scope: ['entity.name.function', 'meta.function entity.name.function',
              'meta.definition.function entity.name.function', 'support.function.magic'],
      settings: { foreground: syntax.function, fontStyle: fontStyle([boldFunctions==='on' && 'bold']) } },
    { name: 'Function call',
      scope: ['meta.function-call entity.name.function', 'meta.function-call support.function'],
      settings: { foreground: syntax.function } },
    { name: 'Method',
      scope: ['meta.method-call entity.name.function', 'meta.function.method'],
      settings: { foreground: syntax.method, fontStyle: fontStyle([boldFunctions==='on' && 'bold']) } },
    { name: 'Variable',
      scope: ['variable', 'variable.other', 'variable.other.readwrite'],
      settings: { foreground: syntax.variable } },
    { name: 'Parameter',
      scope: ['variable.parameter', 'meta.parameter'],
      settings: { foreground: syntax.parameter } },
    { name: 'Property',
      scope: ['variable.other.property', 'variable.other.object.property',
              'meta.object.member', 'support.variable.property', 'variable.object.property'],
      settings: { foreground: syntax.property } },
    { name: 'Punctuation',
      scope: ['punctuation', 'punctuation.separator', 'punctuation.terminator',
              'meta.brace', 'punctuation.definition.block'],
      settings: { foreground: syntax.punctuation } },
    { name: 'Operator',
      scope: ['keyword.operator', 'keyword.operator.arrow', 'keyword.operator.assignment',
              'keyword.operator.arithmetic', 'keyword.operator.comparison'],
      settings: { foreground: syntax.operator } },
    { name: 'Tag',
      scope: ['entity.name.tag', 'meta.tag', 'punctuation.definition.tag'],
      settings: { foreground: syntax.tag } },
    { name: 'Attribute',
      scope: ['entity.other.attribute-name', 'entity.other.attribute'],
      settings: { foreground: syntax.attribute } },
    { name: 'Decorator',
      scope: ['meta.decorator', 'punctuation.decorator', 'entity.name.function.decorator',
              'meta.decorator variable.other.readwrite'],
      settings: { foreground: syntax.decorator, fontStyle: fontStyle([italicKeywords==='on' && 'italic']) } },
    { name: 'Invalid',
      scope: ['invalid', 'invalid.illegal'],
      settings: { foreground: syntax.invalid } },
    { name: 'Markdown heading',
      scope: ['markup.heading', 'entity.name.section'],
      settings: { foreground: syntax.heading, fontStyle: 'bold' } },
    { name: 'Markdown link',
      scope: ['markup.underline.link', 'string.other.link'],
      settings: { foreground: syntax.link, fontStyle: 'underline' } },
    { name: 'Markdown bold',
      scope: ['markup.bold'],
      settings: { foreground: syntax.variable, fontStyle: 'bold' } },
    { name: 'Markdown italic',
      scope: ['markup.italic'],
      settings: { foreground: syntax.variable, fontStyle: 'italic' } },
    // SQL-specific
    { name: 'SQL keyword',
      scope: ['keyword.other.sql', 'keyword.other.DML.sql', 'keyword.other.create.sql',
              'storage.type.sql', 'keyword.other.data-integrity.sql'],
      settings: { foreground: syntax.sqlKeyword, fontStyle: fontStyle([italicKeywords==='on' && 'italic']) } },
    { name: 'SQL function',
      scope: ['support.function.aggregate.sql', 'support.function.string.sql',
              'meta.function-call.sql entity.name.function'],
      settings: { foreground: syntax.sqlFn } },
    { name: 'SQL string',
      scope: ['string.quoted.single.sql'],
      settings: { foreground: syntax.sqlString } },
    { name: 'SQL comment',
      scope: ['comment.line.double-dash.sql', 'comment.block.c.sql'],
      settings: { foreground: syntax.sqlComment, fontStyle: 'italic' } },
    // JSON
    { name: 'JSON key',
      scope: ['support.type.property-name.json', 'string.quoted.double.json support.type.property-name'],
      settings: { foreground: syntax.property } },
  ];
  return rules;
}

// ---------- Semantic highlighting map ---------------------------------
function buildSemanticTokens(syntax, state) {
  if (state.semanticHighlighting === 'off') return undefined;
  return {
    enabled: true,
    rules: {
      'variable': syntax.variable,
      'variable.readonly': syntax.constant,
      'parameter': syntax.parameter,
      'property': syntax.property,
      'property.readonly': syntax.property,
      'enumMember': syntax.constant,
      'function': syntax.function,
      'method': syntax.method,
      'class': syntax.classDef,
      'interface': syntax.type,
      'type': syntax.type,
      'typeParameter': syntax.type,
      'enum': syntax.type,
      'namespace': syntax.type,
      'decorator': syntax.decorator,
      'keyword': syntax.keyword,
      'string': syntax.string,
      'number': syntax.number,
    },
  };
}

// ---------- Workbench colors (UI chrome) --------------------------------
function buildColors(ansi, chrome, state) {
  const tabMode = state.tabStyle || 'underline';
  const bracketsOn = state.bracketPairColors === 'on';

  const colors = {
    // editor core
    'editor.background': chrome.editorBg,
    'editor.foreground': chrome.editorFg,
    'editorLineNumber.foreground': chrome.lineNumber,
    'editorLineNumber.activeForeground': chrome.lineNumberActive,
    'editor.selectionBackground': chrome.selectionBg,
    'editor.selectionHighlightBackground': chrome.selectionHighlight,
    'editor.wordHighlightBackground': chrome.selectionHighlight,
    'editor.wordHighlightStrongBackground': chrome.selectionBg,
    'editor.findMatchBackground': chrome.findMatchBg,
    'editor.findMatchHighlightBackground': chrome.findMatchBg,
    'editor.findMatchBorder': chrome.findMatchBorder,
    'editorCursor.foreground': chrome.cursor,
    'editorBracketMatch.background': chrome.selectionHighlight,
    'editorBracketMatch.border': chrome.bracketMatch,
    'editorIndentGuide.background1': state.indentGuides === 'hidden' ? '#00000000' : chrome.indentGuide,
    'editorIndentGuide.activeBackground1': state.indentGuides === 'hidden' ? '#00000000' : chrome.indentGuideActive,
    'editorGutter.background': chrome.editorBg,
    'editorGutter.modifiedBackground': chrome.gutterModify,
    'editorGutter.addedBackground': chrome.gutterAdd,
    'editorGutter.deletedBackground': chrome.gutterDelete,
    'editorError.foreground': ansi.red,
    'editorWarning.foreground': ansi.yellow,
    'editorInfo.foreground': ansi.blue,
    'editorHint.foreground': ansi.cyan,
    'editorLink.activeForeground': chrome.focusBorder,
    // bracket pair colorization (VS Code 1.60+)
    ...(bracketsOn ? {
      'editorBracketHighlight.foreground1': chrome.bracket1,
      'editorBracketHighlight.foreground2': chrome.bracket2,
      'editorBracketHighlight.foreground3': chrome.bracket3,
      'editorBracketHighlight.foreground4': chrome.bracket4,
      'editorBracketHighlight.foreground5': chrome.bracket5,
      'editorBracketHighlight.foreground6': chrome.bracket6,
      'editorBracketHighlight.unexpectedBracket.foreground': ansi.red,
    } : {}),
    // sidebar
    'sideBar.background': chrome.sidebarBg,
    'sideBar.foreground': chrome.sidebarFg,
    'sideBar.border': chrome.sidebarBorder,
    'sideBarSectionHeader.background': chrome.sidebarBg,
    'sideBarSectionHeader.foreground': chrome.sidebarFg,
    'sideBarTitle.foreground': chrome.sidebarFg,
    // activity bar
    'activityBar.background': chrome.activityBarBg,
    'activityBar.foreground': chrome.activityBarActiveFg,
    'activityBar.inactiveForeground': chrome.activityBarFg,
    'activityBar.border': chrome.activityBarBorder,
    'activityBar.activeBorder': state.activityAccent === 'hidden' ? '#00000000' : chrome.activityBarActiveFg,
    'activityBarBadge.background': chrome.activityBarBadgeBg,
    'activityBarBadge.foreground': chrome.activityBarBadgeFg,
    // title bar
    'titleBar.activeBackground': chrome.titleBarBg,
    'titleBar.activeForeground': chrome.titleBarFg,
    'titleBar.inactiveBackground': chrome.titleBarBg,
    'titleBar.inactiveForeground': chrome.activityBarFg,
    'titleBar.border': chrome.sidebarBorder,
    // status bar
    'statusBar.background': chrome.statusBarBg,
    'statusBar.foreground': chrome.statusBarFg,
    'statusBar.border': chrome.statusBarBorder,
    'statusBar.noFolderBackground': chrome.statusBarBg,
    'statusBarItem.hoverBackground': '#FFFFFF0F',
    'statusBarItem.remoteBackground': ansi.green,
    'statusBarItem.remoteForeground': '#0A2015',
    // tabs
    'editorGroupHeader.tabsBackground': chrome.tabsBg,
    'editorGroupHeader.tabsBorder': chrome.tabBorder,
    'editorGroupHeader.border': chrome.tabBorder,
    'tab.activeBackground': tabMode === 'filled' ? chrome.tabActiveBorderTop + '22' : chrome.tabActiveBg,
    'tab.activeForeground': chrome.tabActiveFg,
    'tab.inactiveBackground': chrome.tabInactiveBg,
    'tab.inactiveForeground': chrome.tabInactiveFg,
    'tab.border': chrome.tabBorder,
    'tab.activeBorderTop': tabMode === 'underline' ? chrome.tabActiveBorderTop : '#00000000',
    'tab.activeBorder': tabMode === 'boxed' ? chrome.tabActiveBorderTop : '#00000000',
    'tab.hoverBackground': '#FFFFFF08',
    // panels (terminal / problems / output)
    'panel.background': chrome.panelBg,
    'panel.border': chrome.panelBorder,
    'panelTitle.activeBorder': chrome.activityBarActiveFg,
    'panelTitle.activeForeground': chrome.editorFg,
    'panelTitle.inactiveForeground': chrome.activityBarFg,
    // integrated terminal — wired to ANSI palette
    'terminal.background': ansi.bg,
    'terminal.foreground': ansi.fg,
    'terminal.ansiBlack': ansi.black,
    'terminal.ansiRed': ansi.red,
    'terminal.ansiGreen': ansi.green,
    'terminal.ansiYellow': ansi.yellow,
    'terminal.ansiBlue': ansi.blue,
    'terminal.ansiMagenta': ansi.magenta,
    'terminal.ansiCyan': ansi.cyan,
    'terminal.ansiWhite': ansi.white,
    'terminal.ansiBrightBlack': ansi.brBlack,
    'terminal.ansiBrightRed': ansi.brRed,
    'terminal.ansiBrightGreen': ansi.brGreen,
    'terminal.ansiBrightYellow': ansi.brYellow,
    'terminal.ansiBrightBlue': ansi.brBlue,
    'terminal.ansiBrightMagenta': ansi.brMagenta,
    'terminal.ansiBrightCyan': ansi.brCyan,
    'terminal.ansiBrightWhite': ansi.brWhite,
    'terminalCursor.foreground': ansi.cursor,
    'terminal.selectionBackground': ansi.selBg,
    // breadcrumbs
    'breadcrumb.foreground': chrome.breadcrumbFg,
    'breadcrumb.focusForeground': chrome.breadcrumbActive,
    'breadcrumb.activeSelectionForeground': chrome.breadcrumbActive,
    // lists (file tree)
    'list.activeSelectionBackground': '#3ECF8E1F',
    'list.activeSelectionForeground': chrome.editorFg,
    'list.inactiveSelectionBackground': '#FFFFFF0A',
    'list.inactiveSelectionForeground': chrome.editorFg,
    'list.hoverBackground': '#FFFFFF08',
    'list.focusBackground': '#3ECF8E14',
    'list.focusForeground': chrome.editorFg,
    'tree.indentGuidesStroke': chrome.indentGuide,
    // inputs, buttons, widgets
    'button.background': ansi.green,
    'button.foreground': '#0A2015',
    'button.hoverBackground': ansi.brGreen,
    'input.background': chrome.sidebarBg,
    'input.foreground': chrome.editorFg,
    'input.border': chrome.sidebarBorder,
    'inputOption.activeBackground': '#3ECF8E33',
    'inputOption.activeForeground': chrome.editorFg,
    'focusBorder': chrome.focusBorder,
    'dropdown.background': chrome.sidebarBg,
    'dropdown.foreground': chrome.editorFg,
    'dropdown.border': chrome.sidebarBorder,
    // scrollbars
    'scrollbarSlider.background': chrome.scrollbarThumb,
    'scrollbarSlider.hoverBackground': '#FFFFFF1F',
    'scrollbarSlider.activeBackground': '#FFFFFF2E',
    // minimap
    'minimap.background': chrome.minimapBg,
    'minimap.selectionHighlight': chrome.selectionBg,
    'minimap.findMatchHighlight': chrome.findMatchBorder,
    // badges
    'badge.background': ansi.green,
    'badge.foreground': '#0A2015',
    // notifications
    'notifications.background': chrome.sidebarBg,
    'notifications.foreground': chrome.editorFg,
    'notifications.border': chrome.sidebarBorder,
    // git decorations in explorer
    'gitDecoration.modifiedResourceForeground': ansi.yellow,
    'gitDecoration.deletedResourceForeground': ansi.red,
    'gitDecoration.untrackedResourceForeground': ansi.green,
    'gitDecoration.ignoredResourceForeground': chrome.breadcrumbFg,
    'gitDecoration.conflictingResourceForeground': ansi.magenta,
  };
  return colors;
}

// ---------- Color sanitizer: force #RRGGBB / #RRGGBBAA -----------------
// VS Code's color-theme.json requires hex. Any rgba()/rgb()/hsl() slips in
// would silently fall back to the error-red placeholder at runtime.
function toHex8(c) {
  if (typeof c !== 'string') return c;
  const s = c.trim();
  // already hex
  if (/^#[0-9a-fA-F]{3,8}$/.test(s)) return s.toUpperCase();
  // rgba(r,g,b,a) or rgb(r,g,b)
  const rgba = s.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:[\s,\/]+([\d.]+))?\s*\)$/i);
  if (rgba) {
    const r = Math.max(0, Math.min(255, +rgba[1]));
    const g = Math.max(0, Math.min(255, +rgba[2]));
    const b = Math.max(0, Math.min(255, +rgba[3]));
    const a = rgba[4] === undefined ? 1 : Math.max(0, Math.min(1, +rgba[4]));
    const hh = n => n.toString(16).padStart(2, '0');
    const alpha = a >= 1 ? '' : hh(Math.round(a * 255));
    return ('#' + hh(r) + hh(g) + hh(b) + alpha).toUpperCase();
  }
  return s; // leave others; caller logs if needed
}
function sanitizeColorMap(map) {
  const out = {};
  for (const k in map) out[k] = toHex8(map[k]);
  return out;
}

// ---------- Full color-theme.json --------------------------------------
function buildColorThemeJson(theme, state, name) {
  const { ansi, syntax, chrome } = theme;
  const out = {
    name,
    type: 'dark',
    semanticHighlighting: state.semanticHighlighting === 'on',
    colors: sanitizeColorMap(buildColors(ansi, chrome, state)),
    tokenColors: buildTokenColors(syntax, state).map(r => ({
      ...r,
      settings: { ...r.settings, ...(r.settings.foreground ? { foreground: toHex8(r.settings.foreground) } : {}) },
    })),
  };
  const sem = buildSemanticTokens(syntax, state);
  if (sem) out.semanticTokenColors = sanitizeColorMap(sem.rules);
  return JSON.stringify(out, null, 2);
}

// ---------- Extension manifest (package.json) ---------------------------
function buildPackageJson(displayName, slug, state) {
  const themeLabel = displayName;
  return JSON.stringify({
    name: slug,
    displayName: themeLabel,
    description: `${themeLabel} — unofficial Supabase-inspired VS Code color theme.`,
    version: '1.0.0',
    publisher: 'supabase-desktop-kits',
    engines: { vscode: '^1.70.0' },
    categories: ['Themes'],
    keywords: ['supabase', 'dark', 'theme', 'green'],
    icon: 'icon.png',
    contributes: {
      themes: [{
        label: themeLabel,
        uiTheme: 'vs-dark',
        path: `./themes/${slug}-color-theme.json`,
      }],
    },
    __build: state,
  }, null, 2);
}

// ---------- README / install -------------------------------------------
function buildReadme(displayName, slug, state) {
  return [
    `# ${displayName}`,
    ``,
    `An unofficial Supabase-inspired color theme for VS Code, Cursor, Windsurf and VSCodium.`,
    ``,
    `## Install`,
    ``,
    `**VSIX (easiest)**`,
    `\`\`\``,
    `code --install-extension ${slug}-1.0.0.vsix`,
    `# or: right-click the .vsix in Finder/Explorer → Install`,
    `\`\`\``,
    ``,
    `Then open the Command Palette (**Cmd/Ctrl+Shift+P**) → **Preferences: Color Theme** → pick "${displayName}".`,
    ``,
    `**Manual (raw JSON)**`,
    ``,
    `1. Copy \`themes/${slug}-color-theme.json\` into your own theme extension's \`themes/\` folder.`,
    `2. Reference it from that extension's \`package.json\`.`,
    ``,
    `**Without an extension (settings.json)**`,
    ``,
    `Paste \`settings-snippet.json\` into your user \`settings.json\` if you'd rather tweak your current theme with Supabase overrides.`,
    ``,
    `## Build settings`,
    ``,
    Object.entries(state).map(([k,v]) => `- **${k}**: ${v}`).join('\n'),
    ``,
    `## Files`,
    ``,
    `- \`${slug}-1.0.0.vsix\` — sideload-ready extension`,
    `- \`package.json\` — extension manifest`,
    `- \`themes/${slug}-color-theme.json\` — raw color theme`,
    `- \`tokens.json\` — neutral design tokens`,
    `- \`settings-snippet.json\` — paste-into-settings.json overrides`,
    ``,
    `---`,
    `Built with the Supabase desktop kits builder. Unofficial — not affiliated with Supabase.`,
  ].join('\n');
}

// ---------- settings.json snippet --------------------------------------
function buildSettingsSnippet(theme, state) {
  const colors = buildColors(theme.ansi, theme.chrome, state);
  const tokenColors = buildTokenColors(theme.syntax, state);
  return JSON.stringify({
    'workbench.colorCustomizations': colors,
    'editor.tokenColorCustomizations': { textMateRules: tokenColors },
  }, null, 2);
}

// ---------- Neutral tokens.json ---------------------------------------
function buildTokensJson(theme, name, state) {
  const { ansi, syntax, chrome } = theme;
  return JSON.stringify({
    name,
    source: 'supabase-desktop-kits/vscode',
    build: state,
    palette: {
      ansi: {
        normal: {
          black: ansi.black, red: ansi.red, green: ansi.green, yellow: ansi.yellow,
          blue: ansi.blue, magenta: ansi.magenta, cyan: ansi.cyan, white: ansi.white,
        },
        bright: {
          black: ansi.brBlack, red: ansi.brRed, green: ansi.brGreen, yellow: ansi.brYellow,
          blue: ansi.brBlue, magenta: ansi.brMagenta, cyan: ansi.brCyan, white: ansi.brWhite,
        },
        fg: ansi.fg, bg: ansi.bg, cursor: ansi.cursor, selection: ansi.selBg,
      },
      syntax,
      chrome,
    },
  }, null, 2);
}

// ---------- Tiny PNG icon (solid green Supabase bolt SVG rasterized) ---
// Keep it SVG — VS Code accepts SVG icons in extensions (via icon field only in
// marketplace builds; for sideload, a PNG is safer). We emit a minimal 128×128 PNG
// via a canvas at download time in showcase.js. This file just exports helpers.

window.__vscodeExporters = {
  buildColorThemeJson,
  buildPackageJson,
  buildReadme,
  buildSettingsSnippet,
  buildTokensJson,
  buildTokenColors,
  buildColors,
};
