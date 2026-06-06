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
      className="fixed bottom-0 right-0 z-40 flex h-[26px] items-center gap-5 px-[20px] text-[10px] font-medium text-[var(--text-tertiary)]"
      style={{
        left: 'var(--sidebar-w)',
        background: 'rgba(10,10,11,0.92)',
        borderTop: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center gap-[5px]">
        <div className="h-[5px] w-[5px] rounded-full bg-[var(--green)]" style={{ boxShadow: '0 0 4px var(--green)' }} />
        System Online
      </div>
      <span>619 Fitness Studio · Lucknow</span>
      <span>v3.0 Aurora Premium</span>
      <span className="ml-auto">{time}</span>
    </div>
  );
}
