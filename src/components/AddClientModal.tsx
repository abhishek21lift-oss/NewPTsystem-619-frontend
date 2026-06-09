import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../lib/api';
import Modal from './Modal';
import { fmt } from './Charts';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const GRADIENTS = [
  'linear-gradient(145deg, #FF375F, #8B0000)',
  'linear-gradient(145deg, #FF6B9D, #D63060)',
  'linear-gradient(145deg, #5AC8FA, #0A84FF)',
];

export default function AddClientModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [paidAmount, setPaidAmount] = useState('');
  const [discount, setDiscount] = useState('');

  useEffect(() => {
    if (!open) { setStep(1); setName(''); setPhone(''); setGender('Male'); setSelectedPlan(null); setSelectedTrainer(null); setPaidAmount(''); setDiscount(''); return; }
    api.getTrainers().then(setTrainers).catch(() => {});
    api.getMembershipPlans().then(setPlans).catch(() => {});
  }, [open]);

  const reset = () => { setStep(1); setName(''); setPhone(''); setGender('Male'); setSelectedPlan(null); setSelectedTrainer(null); setPaidAmount(''); setDiscount(''); };

  const handleNext = () => {
    if (!name.trim()) { toast.error('Enter client name'); return; }
    if (!phone.trim()) { toast.error('Enter phone number'); return; }
    setStep(2);
  };

  const discountAmt = Math.min(Math.max(Number(discount) || 0, 0), selectedPlan?.default_price || 0);
  const finalAmount = (selectedPlan?.default_price || 0) - discountAmt;

  const handleSubmit = async () => {
    if (!selectedTrainer) { toast.error('Select a trainer'); return; }
    if (!selectedPlan) { toast.error('Select a package'); return; }
    setSubmitting(true);
    try {
      const client = await api.createClient({ full_name: name.trim(), phone: phone.trim(), gender });
      const enrollment = await api.createEnrollment({
        client_id: client.id,
        trainer_id: selectedTrainer.id,
        plan_id: selectedPlan.id,
        total_charged: finalAmount,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + selectedPlan.months_count * 30 * 86400000).toISOString().split('T')[0],
        status: 'active',
      });
      const paid = Number(paidAmount) || 0;
      if (paid > 0) {
        await api.createPayment({ enrollment_id: enrollment.id, amount: paid, paid_at: new Date().toISOString().split('T')[0], method: 'cash' });
      }
      toast.success(`${name.trim()} enrolled in ${selectedPlan.name}`);
      reset(); onSuccess(); onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create enrollment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="540px">
      <div className="px-[28px] pb-[24px] pt-[24px]">
        <div className="mb-[20px] flex items-center gap-[10px]">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-[10px] flex-1">
              <div
                className="flex h-[28px] w-[28px] items-center justify-center rounded-full text-[11px] font-bold transition-all"
                style={{
                  background: step >= s ? 'linear-gradient(145deg, #FF375F, #CC1E3A)' : 'rgba(255,255,255,0.06)',
                  color: step >= s ? '#fff' : 'var(--text-tertiary)',
                  boxShadow: step >= s ? '0 4px 12px rgba(255,55,95,0.4)' : 'none',
                }}
              >
                {s}
              </div>
              <div className="text-[10px]" style={{ color: step >= s ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                {['Details', 'Package', 'Payment'][s - 1]}
              </div>
              {s < 3 && <div className="flex-1 h-px" style={{ background: step > s ? 'var(--red)' : 'var(--border)' }} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="mb-[18px] text-[15px] font-bold">Personal Details</h2>
            <div className="space-y-[14px]">
              <div>
                <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Kumar"
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-[14px] py-[10px] text-[13px] text-[var(--text-primary)] outline-none focus:border-[rgba(255,55,95,0.4)] focus:bg-[rgba(255,255,255,0.06)] transition-all placeholder:text-[var(--text-tertiary)]"
                />
              </div>
              <div>
                <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Phone Number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 9876543210"
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-[14px] py-[10px] text-[13px] text-[var(--text-primary)] outline-none focus:border-[rgba(255,55,95,0.4)] focus:bg-[rgba(255,255,255,0.06)] transition-all placeholder:text-[var(--text-tertiary)]"
                />
              </div>
              <div>
                <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Gender</label>
                <div className="flex gap-[8px]">
                  {(['Male', 'Female'] as const).map(g => (
                    <button key={g} onClick={() => setGender(g)}
                      className="flex-1 rounded-[10px] border px-[14px] py-[9px] text-[12px] font-semibold transition-all"
                      style={{
                        borderColor: gender === g ? 'rgba(255,55,95,0.5)' : 'var(--border)',
                        background: gender === g ? 'rgba(255,55,95,0.12)' : 'rgba(255,255,255,0.04)',
                        color: gender === g ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      {g === 'Male' ? '👨' : '👩'} {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-[24px] flex justify-end">
              <button onClick={handleNext} className="rounded-[10px] bg-gradient-to-r from-[#FF375F] to-[#CC1E3A] px-[24px] py-[9px] text-[12px] font-bold text-white transition-all hover:-translate-y-px"
                style={{ boxShadow: '0 4px 14px rgba(255,55,95,0.4)' }}
              >Next →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-[14px] text-[15px] font-bold">Select Package & Trainer</h2>
            <div className="mb-[16px]">
              <label className="mb-[7px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Membership Plan</label>
              <div className="grid grid-cols-2 gap-[8px]">
                {plans.map(p => (
                  <button key={p.id} onClick={() => setSelectedPlan(p)}
                    className="rounded-[10px] border px-[14px] py-[10px] text-left transition-all"
                    style={{
                      borderColor: selectedPlan?.id === p.id ? 'rgba(255,55,95,0.5)' : 'var(--border)',
                      background: selectedPlan?.id === p.id ? 'rgba(255,55,95,0.12)' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div className="text-[13px] font-bold text-[var(--text-primary)]">{p.name}</div>
                    <div className="mt-[2px] text-[11px] text-[var(--text-tertiary)]">{fmt(p.default_price)}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-[7px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Trainer</label>
              <div className="grid grid-cols-3 gap-[8px]">
                {trainers.map((t, i) => (
                  <button key={t.id} onClick={() => setSelectedTrainer(t)}
                    className="flex flex-col items-center gap-[6px] rounded-[10px] border py-[12px] transition-all"
                    style={{
                      borderColor: selectedTrainer?.id === t.id ? 'rgba(255,55,95,0.5)' : 'var(--border)',
                      background: selectedTrainer?.id === t.id ? 'rgba(255,55,95,0.12)' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-[11px] font-extrabold text-white"
                      style={{ background: GRADIENTS[i % 3] }}
                    >
                      {t.initials}
                    </div>
                    <div className="text-[11px] font-semibold text-[var(--text-primary)]">{t.full_name.split(' ')[0]}</div>
                    <div className="text-[9px] text-[var(--text-tertiary)]">{t.specialty?.split('&')[0]?.trim() || 'Fitness'}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-[20px] flex justify-between">
              <button onClick={() => setStep(1)} className="rounded-[10px] border border-[var(--border)] px-[20px] py-[9px] text-[12px] font-bold text-[var(--text-secondary)] transition-all hover:bg-[rgba(255,255,255,0.05)]">← Back</button>
              <button disabled={!selectedPlan || !selectedTrainer}
                className="rounded-[10px] bg-gradient-to-r from-[#FF375F] to-[#CC1E3A] px-[24px] py-[9px] text-[12px] font-bold text-white transition-all hover:-translate-y-px disabled:opacity-40"
                style={{ boxShadow: '0 4px 14px rgba(255,55,95,0.4)' }}
                onClick={() => setStep(3)}
              >Next →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="mb-[14px] text-[15px] font-bold">Payment Summary</h2>
            <div className="space-y-[10px] rounded-[12px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-[16px]">
              {[
                ['Client', name],
                ['Phone', phone],
                ['Package', `${selectedPlan?.name} — ${fmt(selectedPlan?.default_price)}`],
                ['Trainer', selectedTrainer?.full_name],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between text-[12px]">
                  <span className="text-[var(--text-tertiary)]">{label}</span>
                  <span className="font-semibold text-[var(--text-primary)]">{val}</span>
                </div>
              ))}
              {discountAmt > 0 && (
                <div className="flex justify-between text-[12px]">
                  <span className="text-[var(--text-tertiary)]">Discount</span>
                  <span className="font-semibold text-[var(--success)]">-{fmt(discountAmt)}</span>
                </div>
              )}
              <div className="border-t border-[var(--border)] pt-[10px] flex justify-between text-[13px] font-bold">
                <span className="text-[var(--text-primary)]">Total Charged</span>
                <span style={{ color: 'var(--red)' }}>{fmt(finalAmount)}</span>
              </div>
            </div>
            <div className="mt-[14px] grid grid-cols-2 gap-[12px]">
              <div>
                <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Discount</label>
                <input type="number" value={discount} onChange={e => setDiscount(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-[14px] py-[10px] text-[13px] text-[var(--text-primary)] outline-none focus:border-[rgba(255,55,95,0.4)] transition-all placeholder:text-[var(--text-tertiary)]"
                />
              </div>
              <div>
                <label className="mb-[5px] block text-[10.5px] font-semibold text-[var(--text-secondary)]">Amount Paid Today</label>
                <input type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-[14px] py-[10px] text-[13px] text-[var(--text-primary)] outline-none focus:border-[rgba(255,55,95,0.4)] transition-all placeholder:text-[var(--text-tertiary)]"
                />
              </div>
            </div>
            <div className="mt-[20px] flex justify-between">
              <button onClick={() => setStep(2)} className="rounded-[10px] border border-[var(--border)] px-[20px] py-[9px] text-[12px] font-bold text-[var(--text-secondary)] transition-all hover:bg-[rgba(255,255,255,0.05)]">← Back</button>
              <button onClick={handleSubmit} disabled={submitting}
                className="rounded-[10px] bg-gradient-to-r from-[#FF375F] to-[#CC1E3A] px-[24px] py-[9px] text-[12px] font-bold text-white transition-all hover:-translate-y-px disabled:opacity-40"
                style={{ boxShadow: '0 4px 14px rgba(255,55,95,0.4)' }}
              >
                {submitting ? 'Saving...' : '✓ Save Enrollment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
