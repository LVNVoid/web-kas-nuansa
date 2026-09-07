import { getGetPeriodsUseCase, getGetExpensesUseCase } from "@/di/container";
import {
  ExpenseManager,
  ExpenseRecordData,
} from "@/presentation/components/admin/ExpenseManager";
import { PeriodData } from "@/presentation/components/admin/PaymentManager";

interface AdminExpensesPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminExpensesPage({
  searchParams,
}: AdminExpensesPageProps) {
  const { period: periodParam } = await searchParams;

  const getPeriods = getGetPeriodsUseCase();
  const getExpenses = getGetExpensesUseCase();

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

  // 3. Ambil daftar pengeluaran
  const expenses = await getExpenses.execute(selectedPeriod?.id);

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

  const expenseDataList: ExpenseRecordData[] = expenses.map((e) => ({
    id: e.id,
    periodId: e.periodId,
    date: e.date,
    category: e.category,
    title: e.title,
    amount: e.amount,
    notes: e.notes,
  }));

  return (
    <div>
      <ExpenseManager
        periods={periodDataList}
        selectedPeriod={selectedPeriodData}
        expenses={expenseDataList}
      />
    </div>
  );
}
