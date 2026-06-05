import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center py-20 text-[var(--text-tertiary)]">
      <div className="text-center">
        <div className="text-[24px] font-bold" style={{ color: 'var(--text-secondary)' }}>{title}</div>
        <div className="mt-2 text-[13px]">Coming soon with full data integration</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<PlaceholderPage title="All Clients" />} />
        <Route path="/active" element={<PlaceholderPage title="Active Clients" />} />
        <Route path="/revenue" element={<PlaceholderPage title="Revenue Analysis" />} />
        <Route path="/payouts" element={<PlaceholderPage title="Trainer Payouts" />} />
        <Route path="/balance" element={<PlaceholderPage title="Balance Sheet" />} />
        <Route path="/trainers" element={<PlaceholderPage title="Trainer Performance" />} />
        <Route path="/analytics" element={<PlaceholderPage title="Studio Analytics" />} />
        <Route path="/schedule" element={<PlaceholderPage title="Schedule & Sessions" />} />
        <Route path="/forecast" element={<PlaceholderPage title="Revenue Forecast" />} />
      </Routes>
    </Layout>
  );
}
