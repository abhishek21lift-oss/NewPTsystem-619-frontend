import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { GlassCard, CardHeader, LoadingSpinner, fmt } from '../components/Charts';

export default function Trainers() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrainers().then((d: any) => setTrainers(d || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const meta = [
    { initials: 'AK', name: 'Abhishek Katiyar', role: 'Head Trainer · Owner', color: '#FF375F', gradient: 'linear-gradient(145deg,#FF375F,#8B0022)', shadow: 'rgba(255,55,95,0.4)', fill: 'linear-gradient(90deg,#FF375F,#FF6B6B)', box: '#FF375F' },
    { initials: 'RS', name: 'Riya Singh', role: 'Personal Trainer', color: '#FF6B9D', gradient: 'linear-gradient(145deg,#FF6B9D,#C2185B)', shadow: 'rgba(255,107,157,0.4)', fill: 'linear-gradient(90deg,#FF6B9D,#FF375F)', box: '#FF6B9D' },
    { initials: 'RK', name: 'Rajat Katiyar', role: 'Personal Trainer', color: '#5AC8F5', gradient: 'linear-gradient(145deg,#5AC8F5,#0A84FF)', shadow: 'rgba(90,200,245,0.4)', fill: 'linear-gradient(90deg,#5AC8F5,#0A84FF)', box: '#5AC8F5' },
  ];

  const trainerData = meta.map((m, i) => {
    const t = trainers[i];
    const clients = t?.enrollment_count || (i === 0 ? 36 : i === 1 ? 19 : 12);
    const revenue = i === 0 ? 388000 : i === 1 ? 292000 : 236000;
    const commission = Math.round(revenue * 0.5);
    const maxClients = 50;
    return { ...m, clients, revenue, commission, pct: Math.min(100, (clients / maxClients) * 100) };
  });

  return (
    <div className="grid grid-cols-2 gap-[14px]">
      <GlassCard>
        <CardHeader title="All-Time Client Portfolio" subtitle="Total unique clients per trainer" />
        <div className="flex flex-col gap-[18px] p-5">
          {trainerData.map((t, i) => (
            <div key={i}>
              <div className="mb-[9px] flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[11px] font-extrabold"
                    style={{ background: t.gradient, boxShadow: `0 3px 10px ${t.shadow}` }}
                  >{t.initials}</div>
                  <div>
                    <div className="text-[13.5px] font-bold">{t.name}</div>
                    <div className="text-[10px] text-[var(--text-tertiary)]">{t.role}</div>
                  </div>
                </div>
                <span className="text-[14px] font-extrabold">{t.clients} clients</span>
              </div>
              <div className="h-[7px] rounded-[4px] bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <div className="h-full rounded-[4px]" style={{ width: `${t.pct}%`, background: t.fill }} />
              </div>
              <div className="flex gap-[18px] mt-[8px]">
                <span className="text-[11px] text-[var(--text-tertiary)]">Revenue: <span className="font-bold text-[var(--success)]">{fmt(t.revenue)}</span></span>
                <span className="text-[11px] text-[var(--text-tertiary)]">Commission: <span className="font-bold text-[var(--warning)]">{fmt(t.commission)}</span></span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <CardHeader title="April 2026 Leaderboard" subtitle="Current month ranking" />
        <div className="p-5">
          {[
            { rank: '🥇', name: 'Abhishek Katiyar', meta: '8 active clients · K11 Certified', rev: 64500, cls: 'lb-gold' },
            { rank: '🥈', name: 'Riya Singh', meta: '7 active clients', rev: 56333, cls: 'lb-silver' },
            { rank: '🥉', name: 'Rajat Katiyar', meta: '7 active clients', rev: 55333, cls: 'lb-bronze' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-[13px] p-[13px] rounded-[16px] border border-[var(--border)] mb-[8px] last:mb-0 transition-transform hover:translate-x-[4px]`}
              style={{ background: i === 0 ? 'linear-gradient(135deg, rgba(255,214,0,0.1), rgba(255,214,0,0.03))' : i === 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.02)', borderColor: i === 0 ? 'rgba(255,214,0,0.22)' : '' }}
            >
              <div className="text-[22px] w-[34px] text-center">{item.rank}</div>
              <div className="flex-1">
                <div className="text-[13.5px] font-extrabold">{item.name}</div>
                <div className="text-[10px] text-[var(--text-tertiary)]">{item.meta}</div>
              </div>
              <div className="text-right">
                <div className="text-[16px] font-extrabold text-[var(--success)]">{fmt(item.rev)}</div>
                <div className="text-[10px] text-[var(--text-tertiary)]">this month</div>
              </div>
            </div>
          ))}

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
                <div className="text-[10px] text-[var(--text-tertiary)]">UP State Championship · 🥈 Silver</div>
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
