import { IExpenseRepository } from "../../repositories/expense.repository";
import { IAuthService } from "../../services/auth.service.interface";
import { ExpenseRecord } from "../../entities/expense.entity";
import { UnauthorizedError } from "../../errors/domain.errors";

export class DeleteExpenseUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(id: string): Promise<ExpenseRecord> {
    const session = await this.authService.getSession();
    if (!session) throw new UnauthorizedError();

    return await this.expenseRepository.delete(id);
  }
}
