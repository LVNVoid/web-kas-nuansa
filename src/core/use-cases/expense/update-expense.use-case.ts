import { IExpenseRepository } from "../../repositories/expense.repository";
import { IAuthService } from "../../services/auth.service.interface";
import { ExpenseRecord, UpdateExpenseDTO } from "../../entities/expense.entity";
import { UnauthorizedError, ValidationError } from "../../errors/domain.errors";

export class UpdateExpenseUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(id: string, input: UpdateExpenseDTO): Promise<ExpenseRecord> {
    const session = await this.authService.getSession();
    if (!session) throw new UnauthorizedError();

    const title = input.title?.trim();
    const amount = input.amount;

    if (!title || amount <= 0) {
      throw new ValidationError("Judul pengeluaran dan nominal (> 0) wajib diisi.");
    }

    return await this.expenseRepository.update(id, {
      ...input,
      title,
      category: input.category?.trim() || "Operasional",
      date: input.date ?? new Date(),
    });
  }
}
