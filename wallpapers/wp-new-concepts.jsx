// Wallpaper concepts — iterations + new. All W/H-driven.
// Atmospheric: SbCornerLockup. Hero: mark alone, showWordmark adds corner lockup.

// ──────────────────────────────────────────────────────────────
// WP2b — Ignition. Glow reseated: follows the curve's peak (right edge).
// ──────────────────────────────────────────────────────────────
function WP2b_Ignition(props) {
  const { id = 'wp2b', glow = 1, showWordmark = true } = props;
  const { W, H } = dims(props);
  const spacing = Math.max(56, Math.round(H / 40));
  const curveY = (x) => {
    const t = x / W;
    const eased = Math.pow(t, 2.1);
    return H * 0.82 - eased * H * 0.55;
  };
  const tipX = W - W * 0.015;
  const tipY = curveY(tipX);

  const dots = [];
  for (let y = spacing; y < H; y += spacing) {
    for (let x = spacing; x < W; x += spacing) {
      const cy = curveY(x);
      const dy = (y - cy) / H;
      const above = y < cy;
      const dist = Math.abs(dy);
      const brightness = above ? Math.max(0, 0.55 - dist * 2.6) : Math.max(0, 0.45 - dist * 1.5);
      const op = 0.08 + brightness * 0.42 * glow;
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} fill={SB_GREEN} opacity={op} />);
    }
  }
  const steps = 160;
  const curvePts = Array.from({ length: steps + 1 }, (_, i) => {
    const x = (i / steps) * W;
    return `${x},${curveY(x)}`;
  }).join(' L');

  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <SbDefs />
      <defs>
        <linearGradient id={`${id}-below`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0.22 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG_DEEP} stopOpacity={1} />
          <stop offset="100%" stopColor={BG_DEEP} stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`${id}-tipGlow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0.75 * glow} />
          <stop offset="30%" stopColor={SB_GREEN} stopOpacity={0.28 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={BG_DEEP} />
      <path d={`M0,${H} L${curvePts} L${W},${H} Z`} fill={`url(#${id}-below)`} />
      <g>{dots}</g>
      <path d={`M${curvePts}`} fill="none" stroke={SB_GREEN} strokeOpacity={0.38 * glow} strokeWidth={2} />
      <ellipse cx={tipX} cy={tipY} rx={H * 0.32} ry={H * 0.32} fill={`url(#${id}-tipGlow)`} />
      <circle cx={tipX} cy={tipY} r={Math.max(10, H * 0.005)} fill={SB_GREEN} opacity={0.95 * glow} />
      <rect width={W} height={H * 0.155} fill={`url(#${id}-top)`} />
      {showWordmark && <SbCornerLockup W={W} H={H} corner="bl" />}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// WP3b — Service Graph. Fills wide aspects with varied Y + peripheral nodes.
// ──────────────────────────────────────────────────────────────
function WP3b_Graph(props) {
  const { id = 'wp3b', glow = 1, showWordmark = true } = props;
  const { W, H } = dims(props);
  const rand = mulberry32(11);
  // Normalised positions spread 0.05..0.95 on both axes, intentionally irregular.
  const nNorm = [
    { name: 'auth',       nx: 0.07, ny: 0.22, size: 1.0 },
    { name: 'database',   nx: 0.24, ny: 0.56, size: 1.7 },
    { name: 'realtime',   nx: 0.38, ny: 0.18, size: 1.0 },
    { name: 'storage',    nx: 0.47, ny: 0.83, size: 1.1 },
    { name: 'edge',       nx: 0.60, ny: 0.35, size: 1.0 },
    { name: 'vector',     nx: 0.73, ny: 0.70, size: 0.9 },
    { name: 'queues',     nx: 0.82, ny: 0.22, size: 1.0 },
    { name: 'analytics',  nx: 0.90, ny: 0.50, size: 0.9 },
    { name: 'studio',     nx: 0.14, ny: 0.86, size: 0.9 },
    { name: 'functions',  nx: 0.52, ny: 0.44, size: 0.9 },
    { name: 'cron',       nx: 0.66, ny: 0.55, size: 0.8 },
  ];
  const nodes = nNorm.map(n => ({ ...n, x: n.nx * W, y: n.ny * H }));
  // Build edges by picking each node's 1-2 nearest neighbours.
  const edges = new Set();
  for (let i = 0; i < nodes.length; i++) {
    const dists = nodes.map((n, j) => ({ j, d: j === i ? Infinity : Math.hypot((n.x - nodes[i].x) / W, (n.y - nodes[i].y) / H) }));
    dists.sort((a, b) => a.d - b.d);
    const count = 1 + Math.floor(rand() * 2);
    for (let k = 0; k < count && k < dists.length; k++) {
      const a = Math.min(i, dists[k].j), b = Math.max(i, dists[k].j);
      edges.add(`${a}-${b}`);
    }
  }
  const edgeList = Array.from(edges).map(e => e.split('-').map(Number));

  const stars = [];
  for (let i = 0; i < 620; i++) {
    stars.push(<circle key={i} cx={rand() * W} cy={rand() * H} r={rand() * 1.4 + 0.4} fill={FG} opacity={0.04 + rand() * 0.14} />);
  }
  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <SbDefs />
      <defs>
        <radialGradient id={`${id}-vign`} cx="50%" cy="50%" r="72%">
          <stop offset="0%" stopColor={BG} stopOpacity={0} />
          <stop offset="100%" stopColor={BG_DEEP} stopOpacity={0.85} />
        </radialGradient>
        <radialGradient id={`${id}-hub`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0.55 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={BG_DEEP} />
      <g>{stars}</g>
      <g>
        {edgeList.map(([a, b], i) => {
          const n1 = nodes[a], n2 = nodes[b];
          const mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
          return (
            <g key={i}>
              <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={SB_GREEN} strokeOpacity={0.22 * glow} strokeWidth={1.5} />
              <circle cx={mx} cy={my} r={3} fill={SB_GREEN} opacity={0.45 * glow} />
            </g>
          );
        })}
      </g>
      {nodes.map((n, i) => (
        <circle key={`g-${i}`} cx={n.x} cy={n.y} r={Math.min(W, H) * 0.09 * n.size} fill={`url(#${id}-hub)`} />
      ))}
      {nodes.map((n, i) => {
        const label = n.name;
        const fontSize = Math.max(18, H * 0.0095);
        const padX = fontSize * 1.1, padY = fontSize * 0.56;
        const approxTextW = label.length * fontSize * 0.62;
        const tagW = approxTextW + padX * 2;
        const tagH = fontSize + padY * 2;
        const tagX = n.x + Math.min(W, H) * 0.018;
        const tagY = n.y - tagH / 2;
        const ringR = Math.max(16, Math.min(W, H) * 0.008) * n.size;
        const coreR = Math.max(8, Math.min(W, H) * 0.0037) * n.size;
        return (
          <g key={`n-${i}`}>
            <circle cx={n.x} cy={n.y} r={ringR} fill="none" stroke={SB_GREEN} strokeOpacity={0.6} strokeWidth={1.5} />
            <circle cx={n.x} cy={n.y} r={coreR} fill={SB_GREEN} />
            <rect x={tagX} y={tagY} width={tagW} height={tagH} rx={tagH / 2} fill={SURFACE_100} stroke={BORDER} strokeWidth={1.5} />
            <circle cx={tagX + padX} cy={n.y} r={5} fill={SB_GREEN} />
            <text x={tagX + padX + 16} y={n.y + fontSize * 0.36} fill={FG_LIGHT} fontFamily="'Source Code Pro', monospace" fontSize={fontSize} fontWeight={500}>
              {label}
            </text>
          </g>
        );
      })}
      <rect width={W} height={H} fill={`url(#${id}-vign)`} />
      {showWordmark && <SbCornerLockup W={W} H={H} corner="br" />}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// WP4b — Expanse (hero). Small mark on horizon; lockup opt-in corner.
// ──────────────────────────────────────────────────────────────
function WP4b_Expanse(props) {
  const { id = 'wp4b', glow = 1, showWordmark = true } = props;
  const { W, H } = dims(props);
  const cx = W / 2;
  const horizonY = H * 0.5;
  const markScale = Math.min(W, H * 2.2) / 1800;
  const markW = 109 * markScale, markH = 113 * markScale;
  const mx = cx - markW / 2;
  const my = horizonY - markH / 2;
  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <SbDefs />
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG_DEEP} />
          <stop offset="45%" stopColor="#0b120f" />
          <stop offset="100%" stopColor="#0a140f" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0.32 * glow} />
          <stop offset="40%" stopColor={SB_GREEN} stopOpacity={0.08 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-groundFade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG_DEEP} stopOpacity={0} />
          <stop offset="85%" stopColor={BG_DEEP} stopOpacity={0.6} />
          <stop offset="100%" stopColor={BG_DEEP} stopOpacity={0.95} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      {/* Single soft glow, wider than tall, centered on the mark */}
      <ellipse cx={cx} cy={horizonY} rx={W * 0.5} ry={H * 0.32} fill={`url(#${id}-sun)`} />
      <line x1={0} y1={horizonY} x2={W} y2={horizonY} stroke={SB_GREEN} strokeOpacity={0.3 * glow} strokeWidth={1.5} />
      <g stroke={SB_GREEN} strokeLinecap="round">
        {Array.from({ length: 22 }).map((_, i) => {
          const t = Math.pow((i + 1) / 22, 1.6);
          const y = horizonY + t * (H - horizonY);
          const op = 0.04 * glow + t * 0.22 * glow;
          return <line key={`h-${i}`} x1={0} y1={y} x2={W} y2={y} strokeOpacity={op} strokeWidth={1} />;
        })}
        {Array.from({ length: 56 }).map((_, i) => {
          const t = (i - 27.5) / 28;
          const xBot = cx + t * (W * 1.1);
          return <line key={`v-${i}`} x1={cx} y1={horizonY} x2={xBot} y2={H} strokeOpacity={0.06 * glow + (1 - Math.abs(t)) * 0.14 * glow} strokeWidth={1} />;
        })}
      </g>
      <rect x={0} y={horizonY} width={W} height={H - horizonY} fill={`url(#${id}-groundFade)`} />
      <g transform={`translate(${mx} ${my}) scale(${markScale})`}>
        <use href="#sb-mark" />
      </g>
      {showWordmark && <SbCornerLockup W={W} H={H} corner="br" />}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// WP6_Seed — lockup to bottom-left corner; canopy fans wider on wide aspects.
// ──────────────────────────────────────────────────────────────
function WP6_Seed(props) {
  const { id = 'wp6s', glow = 1, showWordmark = true } = props;
  const { W, H } = dims(props);
  const rand = mulberry32(5);
  const cx = W / 2;
  // Raise seed so canopy sits above dock safe zone (bottom ~18%)
  const cy = H * 0.78;
  const markScale = Math.min(W, H * 2) / 820;
  const markW = 109 * markScale, markH = 113 * markScale;

  // Aspect-aware fan: wider horizontal spread on wider canvases.
  const aspectRatio = W / H;
  // Angular fan spread — wider on wider canvases, but always at least ~PI (180°)
  const fanSpread = Math.min(Math.PI * 1.7, Math.PI * 1.15 + aspectRatio * 0.12);
  // Length driven by width (so wider canvases = longer branches).
  const baseLen = W * 0.048;
  // Canopy should ALWAYS be wider than tall. Squish more aggressively so
  // visual width (spread × baseLen) > visual height (baseLen × ySquish × depth).
  const ySquish = aspectRatio >= 2.4 ? 0.34 : aspectRatio >= 1.9 ? 0.46 : 0.58;

  const branches = [];
  function grow(x, y, angle, length, depth, width) {
    if (depth <= 0 || length < 40) return;
    const nx = x + Math.cos(angle) * length;
    const ny = y + Math.sin(angle) * length;
    branches.push({ x1: x, y1: y, x2: nx, y2: ny, depth, width });
    const splits = rand() < 0.3 ? 3 : 2;
    for (let i = 0; i < splits; i++) {
      const spread = 0.35 + rand() * 0.3;
      const childAngle = angle + (i - (splits - 1) / 2) * spread + (rand() - 0.5) * 0.15;
      const childLen = length * (0.62 + rand() * 0.18);
      grow(nx, ny, childAngle, childLen, depth - 1, width * 0.8);
    }
  }
  const fanCount = Math.round(9 + (aspectRatio - 1.78) * 2); // more branches on wider screens
  for (let i = 0; i < fanCount; i++) {
    const t = i / (fanCount - 1);
    const angle = -Math.PI / 2 + (t - 0.5) * fanSpread;
    const len = baseLen + rand() * baseLen * 0.3;
    grow(cx, cy - markH * 0.1, angle, len, 6, 2.6);
  }

  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <SbDefs />
      <defs>
        <radialGradient id={`${id}-soil`} cx="50%" cy="78%" r="42%">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0.6 * glow} />
          <stop offset="40%" stopColor={SB_GREEN} stopOpacity={0.12 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG_DEEP} />
          <stop offset="80%" stopColor={BG} />
          <stop offset="100%" stopColor="#0c1611" />
        </linearGradient>
        <linearGradient id={`${id}-topFade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG_DEEP} stopOpacity={1} />
          <stop offset="100%" stopColor={BG_DEEP} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <rect width={W} height={H} fill={`url(#${id}-soil)`} />
      <g transform={`translate(${cx} ${cy - markH * 0.1}) scale(1 ${ySquish}) translate(${-cx} ${-(cy - markH * 0.1)})`}>
      <g strokeLinecap="round" fill="none">
        {branches.map((b, i) => {
          const fadeByDepth = b.depth / 6;
          const op = 0.15 * glow + fadeByDepth * 0.55 * glow;
          return <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={SB_GREEN} strokeOpacity={op} strokeWidth={b.width} />;
        })}
      </g>
      <g>
        {branches.filter(b => b.depth <= 1).map((b, i) => (
          <circle key={i} cx={b.x2} cy={b.y2} r={2.8} fill={SB_GREEN} opacity={0.9 * glow} />
        ))}
      </g>
      </g>
      <rect width={W} height={H * 0.148} fill={`url(#${id}-topFade)`} />
      <g transform={`translate(${cx - markW / 2} ${cy - markH / 2}) scale(${markScale})`}>
        <use href="#sb-mark" />
      </g>
      {showWordmark && <SbCornerLockup W={W} H={H} corner="bl" />}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// WP7_Column — "strata" version: layered horizontal bands hint at stack.
// No text labels. Lockup vertically offset below mark on the column axis.
// ──────────────────────────────────────────────────────────────
function WP7_Column(props) {
  const { id = 'wp7c', glow = 1, showWordmark = true } = props;
  const { W, H } = dims(props);
  const cx = W / 2;
  const markScale = Math.min(W, H * 2) / 700;
  const markW = 109 * markScale, markH = 113 * markScale;
  const colW = markW * 1.4;
  // 5 strata of varying heights and densities.
  const strata = [
    { yStart: 0.05, yEnd: 0.22, density: 3,   opacity: 0.35 },
    { yStart: 0.22, yEnd: 0.38, density: 6,   opacity: 0.55 },
    { yStart: 0.38, yEnd: 0.56, density: 10,  opacity: 0.75 },
    { yStart: 0.56, yEnd: 0.76, density: 14,  opacity: 0.95 },
    { yStart: 0.76, yEnd: 0.95, density: 20,  opacity: 0.65 },
  ];
  const rand = mulberry32(13);

  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <SbDefs />
      <defs>
        <linearGradient id={`${id}-colEnds`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0} />
          <stop offset="15%" stopColor={SB_GREEN} stopOpacity={1} />
          <stop offset="85%" stopColor={SB_GREEN} stopOpacity={1} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-colSide`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0} />
          <stop offset="50%" stopColor={SB_GREEN} stopOpacity={0.12 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-colSide`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0} />
          <stop offset="50%" stopColor={SB_GREEN} stopOpacity={0.3 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0.6 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </radialGradient>
        <filter id={`${id}-markglow`} filterUnits="userSpaceOnUse"
          x={cx - markW * 2} y={H / 2 - markH * 2} width={markW * 4} height={markH * 4}>
          <feGaussianBlur stdDeviation={markW * 0.22} />
        </filter>
        <filter id={`${id}-markglow2`} filterUnits="userSpaceOnUse"
          x={cx - markW * 1.2} y={H / 2 - markH * 1.2} width={markW * 2.4} height={markH * 2.4}>
          <feGaussianBlur stdDeviation={markW * 0.06} />
        </filter>
        {/* Giant mark-shaped halo behind everything — replaces the old ellipse. */}
        <filter id={`${id}-markglowHuge`} filterUnits="userSpaceOnUse"
          x={cx - markW * 5} y={H / 2 - markH * 5} width={markW * 10} height={markH * 10}>
          <feGaussianBlur stdDeviation={markW * 0.9} />
        </filter>
        {/* Top/bottom fade only (no horizontal vignette) */}
        <mask id={`${id}-colmask`}>
          <rect x={0} y={0} width={W} height={H} fill={`url(#${id}-colEnds)`} />
        </mask>
        {/* Horizontal fade applied per-band — 0 at column's L edge, full at center, 0 at R edge */}
        <linearGradient id={`${id}-bandFade`} gradientUnits="userSpaceOnUse"
          x1={cx - colW / 2} y1="0" x2={cx + colW / 2} y2="0">
          <stop offset="0%"  stopColor={SB_GREEN} stopOpacity={0} />
          <stop offset="25%" stopColor={SB_GREEN} stopOpacity={0.6} />
          <stop offset="50%" stopColor={SB_GREEN} stopOpacity={1} />
          <stop offset="75%" stopColor={SB_GREEN} stopOpacity={0.6} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </linearGradient>
        {/* Vertical glow behind the column — subtle radial */}
        <radialGradient id={`${id}-verticalGlow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0.1 * glow} />
          <stop offset="60%" stopColor={SB_GREEN} stopOpacity={0.02 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={BG_DEEP} />
      {/* Giant mark-shaped halo behind the column (replaces the old ellipse). */}
      <g transform={`translate(${cx - markW * 2.5 / 2} ${H / 2 - markH * 2.5 / 2}) scale(${markScale * 2.5})`} filter={`url(#${id}-markglowHuge)`} opacity={0.35 * glow}>
        <use href="#sb-mark" />
      </g>
      {/* Strata bands: wider than column, horizontally faded per-line; masked top/bottom only. */}
      <g mask={`url(#${id}-colmask)`}>
        {strata.map((s, si) => {
          const y0 = s.yStart * H, y1 = s.yEnd * H;
          const bandCount = s.density;
          const lines = [];
          const bandX = cx - colW / 2;
          const bandW = colW;
          for (let i = 0; i < bandCount; i++) {
            const y = y0 + ((y1 - y0) * (i + 0.5)) / bandCount + (rand() - 0.5) * ((y1 - y0) / bandCount) * 0.3;
            const thick = Math.max(1, (y1 - y0) / bandCount * (0.15 + rand() * 0.25));
            lines.push(
              <rect key={`${si}-${i}`} x={bandX} y={y - thick / 2} width={bandW} height={thick}
                fill={`url(#${id}-bandFade)`} opacity={Math.min(1, s.opacity * (0.55 + rand() * 0.45) * glow)} />
            );
          }
          // Stratum divider
          lines.push(
            <rect key={`${si}-div`} x={bandX} y={y1} width={bandW} height={1.5} fill={`url(#${id}-bandFade)`} opacity={0.18 * glow} />
          );
          return <g key={si}>{lines}</g>;
        })}
      </g>
      {/* Mark-shaped glow + mark */}
      <g transform={`translate(${cx - markW / 2} ${H / 2 - markH / 2}) scale(${markScale})`} filter={`url(#${id}-markglow)`} opacity={0.85 * glow}>
        <use href="#sb-mark" />
      </g>
      <g transform={`translate(${cx - markW / 2} ${H / 2 - markH / 2}) scale(${markScale})`} filter={`url(#${id}-markglow2)`} opacity={0.7 * glow}>
        <use href="#sb-mark" />
      </g>
      <g transform={`translate(${cx - markW / 2} ${H / 2 - markH / 2}) scale(${markScale})`}>
        <use href="#sb-mark" />
      </g>
      {/* Lockup in bottom-right (matches other wallpapers). */}
      {showWordmark && <SbCornerLockup W={W} H={H} corner="br" />}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// WP_Pulse — soft radial pulse from the mark (always-on heartbeat).
// Hero: mark at center, concentric rings radiating outward.
// ──────────────────────────────────────────────────────────────
function WP_Pulse(props) {
  const { id = 'wppu', glow = 1, showWordmark = true } = props;
  const { W, H } = dims(props);
  const cx = W / 2, cy = H / 2;
  const markScale = Math.min(W, H * 2) / 780;
  const markW = 109 * markScale, markH = 113 * markScale;

  // Rings carry the heartbeat metaphor: near rings are tight+bright,
  // distant ones are faint and far-spaced. Slight elliptical stretch
  // on wide aspects so the pulse reaches the side edges.
  const aspectRatio = W / H;
  const rings = [];
  const rBase = Math.min(W, H) * 0.07;
  const count = 32;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const r = rBase * (1 + Math.pow(t, 1.2) * 18);
    const op = Math.max(0.02, 0.38 * (1 - t) * (1 - t)) * glow;
    const sw = 1 + (1 - t) * 2;
    rings.push({ r, op, sw });
  }

  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <SbDefs />
      <defs>
        <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0.55 * glow} />
          <stop offset="40%" stopColor={SB_GREEN} stopOpacity={0.15 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-bg`} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#0e1a14" stopOpacity={0.95} />
          <stop offset="100%" stopColor={BG_DEEP} stopOpacity={1} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-bg)`} />
      <ellipse cx={cx} cy={cy} rx={W * 0.22} ry={H * 0.44} fill={`url(#${id}-core)`} />
      <g fill="none" transform={`translate(${cx} ${cy})`}>
        {rings.map((r, i) => (
          <ellipse key={i} cx={0} cy={0} rx={r.r * Math.max(1, aspectRatio / 1.78)} ry={r.r} stroke={SB_GREEN} strokeOpacity={r.op} strokeWidth={r.sw} />
        ))}
      </g>
      <g transform={`translate(${cx - markW / 2} ${cy - markH / 2}) scale(${markScale})`}>
        <use href="#sb-mark" />
      </g>
      {showWordmark && <SbCornerLockup W={W} H={H} corner="br" />}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// WP_Terminal — mark glowing above a single monospace prompt line.
// Hero; developer-product honesty. Speaks to the "speed" half of the brief.
// ──────────────────────────────────────────────────────────────
function WP_Terminal(props) {
  const { id = 'wpte', glow = 1, showWordmark = false } = props;
  const { W, H } = dims(props);
  const cx = W / 2, cy = H * 0.44;
  const markScale = Math.min(W, H * 2) / 760;
  const markW = 109 * markScale, markH = 113 * markScale;
  const promptY = cy + markH * 0.95;
  const fontSize = Math.max(20, H * 0.019);
  const blockW = fontSize * 0.55;
  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <SbDefs />
      <defs>
        <radialGradient id={`${id}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0.45 * glow} />
          <stop offset="30%" stopColor={SB_GREEN} stopOpacity={0.14 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG_DEEP} />
          <stop offset="100%" stopColor="#0a130e" />
        </linearGradient>
        <filter id={`${id}-markglow`} filterUnits="userSpaceOnUse"
          x={cx - markW * 2} y={cy - markH * 2} width={markW * 4} height={markH * 4}>
          <feGaussianBlur stdDeviation={markW * 0.22} />
        </filter>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-bg)`} />
      <ellipse cx={cx} cy={cy} rx={Math.min(W * 0.4, H * 0.55)} ry={Math.min(W * 0.2, H * 0.35)} fill={`url(#${id}-sun)`} />
      <g transform={`translate(${cx - markW / 2} ${cy - markH / 2}) scale(${markScale})`} filter={`url(#${id}-markglow)`} opacity={0.85 * glow}>
        <use href="#sb-mark" />
      </g>
      <g transform={`translate(${cx - markW / 2} ${cy - markH / 2}) scale(${markScale})`}>
        <use href="#sb-mark" />
      </g>
      {/* Prompt line, centered */}
      <g fontFamily="'Source Code Pro', monospace" fontSize={fontSize} letterSpacing={0.8}>
        {/* Build the prompt manually so the $ sits in green and the cursor block aligns after the last char */}
        {(() => {
          const prefix = '$ ';
          const cmd = 'npx create-supabase-app';
          // Approximate character width in monospace
          const charW = fontSize * 0.6;
          const totalW = (prefix.length + cmd.length) * charW + blockW * 1.1;
          const startX = cx - totalW / 2;
          return (
            <>
              <text x={startX} y={promptY} fill={SB_GREEN} opacity={0.9 * glow}>{prefix}</text>
              <text x={startX + prefix.length * charW} y={promptY} fill={FG} opacity={0.88}>{cmd}</text>
              <rect x={startX + (prefix.length + cmd.length) * charW + charW * 0.15} y={promptY - fontSize * 0.85} width={blockW} height={fontSize * 0.95} fill={SB_GREEN} opacity={0.75 * glow} />
            </>
          );
        })()}
      </g>
      {showWordmark && <SbCornerLockup W={W} H={H} corner="br" />}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// WP_Spectrum — palette strip of Supabase product shades across the canvas.
// Atmospheric; "whole platform, many tools." Mark optional at center.
// ──────────────────────────────────────────────────────────────
function WP_Spectrum(props) {
  const { id = 'wpsp', glow = 1, showWordmark = true } = props;
  const { W, H } = dims(props);
  const cx = W / 2;
  // 12 product shades spanning Supabase's green palette (dark → bright → dark).
  // Each "cell" sits on a central horizontal band; rest of canvas stays black.
  const shades = [
    '#1a2620', '#1e3028', '#224033', '#2a5540', '#336e4e', '#3FCF8E',
    '#2eb377', '#289b66', '#237d53', '#1d5d3f', '#18402c', '#122c1f',
  ];
  const cellCount = shades.length;
  const bandH = H * 0.28;
  const bandY = (H - bandH) / 2;
  const totalW = W * 0.72;
  const cellW = totalW / cellCount;
  const cellGap = cellW * 0.04;
  const startX = cx - totalW / 2;
  const markScale = Math.min(W, H * 2) / 2400;
  const markW = 109 * markScale, markH = 113 * markScale;
  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <SbDefs />
      <defs>
        <linearGradient id={`${id}-cellFade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG_DEEP} stopOpacity={0.85} />
          <stop offset="30%" stopColor={BG_DEEP} stopOpacity={0} />
          <stop offset="70%" stopColor={BG_DEEP} stopOpacity={0} />
          <stop offset="100%" stopColor={BG_DEEP} stopOpacity={0.85} />
        </linearGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={cellW * 0.04} />
        </filter>
      </defs>
      <rect width={W} height={H} fill={BG_DEEP} />
      {/* Palette strip */}
      <g filter={`url(#${id}-soft)`}>
        {shades.map((c, i) => (
          <rect key={i}
            x={startX + i * cellW + cellGap / 2}
            y={bandY}
            width={cellW - cellGap}
            height={bandH}
            fill={c}
            opacity={glow} />
        ))}
      </g>
      {/* Vertical fade on the band so it ghosts out top/bottom */}
      <rect x={startX - cellGap} y={bandY} width={totalW + cellGap * 2} height={bandH} fill={`url(#${id}-cellFade)`} />
      {/* Spectrum always shows the mark — the palette strip alone doesn't read as Supabase.
          The showWordmark toggle controls whether the "supabase" lettering appears alongside it. */}
      <SbCornerLockup W={W} H={H} corner="br" showWordmark={showWordmark} />
    </svg>
  );
}

Object.assign(window, {
  WP2b_Ignition, WP3b_Graph, WP4b_Expanse,
  WP6_Seed, WP7_Column,
  WP_Pulse, WP_Terminal, WP_Spectrum,
});
