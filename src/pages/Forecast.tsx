import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { GlassCard, CardHeader, LoadingSpinner, fmt } from '../components/Charts';
import type { ForecastData } from '../types';

export default function Forecast() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getForecast().then((d: any) => setForecast(d)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const f = forecast || {
    forecast: [
      { month: 'May 2026', revenue: 100500 },
      { month: 'Jun 2026', revenue: 53833 },
      { month: 'Jul 2026', revenue: 38500 },
      { month: 'Aug 2026', revenue: 42000 },
      { month: 'Sep 2026', revenue: 68000 },
      { month: 'Oct 2026', revenue: 97000 },
    ],
    total_6month: 197000,
    active_enrollments_count: 22,
  };

  const maxRev = Math.max(...f.forecast.map(r => r.revenue), 1);

  const fcColors = ['#FF375F', '#FF9500', '#BF5AF2', '#BF5AF2', '#0A84FF', '#32D74B'];
  const fcLabels = ['Actual', 'Actual', 'Forecast', 'Forecast', 'Projected', 'Projected'];

  return (
    <div>
      <div className="mb-[14px] rounded-[16px] flex items-center gap-[11px] p-3 text-[12.5px]"
        style={{ background: 'linear-gradient(135deg, rgba(50,215,75,0.08), rgba(50,215,75,0.03))', border: '1px solid rgba(50,215,75,0.2)', color: 'var(--success)' }}
      >
        <span className="text-[16px]">📈</span>
        <span>Projected 6-month revenue: <strong>{fmt(f.total_6month)}</strong> from current pipeline. Add 5 new clients to hit ₹3L target.</span>
      </div>

      <div className="mb-[14px] grid grid-cols-4 gap-[14px]">
        {[
          { label: '6-Month Projection', val: fmt(f.total_6month), sub: 'From current clients', color: '#32D74B', icon: '🔮' },
          { label: 'To Hit ₹3L', val: '+5', sub: 'New enrollments needed', color: '#0A84FF', icon: '🎯' },
          { label: 'Renewals Due (30d)', val: '4', sub: 'Expiring soon', color: '#FF9500', icon: '📉' },
          { label: 'Projected Commission', val: fmt(Math.round(f.total_6month * 0.5)), sub: '6 months at 50%', color: '#BF5AF2', icon: '💡' },
        ].map((k, i) => (
          <div key={i} className="relative overflow-hidden rounded-[22px] p-5 transition-all hover:-translate-y-[4px] cursor-pointer"
            style={{ background: `linear-gradient(145deg, ${k.color}18, ${k.color}06)`, border: `1px solid ${k.color}22` }}
          >
            <div className="absolute -right-[30px] -top-[30px] h-[90px] w-[90px] rounded-full opacity-[0.2] blur-[18px] pointer-events-none" style={{ background: k.color }} />
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] mb-[14px] text-[18px]" style={{ background: `${k.color}15` }}>{k.icon}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.8px] mb-[4px]" style={{ color: `${k.color}CC` }}>{k.label}</div>
            <div className="text-[30px] font-extrabold tracking-tight leading-none mb-[8px]" style={{ color: k.color }}>{k.val}</div>
            <div className="text-[11px] text-[var(--text-tertiary)]">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-[14px]">
        <GlassCard>
          <CardHeader title="6-Month Revenue Forecast" subtitle="May–Oct 2026 projection"
            action={<div className="rounded-[8px] px-[10px] py-[4px] text-[10.5px] font-bold" style={{ background: 'rgba(191,90,242,0.12)', border: '1px solid rgba(191,90,242,0.22)', color: '#D077FF' }}>AI Model</div>}
          />
          <div className="flex flex-col gap-0 px-5 py-[18px]">
            {f.forecast.map((r, i) => {
              function gradColor(c: string) {
                if (c === '#FF375F') return '#FF6B6B';
                if (c === '#FF9500') return '#FFB340';
                if (c === '#0A84FF') return '#5AC8F5';
                if (c === '#32D74B') return '#5FE87A';
                return '#D077FF';
              }
              return (
                <div key={i} className="flex items-center gap-3 mb-[11px]">
                  <div className="text-[12px] font-semibold text-[var(--text-secondary)] w-[72px]">{r.month}</div>
                  <div className="flex-1 h-[7px] rounded-[4px] bg-[rgba(255,255,255,0.06)] overflow-hidden">
                    <div className="h-full rounded-[4px] transition-all duration-1300"
                      style={{ width: `${(r.revenue / maxRev) * 100}%`, background: `linear-gradient(90deg,${fcColors[i]},${gradColor(fcColors[i])})`, opacity: i < 2 ? 1 : 0.7 }}
                  />
                  </div>
                  <div className="text-[12px] font-bold w-[72px] text-right" style={{ color: i < 2 ? '' : fcColors[i] }}>{fmt(r.revenue)}</div>
                  <div className="text-[9.5px] font-bold px-[8px] py-[2px] rounded-[6px] w-[58px] text-center"
                    style={{ background: `${fcColors[i]}15`, color: fcColors[i] }}
                  >{fcLabels[i]}</div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <CardHeader title="Growth Scenarios" subtitle="What-if analysis · next 6 months" />
          <div className="p-5">
            {[
              { name: '🔴 Conservative', val: fmt(197000), pct: 26, color: '#FF375F', sub: 'No new clients · current pipeline only', bg: 'rgba(255,55,95,0.06)', border: 'rgba(255,55,95,0.15)' },
              { name: '🟡 Moderate (+5)', val: fmt(300000), pct: 40, color: '#FF9500', sub: '5 new 3-month packages @ avg ₹25K', bg: 'rgba(255,149,0,0.06)', border: 'rgba(255,149,0,0.15)' },
              { name: '🟢 Aggressive (+12)', val: fmt(550000), pct: 73, color: '#32D74B', sub: '12 new + 60% renewal from expiring', bg: 'rgba(50,215,75,0.06)', border: 'rgba(50,215,75,0.15)' },
            ].map((sc, i) => (
              <div key={i} className="rounded-[16px] p-4 border mb-3 last:mb-0" style={{ background: sc.bg, borderColor: sc.border }}>
                <div className="flex items-center justify-between mb-[8px]">
                  <span className="text-[12.5px] font-bold" style={{ color: sc.color }}>{sc.name}</span>
                  <span className="text-[15px] font-extrabold">{sc.val}</span>
                </div>
                <div className="h-[5px] rounded-[3px] bg-[rgba(255,255,255,0.06)] overflow-hidden mb-[6px]">
                  <div className="h-full rounded-[3px]" style={{ width: `${sc.pct}%`, background: sc.color }} />
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)]">{sc.sub}</div>
              </div>
            ))}
            <div className="mt-3 p-[14px] rounded-[16px]" style={{ background: 'rgba(191,90,242,0.06)', border: '1px solid rgba(191,90,242,0.15)' }}>
              <div className="text-[11px] font-bold text-[#D077FF] mb-[6px]">🤖 AI Recommendation</div>
              <div className="text-[11px] text-[var(--text-secondary)] leading-[1.6]">Focus Sep–Oct ramp-up. Winter drives yield +40% sign-ups. Target Lucknow corporates for bulk 12-month deals to hit ₹5L by Dec 2026.</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
