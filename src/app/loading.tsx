export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#191919]">
      <header className="sticky top-0 z-40 w-full border-b border-[#eae9e5] bg-[#ffffff]/90 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#eae9e5] animate-pulse" />
            <div className="space-y-1">
              <div className="h-4 w-36 rounded bg-[#eae9e5] animate-pulse" />
              <div className="h-3 w-48 rounded bg-[#f1f0ec] animate-pulse" />
            </div>
          </div>
          <div className="h-7 w-24 rounded-lg bg-[#f1f0ec] animate-pulse" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        {/* Period Selector Skeleton */}
        <div className="flex justify-between items-center border-b border-[#eae9e5] pb-4">
          <div className="h-6 w-48 rounded bg-[#eae9e5] animate-pulse" />
          <div className="h-8 w-32 rounded-lg bg-[#eae9e5] animate-pulse" />
        </div>

        {/* 4 Cards Skeleton */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="notion-card p-5 space-y-2">
              <div className="h-3 w-24 rounded bg-[#f1f0ec] animate-pulse" />
              <div className="h-7 w-32 rounded bg-[#eae9e5] animate-pulse" />
              <div className="h-3 w-28 rounded bg-[#f1f0ec] animate-pulse" />
            </div>
          ))}
        </div>

        {/* Matrix Grid Skeleton */}
        <div className="notion-card p-5 space-y-4">
          <div className="h-4 w-44 rounded bg-[#eae9e5] animate-pulse" />
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {Array.from({ length: 24 }).map((_, idx) => (
              <div
                key={idx}
                className="h-20 rounded-xl border border-[#eae9e5] bg-[#fbfbfa] animate-pulse"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
