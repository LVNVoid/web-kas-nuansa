import {
  CreateExpenseDTO,
  ExpenseRecord,
  UpdateExpenseDTO,
} from "../entities/expense.entity";

export interface IExpenseRepository {
  findAll(): Promise<ExpenseRecord[]>;
  findByPeriodId(periodId: string): Promise<ExpenseRecord[]>;
  create(data: CreateExpenseDTO): Promise<ExpenseRecord>;
  update(id: string, data: UpdateExpenseDTO): Promise<ExpenseRecord>;
  delete(id: string): Promise<ExpenseRecord>;
  aggregateTotalExpense(): Promise<number>;
}
