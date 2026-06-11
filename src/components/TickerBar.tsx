const tickerItems = [
  { color: '#30D158', text: 'Total Revenue ₹9,16,000' },
  { color: '#0A84FF', text: 'Active Clients: 23' },
  { color: '#FF9F0A', text: 'Pending Dues ₹1,57,000' },
  { color: '#FF375F', text: 'Abhishek — 8 active clients this month' },
  { color: '#FF6B9D', text: 'Riya Singh — ₹56,333 April revenue' },
  { color: '#5AC8FA', text: 'Rajat Katiyar — 7 active clients' },
  { color: '#BF5AF2', text: 'Studio peak: ₹2,10,500 in Mar 2026' },
  { color: '#FFD60A', text: 'Abhishek — 640kg competition total 🥈 Silver' },
  { color: '#30D158', text: 'Rashi Bhatia — 12-Month package active' },
  { color: '#0A84FF', text: '67 total clients enrolled all-time' },
  { color: '#FF9F0A', text: 'Jay Singh expiring in 7 days — follow up!' },
  { color: '#FF375F', text: '4 expired clients with outstanding dues ₹48,000' },
];

export default function TickerBar() {
  const items = [...tickerItems, ...tickerItems];

  return (
    <div
      className="flex h-[34px] items-center overflow-hidden border-b border-[var(--border)]"
      style={{
        background: 'linear-gradient(90deg, rgba(255,55,95,0.08), rgba(10,132,255,0.05), rgba(48,209,88,0.05), rgba(255,159,10,0.06))',
      }}
    >
      <div className="relative z-[3] shrink-0 whitespace-nowrap px-[14px] text-[10px] font-extrabold uppercase tracking-[1px]"
        style={{ color: 'var(--red-light)' }}
      >
        LIVE
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex animate-ticker-scroll gap-0 hover:[animation-play-state:paused]">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-[6px] whitespace-nowrap border-r border-[rgba(255,255,255,0.06)] px-[22px] text-[11px] font-semibold"
            >
              <span
                className="h-[6px] w-[6px] shrink-0 rounded-full"
                style={{ background: item.color, boxShadow: `0 0 5px ${item.color}` }}
              />
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
