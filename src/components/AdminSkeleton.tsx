"use client";

export function AdminSkeleton() {
  const bar = "animate-pulse rounded-2xl bg-paper-2";
  return (
    <div aria-hidden>
      <div className={`${bar} mt-6 h-28`} />
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${bar} h-24`} />
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className={`${bar} mt-4 h-32`} />
      ))}
    </div>
  );
}
