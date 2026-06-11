import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, CheckCircle, Users, Wallet, TrendingUp } from 'lucide-react';
import { api } from '../lib/api';
import type { DashboardData, TrainerBreakdown, PlanDistribution } from '../types';
import TickerBar from '../components/TickerBar';
import { KpiCard, Sparkline, RingChart, GlassCard, CardHeader, LoadingSpinner, fmt, drawDonut3D, drawRevenueChart } from '../components/Charts';

const TRAINER_COLORS = [
  { c: '#FF375F', tc: '#FF7087' },
  { c: '#FF6B9D', tc: '#FF8BB8' },
  { c: '#5AC8F5', tc: '#5AC8F5' },
  { c: '#FFD60A', tc: '#FFD60A' },
];

const PLAN_COLORS = [
  { c: '#FF375F', tc: '#FF7087' },
  { c: '#FF9500', tc: '#FFB340' },
  { c: '#0A84FF', tc: '#5AC8F5' },
  { c: '#BF5AF2', tc: '#D077FF' },
];

export default function Overview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [trainerBreakdown, setTrainerBreakdown] = useState<TrainerBreakdown[]>([]);
  const [planDist, setPlanDist] = useState<PlanDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(70);

  useEffect(() => {
    const target = new Date('2026-06-19T00:00:00+05:30');
    const tick = () => setCountdown(Math.ceil((target.getTime() - Date.now()) / 86400000));
    tick(); const id = setInterval(tick, 60000);

    Promise.all([
      api.getDashboard(),
      api.getTrainerBreakdown(),
      api.getPlanDistribution(),
    ]).then(([d, tb, pd]) => {
      setData(d);
      setTrainerBreakdown(tb);
      setPlanDist(pd);

      setTimeout(() => {
        drawDonut3D('d-status', [
          { v: d.stats.active_enrollments, c: '#32D74B' },
          { v: d.stats.expired_enrollments, c: '#3A3A3C' },
          { v: d.stats.soon_enrollments, c: '#FF9500' },
        ]);

        const trainerColors = ['#FF375F', '#FF6B9D', '#5AC8F5', '#FFD60A'];
        drawDonut3D('d-trainer', tb.map((t, i) => ({ v: t.total_clients, c: trainerColors[i % trainerColors.length] })));

        const planColors = ['#FF375F', '#FF9500', '#0A84FF', '#BF5AF2'];
        const pkgData = pd
          .filter(p => (p.enrollments?.[0]?.count || p.enrollment_count || 0) > 0)
          .map((p, i) => ({ v: p.enrollments?.[0]?.count ?? p.enrollment_count ?? 0, c: planColors[i % planColors.length] }));
        if (pkgData.length > 0) drawDonut3D('d-pkg', pkgData);

        if (d.monthly_revenue.length > 0) {
          drawRevenueChart('rev-svg', d.monthly_revenue);
        }
      }, 100);
    }).catch(console.error).finally(() => setLoading(false));
    return () => clearInterval(id);
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = data?.stats || { total_clients: 0, active_enrollments: 0, expired_enrollments: 0, soon_enrollments: 0, total_revenue: 0 };
  const activities = data?.recent_activities || [];
  const monthlyRevenue = data?.monthly_revenue || [];

  const peak = monthlyRevenue.length > 0
    ? monthlyRevenue.reduce((a, b) => (a.rev > b.rev ? a : b), monthlyRevenue[0])
    : null;

  const totalPkgEnrollments = planDist.reduce((s, p) => s + (p.enrollments?.[0]?.count || p.enrollment_count || 0), 0);

  const trainerCards = trainerBreakdown.map((t, i) => {
    const c = TRAINER_COLORS[i % TRAINER_COLORS.length];
    const maxClients = Math.max(...trainerBreakdown.map(x => x.total_clients), 1);
    const pct = Math.round((t.total_clients / maxClients) * 100);
    return {
      initials: t.initials,
      name: t.full_name,
      role: i === 0 ? 'Head Trainer · K11 Certified · Owner' : 'Personal Trainer',
      cls: ['r', 'p', 'b', 'y'][i % 4],
      bg1: `rgba(255,55,95,0.10)`,
      bg2: `rgba(255,55,95,0.03)`,
      gradient: [ 'linear-gradient(145deg,#FF375F,#8B0022)', 'linear-gradient(145deg,#FF6B9D,#C2185B)', 'linear-gradient(145deg,#5AC8F5,#0A84FF)', 'linear-gradient(145deg,#FFD60A,#FF8C00)' ][i % 4],
      shadow: [ 'rgba(255,55,95,0.4)', 'rgba(255,107,157,0.4)', 'rgba(90,200,245,0.4)', 'rgba(255,214,0,0.4)' ][i % 4],
      clients: t.total_clients,
      pct,
      revenue: Math.round(t.total_revenue / (trainerBreakdown.length || 1)),
      commission: Math.round(t.commission),
      alltime: Math.round(t.total_revenue),
      fillGrad: [ 'linear-gradient(90deg,#FF375F,#FF6B6B)', 'linear-gradient(90deg,#FF6B9D,#FF375F)', 'linear-gradient(90deg,#5AC8F5,#0A84FF)', 'linear-gradient(90deg,#FFD60A,#FF9500)' ][i % 4],
    };
  });

  const totalMonthlyRev = trainerCards.reduce((s, t) => s + t.revenue, 0);

  return (
    <div>
      <TickerBar />

      <div className="mb-[14px] flex items-center gap-[14px] overflow-hidden rounded-[16px] p-3 text-[12.5px] relative"
        style={{ background: 'linear-gradient(135deg,rgba(255,55,95,0.16),rgba(255,149,0,0.12),rgba(191,90,242,0.10))', border: '1px solid rgba(255,55,95,0.28)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,214,0,0.04),transparent)' }} />
        <span className="text-[22px] shrink-0">🎉</span>
        <div className="flex-1">
          <div className="text-[13px] font-extrabold tracking-tight" style={{ color: 'var(--red-light)' }}>Grand Reopening — 19 June 2026</div>
          <div className="mt-[2px] text-[11px] text-[var(--text-secondary)] font-medium">619 Fitness Studio is moving to a new, larger location in Lucknow. Mark the date!</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[18px] font-extrabold tracking-tight" style={{ color: 'var(--yellow)' }}>{countdown > 0 ? countdown : countdown === 0 ? 'TODAY!' : 'Open!'}</div>
          <div className="mt-[1px] text-[9.5px] font-bold uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Days to Go</div>
        </div>
        <button className="btn-primary text-[11px] px-[14px] py-[7px]">Marketing →</button>
      </div>

      {stats.expired_enrollments > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-[14px] flex items-center gap-3 rounded-[16px] border border-[rgba(255,149,0,0.2)] p-3 text-[12.5px]"
          style={{ background: 'linear-gradient(135deg, rgba(255,149,0,0.08), rgba(255,149,0,0.03))', color: 'var(--orange-light)' }}
        >
          <AlertTriangle size={18} strokeWidth={1.5} />
          <span><strong>{stats.expired_enrollments} expired clients</strong> — renewals needed to maintain studio revenue.</span>
          <span className="ml-auto cursor-pointer text-[11px] opacity-70 hover:opacity-100 font-semibold">View →</span>
        </motion.div>
      )}

      <div className="spotlight-card mb-[14px]">
        <div className="relative z-[1] mb-3 flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[1.2px] text-[var(--text-tertiary)]">
          <span className="h-[6px] w-[6px] rounded-full bg-[var(--red)]" style={{ boxShadow: '0 0 8px rgba(255,55,95,0.6)', animation: 'blink 2s ease-in-out infinite' }} />
          Studio · All-Time Performance
        </div>
        <div className="relative z-[1] grid grid-cols-5">
          {[
            { label: 'Total Revenue', val: fmt(stats.total_revenue), color: 'var(--green-light)', sub: 'May 2025 – Now' },
            { label: 'Active Clients', val: String(stats.active_enrollments), color: 'var(--blue-light)', sub: `${trainerBreakdown.length} trainers` },
            { label: 'Total Enrolled', val: String(stats.total_clients), color: '', sub: 'All time' },
            { label: 'Expired', val: String(stats.expired_enrollments), color: 'var(--orange-light)', sub: 'Needs renewal' },
            { label: 'Avg Revenue/Mo', val: monthlyRevenue.length > 0 ? fmt(Math.round(stats.total_revenue / monthlyRevenue.length)) : fmt(0), color: 'var(--purple-light)', sub: 'Per month avg' },
          ].map((item, i) => (
            <div key={i} className="border-r border-[var(--border)] px-[18px] first:pl-0 last:border-r-0">
              <div className="stat-label">{item.label}</div>
              <div className="stat-value mb-[4px]" style={{ color: item.color || 'var(--text-primary)' }}>
                {item.val}
              </div>
              <div className="text-[10.5px] text-[var(--text-tertiary)] font-medium">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-[14px] grid grid-cols-4 gap-[14px]">
        <KpiCard label="Total Revenue" value={fmt(stats.total_revenue)} sub={`${monthlyRevenue.length} months`} color="#FF375F" icon={DollarSign}><Sparkline /></KpiCard>
        <KpiCard label="Active Clients" value={String(stats.active_enrollments)} sub={`${trainerBreakdown.length} trainers`} color="#32D74B" icon={CheckCircle}><RingChart pct={Math.round((stats.active_enrollments / Math.max(stats.total_clients, 1)) * 100)} color="#32D74B" /></KpiCard>
        <KpiCard label="Total Clients" value={String(stats.total_clients)} sub="All-time enrollments" color="#0A84FF" icon={Users}><Sparkline heights={[20, 38, 55, 72, 88, 100, 100]} /></KpiCard>
        <KpiCard label="Revenue Goal" value={fmt(200000)} sub={`₹${fmt(stats.total_revenue)} achieved`} color="#FF9500" icon={Wallet}><RingChart pct={Math.round((stats.total_revenue / (200000 * 14)) * 100)} color="#FF9500" /></KpiCard>
      </div>

      <div className="mb-[14px] grid grid-cols-3 gap-[14px]">
        <GlassCard>
          <CardHeader title="Client Status" subtitle="Active vs Expired vs Expiring" />
          <div className="flex flex-col items-center gap-[14px] p-[22px]">
            <div className="relative h-[150px] w-[150px]">
              <canvas id="d-status" className="h-[150px] w-[150px]" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[22px] font-extrabold tracking-tight leading-none" style={{ color: 'var(--green-light)' }}>{stats.active_enrollments}</div>
                <div className="mt-[2px] text-[9.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Active</div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-[8px]">
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#32D74B' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Active</span><span className="text-[12.5px] font-bold" style={{ color: 'var(--green-light)' }}>{stats.active_enrollments}</span></div>
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: 'var(--chart-dot)' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Expired</span><span className="text-[12.5px] font-bold">{stats.expired_enrollments}</span></div>
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF9500' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Expiring Soon</span><span className="text-[12.5px] font-bold" style={{ color: 'var(--orange-light)' }}>{stats.soon_enrollments}</span></div>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <CardHeader title="Trainer Share" subtitle="Total clients by trainer" />
          <div className="flex flex-col items-center gap-[14px] p-[22px]">
            <div className="relative h-[150px] w-[150px]">
              <canvas id="d-trainer" className="h-[150px] w-[150px]" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[22px] font-extrabold tracking-tight leading-none">{trainerBreakdown.reduce((s, t) => s + t.total_clients, 0)}</div>
                <div className="mt-[2px] text-[9.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Total</div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-[8px]">
              {trainerBreakdown.map((t, i) => (
                <div key={t.id} className="dl-item flex items-center gap-2 text-[11.5px]">
                  <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: TRAINER_COLORS[i % TRAINER_COLORS.length].c }} />
                  <span className="flex-1 text-[var(--text-secondary)] font-medium">{t.full_name}</span>
                  <span className="text-[12.5px] font-bold" style={{ color: TRAINER_COLORS[i % TRAINER_COLORS.length].tc }}>{t.total_clients}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <CardHeader title="Package Mix" subtitle={`${totalPkgEnrollments} total packages enrolled`} />
          <div className="flex flex-col items-center gap-[14px] p-[22px]">
            <div className="relative h-[150px] w-[150px]">
              <canvas id="d-pkg" className="h-[150px] w-[150px]" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[22px] font-extrabold tracking-tight leading-none">{totalPkgEnrollments}</div>
                <div className="mt-[2px] text-[9.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Packages</div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-[8px]">
              {planDist.filter(p => (p.enrollments?.[0]?.count || p.enrollment_count || 0) > 0).map((p, i) => (
                <div key={p.id} className="dl-item flex items-center gap-2 text-[11.5px]">
                  <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: PLAN_COLORS[i % PLAN_COLORS.length].c }} />
                  <span className="flex-1 text-[var(--text-secondary)] font-medium">{p.name}</span>
                  <span className="text-[12.5px] font-bold" style={{ color: PLAN_COLORS[i % PLAN_COLORS.length].tc }}>{p.enrollments?.[0]?.count ?? p.enrollment_count ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-[14px] grid grid-cols-[1.65fr_1fr] gap-[14px]">
        <GlassCard>
          <CardHeader title="Monthly Revenue Trend" subtitle={`${monthlyRevenue.length > 0 ? monthlyRevenue[0]?.month : ''} – ${monthlyRevenue.length > 0 ? monthlyRevenue[monthlyRevenue.length - 1]?.month : ''} · All trainers`} action={<div className="c-action">All Trainers</div>} />
          <div className="h-[200px] px-5 py-4">
            <svg id="rev-svg" className="h-full w-full overflow-visible" viewBox="0 0 580 180" preserveAspectRatio="none" />
          </div>
          <div className="grid grid-cols-3 border-t border-[var(--border)] px-5 py-[14px]">
            <div className="text-center"><div className="text-[17px] font-extrabold tracking-tight" style={{ color: 'var(--green)' }}>{peak ? fmt(peak.rev) : '—'}</div><div className="mt-[2px] text-[9.5px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Peak Month</div></div>
            <div className="text-center border-x border-[var(--border)]"><div className="text-[17px] font-extrabold tracking-tight" style={{ color: 'var(--blue-light)' }}>{peak ? peak.month : '—'}</div><div className="mt-[2px] text-[9.5px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Best Month</div></div>
            <div className="text-center"><div className="text-[17px] font-extrabold tracking-tight" style={{ color: 'var(--orange-light)' }}>{fmt(stats.total_revenue)}</div><div className="mt-[2px] text-[9.5px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">All-Time Total</div></div>
          </div>
        </GlassCard>
        <GlassCard>
          <CardHeader title="Recent Activity" subtitle="Latest studio updates" action={<div className="c-action">View All</div>} />
          <div className="flex flex-col px-5 py-3">
            {activities.slice(0, 6).map((act, i) => (
              <div key={act.id || i} className="flex items-start gap-3 border-b border-[var(--table-border)] py-[10px] last:border-b-0">
                <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[10px] text-[14px]"
                  style={{ background: act.color || 'rgba(10,132,255,0.10)' }}
                >
                  {act.icon || '📌'}
                </div>
                <div className="flex-1">
                  <div className="text-[12.5px] font-medium leading-[1.5] text-[var(--text-secondary)]"
                    dangerouslySetInnerHTML={{
                      __html: (act.description || '').replace(/(₹[\d,]+)/g, '<strong style="color:var(--orange-light)">$1</strong>')
                    }}
                  />
                  <div className="mt-[2px] text-[10px] text-[var(--text-tertiary)]">{act.created_at ? new Date(act.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mb-[14px]">
        <CardHeader title="Monthly Trainer Snapshot" subtitle="Current active period"
          action={<div className="text-[11px] text-[var(--text-tertiary)]">Total: <span className="font-bold" style={{ color: 'var(--green)' }}>{fmt(totalMonthlyRev)}</span></div>}
        />
        <div className="grid grid-cols-4 gap-3 px-5 py-[18px]">
          {trainerCards.map((t, i) => (
            <div key={i} className={`relative overflow-hidden rounded-[16px] border border-[var(--border)] tc-${t.cls} p-[18px] transition-all hover:-translate-y-[2px]`}
              style={{ background: `linear-gradient(145deg, ${t.bg1}, ${t.bg2})` }}
            >
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full text-[15px] font-extrabold mb-[13px] text-white"
                style={{ background: t.gradient, boxShadow: `0 5px 18px ${t.shadow}` }}
              >{t.initials}</div>
              <div className="mb-[2px] text-[14px] font-bold tracking-tight">{t.name}</div>
              <div className="mb-[14px] text-[10px] text-[var(--text-tertiary)] font-medium">{t.role}</div>
              <div className="mb-[5px] flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">Active Clients</span><span className="font-bold">{t.clients}</span></div>
              <div className="mb-[3px] h-[4px] rounded-[2px] bg-[var(--border)] overflow-hidden"><div className="h-full rounded-[2px]" style={{ width: `${t.pct}%`, background: t.fillGrad }} /></div>
              <div className="mt-[6px] flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">Monthly Revenue</span><span className="font-bold" style={{ color: 'var(--green)' }}>{fmt(t.revenue)}</span></div>
              <div className="flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">Commission (50%)</span><span className="font-bold" style={{ color: 'var(--orange-light)' }}>{fmt(t.commission)}</span></div>
              <div className="flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">All-Time Revenue</span><span className="font-bold" style={{ color: 'var(--blue-light)' }}>{fmt(t.alltime)}</span></div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <CardHeader title="Performance Goals" subtitle="Studio targets"
          action={<div className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-[11px] py-[4px] text-[10.5px] text-[var(--text-tertiary)]">June 2026</div>}
        />
        <div className="px-5 py-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Revenue Target', current: monthlyRevenue.length > 0 ? fmt(monthlyRevenue[monthlyRevenue.length - 1]?.rev || 0) : fmt(0), target: fmt(200000), pct: monthlyRevenue.length > 0 ? Math.min(Math.round(((monthlyRevenue[monthlyRevenue.length - 1]?.rev || 0) / 200000) * 100), 100) : 0, color: 'var(--green-light)', fill: 'linear-gradient(90deg,#32D74B,#5FE87A)' },
              { label: 'Active Clients', current: String(stats.active_enrollments), target: '40', pct: Math.min(Math.round((stats.active_enrollments / 40) * 100), 100), color: 'var(--blue-light)', fill: 'linear-gradient(90deg,#0A84FF,#5AC8F5)' },
              { label: 'Retention Rate', current: `${Math.round((stats.active_enrollments / Math.max(stats.total_clients, 1)) * 100)}%`, target: '60%', pct: Math.round((stats.active_enrollments / Math.max(stats.total_clients, 1)) * 100), color: 'var(--orange-light)', fill: 'linear-gradient(90deg,#FF9500,#FFB340)' },
              { label: 'Avg Revenue/Client', current: fmt(Math.round(stats.total_revenue / Math.max(stats.total_clients, 1))), target: fmt(25000), pct: Math.min(Math.round(((stats.total_revenue / Math.max(stats.total_clients, 1)) / 25000) * 100), 100), color: 'var(--purple-light)', fill: 'linear-gradient(90deg,#BF5AF2,#D077FF)' },
            ].map((g, i) => (
              <div key={i} className="rounded-[16px] border border-[var(--border)] bg-[var(--insight-bg)] p-4">
                <div className="mb-[10px] text-[10px] font-bold uppercase tracking-[0.6px] text-[var(--text-tertiary)]">{g.label}</div>
                <div className="mb-[8px] flex items-baseline justify-between">
                  <div className="text-[18px] font-extrabold tracking-tight" style={{ color: g.color }}>{g.current}</div>
                  <div className="text-[10.5px] text-[var(--text-tertiary)]">/ {g.target}</div>
                </div>
                <div className="h-[5px] rounded-[3px] bg-[var(--border)] overflow-hidden">
                  <div className="h-full rounded-[3px] transition-all duration-1400" style={{ width: `${g.pct}%`, background: g.fill }} />
                </div>
                <div className="mt-[6px] text-[11px] font-bold" style={{ color: `${g.color}` }}>{g.pct}% achieved</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
