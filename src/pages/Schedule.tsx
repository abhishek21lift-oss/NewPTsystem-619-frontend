import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { GlassCard, CardHeader, LoadingSpinner } from '../components/Charts';

export default function Schedule() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getTodaySessions(),
      api.getWeeklySummary(),
    ]).then(([s, w]) => {
      setSessions(s || []);
      setWeeklySummary(w || null);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const todaySessions = sessions.length > 0 ? sessions : defaultSessions;
  const week = weeklySummary?.daily_counts || [7, 6, 8, 3, 5, 4, 2];
  const maxWeek = Math.max(...week, 1);
  const colors = ['#5AC8F5', '#5AC8F5', '#5AC8F5', '#FF375F', 'var(--text-tertiary)', 'var(--text-tertiary)', 'var(--text-tertiary)'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      <GlassCard className="mb-[14px]">
        <CardHeader title="Session Activity Heatmap" subtitle="Last 90 days · hover cells for details"
          action={
            <div className="flex gap-[5px] items-center text-[10.5px] text-[var(--text-tertiary)]">
              Less <div className="h-[9px] w-[9px] rounded-[3px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-[9px] w-[9px] rounded-[3px]" style={{ background: 'rgba(255,55,95,0.25)' }} />
              <div className="h-[9px] w-[9px] rounded-[3px]" style={{ background: 'rgba(255,55,95,0.55)' }} />
              <div className="h-[9px] w-[9px] rounded-[3px]" style={{ background: '#FF375F' }} /> More
            </div>
          }
        />
        <div className="grid grid-cols-15 gap-[4px] p-5" style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}>
          {Array.from({ length: 90 }, (_, i) => {
            const day = (i + 4) % 7;
            const r = Math.random();
            const v = (day === 0 || day === 6)
              ? (r < 0.6 ? 0 : r < 0.85 ? 1 : 2)
              : (r < 0.1 ? 0 : r < 0.35 ? 1 : r < 0.62 ? 2 : r < 0.82 ? 3 : 4);
            const cols = ['rgba(255,255,255,0.05)', 'rgba(255,55,95,0.18)', 'rgba(255,55,95,0.38)', 'rgba(255,55,95,0.62)', '#FF375F'];
            const labels = ['No sessions', '1–2 sessions', '3–4 sessions', '5–6 sessions', '7+ sessions'];
            const base = new Date('2026-01-10');
            const d = new Date(base.getTime() + i * 86400000);
            const ds = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            return (
              <div key={i} className="aspect-square rounded-[4px] cursor-pointer transition-transform hover:scale-[1.3] relative group"
                style={{ background: cols[v] }}
                title={`${ds}: ${labels[v]}`}
              />
            );
          })}
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-[14px]">
        <GlassCard>
          <CardHeader title="Today's Schedule" subtitle={`April 10, 2026 · Thursday`} action={<div className="c-action">+ Session</div>} />
          <div className="flex flex-col gap-[7px] px-5 py-3">
            {todaySessions.map((s, i) => {
              const time = s.scheduled_at ? new Date(s.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : defaultTimes[i];
              const done = s.status === 'completed' || i < 3;
              const tagColor = done ? 'rgba(50,215,75,0.12)' : (s.status === 'no_show' ? 'rgba(255,55,95,0.12)' : 'rgba(10,132,255,0.12)');
              const tagText = done ? 'Done ✓' : s.status === 'no_show' ? 'No Show' : 'Upcoming';
              const tagTxtColor = done ? '#5FE87A' : s.status === 'no_show' ? '#FF7087' : '#5AC8F5';
              const dotColor = i === 0 || i === 1 ? '#32D74B' : i === 2 ? '#FF6B9D' : i === 3 || i === 7 ? '#FF375F' : i === 4 ? '#5AC8F5' : '#FF6B9D';
              const pkg = s.notes || defaultPackages[i];
              return (
                <div key={s.id || i} className={`flex items-center gap-[13px] p-3 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] transition-all hover:translate-x-[3px] hover:border-[var(--border-strong)] cursor-pointer ${done ? 'opacity-45' : ''}`}>
                  <div className="font-mono text-[11.5px] text-[var(--text-tertiary)] min-w-[54px]">{time}</div>
                  <div className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: dotColor }} />
                  <div className="flex-1">
                    <div className="text-[13px] font-bold">{s.clients?.full_name || defaultNames[i]}</div>
                    <div className="text-[10.5px] text-[var(--text-tertiary)]">{pkg}</div>
                  </div>
                  <div className="text-[10.5px] font-bold px-[9px] py-[2px] rounded-[8px]" style={{ background: tagColor, color: tagTxtColor }}>{tagText}</div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <CardHeader title="Weekly Summary" subtitle="Apr 7–13, 2026" />
          <div className="p-5">
            <div className="flex gap-[7px] items-end h-[88px] mb-[8px]">
              {week.map((v: number, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-[3px]">
                  <div className="text-[10px]" style={{ color: colors[i], fontWeight: i === 3 ? 800 : 400 }}>{v}</div>
                  <div className="w-full rounded-t-[3px]" style={{
                    height: `${(v / maxWeek) * 100}%`,
                    minHeight: 4,
                    background: colors[i],
                    opacity: i === 3 ? 1 : 0.55,
                    transition: 'height 0.8s',
                  }} />
                </div>
              ))}
            </div>
            <div className="flex justify-around mb-5 text-[10px] text-[var(--text-tertiary)]">
              {dayLabels.map((d, i) => (
                <span key={i} style={{ color: i === 3 ? '#5AC8F5' : '', fontWeight: i === 3 ? 700 : 400 }}>{d}</span>
              ))}
            </div>
            <div className="flex flex-col gap-[11px] border-t border-[var(--border)] pt-4">
              {[
                { label: 'Sessions Completed', val: '18 / 22', color: '#5FE87A' },
                { label: 'Revenue This Week', val: '₹44,000', color: '' },
                { label: 'Top Trainer', val: 'Abhishek (8)', color: '', isTag: true },
                { label: 'No-shows', val: '4', color: '#FFB340' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[12px] text-[var(--text-secondary)]">{r.label}</span>
                  {r.isTag ? (
                    <span className="tag tag-a">{r.val}</span>
                  ) : (
                    <span className="text-[14px] font-extrabold" style={{ color: r.color || 'var(--text-primary)' }}>{r.val}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-[14px] mt-[18px] pt-[14px] border-t border-[var(--border)]">
              {[
                { initials: 'AK', name: 'Abhishek', val: '8', color: '#FF375F', gradient: 'linear-gradient(145deg,#FF375F,#8B0022)', shadow: 'rgba(255,55,95,0.4)' },
                { initials: 'RS', name: 'Riya', val: '7', color: '#FF6B9D', gradient: 'linear-gradient(145deg,#FF6B9D,#C2185B)', shadow: 'rgba(255,107,157,0.4)' },
                { initials: 'RK', name: 'Rajat', val: '7', color: '#5AC8F5', gradient: 'linear-gradient(145deg,#5AC8F5,#0A84FF)', shadow: 'rgba(90,200,245,0.4)' },
              ].map((t, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-[11px] font-extrabold mx-auto mb-[5px]"
                    style={{ background: t.gradient, boxShadow: `0 3px 10px ${t.shadow}` }}
                  >{t.initials}</div>
                  <div className="text-[15px] font-extrabold" style={{ color: t.color }}>{t.val}</div>
                  <div className="text-[9.5px] text-[var(--text-tertiary)]">sessions</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

const defaultTimes = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '5:00 PM', '6:00 PM', '7:00 PM'];
const defaultNames = ['Rashi Bhatia', 'Vipul Bhatia', 'Neetu Singh', 'Ankush Thakur', 'Stuti Yadav', 'Vaibhav', 'Deepak Rathore', 'Rahul Rathore'];
const defaultPackages = [
  'Abhishek · 12-Month', 'Abhishek · 12-Month', 'Riya · 3-Month', 'Abhishek · 3-Month',
  'Rajat · 4-Month', 'Riya · 3-Month', 'Rajat · 3-Month', 'Abhishek · 3-Month',
];
const defaultSessions = defaultNames.map((name, i) => ({
  id: `s-${i}`,
  scheduled_at: new Date(`2026-04-10T${['07:00', '08:00', '09:00', '10:00', '11:00', '17:00', '18:00', '19:00'][i]}:00`).toISOString(),
  status: i < 3 ? 'completed' : 'scheduled',
  clients: { full_name: name },
  notes: defaultPackages[i],
}));
