import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, CheckCircle, Users, Wallet } from 'lucide-react';
import { api } from '../lib/api';
import type { DashboardData } from '../types';
import TickerBar from '../components/TickerBar';
import { KpiCard, Sparkline, RingChart, DonutChart, GlassCard, CardHeader, LoadingSpinner, fmt, drawDonut3D, drawRevenueChart } from '../components/Charts';

export default function Overview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const chartInited = useRef(false);
  const [countdown, setCountdown] = useState(70);

  useEffect(() => {
    const target = new Date('2026-06-19T00:00:00+05:30');
    const tick = () => setCountdown(Math.ceil((target.getTime() - Date.now()) / 86400000));
    tick(); const id = setInterval(tick, 60000);

    api.getDashboard().then(d => {
      setData(d);
      setTimeout(() => {
        drawDonut3D('d-status', [{ v: d.stats.active_enrollments, c: '#32D74B' }, { v: d.stats.expired_enrollments, c: '#3A3A3C' }, { v: d.stats.soon_enrollments, c: '#FF9500' }]);
        drawDonut3D('d-trainer', [{ v: 8, c: '#FF375F' }, { v: 7, c: '#FF6B9D' }, { v: 7, c: '#5AC8F5' }]);
        drawDonut3D('d-pkg', [{ v: 46, c: '#FF375F' }, { v: 55, c: '#FF9500' }, { v: 7, c: '#0A84FF' }, { v: 7, c: '#BF5AF2' }]);
        drawRevenueChart('rev-svg', d.monthly_revenue.length > 0 ? d.monthly_revenue : revenueMonths);
        chartInited.current = true;
      }, 100);
    }).catch(console.error).finally(() => setLoading(false));
    return () => clearInterval(id);
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = data?.stats || { total_clients: 67, active_enrollments: 23, expired_enrollments: 43, soon_enrollments: 1, total_revenue: 916000 };
  const activities = data?.recent_activities || [];

  return (
    <div>
      <TickerBar />

      <div className="mb-[14px] flex items-center gap-[14px] overflow-hidden rounded-[16px] p-3 text-[12.5px] relative"
        style={{ background: 'linear-gradient(135deg,rgba(255,55,95,0.18),rgba(255,149,0,0.14),rgba(191,90,242,0.12))', border: '1px solid rgba(255,55,95,0.32)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,214,0,0.05),transparent)' }} />
        <span className="text-[22px] shrink-0">🎉</span>
        <div className="flex-1">
          <div className="text-[13px] font-extrabold tracking-tight" style={{ color: '#FF7087' }}>Grand Reopening — 19 June 2026</div>
          <div className="mt-[2px] text-[11px] text-[var(--text-secondary)]">619 Fitness Studio is moving to a new, larger location in Lucknow. Mark the date!</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[18px] font-extrabold tracking-tight" style={{ color: '#FFD60A' }}>{countdown > 0 ? countdown : countdown === 0 ? 'TODAY! 🎊' : 'Open!'}</div>
          <div className="mt-[1px] text-[9.5px] font-bold uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Days to Go</div>
        </div>
        <button onClick={() => {}} className="shrink-0 rounded-[9px] border-none px-[14px] py-[7px] text-[11px] font-bold text-white cursor-pointer font-[inherit]"
          style={{ background: 'linear-gradient(135deg,#FF375F,#CC1E3A)' }}
        >Marketing Plan →</button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-[14px] flex items-center gap-3 rounded-[16px] border border-[rgba(255,149,0,0.22)] p-3 text-[12.5px]"
        style={{ background: 'linear-gradient(135deg, rgba(255,149,0,0.1), rgba(255,149,0,0.04))', color: 'var(--warning)' }}
      >
        <AlertTriangle size={18} />
        <span><strong>4 expired clients</strong> have outstanding balances totalling <strong>₹48,000</strong> — follow up needed.</span>
        <span className="ml-auto cursor-pointer text-[11px] opacity-75 hover:opacity-100">View →</span>
      </motion.div>

      <div className="spotlight mb-[14px] relative overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.1)] p-5"
        style={{ background: 'linear-gradient(135deg, rgba(255,55,95,0.12), rgba(10,132,255,0.08), rgba(191,90,242,0.06), rgba(50,215,75,0.06))' }}
      >
        <div className="absolute -right-[60px] -top-[60px] h-[200px] w-[200px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,55,95,0.15), transparent 70%)' }}
        />
        <div className="absolute bottom-[-40px] left-[30%] h-[140px] w-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(10,132,255,0.1), transparent 70%)' }}
        />
        <div className="relative z-[1] mb-4 flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[1.2px] text-[var(--text-tertiary)]">
          <span className="h-[6px] w-[6px] rounded-full bg-[var(--aurora-red)]" style={{ boxShadow: '0 0 6px rgba(255,55,95,0.6)', animation: 'blink 2s ease-in-out infinite' }} />
          Studio · All-Time Performance
        </div>
        <div className="relative z-[1] grid grid-cols-5">
          {[
            { label: 'Total Revenue', val: fmt(stats.total_revenue), color: '#5FE87A', sub: 'Apr 2025 – Now' },
            { label: 'Active Clients', val: String(stats.active_enrollments), color: '#5AC8F5', sub: '3 trainers' },
            { label: 'Total Enrolled', val: String(stats.total_clients), color: '', sub: 'All time' },
            { label: 'Pending Dues', val: fmt(157000), color: '#FFB340', sub: '12 clients' },
            { label: 'Commission Pool', val: fmt(458000), color: '#D077FF', sub: '50% split' },
          ].map((item, i) => (
            <div key={i} className="border-r border-[var(--border)] px-[18px] first:pl-0 last:border-r-0">
              <div className="mb-[5px] text-[10px] font-bold uppercase tracking-[0.6px] text-[var(--text-tertiary)]">{item.label}</div>
              <div className="text-[24px] font-extrabold tracking-tight leading-none" style={{ color: item.color || 'var(--text-primary)' }}>
                {item.val}
              </div>
              <div className="mt-[4px] text-[10.5px] text-[var(--text-tertiary)]">{item.sub}</div>
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
                <div className="text-[22px] font-extrabold tracking-tight leading-none" style={{ color: '#5FE87A' }}>{stats.active_enrollments}</div>
                <div className="mt-[2px] text-[9.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Active</div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-[8px]">
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#32D74B' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Active</span><span className="text-[12.5px] font-bold" style={{ color: '#5FE87A' }}>{stats.active_enrollments}</span></div>
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Expired</span><span className="text-[12.5px] font-bold">{stats.expired_enrollments}</span></div>
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF9500' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Expiring Soon</span><span className="text-[12.5px] font-bold" style={{ color: '#FFB340' }}>{stats.soon_enrollments}</span></div>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <CardHeader title="Trainer Share" subtitle="Active clients by trainer (Apr 2026)" />
          <div className="flex flex-col items-center gap-[14px] p-[22px]">
            <div className="relative h-[150px] w-[150px]">
              <canvas id="d-trainer" className="h-[150px] w-[150px]" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[22px] font-extrabold tracking-tight leading-none">22</div>
                <div className="mt-[2px] text-[9.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text-tertiary)]">This Month</div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-[8px]">
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF375F' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Abhishek</span><span className="text-[12.5px] font-bold" style={{ color: '#FF7087' }}>8</span></div>
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF6B9D' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Riya</span><span className="text-[12.5px] font-bold" style={{ color: '#FF8BB8' }}>7</span></div>
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#5AC8F5' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Rajat</span><span className="text-[12.5px] font-bold" style={{ color: '#5AC8F5' }}>7</span></div>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <CardHeader title="Package Mix" subtitle="115 total packages enrolled" />
          <div className="flex flex-col items-center gap-[14px] p-[22px]">
            <div className="relative h-[150px] w-[150px]">
              <canvas id="d-pkg" className="h-[150px] w-[150px]" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[22px] font-extrabold tracking-tight leading-none">115</div>
                <div className="mt-[2px] text-[9.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Packages</div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-[8px]">
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF375F' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">1 Month</span><span className="text-[12.5px] font-bold" style={{ color: '#FF7087' }}>46</span></div>
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF9500' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">3 Months</span><span className="text-[12.5px] font-bold" style={{ color: '#FFB340' }}>55</span></div>
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#0A84FF' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">4 Months</span><span className="text-[12.5px] font-bold" style={{ color: '#5AC8F5' }}>7</span></div>
              <div className="dl-item flex items-center gap-2 text-[11.5px]"><div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#BF5AF2' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">12+ Months</span><span className="text-[12.5px] font-bold" style={{ color: '#D077FF' }}>7</span></div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-[14px] grid grid-cols-[1.65fr_1fr] gap-[14px]">
        <GlassCard>
          <CardHeader title="Monthly Revenue Trend" subtitle="May 2025 – Jul 2026 · All trainers" action={<div className="c-action">All Trainers</div>} />
          <div className="h-[200px] px-5 py-4">
            <svg id="rev-svg" className="h-full w-full overflow-visible" viewBox="0 0 580 180" preserveAspectRatio="none" />
          </div>
          <div className="grid grid-cols-3 border-t border-[var(--border)] px-5 py-[14px]">
            <div className="text-center"><div className="text-[17px] font-extrabold text-[var(--success)]">₹2.10L</div><div className="mt-[2px] text-[9.5px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Peak Month</div></div>
            <div className="text-center border-x border-[var(--border)]"><div className="text-[17px] font-extrabold text-[var(--aurora-teal)]">Mar '26</div><div className="mt-[2px] text-[9.5px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Best Month</div></div>
            <div className="text-center"><div className="text-[17px] font-extrabold text-[var(--warning)]">{fmt(stats.total_revenue)}</div><div className="mt-[2px] text-[9.5px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">All-Time Total</div></div>
          </div>
        </GlassCard>
        <GlassCard>
          <CardHeader title="Recent Activity" subtitle="Latest studio updates" action={<div className="c-action">View All</div>} />
          <div className="flex flex-col px-5 py-3">
            {(activities.length > 0 ? activities : defaultActivities).map((act, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-[rgba(255,255,255,0.04)] py-[10px] last:border-b-0">
                <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[10px] text-[14px]"
                  style={{ background: act.color || 'rgba(10,132,255,0.12)' }}
                >
                  {act.icon || '📌'}
                </div>
                <div className="flex-1">
                  <div className="text-[12.5px] font-medium leading-[1.5] text-[var(--text-secondary)]"
                    dangerouslySetInnerHTML={{
                      __html: (act.description || '').replace(/(₹[\d,]+)/g, '<strong style="color:var(--warning)">$1</strong>')
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
        <CardHeader title="April 2026 · Monthly Trainer Snapshot" subtitle="Current active payout month"
          action={<div className="text-[11px] text-[var(--text-tertiary)]">Total: <span className="font-bold text-[var(--success)]">₹1,76,166</span></div>}
        />
        <div className="grid grid-cols-3 gap-3 px-5 py-[18px]">
          {trainers.map((t, i) => (
            <div key={i} className={`relative overflow-hidden rounded-[16px] border border-[var(--border)] tc-${t.cls} p-[18px] transition-all hover:-translate-y-[2px]`}
              style={{ background: `linear-gradient(145deg, ${t.bg1}, ${t.bg2})` }}
            >
              <div className={`tc-ava flex h-[46px] w-[46px] items-center justify-center rounded-full text-[15px] font-extrabold mb-[13px]`}
                style={{ background: t.gradient, boxShadow: `0 5px 18px ${t.shadow}` }}
              >{t.initials}</div>
              <div className="mb-[2px] text-[14px] font-bold tracking-tight">{t.name}</div>
              <div className="mb-[14px] text-[10px] text-[var(--text-tertiary)]">{t.role}</div>
              <div className="mb-[5px] flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">Active Clients</span><span className="font-bold">{t.clients}</span></div>
              <div className="mb-[3px] h-[4px] rounded-[2px] bg-[rgba(255,255,255,0.07)] overflow-hidden"><div className="h-full rounded-[2px]" style={{ width: `${t.pct}%`, background: t.fillGrad }} /></div>
              <div className="mt-[6px] flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">Monthly Revenue</span><span className="font-bold text-[var(--success)]">{fmt(t.revenue)}</span></div>
              <div className="flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">Commission (50%)</span><span className="font-bold text-[var(--warning)]">{fmt(t.commission)}</span></div>
              <div className="flex items-center justify-between text-[12px]"><span className="text-[var(--text-secondary)]">All-Time Revenue</span><span className="font-bold text-[var(--aurora-teal)]">{fmt(t.alltime)}</span></div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <CardHeader title="🎯 Monthly Goals — April 2026" subtitle="Month 13 of 21"
          action={<div className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-[11px] py-[4px] text-[10.5px] text-[var(--text-tertiary)]">Month 13/21</div>}
        />
        <div className="px-5 py-4">
          <div className="grid grid-cols-4 gap-3">
            {goals.map((g, i) => (
              <div key={i} className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="mb-[10px] text-[10px] font-bold uppercase tracking-[0.6px] text-[var(--text-tertiary)]">{g.label}</div>
                <div className="mb-[8px] flex items-baseline justify-between">
                  <div className="text-[18px] font-extrabold tracking-tight" style={{ color: g.color }}>{g.current}</div>
                  <div className="text-[10.5px] text-[var(--text-tertiary)]">/ {g.target}</div>
                </div>
                <div className="h-[5px] rounded-[3px] bg-[rgba(255,255,255,0.07)] overflow-hidden">
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

const revenueMonths = [
  { m: 'May 2025', rev: 7000 }, { m: 'Jun 2025', rev: 77333 }, { m: 'Jul 2025', rev: 78667 },
  { m: 'Aug 2025', rev: 79667 }, { m: 'Sep 2025', rev: 152000 }, { m: 'Oct 2025', rev: 176667 },
  { m: 'Nov 2025', rev: 204333 }, { m: 'Dec 2025', rev: 201333 }, { m: 'Jan 2026', rev: 202500 },
  { m: 'Feb 2026', rev: 209167 }, { m: 'Mar 2026', rev: 210500 }, { m: 'Apr 2026', rev: 176167 },
  { m: 'May 2026', rev: 100500 }, { m: 'Jun 2026', rev: 53833 }, { m: 'Jul 2026', rev: 10833 },
];

const defaultActivities = [
  { action: 'enrolled', description: 'Renuka started a new 1-Month package with Abhishek', icon: '🏋️', color: 'rgba(50,215,75,0.12)', created_at: 'Today · 10 Apr 2026' },
  { action: 'enrolled', description: 'Tarang Gupta enrolled in 3-Month package with Riya', icon: '🏋️', color: 'rgba(50,215,75,0.12)', created_at: 'Today · 10 Apr 2026' },
  { action: 'expiring', description: 'Jay Singh expiring in 7 days — follow up!', icon: '⏰', color: 'rgba(255,149,0,0.12)', created_at: 'Urgent' },
  { action: 'payment', description: 'Vaibhav pending ₹20,000 balance', icon: '💸', color: 'rgba(255,55,95,0.12)', created_at: '3 Months · Riya' },
  { action: 'achievement', description: 'Abhishek — Silver at UP State Powerlifting · 640kg total', icon: '🥈', color: 'rgba(255,214,0,0.1)', created_at: '83kg Senior · National prep' },
];

const trainers = [
  { initials: 'AK', name: 'Abhishek Katiyar', role: 'Head Trainer · K11 Certified · Owner', cls: 'r', bg1: 'rgba(255,55,95,0.12)', bg2: 'rgba(255,55,95,0.04)', gradient: 'linear-gradient(145deg,#FF375F,#8B0022)', shadow: 'rgba(255,55,95,0.4)', clients: 8, pct: 49, revenue: 64500, commission: 32250, alltime: 388000, fillGrad: 'linear-gradient(90deg,#FF375F,#FF6B6B)' },
  { initials: 'RS', name: 'Riya Singh', role: 'Personal Trainer · Women\'s Specialist', cls: 'p', bg1: 'rgba(255,107,157,0.12)', bg2: 'rgba(255,107,157,0.04)', gradient: 'linear-gradient(145deg,#FF6B9D,#C2185B)', shadow: 'rgba(255,107,157,0.4)', clients: 7, pct: 43, revenue: 56333, commission: 28167, alltime: 292000, fillGrad: 'linear-gradient(90deg,#FF6B9D,#FF375F)' },
  { initials: 'RK', name: 'Rajat Katiyar', role: 'Personal Trainer · Strength Coach', cls: 'b', bg1: 'rgba(90,200,245,0.12)', bg2: 'rgba(10,132,255,0.04)', gradient: 'linear-gradient(145deg,#5AC8F5,#0A84FF)', shadow: 'rgba(90,200,245,0.4)', clients: 7, pct: 42, revenue: 55333, commission: 27667, alltime: 236000, fillGrad: 'linear-gradient(90deg,#5AC8F5,#0A84FF)' },
];

const goals = [
  { label: 'Revenue Target', current: '₹1.76L', target: '₹2L', pct: 88, color: '#5FE87A', fill: 'linear-gradient(90deg,#32D74B,#5FE87A)' },
  { label: 'Active Clients', current: '23', target: '30', pct: 77, color: '#5AC8F5', fill: 'linear-gradient(90deg,#0A84FF,#5AC8F5)' },
  { label: 'Dues Collected', current: '₹1.09L', target: '₹1.57L', pct: 69, color: '#FFB340', fill: 'linear-gradient(90deg,#FF9500,#FFB340)' },
  { label: 'New Enrollments', current: '3', target: '8', pct: 37, color: '#D077FF', fill: 'linear-gradient(90deg,#BF5AF2,#D077FF)' },
];
