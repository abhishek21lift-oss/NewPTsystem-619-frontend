import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Users, UserCheck, DollarSign, Wallet, Scale,
  Trophy, BarChart3, Calendar, TrendingUp, Bell,
} from 'lucide-react';

const navItems = [
  { section: 'Overview', items: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  ]},
  { section: 'Clients', items: [
    { label: 'All Clients', icon: Users, path: '/clients', badge: '67' },
    { label: 'Active Clients', icon: UserCheck, path: '/active', badge: '23' },
  ]},
  { section: 'Finance', items: [
    { label: 'Revenue', icon: DollarSign, path: '/revenue' },
    { label: 'Payouts', icon: Wallet, path: '/payouts' },
    { label: 'Balance Sheet', icon: Scale, path: '/balance' },
  ]},
  { section: 'Trainers', items: [
    { label: 'Trainer Stats', icon: Trophy, path: '/trainers' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics', new: true },
  ]},
  { section: 'Schedule', items: [
    { label: 'Schedule', icon: Calendar, path: '/schedule' },
    { label: 'Forecast', icon: TrendingUp, path: '/forecast' },
  ]},
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[var(--sidebar-w)] flex-col border-r border-[var(--border)]"
      style={{ background: 'rgba(14,14,16,0.92)', backdropFilter: 'blur(40px) saturate(180%)' }}
    >
      <div className="border-b border-[var(--border)] px-[18px] py-[22px]">
        <div className="flex items-center gap-[11px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] font-extrabold text-sm text-white"
            style={{
              background: 'linear-gradient(145deg, #FF3B30, #CC2936)',
              boxShadow: '0 6px 20px rgba(255,59,48,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            619
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">619 Fitness</div>
            <div className="text-[10.5px] text-[var(--text-tertiary)]">Studio Management OS</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-[10px] py-[14px]">
        {navItems.map(({ section, items }) => (
          <div key={section}>
            <div className="px-[10px] pb-[7px] pt-[18px] text-[9.5px] font-bold uppercase tracking-[1px] text-[var(--text-tertiary)] first:pt-0">
              {section}
            </div>
            {items.map(({ label, icon: Icon, path, badge, new: isNew }) => {
              const active = location.pathname === path;
              return (
                <div
                  key={path}
                  onClick={() => navigate(path)}
                  className={clsx(
                    'flex items-center gap-[9px] rounded-[11px] px-[10px] py-[9px] text-[13px] font-medium cursor-pointer transition-all duration-150 mb-[2px] border border-transparent',
                    active
                      ? 'text-[#FF6B63] border-[rgba(255,59,48,0.2)]'
                      : 'text-[var(--text-secondary)] hover:bg-surface hover:text-[var(--text-primary)]',
                    active && 'bg-gradient-to-br from-[rgba(255,59,48,0.15)] to-[rgba(255,59,48,0.08)]',
                  )}
                >
                  <Icon size={16} className={clsx('shrink-0', active ? 'opacity-100' : 'opacity-65')} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="min-w-[18px] rounded-full bg-gradient-to-r from-[#FF3B30] to-[#FF6B63] px-[7px] py-[2px] text-center text-[9.5px] font-bold text-white shadow-[0_2px_6px_rgba(255,59,48,0.35)]">
                      {badge}
                    </span>
                  )}
                  {isNew && (
                    <span className="rounded-full bg-gradient-to-r from-[#BF5AF2] to-[#9B3BD8] px-[6px] py-[2px] text-[9px] font-bold text-white">
                      NEW
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--border)] px-[10px] py-[14px]">
        <div className="flex items-center gap-[10px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-[10px] py-[9px] cursor-pointer hover:bg-[var(--surface-hover)] transition-all">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full font-extrabold text-xs"
            style={{
              background: 'linear-gradient(145deg, #FF3B30, #8B0000)',
              boxShadow: '0 3px 10px rgba(255,59,48,0.35)',
            }}
          >
            AK
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-bold">Abhishek Katiyar</div>
            <div className="text-[10px] text-[var(--text-tertiary)]">Head Trainer · Owner</div>
          </div>
          <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--green)]"
            style={{ boxShadow: '0 0 6px var(--green-glow)' }}
          />
        </div>
      </div>
    </aside>
  );
}
