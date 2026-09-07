import { db } from "../database/db";
import { IPaymentRepository } from "@/core/repositories/payment.repository";
import {
  PaymentDetailDTO,
  PaymentRecord,
} from "@/core/entities/payment.entity";

export class PaymentRepositoryImpl implements IPaymentRepository {
  async findByBlockAndPeriod(blockId: string, periodId: string): Promise<PaymentRecord | null> {
    const record = await db.paymentRecord.findUnique({
      where: {
        blockId_periodId: { blockId, periodId },
      },
    });
    return record ? this.mapToEntity(record) : null;
  }

  async upsert(data: PaymentDetailDTO): Promise<PaymentRecord> {
    const totalAmount =
      data.iuranAmount + data.kasAmount + data.infaqAmount + data.thrAmount;

    const record = await db.paymentRecord.upsert({
      where: {
        blockId_periodId: {
          blockId: data.blockId,
          periodId: data.periodId,
        },
      },
      update: {
        isPaid: data.isPaid,
        paidAt: data.paidAt,
        iuranAmount: data.iuranAmount,
        kasAmount: data.kasAmount,
        infaqAmount: data.infaqAmount,
        thrAmount: data.thrAmount,
        totalAmount,
        notes: data.notes ?? null,
      },
      create: {
        blockId: data.blockId,
        periodId: data.periodId,
        isPaid: data.isPaid,
        paidAt: data.paidAt,
        iuranAmount: data.iuranAmount,
        kasAmount: data.kasAmount,
        infaqAmount: data.infaqAmount,
        thrAmount: data.thrAmount,
        totalAmount,
        notes: data.notes ?? null,
      },
    });

    return this.mapToEntity(record);
  }

  async aggregateTotalPaidIncome(): Promise<number> {
    const res = await db.paymentRecord.aggregate({
      _sum: { totalAmount: true },
      where: { isPaid: true },
    });
    return res._sum.totalAmount ?? 0;
  }

  private mapToEntity(record: {
    id: string;
    blockId: string;
    periodId: string;
    paidAt: Date | null;
    isPaid: boolean;
    iuranAmount: number;
    kasAmount: number;
    infaqAmount: number;
    thrAmount: number;
    totalAmount: number;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): PaymentRecord {
    return {
      id: record.id,
      blockId: record.blockId,
      periodId: record.periodId,
      paidAt: record.paidAt,
      isPaid: record.isPaid,
      iuranAmount: record.iuranAmount,
      kasAmount: record.kasAmount,
      infaqAmount: record.infaqAmount,
      thrAmount: record.thrAmount,
      totalAmount: record.totalAmount,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
