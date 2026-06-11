import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  notifications: { title: string; body: string; icon: string; color: string; is_read: boolean }[];
}

export default function NotificationPanel({ open, onClose, notifications }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => window.addEventListener('click', handler), 0);
    return () => window.removeEventListener('click', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-[calc(100%+8px)] z-50 w-[340px] animate-[fadeUp_0.15s_ease-out] overflow-hidden rounded-[14px] border border-[var(--border)] shadow-2xl"
      style={{
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(40px) saturate(180%)',
      }}
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] px-[16px] py-[12px]">
        <div className="flex items-center gap-[7px]">
          <div className="text-[13px] font-bold">Notifications</div>
          <div className="text-[10px] font-bold px-[6px] py-[1px] rounded-[6px] bg-[var(--red-muted)] text-[var(--red-light)]">
            {notifications.filter(n => !n.is_read).length}
          </div>
        </div>
        <button onClick={onClose} className="text-[10px] font-bold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">Clear all</button>
      </div>
      <div className="max-h-[320px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-[16px] py-[24px] text-center text-[12px] text-[var(--text-tertiary)]">No notifications</div>
        ) : (
          notifications.map((n, i) => (
            <div key={i} className="flex items-start gap-[11px] border-b border-[rgba(255,255,255,0.03)] px-[16px] py-[12px] transition-colors hover:bg-[rgba(255,255,255,0.02)]">
              <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] text-[13px]"
                style={{ background: n.color?.replace(')', ',0.12)').replace('var(', '') || 'rgba(255,255,255,0.06)' }}
              >
                {n.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-[6px]">
                  <div className="text-[11.5px] font-semibold text-[var(--text-primary)]">{n.title}</div>
                  {!n.is_read && <div className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--red)]" style={{ boxShadow: '0 0 6px rgba(255,55,95,0.5)' }} />}
                </div>
                <div className="mt-[2px] text-[10.5px] text-[var(--text-tertiary)] leading-[1.4]">{n.body}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
