import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { GlassCard, CardHeader, LoadingSpinner, StatusBadge } from '../components/Charts';

export default function ActiveClients() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getActiveEnrollments().then((d: any) => setEnrollments(d || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const byTrainer: Record<string, any[]> = {};
  enrollments.forEach(e => {
    const key = e.trainers?.short_code || 'OTHER';
    if (!byTrainer[key]) byTrainer[key] = [];
    byTrainer[key].push(e);
  });

  const trainerMeta: Record<string, { name: string; initials: string; color: string; bg: string; shadow: string }> = {
    AK: { name: 'Abhishek Katiyar', initials: 'AK', color: '#FF375F', bg: 'linear-gradient(145deg,#FF375F,#8B0022)', shadow: 'rgba(255,55,95,0.4)' },
    RS: { name: 'Riya Singh', initials: 'RS', color: '#FF6B9D', bg: 'linear-gradient(145deg,#FF6B9D,#C2185B)', shadow: 'rgba(255,107,157,0.4)' },
    RK: { name: 'Rajat Katiyar', initials: 'RK', color: '#5AC8F5', bg: 'linear-gradient(145deg,#5AC8F5,#0A84FF)', shadow: 'rgba(90,200,245,0.4)' },
    SV: { name: 'Shivani Verma', initials: 'SV', color: '#FFD60A', bg: 'linear-gradient(145deg,#FFD60A,#FF8C00)', shadow: 'rgba(255,214,0,0.4)' },
  };

  return (
    <div className="grid grid-cols-3 gap-[14px]">
      {Object.entries(byTrainer).map(([code, list]) => {
        const meta = trainerMeta[code] || { name: code, initials: code[0], color: '#fff', bg: 'linear-gradient(145deg,#888,#444)', shadow: 'rgba(0,0,0,0.15)' };
        return (
          <GlassCard key={code}>
            <CardHeader title={<span style={{ color: meta.color }}>{meta.name} · Active</span>}
              subtitle={`${list.length} clients`}
              action={
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[10.5px] font-extrabold text-white"
                  style={{ background: meta.bg, boxShadow: `0 3px 10px ${meta.shadow}` }}
                >{meta.initials}</div>
              }
            />
            <div className="flex flex-col gap-[5px] px-[18px] py-[10px]">
              {list.map((e, i) => (
                <div key={e.id} className="flex items-center gap-[9px] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-[11px] py-[9px] transition-all hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)] hover:translate-x-[3px] cursor-pointer">
                  <div className="text-[9.5px] text-[var(--text-tertiary)] font-mono w-[18px]">{String(i + 1).padStart(2, '0')}</div>
                  <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold"
                    style={{ background: 'rgba(255,55,95,0.15)', border: '1px solid rgba(255,55,95,0.2)', color: 'var(--red-light)' }}
                  >{e.clients?.full_name?.[0] || '?'}</div>
                  <div className="flex-1 text-[12.5px] font-semibold">{e.clients?.full_name || 'Unknown'}</div>
                  <div className="text-[10px] text-[var(--text-tertiary)] font-mono">{e.clients?.phone || '—'}</div>
                  <StatusBadge status={e.status} />
                </div>
              ))}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
