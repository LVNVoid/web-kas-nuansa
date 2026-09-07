import { PaymentDetailDTO, PaymentRecord } from "../entities/payment.entity";

export interface IPaymentRepository {
  findByBlockAndPeriod(blockId: string, periodId: string): Promise<PaymentRecord | null>;
  upsert(data: PaymentDetailDTO): Promise<PaymentRecord>;
  aggregateTotalPaidIncome(): Promise<number>;
}
