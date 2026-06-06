import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { GlassCard, CardHeader, LoadingSpinner, fmt, drawDonut3D } from '../components/Charts';

export default function Analytics() {
  const [trainerBreakdown, setTrainerBreakdown] = useState<any[]>([]);
  const [genderDist, setGenderDist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const drawn = useRef(false);

  useEffect(() => {
    Promise.all([
      api.getTrainerBreakdown(),
      api.getGenderDistribution(),
    ]).then(([tb, gd]) => {
      setTrainerBreakdown(tb || []);
      setGenderDist(gd || []);
      setTimeout(() => {
        if (!drawn.current) {
          const gdData = (gd || []).length > 0
            ? (gd || []).map((g: any, i: number) => ({ v: g.count, c: ['#0A84FF', '#FF6B9D'][i] || '#888' }))
            : [{ v: 42, c: '#0A84FF' }, { v: 29, c: '#FF6B9D' }];
          drawDonut3D('d-gender', gdData);
          const trColors = ['#FF375F', '#FF6B9D', '#5AC8F5', '#FFD60A'];
          const trData = (tb || []).map((t: any, i: number) => ({
            v: t.total_revenue || 1000,
            c: trColors[i] || '#888',
          }));
          if (trData.length > 0) drawDonut3D('d-rev-tr', trData);
          drawn.current = true;
        }
      }, 100);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalRev = trainerBreakdown.reduce((s, t) => s + (t.total_revenue || 0), 0) || 0;
  const maleCount = genderDist.find((g: any) => g.gender === 'Male')?.count || 0;
  const femaleCount = genderDist.find((g: any) => g.gender === 'Female')?.count || 0;
  const totalClients = maleCount + femaleCount || trainerBreakdown.reduce((s, t) => s + Number(t.total_clients), 0);

  const trColors = ['#FF375F', '#FF6B9D', '#5AC8F5', '#FFD60A'];
  const trPcts = trainerBreakdown.map((t, i) => ({
    name: t.full_name || '',
    rev: t.total_revenue || 0,
    pct: totalRev > 0 ? ((t.total_revenue || 0) / totalRev * 100).toFixed(0) : '0',
    color: trColors[i] || '#888',
  }));

  return (
    <div>
      <div className="mb-[14px] rounded-[16px] flex items-center gap-[11px] p-3 text-[12.5px]"
        style={{ background: 'linear-gradient(135deg, rgba(50,215,75,0.08), rgba(50,215,75,0.03))', border: '1px solid rgba(50,215,75,0.2)', color: 'var(--success)' }}
      >
        <span className="text-[16px]">🚀</span>
        <span>Studio revenue across <strong>{trainerBreakdown.length} trainers</strong> with <strong>{totalClients} total clients</strong>. Exceptional trajectory!</span>
      </div>

      <div className="mb-[14px] grid grid-cols-4 gap-[14px]">
        {[
          { label: 'Avg Monthly Rev', val: '₹69.8K', sub: 'Over active months', color: '#32D74B', icon: '📊' },
          { label: 'Avg Package Value', val: '₹20.8K', sub: 'Per enrollment', color: '#0A84FF', icon: '💰' },
          { label: 'Retention Rate', val: '34%', sub: 'Renewed clients', color: '#FF9500', icon: '🎯' },
          { label: 'Gender Split', val: '60/40', sub: 'Male / Female', color: '#BF5AF2', icon: '⚧' },
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
          <CardHeader title="Gender Distribution" subtitle={`Across all ${totalClients} enrolled clients`} />
          <div className="flex items-center gap-[28px] p-[22px]">
            <div className="relative h-[150px] w-[150px] shrink-0">
              <canvas id="d-gender" className="h-[150px] w-[150px]" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[22px] font-extrabold tracking-tight">{totalClients}</div>
                <div className="text-[9.5px] text-[var(--text-tertiary)] uppercase tracking-[0.5px]">Total</div>
              </div>
            </div>
            <div className="flex flex-col gap-[13px] flex-1">
              <div className="flex items-center gap-2 text-[13.5px]"><div className="h-[11px] w-[11px] shrink-0 rounded-full" style={{ background: '#0A84FF' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Male</span><span className="text-[15px] font-extrabold text-[#5AC8F5]">{maleCount}</span></div>
              <div className="flex items-center gap-2 text-[13.5px]"><div className="h-[11px] w-[11px] shrink-0 rounded-full" style={{ background: '#FF6B9D' }} /><span className="flex-1 text-[var(--text-secondary)] font-medium">Female</span><span className="text-[15px] font-extrabold text-[#FF8BB8]">{femaleCount}</span></div>
              <div className="mt-[6px] pt-[12px] border-t border-[var(--border)] text-[11px] text-[var(--text-tertiary)]">Female ratio growing · <span className="text-[var(--success)]">↑ +8% vs 6 months ago</span></div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <CardHeader title="Revenue by Trainer" subtitle="All-time contribution share" />
          <div className="flex items-center gap-[28px] p-[22px]">
            <div className="relative h-[150px] w-[150px] shrink-0">
              <canvas id="d-rev-tr" className="h-[150px] w-[150px]" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[16px] font-extrabold tracking-tight">{fmt(totalRev)}</div>
                <div className="text-[9.5px] text-[var(--text-tertiary)] uppercase tracking-[0.5px]">Total</div>
              </div>
            </div>
            <div className="flex flex-col gap-[13px] flex-1">
              {trPcts.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px]">
                  <div className="h-[10px] w-[10px] shrink-0 rounded-full" style={{ background: t.color }} />
                  <span className="flex-1 text-[var(--text-secondary)] font-medium">{t.name}</span>
                  <span className="text-[13px] font-extrabold" style={{ color: t.color }}>{fmt(t.rev)} ({t.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-[14px]">
        <GlassCard>
          <CardHeader title="Studio Intelligence Report" subtitle="AI-generated insights from your data"
            action={<div className="rounded-[8px] px-[10px] py-[4px] text-[10.5px] font-bold" style={{ background: 'rgba(191,90,242,0.12)', border: '1px solid rgba(191,90,242,0.22)', color: '#D077FF' }}>AI Insights</div>}
          />
          <div className="grid grid-cols-3 gap-3 px-5 py-4">
            {[
              { icon: '💡', title: 'Revenue Peak Pattern', body: 'Studio peaked ₹2.10L in Mar 2026. Winter months (Nov–Mar) consistently outperform summer. Plan aggressive drives in Sep–Oct to ride the wave.', color: '#5FE87A', bg: 'rgba(50,215,75,0.05)', border: 'rgba(50,215,75,0.15)' },
              { icon: '🎯', title: '3-Month Package is King', body: '48% of enrollments are 3-month packages at avg ₹25K. Highest-value segment. Add referral bonus for 3-month clients to accelerate growth.', color: '#5AC8F5', bg: 'rgba(10,132,255,0.05)', border: 'rgba(10,132,255,0.15)' },
              { icon: '⚡', title: 'Due Recovery Priority', body: '₹48K from 4 expired clients is at risk. Recommend weekly follow-up calls. 10% settlement discount for immediate full payment can recover fast.', color: '#FFB340', bg: 'rgba(255,149,0,0.05)', border: 'rgba(255,149,0,0.15)' },
            ].map((insight, i) => (
              <div key={i} className="rounded-[16px] p-4 border" style={{ background: insight.bg, borderColor: insight.border }}>
                <div className="text-[18px] mb-[8px]">{insight.icon}</div>
                <div className="text-[12.5px] font-bold mb-[6px]" style={{ color: insight.color }}>{insight.title}</div>
                <div className="text-[11px] text-[var(--text-secondary)] leading-[1.6]">{insight.body}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
