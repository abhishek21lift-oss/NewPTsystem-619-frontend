import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import StatusBar from './StatusBar';

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard Overview', subtitle: '619 Fitness Studio · Jaipur' },
  '/clients': { title: 'All Clients', subtitle: '67 unique clients · Latest package per client shown' },
  '/active': { title: 'Active Clients', subtitle: '23 clients currently active' },
  '/revenue': { title: 'Revenue Analysis', subtitle: 'Total studio earnings per month' },
  '/payouts': { title: 'Trainer Payouts', subtitle: '50% commission split' },
  '/balance': { title: 'Balance Sheet', subtitle: 'Outstanding payment records' },
  '/trainers': { title: 'Trainer Performance', subtitle: 'Leaderboard & stats' },
  '/analytics': { title: 'Studio Analytics', subtitle: 'AI-powered insights' },
  '/schedule': { title: 'Schedule & Sessions', subtitle: 'April 10, 2026 · Thursday' },
  '/forecast': { title: 'Revenue Forecast', subtitle: '6-month projection' },
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const page = titles[location.pathname] || titles['/'];

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
        <Header title={page.title} subtitle={page.subtitle} />
        <div className="px-[30px] pb-[44px] pt-[26px]">
          {children}
        </div>
      </main>
      <StatusBar />
    </div>
  );
}
