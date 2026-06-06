import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { TrainerBreakdown } from '../types';
import { GlassCard, CardHeader, LoadingSpinner, fmt } from '../components/Charts';

const TRAINER_META: Record<string, { gradient: string; shadow: string; fill: string; box: string; role: string }> = {
  AK: { gradient: 'linear-gradient(145deg,#FF375F,#8B0022)', shadow: 'rgba(255,55,95,0.4)', fill: 'linear-gradient(90deg,#FF375F,#FF6B6B)', box: '#FF375F', role: 'Head Trainer · Owner' },
  RS: { gradient: 'linear-gradient(145deg,#FF6B9D,#C2185B)', shadow: 'rgba(255,107,157,0.4)', fill: 'linear-gradient(90deg,#FF6B9D,#FF375F)', box: '#FF6B9D', role: 'Personal Trainer' },
  RK: { gradient: 'linear-gradient(145deg,#5AC8F5,#0A84FF)', shadow: 'rgba(90,200,245,0.4)', fill: 'linear-gradient(90deg,#5AC8F5,#0A84FF)', box: '#5AC8F5', role: 'Personal Trainer' },
  SV: { gradient: 'linear-gradient(145deg,#FFD60A,#FF8C00)', shadow: 'rgba(255,214,0,0.4)', fill: 'linear-gradient(90deg,#FFD60A,#FF9500)', box: '#FFD60A', role: 'Personal Trainer' },
};

export default function Trainers() {
  const [breakdown, setBreakdown] = useState<TrainerBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getTrainerBreakdown(),
    ]).then(([tb]) => {
      setBreakdown(tb);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const maxClients = Math.max(...breakdown.map(t => t.total_clients), 1);
  const sorted = [...breakdown].sort((a, b) => b.total_revenue - a.total_revenue);

  return (
    <div className="grid grid-cols-2 gap-[14px]">
      <GlassCard>
        <CardHeader title="All-Time Client Portfolio" subtitle="Total unique clients per trainer" />
        <div className="flex flex-col gap-[18px] p-5">
          {breakdown.map((t, i) => {
            const meta = TRAINER_META[t.short_code] || TRAINER_META['AK'];
            const pct = Math.min(100, (t.total_clients / maxClients) * 100);
            return (
              <div key={t.id}>
                <div className="mb-[9px] flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[11px] font-extrabold"
                      style={{ background: meta.gradient, boxShadow: `0 3px 10px ${meta.shadow}` }}
                    >{t.initials}</div>
                    <div>
                      <div className="text-[13.5px] font-bold">{t.full_name}</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">{meta.role}</div>
                    </div>
                  </div>
                  <span className="text-[14px] font-extrabold">{t.total_clients} clients</span>
                </div>
                <div className="h-[7px] rounded-[4px] bg-[rgba(255,255,255,0.06)] overflow-hidden">
                  <div className="h-full rounded-[4px]" style={{ width: `${pct}%`, background: meta.fill }} />
                </div>
                <div className="flex gap-[18px] mt-[8px]">
                  <span className="text-[11px] text-[var(--text-tertiary)]">Revenue: <span className="font-bold text-[var(--success)]">{fmt(t.total_revenue)}</span></span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">Commission: <span className="font-bold text-[var(--warning)]">{fmt(t.commission)}</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard>
        <CardHeader title="Leaderboard" subtitle="Ranked by all-time revenue" />
        <div className="p-5">
          {sorted.map((t, i) => {
            const medals = ['🥇', '🥈', '🥉', '🏅'];
            const meta = TRAINER_META[t.short_code] || TRAINER_META['AK'];
            const isGold = i === 0;
            return (
              <div key={t.id} className={`flex items-center gap-[13px] p-[13px] rounded-[16px] border border-[var(--border)] mb-[8px] last:mb-0 transition-transform hover:translate-x-[4px]`}
                style={{ background: isGold ? 'linear-gradient(135deg, rgba(255,214,0,0.1), rgba(255,214,0,0.03))' : 'rgba(255,255,255,0.03)', borderColor: isGold ? 'rgba(255,214,0,0.22)' : '' }}
              >
                <div className="text-[22px] w-[34px] text-center">{medals[i] || '🏅'}</div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-extrabold">{t.full_name}</div>
                  <div className="text-[10px] text-[var(--text-tertiary)]">{t.total_clients} active clients</div>
                </div>
                <div className="text-right">
                  <div className="text-[16px] font-extrabold text-[var(--success)]">{fmt(t.total_revenue)}</div>
                  <div className="text-[10px] text-[var(--text-tertiary)]">all-time</div>
                </div>
              </div>
            );
          })}

          <div className="border-t border-[var(--border)] pt-4 mt-4">
            <div className="text-[13.5px] font-bold mb-[2px]">🏋️ Powerlifting Profile</div>
            <div className="text-[10px] text-[var(--text-tertiary)] mb-[14px]">Abhishek Katiyar — National Level</div>
            <div className="grid grid-cols-3 gap-[8px] mb-3">
              {[
                { val: '230', label: 'Squat kg', color: '#FF375F' },
                { val: '150', label: 'Bench kg', color: '#0A84FF' },
                { val: '260', label: 'Deadlift kg', color: '#32D74B' },
              ].map((l, i) => (
                <div key={i} className="rounded-[12px] p-3 text-center" style={{ background: `${l.color}10`, border: `1px solid ${l.color}22` }}>
                  <div className="text-[22px] font-extrabold tracking-tight" style={{ color: l.color }}>{l.val}</div>
                  <div className="text-[9.5px] text-[var(--text-tertiary)] uppercase tracking-[0.5px]">{l.label}</div>
                </div>
              ))}
            </div>
            <div className="rounded-[14px] p-[14px_16px] flex justify-between items-center"
              style={{ background: 'linear-gradient(135deg, rgba(255,214,0,0.1), rgba(255,180,0,0.04))', border: '1px solid rgba(255,214,0,0.22)' }}
            >
              <div>
                <div className="text-[9.5px] uppercase tracking-[0.5px] font-bold text-[rgba(255,214,0,0.6)] mb-[3px]">Competition Total</div>
                <div className="text-[28px] font-extrabold text-[#FFD60A] tracking-tight">640 kg</div>
                <div className="text-[10px] text-[var(--text-tertiary)]">UP State Championship · Silver</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[var(--text-tertiary)] mb-[4px]">83kg Senior Category</div>
                <div className="text-[11px] text-[var(--text-tertiary)]">Target: <span className="font-bold text-[var(--warning)]">780kg</span></div>
                <div className="text-[10px] text-[var(--text-tertiary)]">Jan 2027 Nationals</div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
