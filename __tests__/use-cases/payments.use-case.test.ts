import { QuickTogglePaymentUseCase } from "@/core/use-cases/payment/quick-toggle-payment.use-case";
import { SavePaymentDetailUseCase } from "@/core/use-cases/payment/save-payment-detail.use-case";
import { GetPaymentsByPeriodUseCase } from "@/core/use-cases/payment/get-payments-by-period.use-case";
import { IPaymentRepository } from "@/core/repositories/payment.repository";
import { IBlockRepository } from "@/core/repositories/block.repository";
import { IAuthService } from "@/core/services/auth.service.interface";
import { UnauthorizedError, ValidationError } from "@/core/errors/domain.errors";

describe("Core Use Cases - Payments", () => {
  let mockPaymentRepo: jest.Mocked<IPaymentRepository>;
  let mockBlockRepo: jest.Mocked<IBlockRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    mockPaymentRepo = {
      findByBlockAndPeriod: jest.fn(),
      upsert: jest.fn(),
      aggregateTotalPaidIncome: jest.fn(),
    };
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
    mockAuthService = {
      hashPassword: jest.fn(),
      signSessionToken: jest.fn(),
      verifySessionToken: jest.fn(),
      getSession: jest.fn(),
      setSessionCookie: jest.fn(),
      deleteSessionCookie: jest.fn(),
    };
  });

  describe("QuickTogglePaymentUseCase", () => {
    it("throws UnauthorizedError when session missing", async () => {
      mockAuthService.getSession.mockResolvedValue(null);
      const useCase = new QuickTogglePaymentUseCase(mockPaymentRepo, mockAuthService);

      await expect(
        useCase.execute({ blockId: "b1", periodId: "p1", newPaidStatus: true })
      ).rejects.toThrow(UnauthorizedError);
    });

    it("upserts default fee when marking paid for first time", async () => {
      mockAuthService.getSession.mockResolvedValue({ userId: "u1", username: "admin", name: "Admin" });
      mockPaymentRepo.findByBlockAndPeriod.mockResolvedValue(null);
      mockPaymentRepo.upsert.mockResolvedValue({
        id: "pay1",
        blockId: "b1",
        periodId: "p1",
        isPaid: true,
        paidAt: new Date(),
        iuranAmount: 50000,
        kasAmount: 25000,
        infaqAmount: 0,
        thrAmount: 0,
        totalAmount: 75000,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const useCase = new QuickTogglePaymentUseCase(mockPaymentRepo, mockAuthService);
      const res = await useCase.execute({ blockId: "b1", periodId: "p1", newPaidStatus: true });

      expect(res.id).toBe("pay1");
      expect(mockPaymentRepo.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          blockId: "b1",
          periodId: "p1",
          isPaid: true,
          iuranAmount: 50000,
          kasAmount: 25000,
        })
      );
    });
  });

  describe("SavePaymentDetailUseCase", () => {
    it("throws ValidationError when blockId or periodId missing", async () => {
      mockAuthService.getSession.mockResolvedValue({ userId: "u1", username: "admin", name: "Admin" });
      const useCase = new SavePaymentDetailUseCase(mockPaymentRepo, mockAuthService);

      await expect(
        useCase.execute({
          blockId: "",
          periodId: "",
          isPaid: true,
          iuranAmount: 50000,
          kasAmount: 25000,
          infaqAmount: 0,
          thrAmount: 0,
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("GetPaymentsByPeriodUseCase", () => {
    it("returns formatted rows for period", async () => {
      mockBlockRepo.findAllWithPaymentsForPeriod.mockResolvedValue([
        {
          id: "b1",
          blockName: "A1",
          ownerName: "Budi",
          phone: "08123",
          isOccupied: true,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          payments: [
            {
              id: "pay1",
              isPaid: true,
              paidAt: new Date("2026-09-01"),
              iuranAmount: 50000,
              kasAmount: 25000,
              infaqAmount: 0,
              thrAmount: 0,
              totalAmount: 75000,
              notes: null,
            },
          ],
        },
      ]);

      const useCase = new GetPaymentsByPeriodUseCase(mockBlockRepo);
      const rows = await useCase.execute("p1");

      expect(rows.length).toBe(1);
      expect(rows[0].blockName).toBe("A1");
      expect(rows[0].totalAmount).toBe(75000);
      expect(rows[0].isPaid).toBe(true);
    });
  });
});
