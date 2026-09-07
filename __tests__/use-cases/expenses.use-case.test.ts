import { CreateExpenseUseCase } from "@/core/use-cases/expense/create-expense.use-case";
import { DeleteExpenseUseCase } from "@/core/use-cases/expense/delete-expense.use-case";
import { IExpenseRepository } from "@/core/repositories/expense.repository";
import { IAuthService } from "@/core/services/auth.service.interface";
import { ValidationError } from "@/core/errors/domain.errors";

describe("Core Use Cases - Expenses", () => {
  let mockExpenseRepo: jest.Mocked<IExpenseRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    mockExpenseRepo = {
      findAll: jest.fn(),
      findByPeriodId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregateTotalExpense: jest.fn(),
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

  describe("CreateExpenseUseCase", () => {
    it("throws ValidationError for invalid input", async () => {
      mockAuthService.getSession.mockResolvedValue({ userId: "u1", username: "admin", name: "Admin" });
      const useCase = new CreateExpenseUseCase(mockExpenseRepo, mockAuthService);

      await expect(
        useCase.execute({ title: "", amount: 0, category: "Operasional" })
      ).rejects.toThrow(ValidationError);
    });

    it("creates expense record successfully", async () => {
      mockAuthService.getSession.mockResolvedValue({ userId: "u1", username: "admin", name: "Admin" });
      mockExpenseRepo.create.mockResolvedValue({
        id: "e1",
        periodId: "p1",
        date: new Date(),
        category: "Fasum",
        title: "Beli Lampu Gang",
        amount: 150000,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const useCase = new CreateExpenseUseCase(mockExpenseRepo, mockAuthService);
      const res = await useCase.execute({
        title: "Beli Lampu Gang",
        amount: 150000,
        category: "Fasum",
      });

      expect(res.id).toBe("e1");
    });
  });

  describe("DeleteExpenseUseCase", () => {
    it("deletes expense successfully", async () => {
      mockAuthService.getSession.mockResolvedValue({ userId: "u1", username: "admin", name: "Admin" });
      mockExpenseRepo.delete.mockResolvedValue({
        id: "e1",
        periodId: null,
        date: new Date(),
        category: "Fasum",
        title: "Lampu",
        amount: 150000,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const useCase = new DeleteExpenseUseCase(mockExpenseRepo, mockAuthService);
      const res = await useCase.execute("e1");
      expect(res.id).toBe("e1");
    });
  });
});
