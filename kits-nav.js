// Shared nav + footer — injects a consistent top bar and footer on every page.
// Usage: <script defer src="shared-nav.js"
//                data-active="hub|wallpapers|chrome|vscode|terminal|raycast|about"
//                data-root=""
//                data-tagline="optional per-page tagline"></script>
// data-root is the relative path to the project root ("" from root, "../" from a subfolder).
(function () {
  var script = document.currentScript;
  var active = (script && script.dataset.active) || '';
  var root = (script && script.dataset.root) || '';
  var tagline = (script && script.dataset.tagline) || 'built in admiration of the supabase design system.';
  if (root && !/\/$/.test(root)) root += '/';

  var pills = [
    { id: 'hub',        label: 'Kits',       href: root + 'index.html',            live: true  },
    { id: 'wallpapers', label: 'Wallpapers', href: root + 'wallpapers/index.html',   live: true  },
    { id: 'chrome',     label: 'Chrome',     href: root + 'chrome-theme/index.html', live: true  },
    { id: 'terminal',   label: 'Terminal',   href: root + 'terminal-theme/index.html', live: true  },
    { id: 'vscode',     label: 'VS Code',    href: root + 'vscode-theme/index.html', live: true },
    { id: 'raycast',    label: 'Raycast',    href: root + 'raycast-theme/index.html', live: true },
  ];

  var nav = document.createElement('nav');
  nav.className = 'kitnav';

  var pillsHtml = pills.map(function (p) {
    var cls = 'kitnav__pill';
    if (p.id === active) cls += ' is-active';
    if (!p.live)         cls += ' is-soon';
    return (
      '<a class="' + cls + '" href="' + p.href + '"' + (p.live ? '' : ' tabindex="-1" aria-disabled="true"') + '>' +
        '<span class="dot"></span>' + p.label +
      '</a>'
    );
  }).join('');

  nav.innerHTML =
    '<div class="kitnav__inner">' +
      '<a class="kitnav__brand" href="' + root + 'index.html">' +
        '<svg viewBox="0 0 109 113" fill="none" aria-hidden="true">' +
          '<path d="M63.71 110.28C60.85 113.89 55.05 111.91 54.98 107.31L53.97 40.06H99.19C107.38 40.06 111.95 49.52 106.86 55.94L63.71 110.28Z" fill="#249361"/>' +
          '<path d="M45.32 2.07C48.18 -1.53 53.97 0.44 54.04 5.04L54.48 72.29H9.83C1.64 72.29 -2.93 62.83 2.17 56.42L45.32 2.07Z" fill="#3ECF8E"/>' +
        '</svg>' +
        '<span>Desktop Kits</span>' +
        '<small>unofficial</small>' +
      '</a>' +
      '<div class="kitnav__pills">' + pillsHtml + '</div>' +
    '</div>';

  // Footer ---------------------------------------------------------------
  var footer = document.createElement('footer');
  footer.className = 'kitfooter';
  footer.innerHTML =
    '<div class="kitfooter__inner">' +
      '<div class="kitfooter__tagline">' + tagline + '</div>' +
      '<div class="kitfooter__links">' +
        '<a href="' + root + 'about.html"' + (active === 'about' ? ' aria-current="page"' : '') + '>about</a>' +
        '<span class="kitfooter__dot">·</span>' +
        '<a href="https://github.com/colings86" target="_blank" rel="noopener">created by <strong>colings86</strong></a>' +
        '<span class="kitfooter__dot">·</span>' +
        '<a href="https://supabase.com" target="_blank" rel="noopener">supabase.com</a>' +
        '<span class="kitfooter__dot">·</span>' +
        '<a href="https://github.com/supabase/supabase" target="_blank" rel="noopener">github</a>' +
      '</div>' +
    '</div>';

  function mount() {
    document.body.insertBefore(nav, document.body.firstChild);
    // Remove any legacy per-page <footer> so we don't double up
    var legacy = document.querySelectorAll('body > footer:not(.kitfooter), body > .site-footer');
    legacy.forEach(function (el) { el.remove(); });
    document.body.appendChild(footer);
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
})();
