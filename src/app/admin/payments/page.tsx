import { getGetPeriodsUseCase, getGetPaymentsByPeriodUseCase } from "@/di/container";
import {
  PaymentManager,
  PeriodData,
} from "@/presentation/components/admin/PaymentManager";

interface AdminPaymentsPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminPaymentsPage({
  searchParams,
}: AdminPaymentsPageProps) {
  const { period: periodParam } = await searchParams;

  const getPeriods = getGetPeriodsUseCase();
  const getPaymentsByPeriod = getGetPaymentsByPeriodUseCase();

  // 1. Ambil semua periode
  const periods = await getPeriods.execute();

  // 2. Tentukan periode terpilih
  let selectedPeriod = null;
  if (periodParam) {
    selectedPeriod = periods.find((p) => p.id === periodParam) || null;
  }
  if (!selectedPeriod && periods.length > 0) {
    selectedPeriod = periods[0];
  }

  // 3. Query blok beserta payment
  const rows = await getPaymentsByPeriod.execute(selectedPeriod?.id);

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
      <PaymentManager
        periods={periodDataList}
        selectedPeriod={selectedPeriodData}
        payments={rows}
      />
    </div>
  );
}
