// Kept + fixed originals. Each accepts {W, H} or {aspect} props.
// Policy: atmospheric wallpapers use SbCornerLockup (standard bottom-right).
// Hero wallpapers show the mark alone; showWordmark adds the same corner lockup.

// ──────────────────────────────────────────────────────────────
// WP2 — Brand Field (atmospheric)
// Lockup bumped ~1.4× via its own centered slot (the only exception:
// WP2's lockup IS the composition, so it stays centered-large).
// ──────────────────────────────────────────────────────────────
function WP2_GridField(props) {
  const { id = 'wp2', glow = 1, showWordmark = true } = props;
  const { W, H } = dims(props);
  const spacing = Math.max(56, Math.round(H / 40));
  const dots = [];
  for (let y = spacing; y < H; y += spacing) {
    for (let x = spacing; x < W; x += spacing) {
      const dy = (y - H * 0.7) / H;
      const dxn = (x - W / 2) / W;
      const dist = Math.sqrt(dy * dy + dxn * dxn * 0.25);
      const brightness = Math.max(0.05, 0.7 - dist * 2.2);
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} fill={SB_GREEN} opacity={0.1 + brightness * 0.28 * glow} />);
    }
  }
  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <SbDefs />
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="110%" r="70%">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0.45 * glow} />
          <stop offset="25%" stopColor={SB_GREEN_DEEP} stopOpacity={0.22 * glow} />
          <stop offset="60%" stopColor="#0f1a15" stopOpacity={0.3 * glow} />
          <stop offset="100%" stopColor={BG} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG_DEEP} stopOpacity={1} />
          <stop offset="100%" stopColor={BG_DEEP} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={BG} />
      <g>{dots}</g>
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      <rect width={W} height={H * 0.15} fill={`url(#${id}-top)`} />
      {showWordmark && (
        <SbLockup cx={W / 2} cy={H / 2 + H * 0.02} scale={Math.min(W, H * 2) / 2850} showWordmark={true} />
      )}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// WP4 — Horizon (hero→atmospheric): drop big mark, lockup only when opted in
// ──────────────────────────────────────────────────────────────
function WP4_Horizon(props) {
  const { id = 'wp4', glow = 1, showWordmark = true, showSqlLine = true } = props;
  const { W, H } = dims(props);
  const cx = W / 2;
  const horizonY = H * 0.72;
  // Mark restored at vertical center of the canvas (above the horizon).
  const markScale = Math.min(W, H * 2.2) / 900;
  const markW = 109 * markScale, markH = 113 * markScale;
  const mx = cx - markW / 2;
  const my = H * 0.5 - markH / 2;
  const sql = `select row_to_json(projects) from public.projects where status = 'building'`;
  return (
    <svg id={id} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: '100%' }}>
      <SbDefs />
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG_DEEP} />
          <stop offset="60%" stopColor={BG} />
          <stop offset="85%" stopColor="#0d1a13" />
          <stop offset="100%" stopColor="#0a140f" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0.7 * glow} />
          <stop offset="30%" stopColor={SB_GREEN} stopOpacity={0.3 * glow} />
          <stop offset="70%" stopColor={SB_GREEN} stopOpacity={0.05 * glow} />
          <stop offset="100%" stopColor={SB_GREEN} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-aurora`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SB_GREEN} stopOpacity={0} />
          <stop offset="50%" stopColor={SB_GREEN} stopOpacity={0.22 * glow} />
          <stop offset="100%" stopColor={SB_GREEN_DEEP} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <ellipse cx={cx} cy={horizonY} rx={W * 0.34} ry={H * 0.37} fill={`url(#${id}-sun)`} />
      <line x1={0} y1={horizonY} x2={W} y2={horizonY} stroke={SB_GREEN} strokeOpacity={0.22 * glow} strokeWidth={1.5} />
      {Array.from({ length: 24 }).map((_, i) => {
        const frac = i / 23;
        const rayX = cx - W * 0.44 + frac * W * 0.88;
        const endOffset = (frac - 0.5) * W * 0.5;
        return <line key={i} x1={rayX} y1={horizonY} x2={cx + endOffset * 0.6} y2={horizonY - H * 0.43 - Math.abs(frac - 0.5) * H * 0.06} stroke={SB_GREEN} strokeOpacity={0.05 * glow + (1 - Math.abs(frac - 0.5)) * 0.08 * glow} strokeWidth={1} />;
      })}
      <rect x={0} y={horizonY} width={W} height={H - horizonY} fill={`url(#${id}-aurora)`} />
      <g stroke={SB_GREEN} strokeOpacity={0.15 * glow} strokeWidth={1}>
        {Array.from({ length: 14 }).map((_, i) => {
          const t = (i + 1) / 14;
          const y = horizonY + t * (H - horizonY);
          return <line key={`h-${i}`} x1={0} y1={y} x2={W} y2={y} strokeOpacity={0.05 * glow + t * 0.12 * glow} />;
        })}
        {Array.from({ length: 40 }).map((_, i) => {
          const t = (i - 19.5) / 20;
          const xTop = cx + t * W * 0.156;
          const xBot = cx + t * (W / 2 + W * 0.052);
          return <line key={`v-${i}`} x1={xTop} y1={horizonY} x2={xBot} y2={H} strokeOpacity={0.06 * glow + (1 - Math.abs(t)) * 0.08 * glow} />;
        })}
      </g>
      {showSqlLine && (
        <text x={cx} y={H * 0.12} fill={FG_MUTED} fontFamily="'Source Code Pro', monospace" fontSize={Math.max(20, H * 0.0117)} letterSpacing={1.5} textAnchor="middle" opacity={0.6}>
          {sql}
        </text>
      )}
      <g transform={`translate(${mx} ${my}) scale(${markScale})`}>
        <use href="#sb-mark" />
      </g>
      {showWordmark && <SbCornerLockup W={W} H={H} corner="br" />}
    </svg>
  );
}

Object.assign(window, { WP2_GridField, WP4_Horizon });
