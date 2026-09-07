import { GetDashboardSummaryUseCase } from "@/core/use-cases/dashboard/get-dashboard-summary.use-case";
import { IBlockRepository } from "@/core/repositories/block.repository";
import { IPeriodRepository } from "@/core/repositories/period.repository";
import { IPaymentRepository } from "@/core/repositories/payment.repository";
import { IExpenseRepository } from "@/core/repositories/expense.repository";

describe("Core Use Cases - Dashboard", () => {
  let mockBlockRepo: jest.Mocked<IBlockRepository>;
  let mockPeriodRepo: jest.Mocked<IPeriodRepository>;
  let mockPaymentRepo: jest.Mocked<IPaymentRepository>;
  let mockExpenseRepo: jest.Mocked<IExpenseRepository>;

  beforeEach(() => {
    mockBlockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByBlockName: jest.fn(),
      findDuplicateName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAllWithPaymentsForPeriod: jest.fn(),
    };
    mockPeriodRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByMonthYear: jest.fn(),
      findLatest: jest.fn(),
      create: jest.fn(),
    };
    mockPaymentRepo = {
      findByBlockAndPeriod: jest.fn(),
      upsert: jest.fn(),
      aggregateTotalPaidIncome: jest.fn(),
    };
    mockExpenseRepo = {
      findAll: jest.fn(),
      findByPeriodId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregateTotalExpense: jest.fn(),
    };
  });

  it("returns zeroed summary when no period exists", async () => {
    mockPeriodRepo.findLatest.mockResolvedValue(null);
    mockBlockRepo.findAll.mockResolvedValue([]);

    const useCase = new GetDashboardSummaryUseCase(
      mockBlockRepo,
      mockPeriodRepo,
      mockPaymentRepo,
      mockExpenseRepo
    );

    const summary = await useCase.execute();

    expect(summary.period).toBeNull();
    expect(summary.totalBalance).toBe(0);
    expect(summary.totalBlocks).toBe(0);
  });

  it("aggregates data correctly for an active period", async () => {
    mockPeriodRepo.findById.mockResolvedValue({
      id: "p1",
      month: 9,
      year: 2026,
      name: "September 2026",
      hasThr: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockBlockRepo.findAllWithPaymentsForPeriod.mockResolvedValue([
      {
        id: "b1",
        blockName: "A1",
        ownerName: "Budi",
        phone: null,
        isOccupied: true,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        payments: [
          {
            id: "pay1",
            isPaid: true,
            paidAt: new Date("2026-09-02"),
            iuranAmount: 50000,
            kasAmount: 25000,
            infaqAmount: 10000,
            thrAmount: 0,
            totalAmount: 85000,
            notes: null,
          },
        ],
      },
      {
        id: "b2",
        blockName: "A2",
        ownerName: "Citra",
        phone: null,
        isOccupied: true,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        payments: [],
      },
    ]);

    mockExpenseRepo.findByPeriodId.mockResolvedValue([
      {
        id: "e1",
        periodId: "p1",
        date: new Date("2026-09-05"),
        category: "Kebersihan",
        title: "Iuran Sampah Lingkungan",
        amount: 35000,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    mockPaymentRepo.aggregateTotalPaidIncome.mockResolvedValue(85000);
    mockExpenseRepo.aggregateTotalExpense.mockResolvedValue(35000);

    const useCase = new GetDashboardSummaryUseCase(
      mockBlockRepo,
      mockPeriodRepo,
      mockPaymentRepo,
      mockExpenseRepo
    );

    const summary = await useCase.execute("p1");

    expect(summary.period?.name).toBe("September 2026");
    expect(summary.totalBalance).toBe(50000);
    expect(summary.periodIncome).toBe(85000);
    expect(summary.periodExpense).toBe(35000);
    expect(summary.paidCount).toBe(1);
    expect(summary.unpaidCount).toBe(1);
    expect(summary.totalBlocks).toBe(2);
    expect(summary.blocks[0].isPaid).toBe(true);
    expect(summary.blocks[1].isPaid).toBe(false);
  });
});
