import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { api } from '../lib/api';
import { KpiCard, GlassCard, CardHeader, LoadingSpinner, fmt } from '../components/Charts';

export default function Revenue() {
  const [revenue, setRevenue] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMonthlyRevenue(21),
      api.getTrainerBreakdown(),
    ]).then(([rev, tr]) => {
      setRevenue(rev || []);
      setTrainers(tr || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalRevenue = revenue.reduce((s, r) => s + r.rev, 0);
  const maxRev = Math.max(...revenue.map(r => r.rev), 1);
  const totalCommission = trainers.reduce((s, t) => s + (t.commission || 0), 0);
  const peakMonth = revenue.reduce((best, r) => r.rev > (best?.rev || 0) ? r : best, revenue[0]);

  const trainerColors = ['#FF375F', '#FF6B9D', '#5AC8F5'];
  const trainerTotals = [388000, 292000, 236000];
  const maxTotal = Math.max(...trainerTotals, 1);

  return (
    <div>
      <div className="mb-[14px] grid grid-cols-4 gap-[14px]">
        <KpiCard label="Total Revenue" value={fmt(totalRevenue)} sub="All trainers combined" color="#FF375F" icon={DollarSign} />
        <KpiCard label="Total Commissions" value={fmt(totalCommission)} sub="At 50% rate" color="#32D74B" icon={TrendingUp} />
        <KpiCard label="Months Tracked" value={`${revenue.length}`} sub="Apr 2025 – Dec 2026" color="#0A84FF" icon={Calendar} />
        <KpiCard label="Peak Month" value={peakMonth ? fmt(peakMonth.rev) : '₹0'} sub={peakMonth?.m || ''} color="#FF9500" icon={BarChart3} />
      </div>

      <div className="grid grid-cols-2 gap-[14px]">
        <GlassCard>
          <CardHeader title="Monthly Revenue · All Trainers" subtitle="Total studio earnings per month" />
          <div className="flex flex-col gap-[9px] px-5 py-3">
            {revenue.map((r, i) => (
              <div key={i} className="flex items-center gap-3 pb-[9px] border-b border-[rgba(255,255,255,0.03)] last:border-b-0 last:pb-0">
                <div className="text-[11.5px] text-[var(--text-secondary)] font-medium w-[86px] shrink-0">{r.month || r.m}</div>
                <div className="flex-1 h-[5px] rounded-[3px] bg-[rgba(255,255,255,0.06)] overflow-hidden">
                  <div className="h-full rounded-[3px]" style={{ width: `${(r.rev / maxRev) * 100}%`, background: 'linear-gradient(90deg,var(--aurora-red),var(--aurora-coral))' }} />
                </div>
                <div className="text-[12px] font-bold w-[76px] text-right">{fmt(r.rev)}</div>
                <div className="text-[10.5px] text-[var(--text-tertiary)] w-[72px] text-right">{fmt(Math.round(r.rev * 0.5))}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <CardHeader title="Trainer Revenue Breakdown" subtitle="Individual all-time earnings" />
          <div className="p-5">
            <div className="flex flex-col gap-4">
              {trainers.map((t, i) => (
                <div key={t.id}>
                  <div className="mb-[7px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-[8px] w-[8px] rounded-full" style={{ background: trainerColors[i], boxShadow: `0 0 6px ${trainerColors[i]}` }} />
                      <span className="text-[12.5px] font-bold" style={{ color: trainerColors[i] }}>{t.full_name}</span>
                    </div>
                    <span className="text-[13px] font-extrabold">{fmt(t.total_revenue)}</span>
                  </div>
                  <div className="h-[7px] rounded-[4px] bg-[rgba(255,255,255,0.06)] overflow-hidden">
                    <div className="h-full rounded-[4px]" style={{ width: `${(t.total_revenue / maxTotal) * 100}%`, background: `linear-gradient(90deg,${trainerColors[i]},${trainerColors[i] === '#FF375F' ? '#FF6B6B' : trainerColors[i] === '#FF6B9D' ? '#FF375F' : '#0A84FF'})` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-[18px] border-t border-[var(--border)]">
              <div className="text-[9.5px] font-bold uppercase tracking-[0.6px] text-[var(--text-tertiary)] mb-2">Studio Total</div>
              <div className="text-[36px] font-extrabold tracking-tight">{fmt(totalRevenue)}</div>
              <div className="text-[12px] text-[var(--text-tertiary)] mt-[6px]">
                Commission: <span className="font-bold text-[var(--warning)]">{fmt(totalCommission)}</span> &nbsp;·&nbsp; Avg Monthly: <span className="font-bold text-[var(--aurora-teal)]">{fmt(Math.round(totalRevenue / (revenue.length || 1)))}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
