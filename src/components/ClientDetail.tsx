import Modal from './Modal';
import { fmt, StatusBadge, TrainerTag } from './Charts';

interface Props {
  client: any;
  open: boolean;
  onClose: () => void;
}

export default function ClientDetail({ client, open, onClose }: Props) {
  if (!client) return null;
  const e = client.enrollments?.[0] || {};
  const charged = e.total_charged || 0;
  const paid = e.payments?.reduce((s: number, p: any) => s + Number(p.amount), 0) || 0;
  const balance = charged - paid;
  const days = e.end_date ? Math.ceil((new Date(e.end_date).getTime() - Date.now()) / 86400000) : 0;

  return (
    <Modal open={open} onClose={onClose} maxWidth="480px">
      <div>
        <div
          className="rounded-t-[16px] px-[28px] pb-[28px] pt-[32px] text-white"
          style={{
            background: 'linear-gradient(145deg, #FF375F, #8B0022)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <div className="flex items-center gap-[16px]">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/20 text-[18px] font-extrabold backdrop-blur-sm"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
            >
              {client.full_name?.split(' ').map((s: string) => s[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-[17px] font-bold">{client.full_name}</h2>
              <div className="mt-[2px] flex items-center gap-[6px] text-white/70 text-[11px]">
                <span>{client.display_id}</span>
                <span>·</span>
                <span>{client.gender}</span>
                <span>·</span>
                <StatusBadge status={e.status || 'expired'} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[10px] px-[28px] py-[20px]">
          {[
            ['Package', e.membership_plans?.duration || '—'],
            ['Trainer', e.trainers?.short_code ? TrainerTag({ trainer: e.trainers.short_code }) : '—'],
            ['Start', e.start_date || '—'],
            ['End', e.end_date || '—'],
            ['Charged', fmt(charged)],
            ['Paid', <span key="paid" className="font-bold" style={{ color: 'var(--success)' }}>{fmt(paid)}</span>],
            ['Balance', <span key="bal" className="font-bold" style={{ color: balance > 0 ? 'var(--warning)' : 'var(--success)' }}>{fmt(balance)}</span>],
            ['Days Left', <span key="days" className="font-bold" style={{ color: days > 0 ? 'var(--success)' : 'var(--text-tertiary)' }}>{days > 0 ? `+${days}d` : `${days}d`}</span>],
          ].map(([label, val]) => (
            <div key={label as string} className="rounded-[10px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-[14px] py-[11px]">
              <div className="text-[9.5px] font-bold uppercase tracking-[0.6px] text-[var(--text-tertiary)]">{label}</div>
              <div className="mt-[4px] text-[13px] font-semibold text-[var(--text-primary)]">{val}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-[8px] border-t border-[var(--border)] px-[28px] py-[16px]">
          <a href={`https://wa.me/${client.phone}`} target="_blank" rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-[6px] rounded-[10px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-[14px] py-[9px] text-[11px] font-bold text-[var(--text-primary)] transition-all hover:bg-[rgba(255,255,255,0.08)]"
          >
            💬 WhatsApp
          </a>
          <a href={`tel:${client.phone}`}
            className="flex flex-1 items-center justify-center gap-[6px] rounded-[10px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-[14px] py-[9px] text-[11px] font-bold text-[var(--text-primary)] transition-all hover:bg-[rgba(255,255,255,0.08)]"
          >
            📞 Call
          </a>
          <button
            className="flex flex-1 items-center justify-center gap-[6px] rounded-[10px] bg-gradient-to-r from-[#FF375F] to-[#CC1E3A] px-[14px] py-[9px] text-[11px] font-bold text-white transition-all hover:-translate-y-px"
            style={{ boxShadow: '0 4px 14px rgba(255,55,95,0.3)' }}
          >
            🔄 Renew
          </button>
        </div>
      </div>
    </Modal>
  );
}
