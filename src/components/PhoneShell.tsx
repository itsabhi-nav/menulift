/** The phone frame used by the hero and the scroll-driven How it works. */
export function PhoneShell({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <div
      className={`relative mx-auto w-[292px] rounded-[46px] bg-phone p-[10px] shadow-[0_50px_100px_-25px_rgba(0,0,0,0.85)] ring-1 ring-white/15 sm:w-[316px] ${className}`}
      role="img"
      aria-label={label}
    >
      {/* side buttons */}
      <span className="absolute -left-[3px] top-28 h-10 w-[3px] rounded-l bg-ink-3" aria-hidden />
      <span className="absolute -left-[3px] top-44 h-16 w-[3px] rounded-l bg-ink-3" aria-hidden />
      <span className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-ink-3" aria-hidden />
      <div className="relative overflow-hidden rounded-[36px] bg-paper text-ink">
        <div className="relative z-10 flex items-center justify-between px-6 pt-4 text-[11px] font-semibold text-slate">
          <span>9:41</span>
          <span className="h-5 w-20 rounded-full bg-phone" aria-hidden />
          <span>4G</span>
        </div>
        {children}
        {/* glass reflection */}
        <div
          className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/25 via-transparent to-transparent opacity-40"
          aria-hidden
        />
      </div>
    </div>
  );
}
