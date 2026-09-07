export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <div className="h-6 w-48 rounded bg-[#eae9e5]" />
          <div className="h-3 w-64 rounded bg-[#f1f0ec]" />
        </div>
        <div className="h-8 w-32 rounded-lg bg-[#eae9e5]" />
      </div>

      <div className="notion-card p-6 space-y-4">
        <div className="h-8 w-full max-w-xs rounded-lg bg-[#f1f0ec]" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-full rounded-md bg-[#fbfbfa] border border-[#f1f0ec]" />
          ))}
        </div>
      </div>
    </div>
  );
}
