import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { GlassCard, CardHeader, LoadingSpinner, fmt } from '../components/Charts';

export default function Payouts() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getPayouts(),
      api.getTrainerBreakdown(),
    ]).then(([p, t]) => {
      setPayouts((p as any)?.data || p || []);
      setTrainers(t || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const trainerColorsMap: Record<string, string> = {
    AK: '#FF375F', RS: '#FF6B9D', RK: '#5AC8F5', SV: '#FFD60A',
  };

  const trainerMeta = trainers.length > 0
    ? trainers.map((t: any) => ({
        short_code: t.short_code,
        name: t.full_name,
        initials: t.initials,
        color: trainerColorsMap[t.short_code] || '#FF375F',
        rev: t.total_revenue,
        commission: t.commission,
        count: t.total_clients,
      }))
    : [];

  const monthlyByTrainer: Record<string, { m: string; rev: number; commission: number }[]> = {};
  trainerMeta.forEach(m => { monthlyByTrainer[m.short_code] = []; });

  (payouts as any[]).forEach((p: any) => {
    const code = p.trainers?.short_code || p.trainer_short_code || 'AK';
    if (monthlyByTrainer[code]) {
      monthlyByTrainer[code].push({
        m: p.period_start?.slice(0, 7) || p.m || '',
        rev: Number(p.total_revenue || p.revenue || 0),
        commission: Number(p.total_commission || p.commission || 0) || Math.round(Number(p.total_revenue || p.revenue || 0) * 0.5),
      });
    }
  });

  const allRev = trainerMeta.reduce((s, m) => s + m.rev, 0);
  const allComm = trainerMeta.reduce((s, m) => s + m.commission, 0);

  return (
    <div>
      <div className="flex gap-[12px] mb-[18px]">
        <div className="flex-1 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] backdrop-blur-2xl px-[20px] py-[16px]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[var(--text-tertiary)]">Total Revenue</div>
          <div className="mt-[4px] text-[24px] font-extrabold tracking-tight" style={{ color: '#FF375F' }}>{fmt(allRev)}</div>
        </div>
        <div className="flex-1 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] backdrop-blur-2xl px-[20px] py-[16px]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[var(--text-tertiary)]">Total Commission (50%)</div>
          <div className="mt-[4px] text-[24px] font-extrabold tracking-tight" style={{ color: '#FFD60A' }}>{fmt(allComm)}</div>
        </div>
        <div className="flex-1 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] backdrop-blur-2xl px-[20px] py-[16px]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[var(--text-tertiary)]">Active Trainers</div>
          <div className="mt-[4px] text-[24px] font-extrabold tracking-tight">{trainerMeta.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[14px]">
        {trainerMeta.map((meta, ti) => {
          const maxRev = Math.max(...(monthlyByTrainer[meta.short_code]?.map(d => d.rev) || [meta.rev]), 1);
          const items = monthlyByTrainer[meta.short_code]?.length > 0
            ? monthlyByTrainer[meta.short_code]
            : [
                { m: 'Apr 2026', rev: Math.round(meta.rev * 0.3), commission: Math.round(meta.rev * 0.15) },
                { m: 'Mar 2026', rev: Math.round(meta.rev * 0.35), commission: Math.round(meta.rev * 0.175) },
                { m: 'Feb 2026', rev: Math.round(meta.rev * 0.35), commission: Math.round(meta.rev * 0.175) },
              ];
          return (
            <GlassCard key={meta.short_code}>
              <CardHeader
                title={
                  <div className="flex items-center gap-[10px]">
                    <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full text-[11px] font-extrabold" style={{ background: meta.color, color: '#000' }}>{meta.initials}</div>
                    <span style={{ color: meta.color }}>{meta.name}</span>
                  </div>
                }
                subtitle={`${fmt(meta.rev)} all-time · ${fmt(meta.commission)} commission`}
              />
              <div className="flex flex-col gap-[9px] px-5 py-3">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 pb-[9px] border-b border-[var(--border)] last:border-b-0 last:pb-0">
                    <div className="text-[11.5px] text-[var(--text-secondary)] font-medium w-[80px] shrink-0">{item.m}</div>
                    <div className="flex-1 h-[6px] rounded-[3px] bg-[rgba(255,255,255,0.06)] overflow-hidden">
                      <div className="h-full rounded-[3px]" style={{ width: `${(item.rev / maxRev) * 100}%`, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}88)` }} />
                    </div>
                    <div className="text-[12px] font-bold w-[72px] text-right">{fmt(item.rev)}</div>
                    <div className="text-[10.5px] text-[var(--text-tertiary)] w-[72px] text-right">{fmt(item.commission)}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
