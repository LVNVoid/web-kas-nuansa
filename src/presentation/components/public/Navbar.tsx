import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#eae9e5] bg-[#ffffff]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0075de] text-white font-bold text-xs shadow-xs transition hover:bg-[#005bab]">
            NA
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-[#191919] sm:text-base">
              Nuansa Asri
            </h1>
            <p className="text-[11px] text-[#787774]">
              Laporan Keuangan & Iuran Warga RT 02 - RW 11
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-[#fbfbfa] border border-[#eae9e5] px-3.5 py-1.5 text-xs font-semibold text-[#37352f] transition hover:bg-[#eae9e5] hover:text-[#191919] active:scale-[0.98]"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </header>
  );
}
