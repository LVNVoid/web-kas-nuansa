import { prisma } from "./prisma";

export interface DashboardBlockItem {
  id: string;
  blockName: string;
  ownerName: string | null;
  isOccupied: boolean;
  isPaid: boolean;
  paidAt: Date | null;
  iuranAmount: number;
  kasAmount: number;
  infaqAmount: number;
  thrAmount: number;
  totalAmount: number;
}

export interface DashboardSummary {
  period: {
    id: string;
    month: number;
    year: number;
    name: string;
    hasThr: boolean;
  } | null;
  totalBalance: number;
  periodIncome: number;
  periodExpense: number;
  paidCount: number;
  unpaidCount: number;
  totalBlocks: number;
  blocks: DashboardBlockItem[];
  expenses: {
    id: string;
    date: Date;
    category: string;
    title: string;
    amount: number;
    notes: string | null;
  }[];
}

export async function getAvailablePeriods() {
  try {
    return await prisma.period.findMany({
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getDashboardData(periodId?: string): Promise<DashboardSummary> {
  try {
    // 1. Dapatkan periode target (atau periode terbaru jika tidak ada ID)
    let currentPeriod = null;
    if (periodId) {
      currentPeriod = await prisma.period.findUnique({
        where: { id: periodId },
      });
    }

    if (!currentPeriod) {
      currentPeriod = await prisma.period.findFirst({
        orderBy: [{ year: "desc" }, { month: "desc" }],
      });
    }

    // 2. Ambil seluruh master blok
    const allBlocks = await prisma.residentBlock.findMany({
      orderBy: { blockName: "asc" },
    });

    if (!currentPeriod) {
      return {
        period: null,
        totalBalance: 0,
        periodIncome: 0,
        periodExpense: 0,
        paidCount: 0,
        unpaidCount: 0,
        totalBlocks: allBlocks.length,
        blocks: allBlocks.map((b) => ({
          id: b.id,
          blockName: b.blockName,
          ownerName: b.ownerName,
          isOccupied: b.isOccupied,
          isPaid: false,
          paidAt: null,
          iuranAmount: 0,
          kasAmount: 0,
          infaqAmount: 0,
          thrAmount: 0,
          totalAmount: 0,
        })),
        expenses: [],
      };
    }

    // 3. Ambil seluruh payment record pada periode ini
    const paymentRecords = await prisma.paymentRecord.findMany({
      where: { periodId: currentPeriod.id },
    });

    const paymentMap = new Map(paymentRecords.map((p) => [p.blockId, p]));

    // 4. Hitung total pemasukan & status lunas
    let periodIncome = 0;
    let paidCount = 0;

    const blocks: DashboardBlockItem[] = allBlocks.map((block) => {
      const payment = paymentMap.get(block.id);
      const isPaid = Boolean(payment?.isPaid);
      if (isPaid) paidCount++;

      const iuran = payment?.iuranAmount ?? 0;
      const kas = payment?.kasAmount ?? 0;
      const infaq = payment?.infaqAmount ?? 0;
      const thr = payment?.thrAmount ?? 0;
      const total = payment?.totalAmount ?? (iuran + kas + infaq + thr);

      if (isPaid) {
        periodIncome += total;
      }

      return {
        id: block.id,
        blockName: block.blockName,
        ownerName: block.ownerName,
        isOccupied: block.isOccupied,
        isPaid,
        paidAt: payment?.paidAt ?? null,
        iuranAmount: iuran,
        kasAmount: kas,
        infaqAmount: infaq,
        thrAmount: thr,
        totalAmount: total,
      };
    });

    // 5. Ambil pengeluaran periode ini
    const expenses = await prisma.expenseRecord.findMany({
      where: { periodId: currentPeriod.id },
      orderBy: { date: "desc" },
    });

    const periodExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    // 6. Hitung total saldo kas kumulatif sepanjang waktu
    const allPaidPayments = await prisma.paymentRecord.aggregate({
      _sum: { totalAmount: true },
      where: { isPaid: true },
    });

    const allExpenses = await prisma.expenseRecord.aggregate({
      _sum: { amount: true },
    });

    const totalAllIncome = allPaidPayments._sum.totalAmount ?? 0;
    const totalAllExpense = allExpenses._sum.amount ?? 0;
    const totalBalance = totalAllIncome - totalAllExpense;

    return {
      period: {
        id: currentPeriod.id,
        month: currentPeriod.month,
        year: currentPeriod.year,
        name: currentPeriod.name,
        hasThr: currentPeriod.hasThr,
      },
      totalBalance,
      periodIncome,
      periodExpense,
      paidCount,
      unpaidCount: allBlocks.length - paidCount,
      totalBlocks: allBlocks.length,
      blocks,
      expenses: expenses.map((e) => ({
        id: e.id,
        date: e.date,
        category: e.category,
        title: e.title,
        amount: e.amount,
        notes: e.notes,
      })),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      period: null,
      totalBalance: 0,
      periodIncome: 0,
      periodExpense: 0,
      paidCount: 0,
      unpaidCount: 0,
      totalBlocks: 0,
      blocks: [],
      expenses: [],
    };
  }
}
