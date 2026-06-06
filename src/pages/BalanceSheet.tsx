import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, ClipboardList, XCircle, DollarSign } from 'lucide-react';
import { api } from '../lib/api';
import { KpiCard, GlassCard, CardHeader, LoadingSpinner, fmt, StatusBadge } from '../components/Charts';

export default function BalanceSheet() {
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOutstanding().then((d: any) => setBalances(d || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalOutstanding = balances.reduce((s, b) => s + Number(b.balance), 0);
  const activeWithBalance = balances.filter(b => b.enrollment_status === 'active').length;
  const expiredWithBalance = balances.filter(b => b.enrollment_status === 'expired').length;
  const largestDue = balances.reduce((max, b) => Number(b.balance) > Number(max?.balance || 0) ? b : max, balances[0]);

  return (
    <div>
      <div className="mb-[14px] grid grid-cols-4 gap-[14px]">
        <KpiCard label="Total Outstanding" value={fmt(totalOutstanding)} sub={`${balances.length} client records`} color="#FF9500" icon={Scale} />
        <KpiCard label="Active w/ Balance" value={String(activeWithBalance)} sub="Still in active packages" color="#0A84FF" icon={ClipboardList} />
        <KpiCard label="Expired w/ Balance" value={String(expiredWithBalance)} sub="Urgent follow-up needed" color="#FF375F" icon={XCircle} />
        <KpiCard label="Largest Due" value={largestDue ? fmt(Number(largestDue.balance)) : '₹0'} sub={largestDue?.client_name || '—'} color="#BF5AF2" icon={DollarSign} />
      </div>

      <GlassCard>
        <CardHeader title="Outstanding Balance Records" subtitle="All clients with pending payment" />
        <div className="flex flex-col gap-[7px] px-5 py-3">
          {balances.map((b, i) => (
            <div key={i} className="flex items-center gap-3 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] px-[14px] py-[12px] transition-all hover:bg-[var(--surface-hover)] hover:border-[var(--border-strong)]">
              <div className="font-mono text-[10px] text-[var(--text-tertiary)] min-w-[58px]">{b.display_id || '—'}</div>
              <div className="text-[13px] font-bold min-w-[155px]">{b.client_name}</div>
              <div className="text-[11px] text-[var(--text-tertiary)] flex-1">{b.plan_name || '—'}</div>
              <div className="flex-1 flex gap-[10px] text-[11px] text-[var(--text-tertiary)]">
                <span>Chgd: <b className="text-[var(--text-secondary)]">{fmt(Number(b.total_charged))}</b></span>
                <span>Paid: <b className="text-[var(--success)]">{fmt(Number(b.total_paid))}</b></span>
              </div>
              <div className="text-[14px] font-extrabold text-[var(--warning)] min-w-[88px] text-right">{fmt(Number(b.balance))}</div>
              <div className="text-[11px] font-bold w-[60px] text-right" style={{ color: b.enrollment_status === 'active' ? 'var(--success)' : 'var(--text-tertiary)' }}>
                {b.days_remaining > 0 ? `+${b.days_remaining}d` : `${b.days_remaining}d`}
              </div>
              <StatusBadge status={b.enrollment_status} />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
