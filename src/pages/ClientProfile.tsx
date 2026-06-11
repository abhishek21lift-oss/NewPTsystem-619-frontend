import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, MessageCircle, RotateCcw, Edit3, Check, X, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { fmt, StatusBadge, TrainerTag, LoadingSpinner } from '../components/Charts';
import toast from 'react-hot-toast';

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getClient(id).then(setClient).catch(() => toast.error('Failed to load client')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!client) return <div className="py-20 text-center text-[var(--text-tertiary)]">Client not found</div>;

  const enrollments = (client.enrollments || []).slice().sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  const e = enrollments[0] || {};
  const charged = e.total_charged || 0;
  const paid = e.payments?.reduce((s: number, p: any) => s + Number(p.amount), 0) || 0;
  const balance = charged - paid;
  const days = e.end_date ? Math.ceil((new Date(e.end_date).getTime() - Date.now()) / 86400000) : 0;

  const startEdit = () => {
    setEditName(client.full_name || '');
    setEditPhone(client.phone || '');
    setEditEmail(client.email || '');
    setEditGender(client.gender || 'Male');
    setEditNotes(client.notes || '');
    setEditing(true);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${client.full_name}? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await api.deleteClient(client.id);
      toast.success('Client deleted');
      navigate('/clients');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!editName.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const updated = await api.updateClient(client.id, {
        full_name: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
        gender: editGender,
        notes: editNotes.trim(),
      });
      setClient(updated);
      toast.success('Client updated');
      setEditing(false);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="relative overflow-hidden rounded-[20px] text-white mb-[18px]"
        style={{
          background: 'linear-gradient(145deg, #FF375F, #8B0022)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 80% 20%, rgba(255,255,255,0.08), transparent)' }}
        />
        <div className="relative z-[1] px-[28px] pb-[28px] pt-[20px]">
          <button onClick={() => navigate('/clients')}
            className="mb-[14px] flex items-center gap-[6px] text-white/60 hover:text-white transition-colors text-[12px] font-semibold"
          >
            <ArrowLeft size={16} /> Back to Clients
          </button>
          <div className="flex items-start gap-[18px]">
            <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white/20 text-[22px] font-extrabold backdrop-blur-sm shrink-0"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
            >
              {client.full_name?.split(' ').map((s: string) => s[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-[8px]">
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                    className="w-full rounded-[10px] border border-white/30 bg-white/10 px-[12px] py-[7px] text-[17px] font-bold text-white outline-none backdrop-blur-sm placeholder:text-white/40"
                    placeholder="Full Name"
                  />
                  <div className="flex gap-[8px]">
                    <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)}
                      className="flex-1 rounded-[8px] border border-white/30 bg-white/10 px-[10px] py-[5px] text-[12px] text-white/90 outline-none backdrop-blur-sm placeholder:text-white/40"
                      placeholder="Phone"
                    />
                    <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)}
                      className="flex-1 rounded-[8px] border border-white/30 bg-white/10 px-[10px] py-[5px] text-[12px] text-white/90 outline-none backdrop-blur-sm placeholder:text-white/40"
                      placeholder="Email"
                    />
                    <div className="flex gap-[4px]">
                      {['Male', 'Female'].map(g => (
                        <button key={g} onClick={() => setEditGender(g)}
                          className="rounded-[6px] px-[10px] py-[5px] text-[11px] font-bold transition-all"
                          style={{ background: editGender === g ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)' }}
                        >{g}</button>
                      ))}
                    </div>
                  </div>
                  <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)}
                    className="w-full rounded-[8px] border border-white/30 bg-white/10 px-[10px] py-[5px] text-[12px] text-white/90 outline-none backdrop-blur-sm placeholder:text-white/40 resize-none"
                    rows={2} placeholder="Notes (optional)"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-[22px] font-extrabold tracking-tight">{client.full_name}</h1>
                  <div className="mt-[4px] flex items-center gap-[8px] text-white/70 text-[12px] flex-wrap">
                    <span className="font-mono text-[11px]">{client.display_id}</span>
                    <span>·</span>
                    <span>{client.gender}</span>
                    <span>·</span>
                    <StatusBadge status={e.status || 'expired'} />
                    {client.phone && <><span>·</span><span>{client.phone}</span></>}
                    {client.email && <><span>·</span><span>{client.email}</span></>}
                  </div>
                </>
              )}
            </div>
            {!editing ? (
              <button onClick={startEdit}
                className="flex items-center gap-[6px] shrink-0 rounded-[10px] border border-white/30 bg-white/10 px-[14px] py-[7px] text-[12px] font-bold text-white transition-all hover:bg-white/20 backdrop-blur-sm"
              ><Edit3 size={14} /> Edit</button>
            ) : (
              <div className="flex gap-[6px] shrink-0">
                <button onClick={() => setEditing(false)}
                  className="flex items-center gap-[6px] rounded-[10px] border border-white/30 bg-white/10 px-[12px] py-[7px] text-[11px] font-bold text-white transition-all hover:bg-white/20"
                ><X size={14} /> Cancel</button>
                <button onClick={saveEdit} disabled={saving}
                  className="flex items-center gap-[6px] rounded-[10px] bg-white/25 px-[12px] py-[7px] text-[11px] font-bold text-white transition-all hover:bg-white/30 disabled:opacity-40"
                ><Check size={14} /> {saving ? 'Saving...' : 'Save'}</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-4 gap-[12px] mb-[18px]">
        {[
          ['Package', e.membership_plans?.duration || '—'],
          ['Trainer', e.trainers?.short_code ? <TrainerTag key="t" trainer={e.trainers.short_code} /> : '—'],
          ['Start Date', e.start_date || '—'],
          ['End Date', e.end_date || '—'],
          ['Total Charged', <span key="ch" className="font-bold" style={{ color: 'var(--warning)' }}>{charged > 0 ? fmt(charged) : '—'}</span>],
          ['Total Paid', <span key="pd" className="font-bold" style={{ color: 'var(--success)' }}>{paid > 0 ? fmt(paid) : '—'}</span>],
          ['Balance', <span key="bl" className="font-bold" style={{ color: balance > 0 ? 'var(--warning)' : 'var(--success)' }}>{fmt(balance)}</span>],
          ['Days Remaining', <span key="dr" className="font-bold" style={{ color: days > 0 ? 'var(--success)' : 'var(--text-tertiary)' }}>{days > 0 ? `+${days}d` : `${days}d`}</span>],
        ].map(([label, val]) => (
          <div key={label as string} className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-[16px] py-[14px]">
            <div className="text-[9.5px] font-bold uppercase tracking-[0.6px] text-[var(--text-tertiary)] mb-[5px]">{label}</div>
            <div className="text-[14px] font-semibold text-[var(--text-primary)]">{val}</div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {client.notes && (
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-[18px] py-[14px] mb-[18px]">
          <div className="text-[9.5px] font-bold uppercase tracking-[0.6px] text-[var(--text-tertiary)] mb-[6px]">Notes</div>
          <div className="text-[12.5px] text-[var(--text-secondary)]">{client.notes}</div>
        </div>
      )}

      {/* Enrollment History */}
      {enrollments.length > 0 && (
        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden mb-[18px]">
          <div className="px-[18px] py-[14px] border-b border-[var(--border)]">
            <div className="text-[13px] font-bold tracking-tight">Enrollment History</div>
            <div className="mt-[2px] text-[10.5px] text-[var(--text-tertiary)]">{enrollments.length} total enrollment{enrollments.length > 1 ? 's' : ''}</div>
          </div>
          <div className="flex flex-col">
            {enrollments.map((enr: any, i: number) => {
              const enrPaid = enr.payments?.reduce((s: number, p: any) => s + Number(p.amount), 0) || 0;
              return (
                <div key={enr.id || i} className="flex items-center gap-[14px] px-[18px] py-[12px] border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface)] transition-colors">
                  <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ background: i === 0 ? 'rgba(255,55,95,0.15)' : 'var(--surface)', color: i === 0 ? '#FF7087' : 'var(--text-tertiary)' }}
                  >{i + 1}</div>
                  <div className="flex-1 min-w-0 grid grid-cols-5 gap-[12px] items-center text-[12px]">
                    <div className="font-semibold text-[var(--text-primary)]">{enr.membership_plans?.duration || '—'}</div>
                    <div className="text-[var(--text-secondary)]">{enr.trainers?.short_code || '—'}</div>
                    <div className="text-[var(--text-tertiary)]">{enr.start_date}</div>
                    <div className="text-[var(--text-tertiary)]">{enr.end_date}</div>
                    <div className="flex items-center gap-[8px] justify-end">
                      <StatusBadge status={enr.status || 'expired'} />
                      <span className="font-bold text-[var(--warning)]">{fmt(enr.total_charged)}</span>
                      <span className="text-[10.5px] text-[var(--text-tertiary)]">(paid {fmt(enrPaid)})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-[10px]">
        <a href={`https://wa.me/${client.phone}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-[7px] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-[20px] py-[10px] text-[12px] font-bold text-[var(--text-primary)] transition-all hover:bg-[var(--surface-hover)]"
        ><MessageCircle size={16} /> WhatsApp</a>
        <a href={`tel:${client.phone}`}
          className="flex items-center justify-center gap-[7px] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-[20px] py-[10px] text-[12px] font-bold text-[var(--text-primary)] transition-all hover:bg-[var(--surface-hover)]"
        ><Phone size={16} /> Call</a>
        <button
          className="flex items-center justify-center gap-[7px] rounded-[12px] bg-gradient-to-r from-[#FF375F] to-[#CC1E3A] px-[20px] py-[10px] text-[12px] font-bold text-white transition-all hover:-translate-y-px"
          style={{ boxShadow: '0 4px 14px rgba(255,55,95,0.3)' }}
        ><RotateCcw size={16} /> Renew</button>
        <button onClick={handleDelete} disabled={saving}
          className="flex items-center justify-center gap-[7px] rounded-[12px] border border-red-500/30 bg-red-500/10 px-[20px] py-[10px] text-[12px] font-bold text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-40 ml-auto"
        ><Trash2 size={16} /> Delete</button>
      </div>
    </motion.div>
  );
}