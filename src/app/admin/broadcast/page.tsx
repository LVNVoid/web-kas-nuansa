import { getGetPeriodsUseCase, getGetDashboardSummaryUseCase } from "@/di/container";
import { BroadcastManager } from "@/presentation/components/admin/BroadcastManager";
import { PeriodData } from "@/presentation/components/admin/PaymentManager";

interface AdminBroadcastPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminBroadcastPage({
  searchParams,
}: AdminBroadcastPageProps) {
  const { period: periodParam } = await searchParams;

  const getPeriods = getGetPeriodsUseCase();
  const getDashboardSummary = getGetDashboardSummaryUseCase();

  // 1. Ambil semua periode
  const periods = await getPeriods.execute();

  // 2. Tentukan periode aktif
  let selectedPeriod = null;
  if (periodParam) {
    selectedPeriod = periods.find((p) => p.id === periodParam) || null;
  }
  if (!selectedPeriod && periods.length > 0) {
    selectedPeriod = periods[0];
  }

  // 3. Ambil dashboard data untuk kalkulasi teks rekap
  const summary = await getDashboardSummary.execute(selectedPeriod?.id);

  const periodDataList: PeriodData[] = periods.map((p) => ({
    id: p.id,
    month: p.month,
    year: p.year,
    name: p.name,
    hasThr: p.hasThr,
  }));

  const selectedPeriodData: PeriodData | null = selectedPeriod
    ? {
        id: selectedPeriod.id,
        month: selectedPeriod.month,
        year: selectedPeriod.year,
        name: selectedPeriod.name,
        hasThr: selectedPeriod.hasThr,
      }
    : null;

  return (
    <div>
      <BroadcastManager
        periods={periodDataList}
        selectedPeriod={selectedPeriodData}
        summary={summary}
      />
    </div>
  );
}
