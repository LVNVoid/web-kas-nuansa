import { IBlockRepository } from "../../repositories/block.repository";
import { IPeriodRepository } from "../../repositories/period.repository";
import { IPaymentRepository } from "../../repositories/payment.repository";
import { IExpenseRepository } from "../../repositories/expense.repository";
import { DashboardBlockItem, DashboardSummary } from "../../entities/dashboard.entity";

export class GetDashboardSummaryUseCase {
  constructor(
    private readonly blockRepository: IBlockRepository,
    private readonly periodRepository: IPeriodRepository,
    private readonly paymentRepository: IPaymentRepository,
    private readonly expenseRepository: IExpenseRepository
  ) {}

  async execute(periodId?: string): Promise<DashboardSummary> {
    let currentPeriod = null;
    if (periodId) {
      currentPeriod = await this.periodRepository.findById(periodId);
    }

    if (!currentPeriod) {
      currentPeriod = await this.periodRepository.findLatest();
    }

    if (!currentPeriod) {
      const allBlocks = await this.blockRepository.findAll();

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

    const [blocksWithPayments, expenses, totalAllIncome, totalAllExpense] =
      await Promise.all([
        this.blockRepository.findAllWithPaymentsForPeriod(currentPeriod.id),
        this.expenseRepository.findByPeriodId(currentPeriod.id),
        this.paymentRepository.aggregateTotalPaidIncome(),
        this.expenseRepository.aggregateTotalExpense(),
      ]);

    let periodIncome = 0;
    let paidCount = 0;

    const blocks: DashboardBlockItem[] = blocksWithPayments.map((block) => {
      const payment = block.payments?.[0];
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

    const periodExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
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
      unpaidCount: blocksWithPayments.length - paidCount,
      totalBlocks: blocksWithPayments.length,
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
  }
}
