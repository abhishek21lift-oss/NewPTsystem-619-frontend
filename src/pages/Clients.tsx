import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { GlassCard, CardHeader, LoadingSpinner, fmt, TrainerTag, StatusBadge } from '../components/Charts';

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.getClients(),
      api.getDashboard(),
    ]).then(([c, d]) => {
      setClients(c.data || c || []);
      setDashboard(d);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const filtered = clients.filter(c =>
    !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.display_id?.toLowerCase().includes(search.toLowerCase())
  );

  const s = dashboard?.stats || {};
  const maleCount = clients.filter((c: any) => c.gender === 'Male').length;
  const femaleCount = clients.filter((c: any) => c.gender === 'Female').length;

  return (
    <div>
      <div className="mb-[14px] flex gap-[9px] flex-wrap">
        <div className="qa-chip green">🟢 Active ({s.active_enrollments || 0})</div>
        <div className="qa-chip orange">⏰ Expiring ({s.soon_enrollments || 0})</div>
        <div className="qa-chip">👤 All ({clients.length})</div>
        <div className="qa-chip blue">👨 Male ({maleCount})</div>
        <div className="qa-chip blue">👩 Female ({femaleCount})</div>
      </div>
      <GlassCard>
        <CardHeader title="Master Client Database"
          subtitle={`${clients.length} unique clients · Click row to view details`}
          action={
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-[6px] text-[11px] text-[var(--text-primary)] outline-none w-[160px]"
            />
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['ID', 'Client', 'Gender', 'Trainer', 'Package', 'Charged', 'Paid', 'Balance', 'Start', 'End', 'Days', 'Status'].map(h =>
                  <th key={h} className="px-[15px] py-[11px] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[var(--text-tertiary)] text-left whitespace-nowrap border-b border-[var(--border)]">{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const enrollments = (c.enrollments || []).slice().sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
                const e = enrollments[0] || {};
                const charged = e.total_charged || 0;
                const paid = e.payments?.reduce((s: number, p: any) => s + Number(p.amount), 0) || 0;
                const balance = charged - paid;
                const start = e.start_date || '';
                const end = e.end_date || '';
                const status = e.status || 'expired';
                const days = end ? Math.ceil((new Date(end).getTime() - Date.now()) / 86400000) : 0;
                return (
                  <tr key={c.id} onClick={() => navigate(`/clients/${c.id}`)}
                    className="cursor-pointer transition-colors hover:[&_td]:bg-[rgba(255,255,255,0.03)]"
                  >
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] font-mono text-[10.5px] text-[var(--text-tertiary)]">{c.display_id}</td>
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] font-bold text-[var(--text-primary)]">{c.full_name}</td>
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)]">{c.gender === 'Male' ? '👨' : '👩'} {c.gender}</td>
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)]">{e.trainers?.short_code ? <TrainerTag trainer={e.trainers.short_code} /> : '—'}</td>
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)]">{e.membership_plans?.duration || '—'}</td>
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)]">{charged > 0 ? fmt(charged) : '—'}</td>
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] font-bold text-[var(--success)]">{paid > 0 ? fmt(paid) : '—'}</td>
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)]" style={{ color: balance > 0 ? 'var(--warning)' : '', fontWeight: balance > 0 ? 700 : '' }}>{balance > 0 ? fmt(balance) : '—'}</td>
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)]">{start}</td>
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)]">{end}</td>
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] font-bold" style={{ color: days > 0 ? 'var(--success)' : 'var(--text-tertiary)' }}>
                      {days > 0 ? `+${days}d` : `${days}d`}
                    </td>
                    <td className="px-[15px] py-[12px] border-b border-[rgba(255,255,255,0.03)] text-[var(--text-secondary)]"><StatusBadge status={status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
