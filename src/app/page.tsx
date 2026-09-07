import { Navbar } from "@/presentation/components/public/Navbar";
import { SummaryCards } from "@/presentation/components/public/SummaryCards";
import { PeriodSelector } from "@/presentation/components/public/PeriodSelector";
import { BlockGrid } from "@/presentation/components/public/BlockGrid";
import { ExpenseList } from "@/presentation/components/public/ExpenseList";
import { getGetPeriodsUseCase, getGetDashboardSummaryUseCase } from "@/di/container";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { period } = await searchParams;
  const getPeriods = getGetPeriodsUseCase();
  const getDashboardSummary = getGetDashboardSummaryUseCase();

  const periods = await getPeriods.execute();
  const summary = await getDashboardSummary.execute(period);

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#191919]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="space-y-6">
          {/* Period Selector */}
          <PeriodSelector
            periods={periods}
            currentPeriodId={summary.period?.id}
          />

          {/* Metric Summary Cards */}
          <SummaryCards summary={summary} />

          {/* Resident Block Matrix */}
          <BlockGrid
            blocks={summary.blocks}
            periodName={summary.period?.name}
          />

          {/* Expense Breakdown */}
          <ExpenseList
            expenses={summary.expenses}
            totalExpense={summary.periodExpense}
          />
        </div>
      </main>

      <footer className="mt-16 border-t border-[#eae9e5] bg-[#ffffff] py-6 text-center text-xs text-[#787774]">
        <p>Kas & Iuran Warga RT.02 / RW.11 • Sistem Informasi & Transparansi Keuangan Lingkungan</p>
      </footer>
    </div>
  );
}
