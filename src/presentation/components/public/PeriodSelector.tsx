"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Period } from "@/core/entities/period.entity";

interface PeriodSelectorProps {
  periods: Period[];
  currentPeriodId?: string;
}

export function PeriodSelector({ periods, currentPeriodId }: PeriodSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (periods.length === 0) return null;

  const handlePeriodChange = (periodId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (periodId) {
      params.set("period", periodId);
    } else {
      params.delete("period");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#eae9e5] pb-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-[#191919] sm:text-xl">
          Laporan Rekap Bulanan
        </h2>
        <p className="text-xs text-[#787774]">
          Pilih periode pembukuan untuk melihat detail transaksi dan matriks iuran
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="period-select" className="text-xs font-semibold text-[#787774]">
          Periode:
        </label>
        <select
          id="period-select"
          value={currentPeriodId || periods[0]?.id || ""}
          onChange={(e) => handlePeriodChange(e.target.value)}
          className="rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-1.5 text-xs font-semibold text-[#191919] shadow-xs outline-none transition focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
        >
          {periods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} {p.hasThr ? "(+THR)" : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
