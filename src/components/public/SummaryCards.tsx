import { formatRupiah } from "@/lib/format";
import { DashboardSummary } from "@/lib/data";

interface SummaryCardsProps {
  summary: DashboardSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const complianceRate =
    summary.totalBlocks > 0
      ? Math.round((summary.paidCount / summary.totalBlocks) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Saldo Kas Kumulatif */}
      <div className="notion-card p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
            Total Saldo Kas
          </span>
          <span className="inline-flex h-2 w-2 rounded-full bg-[#0f7b34]" />
        </div>
        <div className="mt-1.5 text-2xl font-bold tabular-money tracking-tight text-[#191919]">
          {formatRupiah(summary.totalBalance)}
        </div>
        <p className="mt-1 text-[11px] text-[#9b9a97]">
          Akumulasi kas real-time
        </p>
      </div>

      {/* 2. Pemasukan Periode Ini */}
      <div className="notion-card p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
            Pemasukan Bulan Ini
          </span>
          <span className="text-[11px] font-medium text-[#0075de]">
            + Masuk
          </span>
        </div>
        <div className="mt-1.5 text-2xl font-bold tabular-money tracking-tight text-[#0075de]">
          {formatRupiah(summary.periodIncome)}
        </div>
        <p className="mt-1 text-[11px] text-[#9b9a97]">
          Iuran, Kas, Infaq & THR
        </p>
      </div>

      {/* 3. Pengeluaran Periode Ini */}
      <div className="notion-card p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
            Pengeluaran Bulan Ini
          </span>
          <span className="text-[11px] font-medium text-[#d95700]">
            - Keluar
          </span>
        </div>
        <div className="mt-1.5 text-2xl font-bold tabular-money tracking-tight text-[#d95700]">
          {formatRupiah(summary.periodExpense)}
        </div>
        <p className="mt-1 text-[11px] text-[#9b9a97]">
          {summary.expenses.length} transaksi tercatat
        </p>
      </div>

      {/* 4. Kepatuhan Warga */}
      <div className="notion-card p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
            Status Lunas
          </span>
          <span className="text-xs font-bold tabular-money text-[#37352f]">
            {complianceRate}%
          </span>
        </div>
        <div className="mt-1.5 text-2xl font-bold tabular-money tracking-tight text-[#191919]">
          {summary.paidCount} <span className="text-xs font-normal text-[#787774]">/ {summary.totalBlocks} Blok</span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 w-full rounded-full bg-[#f1f0ec]">
          <div
            className="h-1.5 rounded-full bg-[#0075de] transition-all duration-500"
            style={{ width: `${complianceRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
