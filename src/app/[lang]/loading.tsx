export default function Loading() {
  return (
    <div className="min-h-[70vh] bg-paper" aria-label="Loading page">
      <div className="mx-auto max-w-[1360px] px-4 py-12 sm:px-8 sm:py-28">
        <div className="h-3 w-28 animate-pulse rounded-full bg-line" />
        <div className="mt-5 h-14 max-w-2xl animate-pulse rounded-2xl bg-line" />
        <div className="mt-4 h-14 max-w-xl animate-pulse rounded-2xl bg-line" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-52 animate-pulse rounded-3xl bg-paper-2" />
          ))}
        </div>
      </div>
    </div>
  );
}
