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
              placeholder="Search clients…"
              className="input-apple w-[160px] text-[11px] py-[6px]"
            />
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['ID', 'Client', 'Gender', 'Trainer', 'Package', 'Charged', 'Paid', 'Balance', 'Start', 'End', 'Days', 'Status'].map(h =>
                  <th key={h}>{h}</th>
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
                  <tr key={c.id} onClick={() => navigate(`/clients/${c.id}`)} className="cursor-pointer">
                    <td className="font-mono-apple text-[10.5px] text-[var(--text-tertiary)]">{c.display_id}</td>
                    <td className="font-bold text-[var(--text-primary)]">{c.full_name}</td>
                    <td>{c.gender === 'Male' ? '👨' : '👩'} {c.gender}</td>
                    <td>{e.trainers?.short_code ? <TrainerTag trainer={e.trainers.short_code} /> : '—'}</td>
                    <td>{e.membership_plans?.duration || '—'}</td>
                    <td>{charged > 0 ? fmt(charged) : '—'}</td>
                    <td className="font-bold" style={{ color: 'var(--green)' }}>{paid > 0 ? fmt(paid) : '—'}</td>
                    <td style={{ color: balance > 0 ? 'var(--orange-light)' : '', fontWeight: balance > 0 ? 700 : '' }}>{balance > 0 ? fmt(balance) : '—'}</td>
                    <td>{start}</td>
                    <td>{end}</td>
                    <td className="font-bold" style={{ color: days > 0 ? 'var(--green)' : 'var(--text-tertiary)' }}>
                      {days > 0 ? `+${days}d` : `${days}d`}
                    </td>
                    <td><StatusBadge status={status} /></td>
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
