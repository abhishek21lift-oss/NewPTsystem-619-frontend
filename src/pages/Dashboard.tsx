import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import type { DashboardData } from '../types';
import TickerBar from '../components/TickerBar';
import {
  AlertTriangle, TrendingUp, Users, DollarSign, Wallet,
  CheckCircle, Clock, Target, Activity,
} from 'lucide-react';

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

function KpiCard({ label, value, sub, color, icon: Icon, children, onClick }: {
  label: string; value: string; sub: string; color: string; icon: any; children?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4,0,0.2,1] }}
      className="relative cursor-default overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-250 hover:-translate-y-[2px] hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]"
      style={{ boxShadow: 'none' }}
      onClick={onClick}
    >
      <div className="absolute -right-[30px] -top-[30px] h-[100px] w-[100px] rounded-full opacity-[0.06] blur-[20px]"
        style={{ background: color }}
      />
      <div className="relative z-[1]">
        <div className="mb-[10px] flex items-start justify-between">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px]"
            style={{ background: `${color}20` }}
          >
            <Icon size={18} style={{ color }} />
          </div>
          {children}
        </div>
        <div className="mb-[5px] text-[10.5px] font-semibold uppercase tracking-[0.7px] text-[var(--text-tertiary)]">
          {label}
        </div>
        <div className="mb-[9px] text-[28px] font-extrabold tracking-tight leading-none">
          {value}
        </div>
        <div className="text-[11px] text-[var(--text-tertiary)]">{sub}</div>
      </div>
    </motion.div>
  );
}

function Sparkline() {
  const heights = [20, 35, 50, 65, 85, 100, 80];
  return (
    <div className="flex h-[28px] items-end gap-[2px]">
      {heights.map((h, i) => (
        <div key={i} className="flex-1 rounded-t-[2px] transition-all duration-200"
          style={{
            height: `${h}%`,
            minHeight: 3,
            background: i >= 4 ? 'var(--green)' : i >= 2 ? 'var(--blue)' : 'rgba(255,255,255,0.15)',
            opacity: i >= 2 ? (i >= 4 ? 1 : 0.7) : 1,
          }}
        />
      ))}
    </div>
  );
}

function RingChart({ pct, color }: { pct: number; color: string }) {
  const circumference = 169.6;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative h-[64px] w-[64px] shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
        <circle className="fill-none" cx="32" cy="32" r="27" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle className="fill-none stroke-linecap-round" cx="32" cy="32" r="27"
          stroke={color} strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[14px] font-extrabold leading-none" style={{ color }}>{pct}%</div>
        <div className="mt-[1px] text-[8.5px] font-semibold text-[var(--text-tertiary)]">of goal</div>
      </div>
    </div>
  );
}

function DonutChart({ segments, centerVal, centerLabel }: {
  segments: { value: number; color: string; label: string }[];
  centerVal: string; centerLabel: string;
}) {
  const total = segments.reduce((s, s_) => s + s_.value, 0);
  let startAngle = -Math.PI / 2;
  const outerR = 58;
  const innerR = 38;

  const renderSegments = () => {
    const paths: React.ReactNode[] = [];
    segments.forEach((seg, idx) => {
      const angle = (seg.value / total) * Math.PI * 2;
      const endAngle = startAngle + angle;

      const x1 = 70 + Math.cos(startAngle) * outerR;
      const y1 = 70 + Math.sin(startAngle) * outerR;
      const x2 = 70 + Math.cos(endAngle) * outerR;
      const y2 = 70 + Math.sin(endAngle) * outerR;

      const ix1 = 70 + Math.cos(startAngle) * innerR;
      const iy1 = 70 + Math.sin(startAngle) * innerR;
      const ix2 = 70 + Math.cos(endAngle) * innerR;
      const iy2 = 70 + Math.sin(endAngle) * innerR;

      const largeArc = angle > Math.PI ? 1 : 0;

      const d = [
        `M ${x1} ${y1}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${ix2} ${iy2}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}`,
        'Z',
      ].join(' ');

      paths.push(
        <path key={idx} d={d} fill={seg.color} stroke="rgba(10,10,11,0.8)" strokeWidth="1.5" />
      );

      startAngle = endAngle;
    });
    return paths;
  };

  return (
    <div className="relative mx-auto h-[140px] w-[140px]">
      <svg className="h-full w-full" viewBox="0 0 140 140">
        {renderSegments()}
        <circle cx="70" cy="70" r={innerR} fill="#0A0A0B" />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[22px] font-extrabold tracking-tight leading-none">{centerVal}</div>
        <div className="mt-[2px] text-[10px] font-medium text-[var(--text-tertiary)]">{centerLabel}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--red)] border-t-transparent" />
      </div>
    );
  }

  const stats = data?.stats || {
    total_clients: 67, active_enrollments: 23, expired_enrollments: 43, soon_enrollments: 1, total_revenue: 916000,
  };
  const activities = data?.recent_activities || [];

  return (
    <div>
      <TickerBar />

      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-[18px] flex items-center gap-3 rounded-[16px] border border-[rgba(255,159,10,0.2)] p-3 text-[12.5px]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,159,10,0.1), rgba(255,159,10,0.05))',
          color: 'var(--orange)',
        }}
      >
        <AlertTriangle size={18} />
        <span><strong>4 expired clients</strong> still have outstanding balances totalling <strong>₹48,000</strong> — follow up needed.</span>
        <span className="ml-auto cursor-pointer text-[11px] opacity-70 hover:opacity-100">View Details →</span>
      </motion.div>

      {/* Spotlight Strip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative mb-[16px] overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.1)] p-7"
        style={{
          background: 'linear-gradient(135deg, rgba(255,59,48,0.1), rgba(10,132,255,0.06))',
        }}
      >
        <div className="absolute -right-[60px] -top-[60px] h-[200px] w-[200px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,59,48,0.12) 0%, transparent 70%)' }}
        />
        <div className="relative z-[1] mb-[18px] text-[11px] font-bold uppercase tracking-[0.8px] text-[var(--text-tertiary)]">
          Studio · All-Time Performance
        </div>
        <div className="grid grid-cols-5 gap-0">
          {[
            { label: 'Total Revenue', val: fmt(916000), color: 'var(--green)', sub: 'Apr 2025 – Now' },
            { label: 'Active Clients', val: '23', color: 'var(--blue)', sub: '3 trainers' },
            { label: 'Total Enrolled', val: '67', color: '', sub: 'All time' },
            { label: 'Pending Dues', val: fmt(157000), color: 'var(--orange)', sub: '12 clients' },
            { label: 'Commission Pool', val: fmt(458000), color: 'var(--purple)', sub: '50% split' },
          ].map((item, i) => (
            <div key={i} className="border-r border-[var(--border)] px-5 first:pl-0 last:border-r-0">
              <div className="mb-[6px] text-[10px] font-semibold uppercase tracking-[0.6px] text-[var(--text-tertiary)]">{item.label}</div>
              <div className="text-[22px] font-extrabold tracking-tight" style={{ color: item.color || 'var(--text-primary)' }}>
                {item.val}
              </div>
              <div className="mt-[3px] text-[10.5px] text-[var(--text-tertiary)]">{item.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="mb-[22px] grid grid-cols-4 gap-[14px]">
        <KpiCard
          label="Total Revenue" value={fmt(stats.total_revenue)} sub="All trainers · All time" color="#FF3B30"
          icon={DollarSign} onClick={() => {}}>
          <Sparkline />
        </KpiCard>
        <KpiCard
          label="Active Clients" value={String(stats.active_enrollments)} sub="↑ +3 this month" color="#30D158"
          icon={CheckCircle}>
          <RingChart pct={77} color="#30D158" />
        </KpiCard>
        <KpiCard
          label="Total Enrollments" value={String(stats.total_clients)} sub="Unique clients in system" color="#0A84FF"
          icon={Users}>
          <Sparkline />
        </KpiCard>
        <KpiCard
          label="Pending Dues" value={fmt(157000)} sub="12 clients" color="#FF9F0A"
          icon={Wallet}>
          <RingChart pct={35} color="#FF9F0A" />
        </KpiCard>
      </div>

      {/* 3D Donut Charts */}
      <div className="mb-[16px] grid grid-cols-3 gap-[16px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-4 rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-[22px] transition-all duration-250 hover:-translate-y-[3px] hover:border-[rgba(255,255,255,0.12)]"
          style={{ boxShadow: 'none' }}
        >
          <div className="text-center">
            <div className="text-[13px] font-bold tracking-tight">Client Status Breakdown</div>
            <div className="text-[10.5px] text-[var(--text-tertiary)]">Active vs Expired vs Expiring Soon</div>
          </div>
          <DonutChart
            segments={[
              { value: 23, color: '#30D158', label: 'Active' },
              { value: 43, color: '#3A3A3C', label: 'Expired' },
              { value: 1, color: '#FF9F0A', label: 'Expiring Soon' },
            ]}
            centerVal="23" centerLabel="Active"
          />
          <div className="flex w-full flex-col gap-[7px]">
            <div className="flex items-center gap-2 text-[11.5px]">
              <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#30D158' }} />
              <span className="flex-1 text-[var(--text-secondary)] font-medium">Active</span>
              <span className="text-[12px] font-bold text-[#30D158]">23</span>
            </div>
            <div className="flex items-center gap-2 text-[11.5px]">
              <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
              <span className="flex-1 text-[var(--text-secondary)] font-medium">Expired</span>
              <span className="text-[12px] font-bold">43</span>
            </div>
            <div className="flex items-center gap-2 text-[11.5px]">
              <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF9F0A' }} />
              <span className="flex-1 text-[var(--text-secondary)] font-medium">Expiring Soon</span>
              <span className="text-[12px] font-bold text-[#FF9F0A]">1</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18 }}
          className="flex flex-col items-center gap-4 rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-[22px] transition-all duration-250 hover:-translate-y-[3px] hover:border-[rgba(255,255,255,0.12)]"
        >
          <div className="text-center">
            <div className="text-[13px] font-bold tracking-tight">Trainer Client Share</div>
            <div className="text-[10.5px] text-[var(--text-tertiary)]">Active clients by trainer</div>
          </div>
          <DonutChart
            segments={[
              { value: 8, color: '#FF3B30', label: 'Abhishek' },
              { value: 7, color: '#FF6B9D', label: 'Riya' },
              { value: 7, color: '#5AC8FA', label: 'Rajat' },
            ]}
            centerVal="22" centerLabel="This Month"
          />
          <div className="flex w-full flex-col gap-[7px]">
            <div className="flex items-center gap-2 text-[11.5px]">
              <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF3B30' }} />
              <span className="flex-1 text-[var(--text-secondary)] font-medium">Abhishek</span>
              <span className="text-[12px] font-bold text-[#FF3B30]">8</span>
            </div>
            <div className="flex items-center gap-2 text-[11.5px]">
              <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF6B9D' }} />
              <span className="flex-1 text-[var(--text-secondary)] font-medium">Riya</span>
              <span className="text-[12px] font-bold text-[#FF6B9D]">7</span>
            </div>
            <div className="flex items-center gap-2 text-[11.5px]">
              <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#5AC8FA' }} />
              <span className="flex-1 text-[var(--text-secondary)] font-medium">Rajat</span>
              <span className="text-[12px] font-bold text-[#5AC8FA]">7</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.26 }}
          className="flex flex-col items-center gap-4 rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-[22px] transition-all duration-250 hover:-translate-y-[3px] hover:border-[rgba(255,255,255,0.12)]"
        >
          <div className="text-center">
            <div className="text-[13px] font-bold tracking-tight">Package Distribution</div>
            <div className="text-[10.5px] text-[var(--text-tertiary)]">Enrollment count by package type</div>
          </div>
          <DonutChart
            segments={[
              { value: 46, color: '#FF3B30', label: '1 Month' },
              { value: 55, color: '#FF9F0A', label: '3 Months' },
              { value: 7, color: '#0A84FF', label: '4 Months' },
              { value: 7, color: '#BF5AF2', label: '12 Months+' },
            ]}
            centerVal="115" centerLabel="Total Pkgs"
          />
          <div className="flex w-full flex-col gap-[7px]">
            <div className="flex items-center gap-2 text-[11.5px]">
              <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF3B30' }} />
              <span className="flex-1 text-[var(--text-secondary)] font-medium">1 Month</span>
              <span className="text-[12px] font-bold text-[#FF3B30]">46</span>
            </div>
            <div className="flex items-center gap-2 text-[11.5px]">
              <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#FF9F0A' }} />
              <span className="flex-1 text-[var(--text-secondary)] font-medium">3 Months</span>
              <span className="text-[12px] font-bold text-[#FF9F0A]">55</span>
            </div>
            <div className="flex items-center gap-2 text-[11.5px]">
              <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#0A84FF' }} />
              <span className="flex-1 text-[var(--text-secondary)] font-medium">4 Months</span>
              <span className="text-[12px] font-bold text-[#0A84FF]">7</span>
            </div>
            <div className="flex items-center gap-2 text-[11.5px]">
              <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: '#BF5AF2' }} />
              <span className="flex-1 text-[var(--text-secondary)] font-medium">12 Months+</span>
              <span className="text-[12px] font-bold text-[#BF5AF2]">7</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Two Column: Revenue Chart + Activity */}
      <div className="mb-[16px] grid grid-cols-2 gap-[16px]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[10px]"
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-[22px] py-[14px]">
            <div>
              <div className="text-[14px] font-bold tracking-tight">Monthly Revenue Trend</div>
              <div className="mt-[2px] text-[11px] text-[var(--text-tertiary)]">Total studio revenue (May 2025 – Jul 2026)</div>
            </div>
            <div className="cursor-pointer rounded-[10px] border border-[rgba(255,59,48,0.2)] bg-[var(--red-muted)] px-[11px] py-[5px] text-[11px] font-semibold text-[var(--red-light)] transition-all hover:bg-[rgba(255,59,48,0.18)]">
              All Trainers
            </div>
          </div>
          <div className="h-[210px] px-[22px] py-[18px]">
            <RevenueChart />
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-[var(--border)] px-[22px] py-[16px]">
            <div className="text-center">
              <div className="text-[18px] font-extrabold tracking-tight text-[var(--green)]">₹2.10L</div>
              <div className="mt-[2px] text-[10px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Peak Month</div>
            </div>
            <div className="text-center">
              <div className="text-[18px] font-extrabold tracking-tight text-[var(--blue)]">Feb '26</div>
              <div className="mt-[2px] text-[10px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">Best Month</div>
            </div>
            <div className="text-center">
              <div className="text-[18px] font-extrabold tracking-tight text-[var(--orange)]">₹9.16L</div>
              <div className="mt-[2px] text-[10px] uppercase tracking-[0.5px] text-[var(--text-tertiary)]">All-Time Total</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[10px]"
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-[22px] py-[14px]">
            <div>
              <div className="text-[14px] font-bold tracking-tight">Recent Activity</div>
              <div className="mt-[2px] text-[11px] text-[var(--text-tertiary)]">Latest updates from your studio</div>
            </div>
            <div className="cursor-pointer rounded-[10px] border border-[rgba(255,59,48,0.2)] bg-[var(--red-muted)] px-[11px] py-[5px] text-[11px] font-semibold text-[var(--red-light)] transition-all hover:bg-[rgba(255,59,48,0.18)]">
              View All
            </div>
          </div>
          <div className="flex flex-col px-[22px] py-[12px]">
            {(activities.length > 0 ? activities : [
              { action: 'enrolled', description: 'Renuka started a new 1-Month package with Abhishek', icon: '🏋️', color: 'var(--green-muted)', created_at: 'Today · 10 Apr 2026' },
              { action: 'enrolled', description: 'Tarang Gupta enrolled in 3-Month package with Riya', icon: '🏋️', color: 'var(--green-muted)', created_at: 'Today · 10 Apr 2026' },
              { action: 'expiring', description: 'Jay Singh subscription expiring in 7 days', icon: '⏰', color: 'var(--orange-muted)', created_at: 'Follow up required' },
              { action: 'payment', description: 'Vaibhav has pending balance of ₹20,000', icon: '💸', color: 'var(--red-muted)', created_at: '3 Months package · Riya' },
              { action: 'achievement', description: 'Abhishek won Silver at UP State Powerlifting Championship', icon: '🥈', color: 'var(--blue-muted)', created_at: '83kg Senior Category · 650kg total' },
            ]).map((act, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-[rgba(255,255,255,0.04)] py-[10px] last:border-b-0">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] text-[13px]"
                  style={{ background: act.color || 'var(--blue-muted)' }}
                >
                  {act.icon || '📌'}
                </div>
                <div className="flex-1">
                  <div className="text-[12.5px] font-medium leading-[1.5]" dangerouslySetInnerHTML={{
                    __html: (act.description || '').replace(
                      /(₹[\d,]+)/g, '<strong style="color:var(--orange)">$1</strong>'
                    ).replace(
                      /(\d+-Month|\d+ Month)/g, '<strong>$1</strong>'
                    ),
                  }} />
                  <div className="mt-[2px] text-[10.5px] text-[var(--text-tertiary)]">{act.created_at}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trainer Cards */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-[16px] rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[10px]"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-[22px] py-[14px]">
          <div>
            <div className="text-[14px] font-bold tracking-tight">April 2026 — Monthly Snapshot</div>
            <div className="mt-[2px] text-[11px] text-[var(--text-tertiary)]">Current active payout month performance</div>
          </div>
          <div className="text-[11px] text-[var(--text-tertiary)]">
            Total This Month: <span className="font-bold text-[var(--green)]">₹1,76,166</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-[14px] px-[22px] py-[18px]">
          {[
            { initials: 'AK', name: 'Abhishek Katiyar', role: 'Head Trainer · K11 Certified', color: 'linear-gradient(145deg, #FF3B30, #8B0000)', clients: 8, pct: 49, revenue: 64500, commission: 32250, alltime: 388000 },
            { initials: 'RS', name: 'Riya Singh', role: "Personal Trainer · Women's Specialist", color: 'linear-gradient(145deg, #FF6B9D, #D63060)', clients: 7, pct: 43, revenue: 56333, commission: 28167, alltime: 292000 },
            { initials: 'RK', name: 'Rajat Katiyar', role: 'Personal Trainer · Strength Coach', color: 'linear-gradient(145deg, #5AC8FA, #0A84FF)', clients: 7, pct: 42, revenue: 55333, commission: 27667, alltime: 236000 },
          ].map((t, i) => (
            <div key={i} className="relative overflow-hidden rounded-[16px] border border-[var(--border)] bg-[rgba(255,255,255,0.04)] p-5 transition-all duration-250 hover:-translate-y-[2px] hover:border-[var(--border-strong)]"
              style={{ boxShadow: 'none' }}
            >
              <div className="relative mb-[13px] flex h-[46px] w-[46px] items-center justify-center rounded-full text-[15px] font-extrabold"
                style={{ background: t.color, boxShadow: `0 4px 16px ${t.color.includes('FF3B30') ? 'rgba(255,59,48,0.35)' : t.color.includes('FF6B9D') ? 'rgba(255,107,157,0.35)' : 'rgba(90,200,250,0.35)'}` }}
              >
                {t.initials}
                <div className="absolute inset-[-2px] rounded-full opacity-30 blur-[8px]" style={{ background: 'inherit' }} />
              </div>
              <div className="mb-[2px] text-[14px] font-bold tracking-tight">{t.name}</div>
              <div className="mb-[16px] text-[10.5px] text-[var(--text-tertiary)]">{t.role}</div>
              <div className="flex flex-col gap-[9px]">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--text-secondary)]">Active Clients</span>
                  <span className="font-bold">{t.clients} clients</span>
                </div>
                <div className="h-[4px] rounded-[2px] bg-[rgba(255,255,255,0.07)]">
                  <div className="h-full rounded-[2px] transition-all duration-1000" style={{ width: `${t.pct}%`, background: i === 2 ? 'linear-gradient(90deg, #5AC8FA, #0A84FF)' : 'var(--red)' }} />
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--text-secondary)]">Monthly Revenue</span>
                  <span className="font-bold text-[var(--green)]">{fmt(t.revenue)}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--text-secondary)]">Commission (50%)</span>
                  <span className="font-bold text-[var(--orange)]">{fmt(t.commission)}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[var(--text-secondary)]">All-Time Revenue</span>
                  <span className="font-bold text-[var(--blue)]">{fmt(t.alltime)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Monthly Goals */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mb-[16px] rounded-[22px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)] p-5"
      >
        <div className="mb-[18px] flex items-center justify-between">
          <div className="text-[14px] font-bold tracking-tight">🎯 Monthly Goals — April 2026</div>
          <div className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-[10px] py-[4px] text-[11px] text-[var(--text-tertiary)]">Month 13 of 21</div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Revenue Target', current: '₹1.76L', target: '₹2L', pct: 88, color: 'var(--green)', fill: 'linear-gradient(90deg, var(--green), #34D15A)' },
            { label: 'Active Clients', current: '23', target: '30', pct: 77, color: 'var(--blue)', fill: 'linear-gradient(90deg, var(--blue), #5AC8FA)' },
            { label: 'Dues Collected', current: '₹1.09L', target: '₹1.57L', pct: 69, color: 'var(--orange)', fill: 'linear-gradient(90deg, var(--orange), #FFB830)' },
            { label: 'New Enrollments', current: '3', target: '8', pct: 37, color: 'var(--purple)', fill: 'linear-gradient(90deg, var(--purple), #D066FF)' },
          ].map((g, i) => (
            <div key={i} className="rounded-[16px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-[16px] py-[14px]">
              <div className="mb-[10px] text-[10.5px] font-semibold uppercase tracking-[0.5px] text-[var(--text-tertiary)]">{g.label}</div>
              <div className="flex items-baseline justify-between">
                <div className="text-[16px] font-extrabold" style={{ color: g.color }}>{g.current}</div>
                <div className="text-[10.5px] text-[var(--text-tertiary)]">/ {g.target}</div>
              </div>
              <div className="my-[8px] h-[5px] rounded-[3px] bg-[rgba(255,255,255,0.06)]">
                <div className="h-full rounded-[3px] transition-all duration-1200" style={{ width: `${g.pct}%`, background: g.fill }} />
              </div>
              <div className="mt-[2px] text-[11px] font-bold" style={{ color: g.color }}>{g.pct}% achieved</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function RevenueChart() {
  const months = [
    { m: 'May', rev: 7000 }, { m: 'Jun', rev: 77333 }, { m: 'Jul', rev: 78667 },
    { m: 'Aug', rev: 79667 }, { m: 'Sep', rev: 152000 }, { m: 'Oct', rev: 176667 },
    { m: 'Nov', rev: 204333 }, { m: 'Dec', rev: 201333 }, { m: 'Jan', rev: 202500 },
    { m: 'Feb', rev: 209167 }, { m: 'Mar', rev: 210500 }, { m: 'Apr', rev: 176167 },
    { m: 'May', rev: 100500 }, { m: 'Jun', rev: 53833 }, { m: 'Jul', rev: 10833 },
  ];
  const maxV = Math.max(...months.map(d => d.rev));
  const W = 600, H = 170, padL = 4, padR = 4, padT = 12, padB = 32;
  const w = W - padL - padR;
  const h = H - padT - padB;

  const pts = months.map((d, i) => ({
    x: padL + (i / (months.length - 1)) * w,
    y: padT + h - (d.rev / maxV) * h,
    rev: d.rev, m: d.m,
  }));

  function smooth(points: typeof pts) {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const cp1x = points[i].x + (points[i + 1].x - points[i].x) * 0.4;
      const cp1y = points[i].y;
      const cp2x = points[i].x + (points[i + 1].x - points[i].x) * 0.6;
      const cp2y = points[i + 1].y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i + 1].x} ${points[i + 1].y}`;
    }
    return d;
  }

  const linePath = smooth(pts);
  const last = pts[pts.length - 1];
  const areaPath = `${linePath} L ${last.x} ${padT + h} L ${pts[0].x} ${padT + h} Z`;

  return (
    <svg className="h-full w-full overflow-visible" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#FF3B30" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#FF3B30" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {[0.25, 0.5, 0.75, 1].map(r => {
        const y = padT + h - r * h;
        const val = Math.round(maxV * r);
        return (
          <g key={r}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3,4" />
            <text x={padL + 2} y={y - 3} fill="rgba(255,255,255,0.2)" fontSize="8.5" fontFamily="DM Mono, monospace">
              ₹{val > 999 ? (val / 1000).toFixed(0) + 'K' : val}
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="rgba(255,59,48,0.2)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linePath} fill="none" stroke="#FF3B30" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)" />
      {pts.map((p, i) => {
        const isHL = p.rev > 150000;
        if (!isHL && i % 3 !== 0) return null;
        return (
          <circle key={i} cx={p.x} cy={p.y} r={isHL ? 4.5 : 3}
            fill={isHL ? '#FF3B30' : 'rgba(255,255,255,0.3)'}
            stroke={isHL ? 'rgba(255,59,48,0.3)' : 'transparent'}
            strokeWidth={isHL ? 4 : 0}
          />
        );
      })}
      {pts.map((p, i) => {
        if (i % 4 !== 0) return null;
        return (
          <text key={i} x={p.x} y={padT + h + 20}
            fill="rgba(255,255,255,0.28)" fontSize="8.5" fontFamily="Plus Jakarta Sans"
            textAnchor="middle" fontWeight="500"
          >
            {p.m}
          </text>
        );
      })}
    </svg>
  );
}
