import { useEffect, useState } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed bottom-0 right-0 z-40 flex h-[26px] items-center gap-5 px-[20px] text-[9.5px] font-medium text-[var(--text-tertiary)]"
      style={{
        left: 'var(--sidebar-w)',
        background: 'rgba(8,8,12,0.92)',
        borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center gap-[5px]">
        <div className="h-[5px] w-[5px] rounded-full" style={{ background: 'var(--green)', boxShadow: '0 0 5px rgba(48,209,88,0.5)' }} />
        System Online
      </div>
      <span>619 Fitness Studio · Lucknow</span>
      <span className="font-semibold">v3.0 Aurora</span>
      <span className="ml-auto font-mono-apple text-[10px]">{time}</span>
    </div>
  );
}
