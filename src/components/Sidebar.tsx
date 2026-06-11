import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Users, UserCheck, DollarSign, Wallet, Scale,
  Trophy, BarChart3, Calendar, TrendingUp, Bell, ChevronDown, Plus,
} from 'lucide-react';
import { api } from '../lib/api';

interface NavItem {
  label: string;
  icon: any;
  path: string;
  badge?: string;
  new?: boolean;
}

interface SidebarProps {
  onAddTrainer?: () => void;
}

export default function Sidebar({ onAddTrainer }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [totalClients, setTotalClients] = useState(71);
  const [activeClients, setActiveClients] = useState(32);
  const [trainerOpen, setTrainerOpen] = useState(true);

  useEffect(() => {
    api.getDashboard().then(d => {
      setTotalClients(d.stats.total_clients);
      setActiveClients(d.stats.active_enrollments);
    }).catch(() => {});
  }, []);

  const trainerActive = ['/trainers', '/analytics'].includes(location.pathname);

  const navItems: { section: string; items: NavItem[]; color: string }[] = [
    { section: 'Overview', color: '#FF375F', items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    ]},
    { section: 'Clients', color: '#0A84FF', items: [
      { label: 'All Clients', icon: Users, path: '/clients', badge: String(totalClients) },
      { label: 'Active Clients', icon: UserCheck, path: '/active', badge: String(activeClients) },
    ]},
    { section: 'Finance', color: '#30D158', items: [
      { label: 'Revenue', icon: DollarSign, path: '/revenue' },
      { label: 'Payouts', icon: Wallet, path: '/payouts' },
      { label: 'Balance Sheet', icon: Scale, path: '/balance' },
    ]},
    { section: 'Schedule', color: '#FF9F0A', items: [
      { label: 'Schedule', icon: Calendar, path: '/schedule' },
      { label: 'Forecast', icon: TrendingUp, path: '/forecast' },
    ]},
    { section: 'Membership', color: '#BF5AF2', items: [
      { label: 'Membership Plans', icon: Bell, path: '/membership' },
    ]},
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[var(--sidebar-w)] flex-col border-r border-[var(--border)]"
      style={{ background: 'var(--sidebar-bg)', backdropFilter: 'blur(60px) saturate(180%)', WebkitBackdropFilter: 'blur(60px) saturate(180%)' }}
    >
      <div className="border-b border-[var(--border)] px-[18px] py-[20px]">
        <div className="flex items-center gap-[11px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white"
            style={{ boxShadow: '0 8px 24px rgba(255,55,95,0.45)' }}
          >
            <img src="/logo.png" alt="619 Fitness" className="h-9 w-9 object-contain" />
          </div>
          <div>
            <div className="text-[15px] font-extrabold tracking-tight leading-none">619 Fitness</div>
            <div className="mt-[3px] text-[10px] text-[var(--text-tertiary)] font-medium">Studio OS</div>
          </div>
        </div>
        <div className="mt-[10px] flex gap-[5px]">
          <span className="mini-badge mb-live">● LIVE</span>
          <span className="mini-badge mb-jpr">Lucknow</span>
          <span className="mini-badge mb-k11">K11</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-[10px] py-[14px]">
        {navItems.map(({ section, items, color }) => (
          <div key={section}>
            <div className="flex items-center gap-[6px] px-[10px] pb-[7px] pt-[16px] first:pt-0">
              <div className="h-[3px] w-[3px] rounded-full" style={{ background: color }} />
              <div className="text-[9px] font-extrabold uppercase tracking-[1.2px] text-[var(--text-tertiary)]">
                {section}
              </div>
            </div>
            {items.map(({ label, icon: Icon, path, badge, new: isNew }) => {
              const active = location.pathname === path;
              return (
                <div
                  key={path}
                  onClick={() => navigate(path)}
                  className={clsx(
                    'flex items-center gap-[9px] rounded-[11px] px-[10px] py-[9px] text-[13px] font-semibold cursor-pointer transition-all duration-150 mb-[2px] border border-transparent',
                    active
                      ? 'text-[#FF7087] border-[rgba(255,55,95,0.2)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
                    active && 'bg-gradient-to-br from-[rgba(255,55,95,0.15)] to-[rgba(255,55,95,0.06)]',
                  )}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 1.5} className={clsx('shrink-0', active ? 'opacity-100' : 'opacity-60')} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="nav-pill pill-red">{badge}</span>
                  )}
                  {isNew && (
                    <span className="nav-pill pill-purple">AI</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div>
          <div className="flex items-center gap-[6px] px-[10px] pb-[7px] pt-[16px]">
            <div className="h-[3px] w-[3px] rounded-full" style={{ background: '#FFD60A' }} />
            <div className="text-[9px] font-extrabold uppercase tracking-[1.2px] text-[var(--text-tertiary)]">
              Trainers
            </div>
          </div>
          <div
            onClick={() => setTrainerOpen(o => !o)}
            className={clsx(
              'flex items-center gap-[9px] rounded-[11px] px-[10px] py-[9px] text-[13px] font-semibold cursor-pointer transition-all duration-150 mb-[2px] border border-transparent',
              trainerActive
                ? 'text-[#FF7087] border-[rgba(255,55,95,0.2)] bg-gradient-to-br from-[rgba(255,55,95,0.15)] to-[rgba(255,55,95,0.06)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
            )}
          >
            <Trophy size={16} strokeWidth={trainerActive ? 2.5 : 1.5} className={clsx('shrink-0', trainerActive ? 'opacity-100' : 'opacity-60')} />
            <span className="flex-1">Trainer Master</span>
            <ChevronDown size={14} className={clsx('transition-transform duration-200', trainerOpen && 'rotate-180')} />
          </div>
          {trainerOpen && (
            <div className="ml-[8px] pl-[6px] border-l border-[var(--border)]">
              {[
                { label: 'Trainer Stats', icon: BarChart3, path: '/trainers' },
                { label: 'Analytics', icon: Trophy, path: '/analytics' },
              ].map(({ label, icon: Icon, path }) => {
                const active = location.pathname === path;
                return (
                  <div
                    key={path}
                    onClick={() => navigate(path)}
                    className={clsx(
                      'flex items-center gap-[9px] rounded-[10px] px-[10px] py-[8px] text-[12.5px] font-medium cursor-pointer transition-all duration-150 mb-[1px] border border-transparent',
                      active
                        ? 'text-[#FF7087] border-[rgba(255,55,95,0.16)] bg-gradient-to-br from-[rgba(255,55,95,0.12)] to-[rgba(255,55,95,0.04)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
                    )}
                  >
                    <Icon size={14} strokeWidth={active ? 2.5 : 1.5} className={clsx('shrink-0', active ? 'opacity-100' : 'opacity-45')} />
                    <span className="flex-1">{label}</span>
                  </div>
                );
              })}
              <div
                onClick={() => onAddTrainer?.()}
                className="flex items-center gap-[9px] rounded-[10px] px-[10px] py-[8px] text-[12.5px] font-medium cursor-pointer transition-all duration-150 mb-[1px] border border-dashed border-[rgba(255,55,95,0.2)] text-[var(--red-light)] hover:bg-[rgba(255,55,95,0.08)] hover:text-[#FF7087]"
              >
                <Plus size={14} strokeWidth={2} className="shrink-0" />
                <span className="flex-1">Add Trainer</span>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-[var(--border)] px-[10px] py-[14px]">
        <div className="flex items-center gap-[10px] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-[10px] py-[9px] cursor-pointer hover:bg-[var(--surface-hover)] transition-all">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full font-extrabold text-xs text-white"
            style={{
              background: 'linear-gradient(145deg, #FF375F, #8B0022)',
              boxShadow: '0 4px 12px rgba(255,55,95,0.4)',
            }}
          >
            AK
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-bold leading-none">Abhishek Katiyar</div>
            <div className="mt-[3px] text-[9.5px] text-[var(--text-tertiary)] font-medium">Head Trainer · Owner</div>
          </div>
          <div className="h-[8px] w-[8px] shrink-0 rounded-full"
            style={{ background: 'var(--green)', boxShadow: '0 0 8px rgba(48,209,88,0.5)' }}
          />
        </div>
      </div>
    </aside>
  );
}
