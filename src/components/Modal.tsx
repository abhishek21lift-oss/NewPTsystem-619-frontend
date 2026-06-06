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
          className="relative w-full animate-[fadeUp_0.2s_ease-out] rounded-[16px] border border-[var(--border)] shadow-2xl"
          style={{
            maxWidth,
            background: 'rgba(18,18,22,0.96)',
            backdropFilter: 'blur(40px) saturate(180%)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
          }}
        >
          <button
            onClick={onClose}
            className="absolute right-[14px] top-[14px] z-10 flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[var(--border)] bg-[rgba(255,255,255,0.05)] text-[var(--text-tertiary)] transition-all hover:bg-[rgba(255,255,255,0.1)] hover:text-[var(--text-primary)]"
          >
            <X size={14} />
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
