import { IExpenseRepository } from "../../repositories/expense.repository";
import { IAuthService } from "../../services/auth.service.interface";
import { CreateExpenseDTO, ExpenseRecord } from "../../entities/expense.entity";
import { UnauthorizedError, ValidationError } from "../../errors/domain.errors";

export class CreateExpenseUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(input: CreateExpenseDTO): Promise<ExpenseRecord> {
    const session = await this.authService.getSession();
    if (!session) throw new UnauthorizedError();

    const title = input.title?.trim();
    const amount = input.amount;

    if (!title || amount <= 0) {
      throw new ValidationError("Judul pengeluaran dan nominal (> 0) wajib diisi.");
    }

    return await this.expenseRepository.create({
      ...input,
      title,
      category: input.category?.trim() || "Operasional",
      date: input.date ?? new Date(),
    });
  }
}
