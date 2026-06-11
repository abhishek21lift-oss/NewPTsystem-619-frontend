import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command } from 'lucide-react';
import { clsx } from 'clsx';

const CMD_ITEMS = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'All Clients', path: '/clients', icon: '👥' },
  { label: 'Active Clients', path: '/active', icon: '✅' },
  { label: 'Revenue', path: '/revenue', icon: '💰' },
  { label: 'Payouts', path: '/payouts', icon: '💳' },
  { label: 'Balance Sheet', path: '/balance', icon: '⚖️' },
  { label: 'Trainer Stats', path: '/trainers', icon: '🏆' },
  { label: 'Analytics', path: '/analytics', icon: '📈' },
  { label: 'Schedule', path: '/schedule', icon: '📅' },
  { label: 'Forecast', path: '/forecast', icon: '🔮' },
  { label: 'Membership Plans', path: '/membership', icon: '🎫' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
        setSelectedIdx(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = CMD_ITEMS.filter(i =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[selectedIdx]) {
      navigate(filtered[selectedIdx].path);
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed left-1/2 top-[15%] z-[90] w-[460px] -translate-x-1/2 animate-[fadeUp_0.12s_ease-out] overflow-hidden rounded-[14px] border border-[var(--border)] shadow-2xl"
        style={{ background: 'rgba(14,14,18,0.97)', backdropFilter: 'blur(40px)' }}
      >
        <div className="flex items-center gap-[10px] border-b border-[var(--border)] px-[16px] py-[12px]">
          <Search size={15} className="text-[var(--text-tertiary)]" strokeWidth={1.5} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search pages…"
            className="flex-1 bg-transparent text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] font-[inherit]"
          />
          <div className="flex items-center gap-[4px] rounded-[6px] border border-[var(--border)] px-[6px] py-[3px] text-[9px] text-[var(--text-tertiary)]">
            <Command size={10} />K
          </div>
        </div>
        <div className="max-h-[280px] overflow-y-auto py-[6px]">
          {filtered.map((item, i) => (
            <div
              key={item.path}
              onClick={() => { navigate(item.path); setOpen(false); }}
              className={clsx(
                'flex items-center gap-[10px] mx-[6px] rounded-[8px] px-[12px] py-[8px] cursor-pointer transition-all',
                i === selectedIdx
                  ? 'bg-[rgba(255,55,95,0.12)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)]'
              )}
            >
              <span className="text-[14px]">{item.icon}</span>
              <span className="text-[12.5px] font-medium">{item.label}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-[18px] py-[20px] text-center text-[12px] text-[var(--text-tertiary)]">No results</div>
          )}
        </div>
        <div className="flex items-center gap-[12px] border-t border-[var(--border)] px-[16px] py-[8px] text-[9.5px] text-[var(--text-tertiary)]">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>Esc Close</span>
        </div>
      </div>
    </>
  );
}
