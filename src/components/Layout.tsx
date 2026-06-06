import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import StatusBar from './StatusBar';
import CommandPalette from './CommandPalette';
import AddClientModal from './AddClientModal';

function getDateSubtitle() {
  const d = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getScheduleSubtitle() {
  const d = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${days[d.getDay()]}`;
}

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard Overview', subtitle: `619 Fitness Studio · Lucknow · ${getDateSubtitle()}` },
  '/clients': { title: 'All Clients', subtitle: '67 unique clients · Latest package per client shown' },
  '/active': { title: 'Active Clients', subtitle: '23 clients currently active' },
  '/revenue': { title: 'Revenue Analysis', subtitle: 'Total studio earnings per month' },
  '/payouts': { title: 'Trainer Payouts', subtitle: '50% commission split' },
  '/balance': { title: 'Balance Sheet', subtitle: 'Outstanding payment records' },
  '/trainers': { title: 'Trainer Performance', subtitle: 'Leaderboard & stats' },
  '/analytics': { title: 'Studio Analytics', subtitle: 'AI-powered insights' },
  '/schedule': { title: 'Schedule & Sessions', subtitle: getScheduleSubtitle() },
  '/forecast': { title: 'Revenue Forecast', subtitle: '6-month projection' },
  '/membership': { title: 'Membership Plans', subtitle: 'Manage subscription packages' },
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const page = titles[location.pathname] || titles['/'];
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 800px 600px at 10% 0%, rgba(255,59,48,0.06) 0%, transparent 60%), radial-gradient(ellipse 600px 600px at 90% 100%, rgba(10,132,255,0.05) 0%, transparent 55%)',
        }}
      />
      <Sidebar />
      <main className="ml-[var(--sidebar-w)] min-h-screen">
        <Header
          title={page.title}
          subtitle={page.subtitle}
          onNewClient={() => setAddClientOpen(true)}
          notifOpen={notifOpen}
          onNotifToggle={() => setNotifOpen(o => !o)}
          onNotifClose={() => setNotifOpen(false)}
        />
        <div className="px-[30px] pb-[44px] pt-[26px]">
          {children}
        </div>
      </main>
      <StatusBar />
      <CommandPalette />
      <AddClientModal open={addClientOpen} onClose={() => setAddClientOpen(false)} onSuccess={() => {}} />
    </div>
  );
}
