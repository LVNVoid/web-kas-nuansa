import { db } from "../database/db";
import { IExpenseRepository } from "@/core/repositories/expense.repository";
import {
  CreateExpenseDTO,
  ExpenseRecord,
  UpdateExpenseDTO,
} from "@/core/entities/expense.entity";

export class ExpenseRepositoryImpl implements IExpenseRepository {
  async findAll(): Promise<ExpenseRecord[]> {
    const records = await db.expenseRecord.findMany({
      orderBy: { date: "desc" },
    });
    return records.map(this.mapToEntity);
  }

  async findByPeriodId(periodId: string): Promise<ExpenseRecord[]> {
    const records = await db.expenseRecord.findMany({
      where: { periodId },
      orderBy: { date: "desc" },
    });
    return records.map(this.mapToEntity);
  }

  async create(data: CreateExpenseDTO): Promise<ExpenseRecord> {
    const record = await db.expenseRecord.create({
      data: {
        periodId: data.periodId ?? null,
        date: data.date ?? new Date(),
        category: data.category,
        title: data.title,
        amount: data.amount,
        notes: data.notes ?? null,
      },
    });
    return this.mapToEntity(record);
  }

  async update(id: string, data: UpdateExpenseDTO): Promise<ExpenseRecord> {
    const record = await db.expenseRecord.update({
      where: { id },
      data: {
        periodId: data.periodId ?? null,
        date: data.date ?? new Date(),
        category: data.category,
        title: data.title,
        amount: data.amount,
        notes: data.notes ?? null,
      },
    });
    return this.mapToEntity(record);
  }

  async delete(id: string): Promise<ExpenseRecord> {
    const record = await db.expenseRecord.delete({
      where: { id },
    });
    return this.mapToEntity(record);
  }

  async aggregateTotalExpense(): Promise<number> {
    const res = await db.expenseRecord.aggregate({
      _sum: { amount: true },
    });
    return res._sum.amount ?? 0;
  }

  private mapToEntity(record: {
    id: string;
    periodId: string | null;
    date: Date;
    category: string;
    title: string;
    amount: number;
    proofUrl?: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): ExpenseRecord {
    return {
      id: record.id,
      periodId: record.periodId,
      date: record.date,
      category: record.category,
      title: record.title,
      amount: record.amount,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      proofUrl: record.proofUrl,
    };
  }
}
