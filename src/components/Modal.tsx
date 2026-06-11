import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ open, onClose, children, maxWidth = '520px' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div
          className="relative w-full animate-[fadeUp_0.25s_cubic-bezier(0.16,1,0.3,1)] rounded-[20px] border border-[rgba(255,255,255,0.07)] shadow-2xl overflow-hidden"
          style={{
            maxWidth,
            background: 'var(--modal-bg)',
            backdropFilter: 'blur(60px) saturate(180%)',
            WebkitBackdropFilter: 'blur(60px) saturate(180%)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[1.5px] z-10"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,55,95,0.3), rgba(90,200,245,0.15), transparent)' }}
          />
          <button
            onClick={onClose}
            className="absolute right-[14px] top-[14px] z-10 flex h-[30px] w-[30px] items-center justify-center rounded-[9px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)] text-[var(--text-tertiary)] transition-all hover:bg-[rgba(255,255,255,0.09)] hover:text-[var(--text-primary)]"
          >
            <X size={14} />
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
