import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import type { DashboardData } from '../types';
import TickerBar from '../components/TickerBar';
import { AlertTriangle, TrendingUp, Users, DollarSign, Wallet, CheckCircle, Target } from 'lucide-react';
import { KpiCard, Sparkline, RingChart, GlassCard, CardHeader, LoadingSpinner, fmt, drawDonut3D, drawRevenueChart } from '../components/Charts';

const TRAINER_COLORS = [
  { c: '#FF375F', tc: '#FF7087' },
  { c: '#FF6B9D', tc: '#FF8BB8' },
  { c: '#5AC8F5', tc: '#5AC8F5' },
];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then(setData).catch(console.error).finally(() => setLoading(false));

    setTimeout(() => {
      drawDonut3D('d-status', [
        { v: 23, c: '#32D74B' },
        { v: 43, c: '#3A3A3C' },
        { v: 1, c: '#FF9500' },
      ]);
      drawDonut3D('d-trainer', [
        { v: 8, c: '#FF375F' },
        { v: 7, c: '#FF6B9D' },
        { v: 7, c: '#5AC8F5' },
      ]);
      drawDonut3D('d-pkg', [
        { v: 46, c: '#FF375F' },
        { v: 55, c: '#FF9500' },
        { v: 7, c: '#0A84FF' },
        { v: 7, c: '#BF5AF2' },
      ]);
    }, 100);
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = data?.stats || {
    total_clients: 67, active_enrollments: 23, expired_enrollments: 43, soon_enrollments: 1, total_revenue: 916000,
  };
  const activities = data?.recent_activities || [];

  return (
    <div>
      <TickerBar />

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
            { label: 'Total Revenue', val: fmt(stats.total_revenue), color: 'var(--green-light)', sub: 'All trainers · All time' },
            { label: 'Active Clients', val: String(stats.active_enrollments), color: 'var(--blue-light)', sub: '3 trainers' },
            { label: 'Total Enrolled', val: String(stats.total_clients), color: '', sub: 'All time' },
            { label: 'Pending Dues', val: fmt(157000), color: 'var(--orange-light)', sub: '12 clients' },
            { label: 'Commission Pool', val: fmt(458000), color: 'var(--purple-light)', sub: '50% split' },
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
        <KpiCard label="Total Revenue" value={fmt(stats.total_revenue)} sub="All trainers · All time" color="#FF375F" icon={DollarSign}><Sparkline /></KpiCard>
        <KpiCard label="Active Clients" value={String(stats.active_enrollments)} sub="↑ +3 this month" color="#32D74B" icon={CheckCircle}><RingChart pct={77} color="#32D74B" /></KpiCard>
        <KpiCard label="Total Enrollments" value={String(stats.total_clients)} sub="Unique clients in system" color="#0A84FF" icon={Users}><Sparkline heights={[20, 38, 55, 72, 88, 100, 100]} /></KpiCard>
        <KpiCard label="Pending Dues" value={fmt(157000)} sub="12 clients" color="#FF9500" icon={Wallet}><RingChart pct={35} color="#FF9500" /></KpiCard>
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
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Expired</span><span className="text-[12.5px] font-bold">{stats.expired_enrollments}</span></div>
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF9500' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Expiring Soon</span><span className="text-[12.5px] font-bold" style={{ color: 'var(--orange-light)' }}>{stats.soon_enrollments}</span></div>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <CardHeader title="Trainer Share" subtitle="Active clients by trainer" />
          <div className="flex flex-col items-center gap-[14px] p-[22px]">
            <div className="relative h-[150px] w-[150px]">
              <canvas id="d-trainer" className="h-[150px] w-[150px]" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[22px] font-extrabold tracking-tight leading-none">22</div>
                <div className="mt-[2px] text-[9.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text-tertiary)]">This Month</div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-[8px]">
              {[
                { name: 'Abhishek', val: '8', color: TRAINER_COLORS[0] },
                { name: 'Riya', val: '7', color: TRAINER_COLORS[1] },
                { name: 'Rajat', val: '7', color: TRAINER_COLORS[2] },
              ].map((t, i) => (
                <div key={i} className="dl-item flex items-center gap-2 text-[11.5px]">
                  <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: t.color.c }} />
                  <span className="flex-1 text-[var(--text-secondary)] font-medium">{t.name}</span>
                  <span className="text-[12.5px] font-bold" style={{ color: t.color.tc }}>{t.val}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <CardHeader title="Package Mix" subtitle="Enrollment count by package type" />
          <div className="flex flex-col items-center gap-[14px] p-[22px]">
            <div className="relative h-[150px] w-[150px]">
              <canvas id="d-pkg" className="h-[150px] w-[150px]" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[22px] font-extrabold tracking-tight leading-none">115</div>
                <div className="mt-[2px] text-[9.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Packages</div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-[8px]">
              {[
                { name: '1 Month', val: '46', color: '#FF375F' },
                { name: '3 Months', val: '55', color: '#FF9500' },
                { name: '4 Months', val: '7', color: '#0A84FF' },
                { name: '12 Months+', val: '7', color: '#BF5AF2' },
              ].map((p, i) => (
                <div key={i} className="dl-item flex items-center gap-2 text-[11.5px]">
                  <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: p.color }} />
                  <span className="flex-1 text-[var(--text-secondary)] font-medium">{p.name}</span>
                  <span className="text-[12.5px] font-bold" style={{ color: p.color }}>{p.val}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-[14px] grid grid-cols-[1.65fr_1fr] gap-[14px]">
        <GlassCard>
          <CardHeader title="Monthly Revenue Trend" subtitle="Total studio revenue (May 2025 – Jul 2026)" action={<div className="c-action">All Trainers</div>} />
          <div className="h-[200px] px-5 py-4">
            <svg id="rev-svg" className="h-full w-full overflow-visible" viewBox="0 0 580 180" preserveAspectRatio="none" />
          </div>
          <div className="grid grid-cols-3 border-t border-[var(--border)] px-5 py-[14px]">
            <div className="text-center"><div className="text-[17px] font-extrabold tracking-tight" style={{ color: 'var(--green)' }}>₹2.10L</div><div className="mt-[2px] text-[9.5px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Peak Month</div></div>
            <div className="text-center border-x border-[var(--border)]"><div className="text-[17px] font-extrabold tracking-tight" style={{ color: 'var(--blue-light)' }}>Feb '26</div><div className="mt-[2px] text-[9.5px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Best Month</div></div>
            <div className="text-center"><div className="text-[17px] font-extrabold tracking-tight" style={{ color: 'var(--orange-light)' }}>{fmt(stats.total_revenue)}</div><div className="mt-[2px] text-[9.5px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">All-Time Total</div></div>
          </div>
        </GlassCard>
        <GlassCard>
          <CardHeader title="Recent Activity" subtitle="Latest studio updates" action={<div className="c-action">View All</div>} />
          <div className="flex flex-col px-5 py-3">
            {(activities.length > 0 ? activities : [
              { description: 'Renuka started a new 1-Month package with Abhishek', icon: '🏋️', color: 'var(--green-muted)', created_at: 'Today · 10 Apr 2026' },
              { description: 'Tarang Gupta enrolled in 3-Month package with Riya', icon: '🏋️', color: 'var(--green-muted)', created_at: 'Today · 10 Apr 2026' },
              { description: 'Jay Singh subscription expiring in 7 days', icon: '⏰', color: 'var(--orange-muted)', created_at: 'Follow up required' },
              { description: 'Vaibhav has pending balance of ₹20,000', icon: '💸', color: 'var(--red-muted)', created_at: '3 Months package · Riya' },
              { description: 'Abhishek won Silver at UP State Powerlifting Championship', icon: '🥈', color: 'var(--blue-muted)', created_at: '83kg Senior Category · 640kg total' },
            ]).map((act, i) => (
              <div key={act.created_at || i} className="flex items-start gap-3 border-b border-[rgba(255,255,255,0.04)] py-[10px] last:border-b-0">
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
                  <div className="mt-[2px] text-[10px] text-[var(--text-tertiary)]">{act.created_at}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mb-[14px]">
        <CardHeader title="April 2026 — Monthly Snapshot" subtitle="Current active period"
          action={<div className="text-[11px] text-[var(--text-tertiary)]">Total: <span className="font-bold" style={{ color: 'var(--green)' }}>₹1,76,166</span></div>}
        />
        <div className="grid grid-cols-3 gap-3 px-5 py-[18px]">
          {[
            { initials: 'AK', name: 'Abhishek Katiyar', role: 'Head Trainer · K11 Certified', cls: 'r', bg1: 'rgba(255,55,95,0.10)', bg2: 'rgba(255,55,95,0.03)', gradient: 'linear-gradient(145deg,#FF375F,#8B0022)', shadow: 'rgba(255,55,95,0.4)', clients: 8, pct: 49, revenue: 64500, commission: 32250, alltime: 388000, fillGrad: 'linear-gradient(90deg,#FF375F,#FF6B6B)' },
            { initials: 'RS', name: 'Riya Singh', role: 'Personal Trainer · Women\'s Specialist', cls: 'r', bg1: 'rgba(255,107,157,0.10)', bg2: 'rgba(255,107,157,0.03)', gradient: 'linear-gradient(145deg,#FF6B9D,#C2185B)', shadow: 'rgba(255,107,157,0.4)', clients: 7, pct: 43, revenue: 56333, commission: 28167, alltime: 292000, fillGrad: 'linear-gradient(90deg,#FF6B9D,#FF375F)' },
            { initials: 'RK', name: 'Rajat Katiyar', role: 'Personal Trainer · Strength Coach', cls: 'b', bg1: 'rgba(90,200,245,0.10)', bg2: 'rgba(90,200,245,0.03)', gradient: 'linear-gradient(145deg,#5AC8F5,#0A84FF)', shadow: 'rgba(90,200,245,0.4)', clients: 7, pct: 42, revenue: 55333, commission: 27667, alltime: 236000, fillGrad: 'linear-gradient(90deg,#5AC8F5,#0A84FF)' },
          ].map((t, i) => (
            <div key={i} className="relative overflow-hidden rounded-[16px] border border-[var(--border)] p-[18px] transition-all hover:-translate-y-[2px]"
              style={{ background: `linear-gradient(145deg, ${t.bg1}, ${t.bg2})` }}
            >
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full text-[15px] font-extrabold mb-[13px] text-white"
                style={{ background: t.gradient, boxShadow: `0 5px 18px ${t.shadow}` }}
              >{t.initials}</div>
              <div className="mb-[2px] text-[14px] font-bold tracking-tight">{t.name}</div>
              <div className="mb-[14px] text-[10px] text-[var(--text-tertiary)] font-medium">{t.role}</div>
              <div className="mb-[5px] flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">Active Clients</span><span className="font-bold">{t.clients}</span></div>
              <div className="mb-[3px] h-[4px] rounded-[2px] bg-[rgba(255,255,255,0.06)] overflow-hidden"><div className="h-full rounded-[2px]" style={{ width: `${t.pct}%`, background: t.fillGrad }} /></div>
              <div className="mt-[6px] flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">Monthly Revenue</span><span className="font-bold" style={{ color: 'var(--green)' }}>{fmt(t.revenue)}</span></div>
              <div className="flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">Commission (50%)</span><span className="font-bold" style={{ color: 'var(--orange-light)' }}>{fmt(t.commission)}</span></div>
              <div className="flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">All-Time Revenue</span><span className="font-bold" style={{ color: 'var(--blue-light)' }}>{fmt(t.alltime)}</span></div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <CardHeader title="Monthly Goals — April 2026" subtitle="Targets vs current achievement"
          action={<div className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-[11px] py-[4px] text-[10.5px] text-[var(--text-tertiary)]">Month 13 of 21</div>}
        />
        <div className="px-5 py-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Revenue Target', current: '₹1.76L', target: '₹2L', pct: 88, color: 'var(--green-light)', fill: 'linear-gradient(90deg,#32D74B,#5FE87A)' },
              { label: 'Active Clients', current: '23', target: '30', pct: 77, color: 'var(--blue-light)', fill: 'linear-gradient(90deg,#0A84FF,#5AC8F5)' },
              { label: 'Dues Collected', current: '₹1.09L', target: '₹1.57L', pct: 69, color: 'var(--orange-light)', fill: 'linear-gradient(90deg,#FF9500,#FFB340)' },
              { label: 'New Enrollments', current: '3', target: '8', pct: 37, color: 'var(--purple-light)', fill: 'linear-gradient(90deg,#BF5AF2,#D077FF)' },
            ].map((g, i) => (
              <div key={i} className="rounded-[16px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-4">
                <div className="mb-[10px] text-[10px] font-bold uppercase tracking-[0.6px] text-[var(--text-tertiary)]">{g.label}</div>
                <div className="mb-[8px] flex items-baseline justify-between">
                  <div className="text-[18px] font-extrabold tracking-tight" style={{ color: g.color }}>{g.current}</div>
                  <div className="text-[10.5px] text-[var(--text-tertiary)]">/ {g.target}</div>
                </div>
                <div className="h-[5px] rounded-[3px] bg-[rgba(255,255,255,0.06)] overflow-hidden">
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
