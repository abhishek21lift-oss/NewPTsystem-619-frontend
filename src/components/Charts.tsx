import { motion } from 'framer-motion';

export function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export function KpiCard({ label, value, sub, color, icon: Icon, children, onClick }: {
  label: string; value: string; sub: string; color: string; icon: any; children?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
      className="relative cursor-default overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.07)] p-5 transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(255,255,255,0.15)]"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(40px)' }}
      onClick={onClick}
    >
      <div className="absolute -right-[30px] -top-[30px] h-[120px] w-[120px] rounded-full opacity-[0.08] blur-[30px]"
        style={{ background: color }}
      />
      <div className="relative z-[1]">
        <div className="mb-[10px] flex items-start justify-between">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px]"
            style={{ background: `${color}18` }}
          >
            <Icon size={18} style={{ color }} />
          </div>
          {children}
        </div>
        <div className="mb-[5px] text-[10.5px] font-semibold uppercase tracking-[0.7px] text-[var(--text-tertiary)]">
          {label}
        </div>
        <div className="mb-[9px] text-[28px] font-extrabold tracking-tight leading-none">
          {value}
        </div>
        <div className="text-[11px] text-[var(--text-tertiary)]">{sub}</div>
      </div>
    </motion.div>
  );
}

export function Sparkline({ heights }: { heights?: number[] }) {
  const h = heights || [20, 35, 50, 65, 85, 100, 80];
  return (
    <div className="flex h-[28px] items-end gap-[2px]">
      {h.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-[2px] transition-all duration-200"
          style={{
            height: `${v}%`,
            minHeight: 3,
            opacity: 0.7,
            background: i >= h.length - 3 ? 'var(--success)' : 'var(--aurora-red)',
          }}
        />
      ))}
    </div>
  );
}

export function RingChart({ pct, color }: { pct: number; color: string }) {
  const circumference = 163.4;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative h-[62px] w-[62px] shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 62 62">
        <circle className="fill-none" cx="31" cy="31" r="26" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle className="fill-none stroke-linecap-round" cx="31" cy="31" r="26"
          stroke={color} strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[14px] font-extrabold leading-none" style={{ color }}>{pct}%</div>
        <div className="mt-[1px] text-[8.5px] font-semibold text-[var(--text-tertiary)] uppercase">goal</div>
      </div>
    </div>
  );
}

export function DonutChart({ segments, centerVal, centerLabel }: {
  segments: { value: number; color: string }[];
  centerVal: string; centerLabel: string;
}) {
  const total = segments.reduce((s, s_) => s + s_.value, 0);
  let startAngle = -Math.PI / 2;
  const outerR = 62;
  const innerR = 40;

  return (
    <div className="relative mx-auto h-[150px] w-[150px]">
      <svg className="h-full w-full" viewBox="0 0 150 150">
        <defs>
          {segments.map((seg, i) => (
            <linearGradient key={i} id={`dg-${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={seg.color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={seg.color} stopOpacity="0.6" />
            </linearGradient>
          ))}
        </defs>
        {segments.map((seg, idx) => {
          const angle = (seg.value / total) * Math.PI * 2;
          const endAngle = startAngle + angle;
          const x1 = 75 + Math.cos(startAngle) * outerR;
          const y1 = 75 + Math.sin(startAngle) * outerR;
          const x2 = 75 + Math.cos(endAngle) * outerR;
          const y2 = 75 + Math.sin(endAngle) * outerR;
          const ix1 = 75 + Math.cos(startAngle) * innerR;
          const iy1 = 75 + Math.sin(startAngle) * innerR;
          const ix2 = 75 + Math.cos(endAngle) * innerR;
          const iy2 = 75 + Math.sin(endAngle) * innerR;
          const largeArc = angle > Math.PI ? 1 : 0;
          const d = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
          startAngle = endAngle;
          return <path key={idx} d={d} fill={`url(#dg-${idx})`} stroke="rgba(6,6,8,0.85)" strokeWidth="1.5" />;
        })}
        <circle cx="75" cy="75" r={innerR} fill="#0C0C0E" />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[22px] font-extrabold tracking-tight leading-none">{centerVal}</div>
        <div className="mt-[2px] text-[10px] font-medium text-[var(--text-tertiary)] uppercase">{centerLabel}</div>
      </div>
    </div>
  );
}

export function GlassCard({ children, className = '', hoverable = true }: {
  children: React.ReactNode; className?: string; hoverable?: boolean;
}) {
  return (
    <div className={`g-card ${hoverable ? 'hoverable' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: {
  title: React.ReactNode; subtitle?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-[13px]">
      <div>
        <div className="text-[13.5px] font-bold tracking-tight">{title}</div>
        {subtitle && <div className="mt-[2px] text-[10.5px] text-[var(--text-tertiary)]">{subtitle}</div>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  if (status === 'active') return <span className="badge b-active"><span className="badge-dot" />Active</span>;
  if (status === 'expired') return <span className="badge b-expired"><span className="badge-dot" />Expired</span>;
  if (status === 'soon') return <span className="badge b-soon"><span className="badge-dot" />Expiring</span>;
  return null;
}

export function TrainerTag({ trainer }: { trainer: string }) {
  const tagClass = trainer === 'AK' ? 'tag-a' : trainer === 'RS' ? 'tag-r' : trainer === 'SV' ? 'tag-s' : 'tag-k';
  const tagText = trainer === 'AK' ? 'Abhishek' : trainer === 'RS' ? 'Riya' : trainer === 'SV' ? 'Shivani' : 'Rajat';
  return <span className={`tag ${tagClass}`}>{tagText}</span>;
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
    </div>
  );
}

function darken(hex: string, f: number) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.floor(r * f)},${Math.floor(g * f)},${Math.floor(b * f)})`;
}

function lighten(hex: string, f: number) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.min(255, Math.floor(r + (255 - r) * f))},${Math.min(255, Math.floor(g + (255 - g) * f))},${Math.min(255, Math.floor(b + (255 - b) * f))})`;
}

const CSS_CACHE = new Map<string, HTMLStyleElement>();
function injectCSS(id: string, css: string) {
  if (CSS_CACHE.has(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
  CSS_CACHE.set(id, style);
}

export function drawDonut3D(id: string, segs: { v: number; c: string }[]) {
  const canvas = document.getElementById(id) as HTMLCanvasElement | null;
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 2;
  canvas.width = 150 * dpr;
  canvas.height = 150 * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  const cx = 75, cy = 75, OR = 62, IR = 40, depth = 11;
  const total = segs.reduce((s, g) => s + g.v, 0);
  let ang = -Math.PI / 2;

  segs.forEach(seg => {
    const span = (seg.v / total) * Math.PI * 2;
    const mid = ang + span / 2;
    if (Math.sin(mid) > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy + depth, OR, ang, ang + span);
      ctx.arc(cx, cy + depth, IR, ang + span, ang, true);
      ctx.closePath();
      ctx.fillStyle = darken(seg.c, 0.55);
      ctx.fill();
    }
    ang += span;
  });

  ang = -Math.PI / 2;
  segs.forEach(seg => {
    const span = (seg.v / total) * Math.PI * 2;
    const end = ang + span;
    ctx.beginPath();
    ctx.arc(cx, cy, OR, ang, end);
    ctx.lineTo(cx + Math.cos(end) * OR, cy + Math.sin(end) * OR + depth);
    ctx.arc(cx, cy + depth, OR, end, ang, true);
    ctx.lineTo(cx + Math.cos(ang) * OR, cy + Math.sin(ang) * OR);
    ctx.closePath();
    const g = ctx.createLinearGradient(cx, cy, cx, cy + depth);
    g.addColorStop(0, darken(seg.c, 0.72));
    g.addColorStop(1, darken(seg.c, 0.42));
    ctx.fillStyle = g;
    ctx.fill();
    ang += span;
  });

  ang = -Math.PI / 2;
  segs.forEach(seg => {
    const span = (seg.v / total) * Math.PI * 2;
    const end = ang + span;
    const mid = ang + span / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, OR, ang, end);
    ctx.arc(cx, cy, IR, end, ang, true);
    ctx.closePath();
    const gx1 = cx + Math.cos(mid) * IR, gy1 = cy + Math.sin(mid) * IR;
    const gx2 = cx + Math.cos(mid) * OR, gy2 = cy + Math.sin(mid) * OR;
    const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
    grad.addColorStop(0, lighten(seg.c, 0.22));
    grad.addColorStop(0.5, seg.c);
    grad.addColorStop(1, darken(seg.c, 0.78));
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(6,6,8,0.85)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ang += span;
  });

  ctx.beginPath();
  ctx.arc(cx, cy, IR, 0, Math.PI * 2);
  ctx.fillStyle = '#0C0C0E';
  ctx.fill();

  const sh = ctx.createRadialGradient(cx - 16, cy - 22, 4, cx, cy, OR);
  sh.addColorStop(0, 'rgba(255,255,255,0.09)');
  sh.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, OR, 0, Math.PI * 2);
  ctx.arc(cx, cy, IR, Math.PI * 2, 0, true);
  ctx.fillStyle = sh;
  ctx.fill();
}

export function drawRevenueChart(id: string, data: { m: string; rev: number }[]) {
  const svg = document.getElementById(id) as unknown as SVGSVGElement | null;
  if (!svg) return;
  const max = Math.max(...data.map(d => d.rev));
  const W = 580, H = 170, pL = 6, pR = 6, pT = 12, pB = 28;
  const w = W - pL - pR, h = H - pT - pB;
  const pts = data.map((d, i) => ({
    x: pL + (i / (data.length - 1)) * w,
    y: pT + h - (d.rev / max) * h,
    ...d,
  }));

  function smooth(ps: typeof pts) {
    if (ps.length < 2) return '';
    let d = `M ${ps[0].x} ${ps[0].y}`;
    for (let i = 0; i < ps.length - 1; i++) {
      const cpx = (ps[i].x + ps[i + 1].x) / 2;
      d += ` C ${cpx} ${ps[i].y}, ${cpx} ${ps[i + 1].y}, ${ps[i + 1].x} ${ps[i + 1].y}`;
    }
    return d;
  }

  const line = smooth(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${pT + h} L ${pts[0].x} ${pT + h} Z`;
  const grids = [0.25, 0.5, 0.75, 1].map(r => {
    const y = pT + h - r * h;
    const v = max * r;
    const lbl = v >= 100000 ? '₹' + (v / 100000).toFixed(1) + 'L' : '₹' + Math.round(v / 1000) + 'K';
    return `<line x1="${pL}" y1="${y}" x2="${W - pR}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="4,5"/><text x="${pL + 2}" y="${y - 3}" fill="rgba(255,255,255,0.18)" font-size="8" font-family="DM Mono,monospace">${lbl}</text>`;
  });

  const labels = pts.map((p, i) => {
    if (i % 3 !== 0) return '';
    const parts = p.m.split(' ');
    return `<text x="${p.x}" y="${pT + h + 19}" fill="rgba(255,255,255,0.28)" font-size="8.5" text-anchor="middle" font-family="Plus Jakarta Sans">${parts[0].slice(0, 3)} '${(parts[1] || '').slice(2)}</text>`;
  });

  const dots = pts.map((p, i) => {
    const big = p.rev >= 200000;
    if (!big && i % 2 !== 0) return '';
    return `<circle cx="${p.x}" cy="${p.y}" r="${big ? 5 : 3}" fill="${big ? '#FF375F' : 'rgba(255,255,255,0.25)'}" stroke="${big ? 'rgba(255,55,95,0.35)' : 'transparent'}" stroke-width="${big ? 5 : 0}"/>`;
  });

  svg.innerHTML = `
    <defs>
      <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FF375F" stop-opacity="0.28"/>
        <stop offset="55%" stop-color="#FF375F" stop-opacity="0.07"/>
        <stop offset="100%" stop-color="#FF375F" stop-opacity="0"/>
      </linearGradient>
      <filter id="glow-f"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#FF375F"/>
        <stop offset="50%" stop-color="#FF6B6B"/>
        <stop offset="100%" stop-color="#FF9500"/>
      </linearGradient>
    </defs>
    ${grids.join('')}
    <path d="${area}" fill="url(#ag)"/>
    <path d="${line}" fill="none" stroke="rgba(255,55,95,0.18)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${line}" fill="none" stroke="url(#lg)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" filter="url(#glow-f)"/>
    ${dots.join('')}
    ${labels.join('')}
  `;
}
