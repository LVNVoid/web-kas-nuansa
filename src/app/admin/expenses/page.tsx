import { prisma } from "@/lib/prisma";
import {
  ExpenseManager,
  ExpenseRecordData,
} from "@/components/admin/ExpenseManager";
import { PeriodData } from "@/components/admin/PaymentManager";

interface AdminExpensesPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminExpensesPage({
  searchParams,
}: AdminExpensesPageProps) {
  const { period: periodParam } = await searchParams;

  // 1. Ambil semua periode
  const periods = await prisma.period.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  // 2. Tentukan periode terpilih
  let selectedPeriod = null;
  if (periodParam) {
    selectedPeriod = periods.find((p) => p.id === periodParam) || null;
  }
  if (!selectedPeriod && periods.length > 0) {
    selectedPeriod = periods[0];
  }

  // 3. Ambil daftar pengeluaran
  let expenses: Array<{
    id: string;
    periodId: string | null;
    date: Date;
    category: string;
    title: string;
    amount: number;
    notes: string | null;
  }> = [];

  if (selectedPeriod) {
    expenses = await prisma.expenseRecord.findMany({
      where: { periodId: selectedPeriod.id },
      orderBy: { date: "desc" },
    });
  } else {
    expenses = await prisma.expenseRecord.findMany({
      orderBy: { date: "desc" },
    });
  }

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
