import { IExpenseRepository } from "../../repositories/expense.repository";
import { ExpenseRecord } from "../../entities/expense.entity";

export class GetExpensesUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(periodId?: string): Promise<ExpenseRecord[]> {
    if (periodId) {
      return await this.expenseRepository.findByPeriodId(periodId);
    }
    return await this.expenseRepository.findAll();
  }
}
