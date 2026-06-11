import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api';
import { GlassCard, CardHeader, LoadingSpinner, fmt } from '../components/Charts';
import Modal from '../components/Modal';

export default function MembershipPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('3 Months');
  const [months, setMonths] = useState(3);
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api.getMembershipPlans().then(d => setPlans(d || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null); setName(''); setDuration('3 Months'); setMonths(3); setPrice(''); setShowForm(true);
  };
  const openEdit = (p: any) => {
    setEditing(p); setName(p.name); setDuration(p.duration); setMonths(p.months_count); setPrice(String(p.default_price)); setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Enter plan name'); return; }
    if (!price || Number(price) <= 0) { toast.error('Enter valid price'); return; }
    setSubmitting(true);
    try {
      const data = { name: name.trim(), duration, months_count: months, default_price: Number(price) };
      if (editing) {
        await api.updateMembershipPlan(editing.id, data);
        toast.success('Plan updated');
      } else {
        await api.createMembershipPlan(data);
        toast.success('Plan created');
      }
      setShowForm(false); load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.deleteMembershipPlan(id);
      toast.success('Plan deleted');
      load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  const DURATIONS = ['1 Month', '3 Months', '4 Months', '12 Months'];
  const MONTH_MAP: Record<string, number> = { '1 Month': 1, '3 Months': 3, '4 Months': 4, '12 Months': 12 };

  return (
    <div>
      <GlassCard>
        <CardHeader title="Membership Plans"
          subtitle={`${plans.length} plans configured`}
          action={
            <button onClick={openCreate}
              className="flex items-center gap-[6px] rounded-[10px] bg-gradient-to-r from-[#FF375F] to-[#CC1E3A] px-[14px] py-[7px] text-[11px] font-bold text-white transition-all hover:-translate-y-px"
              style={{ boxShadow: '0 4px 14px rgba(255,55,95,0.4)' }}
            >
              <Plus size={12} /> New Plan
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr style={{ background: 'var(--insight-bg)' }}>
                {['Name', 'Duration', 'Months', 'Price', 'Enrollments', 'Actions'].map(h =>
                  <th key={h} className="px-[15px] py-[11px] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[var(--text-tertiary)] text-left whitespace-nowrap border-b border-[var(--border)]">{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id} className="transition-colors hover:[&_td]:bg-[var(--insight-bg)]">
                  <td className="px-[15px] py-[12px] border-b border-[var(--table-border2)] font-bold text-[var(--text-primary)]">{p.name}</td>
                  <td className="px-[15px] py-[12px] border-b border-[var(--table-border2)] text-[var(--text-secondary)]">{p.duration}</td>
                  <td className="px-[15px] py-[12px] border-b border-[var(--table-border2)] text-[var(--text-secondary)]">{p.months_count}</td>
                  <td className="px-[15px] py-[12px] border-b border-[var(--table-border2)] text-[var(--text-secondary)] font-bold">{fmt(p.default_price)}</td>
                  <td className="px-[15px] py-[12px] border-b border-[var(--table-border2)] text-[var(--text-secondary)]">{p.enrollments?.[0]?.count || 0}</td>
                  <td className="px-[15px] py-[12px] border-b border-[var(--table-border2)]">
                    <div className="flex gap-[6px]">
                      <button onClick={() => openEdit(p)}
                        className="flex h-[28px] w-[28px] items-center justify-center rounded-[7px] border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-tertiary)] transition-all hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                      ><Edit3 size={12} /></button>
                      <button onClick={() => handleDelete(p.id, p.name)}
                        className="flex h-[28px] w-[28px] items-center justify-center rounded-[7px] border border-[rgba(255,55,95,0.2)] bg-[rgba(255,55,95,0.06)] text-[var(--red)] transition-all hover:bg-[rgba(255,55,95,0.12)]"
                      ><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal open={showForm} onClose={() => setShowForm(false)} maxWidth="440px">
        <div className="px-[24px] pb-[24px] pt-[24px]">
          <h2 className="mb-[18px] text-[15px] font-bold">{editing ? 'Edit Plan' : 'New Membership Plan'}</h2>
          <div className="space-y-[14px]">
            <div>
              <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Plan Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Premium Monthly"
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--input-bg)] px-[14px] py-[10px] text-[13px] text-[var(--text-primary)] outline-none focus:border-[rgba(255,55,95,0.4)] transition-all placeholder:text-[var(--text-tertiary)]"
              />
            </div>
            <div>
              <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Duration</label>
              <div className="grid grid-cols-2 gap-[8px]">
                {DURATIONS.map(d => (
                  <button key={d} onClick={() => { setDuration(d); setMonths(MONTH_MAP[d] || 3); }}
                    className="rounded-[10px] border px-[14px] py-[9px] text-[12px] font-semibold transition-all"
                    style={{
                      borderColor: duration === d ? 'rgba(255,55,95,0.5)' : 'var(--border)',
                      background: duration === d ? 'rgba(255,55,95,0.12)' : 'var(--input-bg)',
                      color: duration === d ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}
                  >{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Price (₹)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 25000"
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--input-bg)] px-[14px] py-[10px] text-[13px] text-[var(--text-primary)] outline-none focus:border-[rgba(255,55,95,0.4)] transition-all placeholder:text-[var(--text-tertiary)]"
              />
            </div>
          </div>
          <div className="mt-[22px] flex justify-end gap-[8px]">
            <button onClick={() => setShowForm(false)}
              className="rounded-[10px] border border-[var(--border)] px-[18px] py-[9px] text-[11px] font-bold text-[var(--text-secondary)] transition-all hover:bg-[var(--surface-hover)]"
            >Cancel</button>
            <button onClick={handleSave} disabled={submitting}
              className="rounded-[10px] bg-gradient-to-r from-[#FF375F] to-[#CC1E3A] px-[18px] py-[9px] text-[11px] font-bold text-white transition-all hover:-translate-y-px disabled:opacity-40"
              style={{ boxShadow: '0 4px 14px rgba(255,55,95,0.4)' }}
            >{submitting ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
