import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddTrainerModal({ open, onClose, onSuccess }: Props) {
  const [fullName, setFullName] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [initials, setInitials] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [commissionPct, setCommissionPct] = useState(50);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFullName('');
      setShortCode('');
      setInitials('');
      setSpecialty('');
      setCommissionPct(50);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!fullName.trim() || !shortCode.trim() || !initials.trim()) {
      toast.error('Full Name, Short Code & Initials are required');
      return;
    }
    setSaving(true);
    try {
      await api.createTrainer({
        full_name: fullName.trim(),
        short_code: shortCode.trim().toUpperCase(),
        initials: initials.trim().toUpperCase(),
        specialty: specialty.trim() || 'Personal Trainer',
        certification: 'Certified',
        commission_pct: commissionPct,
        is_head: false,
        is_owner: false,
      });
      toast.success(`Trainer ${fullName} added successfully`);
      onSuccess?.();
      onClose();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to add trainer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[460px] rounded-[20px] border border-[var(--border)] p-6 shadow-2xl"
        style={{ background: 'var(--bg2)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[16px] font-extrabold">Add New Trainer</div>
            <div className="mt-[2px] text-[11px] text-[var(--text-tertiary)]">Register a new personal trainer</div>
          </div>
          <button onClick={onClose} className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-[14px]">
          <div>
            <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Full Name *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[12px] py-[9px] text-[13px] text-[var(--text-primary)] outline-none transition-all focus:border-[rgba(255,55,95,0.5)] focus:shadow-[0_0_0_3px_rgba(255,55,95,0.08)]"
              placeholder="e.g. Priya Sharma"
            />
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Short Code *</label>
              <input type="text" value={shortCode} onChange={e => setShortCode(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[12px] py-[9px] text-[13px] text-[var(--text-primary)] outline-none transition-all focus:border-[rgba(255,55,95,0.5)] focus:shadow-[0_0_0_3px_rgba(255,55,95,0.08)]"
                placeholder="e.g. PS"
              />
            </div>
            <div>
              <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Initials *</label>
              <input type="text" value={initials} onChange={e => setInitials(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[12px] py-[9px] text-[13px] text-[var(--text-primary)] outline-none transition-all focus:border-[rgba(255,55,95,0.5)] focus:shadow-[0_0_0_3px_rgba(255,55,95,0.08)]"
                placeholder="e.g. PS"
              />
            </div>
          </div>
          <div>
            <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Specialty</label>
            <input type="text" value={specialty} onChange={e => setSpecialty(e.target.value)}
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[12px] py-[9px] text-[13px] text-[var(--text-primary)] outline-none transition-all focus:border-[rgba(255,55,95,0.5)] focus:shadow-[0_0_0_3px_rgba(255,55,95,0.08)]"
              placeholder="e.g. Strength & Conditioning"
            />
          </div>
          <div>
            <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Commission %</label>
            <input type="number" value={commissionPct} onChange={e => setCommissionPct(Number(e.target.value))}
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[12px] py-[9px] text-[13px] text-[var(--text-primary)] outline-none transition-all focus:border-[rgba(255,55,95,0.5)] focus:shadow-[0_0_0_3px_rgba(255,55,95,0.08)]"
              min={0} max={100}
            />
          </div>
        </div>

        <div className="mt-[22px] flex gap-[10px] justify-end">
          <button onClick={onClose}
            className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-[18px] py-[9px] text-[12px] font-bold text-[var(--text-secondary)] transition-all hover:bg-[var(--surface-hover)]"
          >Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="rounded-[10px] bg-gradient-to-r from-[#FF375F] to-[#CC1E3A] px-[20px] py-[9px] text-[12px] font-bold text-white transition-all hover:-translate-y-px disabled:opacity-40"
            style={{ boxShadow: '0 4px 14px rgba(255,55,95,0.4)' }}
          >{saving ? 'Adding...' : 'Add Trainer'}</button>
        </div>
      </div>
    </div>
  );
}
