import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Clients from './pages/Clients';
import ActiveClients from './pages/ActiveClients';
import Revenue from './pages/Revenue';
import Payouts from './pages/Payouts';
import BalanceSheet from './pages/BalanceSheet';
import Trainers from './pages/Trainers';
import Analytics from './pages/Analytics';
import Schedule from './pages/Schedule';
import Forecast from './pages/Forecast';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/active" element={<ActiveClients />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/payouts" element={<Payouts />} />
        <Route path="/balance" element={<BalanceSheet />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/forecast" element={<Forecast />} />
      </Routes>
    </Layout>
  );
}
