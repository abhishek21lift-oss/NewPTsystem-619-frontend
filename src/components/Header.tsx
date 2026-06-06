import { Search, Bell, Moon, Sun, Download, Plus } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearch?: (q: string) => void;
  onNewClient?: () => void;
  notifOpen?: boolean;
  onNotifToggle?: () => void;
  onNotifClose?: () => void;
}

const SAMPLE_NOTIFICATIONS = [
  { title: 'Payment Due', body: 'Vaibhav has a pending balance of ₹20,000', icon: '💸', color: 'var(--red-muted)', is_read: false },
  { title: 'Subscription Expiring', body: "Renuka's 1-Month plan ends in 7 days", icon: '⏰', color: 'var(--orange-muted)', is_read: false },
  { title: 'New Enrollment', body: 'Tarang Gupta joined 3-Month plan with Riya', icon: '🏋️', color: 'var(--green-muted)', is_read: false },
  { title: 'Achievement Unlocked', body: 'Abhishek won Silver at UP State Powerlifting Championship', icon: '🥈', color: 'var(--blue-muted)', is_read: false },
];

export default function Header({ title, subtitle, onNewClient, notifOpen, onNotifToggle, onNotifClose }: HeaderProps) {
  const { isDark, toggle } = useTheme();

  return (
    <header
      className="sticky top-0 z-40 flex h-[var(--header-h)] items-center justify-between border-b border-[var(--border)] px-[30px]"
      style={{ background: 'rgba(10,10,11,0.75)', backdropFilter: 'blur(30px) saturate(180%)' }}
    >
      <div>
        <h1 className="text-[17px] font-bold tracking-tight">{title}</h1>
        <p className="mt-[1px] text-[11px] text-[var(--text-tertiary)]">{subtitle}</p>
      </div>

      <div className="flex items-center gap-[10px]">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search… ⌘K"
            className="w-[200px] rounded-[10px] border border-[var(--border)] bg-[rgba(255,255,255,0.05)] px-[14px] py-[8px] pl-[30px] text-xs text-[var(--text-secondary)] placeholder:text-[var(--text-tertiary)] transition-all focus:w-[240px] focus:border-[rgba(255,59,48,0.4)] focus:bg-[rgba(255,255,255,0.07)] focus:text-[var(--text-primary)] focus:outline-none"
          />
        </div>

        <div className="relative">
          <div
            onClick={onNotifToggle}
            className="relative flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] border border-[var(--border)] bg-[rgba(255,255,255,0.05)] transition-all hover:bg-[rgba(255,255,255,0.09)]"
          >
            <Bell size={15} />
            <div className="absolute -right-[4px] -top-[4px] flex h-4 w-4 items-center justify-center rounded-full bg-[var(--red)] text-[9px] font-extrabold shadow-[0_0_0_2px_var(--bg)]">
              6
            </div>
          </div>
          <NotificationPanel open={!!notifOpen} onClose={onNotifClose || (() => {})} notifications={SAMPLE_NOTIFICATIONS} />
        </div>

        <div
          onClick={toggle}
          className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] border border-[var(--border)] bg-[rgba(255,255,255,0.05)] transition-all hover:bg-[rgba(255,255,255,0.09)]"
        >
          {isDark ? <Moon size={15} /> : <Sun size={15} />}
        </div>

        <button className="flex items-center gap-[6px] rounded-[10px] border border-[var(--border)] bg-[rgba(255,255,255,0.06)] px-[14px] py-[7px] text-xs font-semibold text-[var(--text-secondary)] transition-all hover:bg-[rgba(255,255,255,0.1)] hover:text-[var(--text-primary)]">
          <Download size={12} />
          Export
        </button>

        <button
          onClick={onNewClient}
          className="flex items-center gap-[6px] rounded-[10px] bg-gradient-to-r from-[#FF375F] to-[#CC1E3A] px-[14px] py-[7px] text-xs font-semibold text-white transition-all hover:-translate-y-[1px] active:translate-y-0 cursor-pointer"
          style={{ boxShadow: '0 4px 14px rgba(255,55,95,0.4), inset 0 1px 0 rgba(255,255,255,0.15)' }}
        >
          <Plus size={12} />
          New Client
        </button>
      </div>
    </header>
  );
}
