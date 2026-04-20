// ============================================================
// Supabase Terminal Theme — exporters
// ============================================================
// Given a resolved ANSI palette (from presets.js), generate every
// supported export format as a plain string.
//
// Formats:
//   - iTerm2 (.itermcolors)  - Apple plist XML
//   - Terminal.app (.terminal) - Apple plist XML with NSArchiver blobs
//   - Kitty (.conf)          - plain text
//   - Alacritty (.toml)      - TOML fragment
//   - Ghostty (config)       - plain text
//   - Warp (.yaml)           - YAML
//   - JSON tokens            - neutral role→hex map
//
// Only the color portion is written; we do NOT include font/line-height
// or other profile-level settings.

function hexToRgbFloat(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}
function hexToRgbInt(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

// ---------- iTerm2 .itermcolors ----------------------------------------
// Plist with keys like "Ansi 0 Color" → dict with Red/Green/Blue Component floats.
function exportIterm(ansi, themeName) {
  const slots = [
    ['Ansi 0 Color',  ansi.black],
    ['Ansi 1 Color',  ansi.red],
    ['Ansi 2 Color',  ansi.green],
    ['Ansi 3 Color',  ansi.yellow],
    ['Ansi 4 Color',  ansi.blue],
    ['Ansi 5 Color',  ansi.magenta],
    ['Ansi 6 Color',  ansi.cyan],
    ['Ansi 7 Color',  ansi.white],
    ['Ansi 8 Color',  ansi.brBlack],
    ['Ansi 9 Color',  ansi.brRed],
    ['Ansi 10 Color', ansi.brGreen],
    ['Ansi 11 Color', ansi.brYellow],
    ['Ansi 12 Color', ansi.brBlue],
    ['Ansi 13 Color', ansi.brMagenta],
    ['Ansi 14 Color', ansi.brCyan],
    ['Ansi 15 Color', ansi.brWhite],
    ['Background Color',        ansi.bg],
    ['Foreground Color',        ansi.fg],
    ['Bold Color',              ansi.brWhite],
    ['Cursor Color',            ansi.cursor],
    ['Cursor Text Color',       ansi.cursorText || ansi.bg],
    ['Selection Color',         ansi.selBg],
    ['Selected Text Color',     ansi.selFg || ansi.fg],
    ['Link Color',              ansi.green],
    ['Badge Color',             ansi.green],
  ];
  const body = slots.map(([k, hex]) => {
    const { r, g, b } = hexToRgbFloat(hex);
    return `\t<key>${k}</key>
\t<dict>
\t\t<key>Color Space</key>
\t\t<string>sRGB</string>
\t\t<key>Red Component</key>
\t\t<real>${r.toFixed(6)}</real>
\t\t<key>Green Component</key>
\t\t<real>${g.toFixed(6)}</real>
\t\t<key>Blue Component</key>
\t\t<real>${b.toFixed(6)}</real>
\t\t<key>Alpha Component</key>
\t\t<real>1</real>
\t</dict>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${body}
</dict>
</plist>
`;
}

// ---------- Terminal.app .terminal --------------------------------------
// Terminal.app uses NSArchiver-serialized NSColor blobs. The simplest
// portable form is a text NSColor representation (`rgb-color-space 0.xx 0.yy 0.zz 1`)
// inside a <string> — Terminal.app will parse this on import.
// This is the approach used by most community .terminal generators.
function exportTerminalApp(ansi, themeName) {
  const nscolor = (hex) => {
    const { r, g, b } = hexToRgbFloat(hex);
    return `rgb-color-space ${r.toFixed(6)} ${g.toFixed(6)} ${b.toFixed(6)} 1`;
  };
  const pairs = [
    ['ANSIBlackColor',        ansi.black],
    ['ANSIRedColor',          ansi.red],
    ['ANSIGreenColor',        ansi.green],
    ['ANSIYellowColor',       ansi.yellow],
    ['ANSIBlueColor',         ansi.blue],
    ['ANSIMagentaColor',      ansi.magenta],
    ['ANSICyanColor',         ansi.cyan],
    ['ANSIWhiteColor',        ansi.white],
    ['ANSIBrightBlackColor',  ansi.brBlack],
    ['ANSIBrightRedColor',    ansi.brRed],
    ['ANSIBrightGreenColor',  ansi.brGreen],
    ['ANSIBrightYellowColor', ansi.brYellow],
    ['ANSIBrightBlueColor',   ansi.brBlue],
    ['ANSIBrightMagentaColor',ansi.brMagenta],
    ['ANSIBrightCyanColor',   ansi.brCyan],
    ['ANSIBrightWhiteColor',  ansi.brWhite],
    ['BackgroundColor',       ansi.bg],
    ['TextColor',             ansi.fg],
    ['CursorColor',           ansi.cursor],
    ['SelectionColor',        ansi.selBg],
  ];
  const body = pairs.map(([k, hex]) =>
    `\t<key>${k}</key>\n\t<string>${nscolor(hex)}</string>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>name</key>
\t<string>${themeName}</string>
\t<key>type</key>
\t<string>Window Settings</string>
${body}
</dict>
</plist>
`;
}

// ---------- Kitty ------------------------------------------------------
function exportKitty(ansi, themeName) {
  return `# ${themeName}
# Supabase-inspired terminal theme · kitty
# Drop into ~/.config/kitty/ and include in kitty.conf:
#   include ${themeName.toLowerCase().replace(/\s+/g, '-')}.conf

foreground              ${ansi.fg}
background              ${ansi.bg}
selection_foreground    ${ansi.selFg || ansi.fg}
selection_background    ${ansi.selBg}

cursor                  ${ansi.cursor}
cursor_text_color       ${ansi.cursorText || ansi.bg}

url_color               ${ansi.green}

# ANSI 0–7
color0  ${ansi.black}
color1  ${ansi.red}
color2  ${ansi.green}
color3  ${ansi.yellow}
color4  ${ansi.blue}
color5  ${ansi.magenta}
color6  ${ansi.cyan}
color7  ${ansi.white}

# ANSI 8–15 (bright)
color8  ${ansi.brBlack}
color9  ${ansi.brRed}
color10 ${ansi.brGreen}
color11 ${ansi.brYellow}
color12 ${ansi.brBlue}
color13 ${ansi.brMagenta}
color14 ${ansi.brCyan}
color15 ${ansi.brWhite}
`;
}

// ---------- Alacritty TOML ---------------------------------------------
function exportAlacritty(ansi, themeName) {
  return `# ${themeName}
# Supabase-inspired terminal theme · alacritty (TOML)

[colors.primary]
background = "${ansi.bg}"
foreground = "${ansi.fg}"

[colors.cursor]
text   = "${ansi.cursorText || ansi.bg}"
cursor = "${ansi.cursor}"

[colors.selection]
text       = "${ansi.selFg || ansi.fg}"
background = "${ansi.selBg}"

[colors.normal]
black   = "${ansi.black}"
red     = "${ansi.red}"
green   = "${ansi.green}"
yellow  = "${ansi.yellow}"
blue    = "${ansi.blue}"
magenta = "${ansi.magenta}"
cyan    = "${ansi.cyan}"
white   = "${ansi.white}"

[colors.bright]
black   = "${ansi.brBlack}"
red     = "${ansi.brRed}"
green   = "${ansi.brGreen}"
yellow  = "${ansi.brYellow}"
blue    = "${ansi.brBlue}"
magenta = "${ansi.brMagenta}"
cyan    = "${ansi.brCyan}"
white   = "${ansi.brWhite}"
`;
}

// ---------- Ghostty ----------------------------------------------------
function exportGhostty(ansi, themeName) {
  return `# ${themeName}
# Supabase-inspired terminal theme · ghostty

background = ${ansi.bg.replace('#','')}
foreground = ${ansi.fg.replace('#','')}

cursor-color = ${ansi.cursor.replace('#','')}
cursor-text  = ${(ansi.cursorText || ansi.bg).replace('#','')}

selection-background = ${ansi.selBg.replace('#','')}
selection-foreground = ${(ansi.selFg || ansi.fg).replace('#','')}

palette = 0=${ansi.black}
palette = 1=${ansi.red}
palette = 2=${ansi.green}
palette = 3=${ansi.yellow}
palette = 4=${ansi.blue}
palette = 5=${ansi.magenta}
palette = 6=${ansi.cyan}
palette = 7=${ansi.white}
palette = 8=${ansi.brBlack}
palette = 9=${ansi.brRed}
palette = 10=${ansi.brGreen}
palette = 11=${ansi.brYellow}
palette = 12=${ansi.brBlue}
palette = 13=${ansi.brMagenta}
palette = 14=${ansi.brCyan}
palette = 15=${ansi.brWhite}
`;
}

// ---------- Warp YAML --------------------------------------------------
function exportWarp(ansi, themeName) {
  return `# ${themeName}
# Supabase-inspired terminal theme · warp
# Save to ~/.warp/themes/${themeName.toLowerCase().replace(/\s+/g, '-')}.yaml

accent: "${ansi.green}"
background: "${ansi.bg}"
foreground: "${ansi.fg}"
details: "darker"
terminal_colors:
  normal:
    black: "${ansi.black}"
    red: "${ansi.red}"
    green: "${ansi.green}"
    yellow: "${ansi.yellow}"
    blue: "${ansi.blue}"
    magenta: "${ansi.magenta}"
    cyan: "${ansi.cyan}"
    white: "${ansi.white}"
  bright:
    black: "${ansi.brBlack}"
    red: "${ansi.brRed}"
    green: "${ansi.brGreen}"
    yellow: "${ansi.brYellow}"
    blue: "${ansi.brBlue}"
    magenta: "${ansi.brMagenta}"
    cyan: "${ansi.brCyan}"
    white: "${ansi.brWhite}"
`;
}

// ---------- JSON tokens ------------------------------------------------
function exportJsonTokens(ansi, themeName, state) {
  return JSON.stringify({
    name: themeName,
    source: 'supabase-desktop-kits/terminal',
    build: state,
    palette: {
      normal: {
        black: ansi.black, red: ansi.red, green: ansi.green, yellow: ansi.yellow,
        blue: ansi.blue, magenta: ansi.magenta, cyan: ansi.cyan, white: ansi.white,
      },
      bright: {
        black: ansi.brBlack, red: ansi.brRed, green: ansi.brGreen, yellow: ansi.brYellow,
        blue: ansi.brBlue, magenta: ansi.brMagenta, cyan: ansi.brCyan, white: ansi.brWhite,
      },
      foreground: ansi.fg,
      background: ansi.bg,
      cursor: { color: ansi.cursor, text: ansi.cursorText || ansi.bg },
      selection: { background: ansi.selBg, foreground: ansi.selFg || ansi.fg },
      accents: { prompt: ansi.promptFg || ansi.green, link: ansi.green },
    },
  }, null, 2);
}

// ---------- README -----------------------------------------------------
function exportReadme(themeName, state) {
  return [
    `${themeName}`,
    `Supabase-inspired terminal theme`,
    `====================================`,
    ``,
    `Build settings:`,
    ...Object.entries(state).map(([k, v]) => `  ${k}: ${v}`),
    ``,
    `FILES`,
    `  ${themeName.toLowerCase().replace(/\s+/g,'-')}.itermcolors   — iTerm2`,
    `  ${themeName.toLowerCase().replace(/\s+/g,'-')}.terminal      — macOS Terminal.app`,
    `  ${themeName.toLowerCase().replace(/\s+/g,'-')}.conf          — Kitty`,
    `  ${themeName.toLowerCase().replace(/\s+/g,'-')}.toml          — Alacritty`,
    `  ${themeName.toLowerCase().replace(/\s+/g,'-')}-ghostty.conf  — Ghostty`,
    `  ${themeName.toLowerCase().replace(/\s+/g,'-')}.yaml          — Warp`,
    `  tokens.json                                                  — plain role→hex map`,
    ``,
    `INSTALL`,
    `  See the "Install" section of the builder page for per-terminal instructions.`,
  ].join('\n');
}

window.__exporters = {
  exportIterm, exportTerminalApp, exportKitty, exportAlacritty,
  exportGhostty, exportWarp, exportJsonTokens, exportReadme,
};
