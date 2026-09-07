import { IBlockRepository } from "../../repositories/block.repository";
import { BlockPaymentRow } from "../../entities/payment.entity";

export class GetPaymentsByPeriodUseCase {
  constructor(private readonly blockRepository: IBlockRepository) {}

  async execute(periodId?: string): Promise<BlockPaymentRow[]> {
    const blocksWithPayments = await this.blockRepository.findAllWithPaymentsForPeriod(periodId);

    return blocksWithPayments.map((b) => {
      const p = b.payments?.[0];
      const iuran = p?.iuranAmount ?? 0;
      const kas = p?.kasAmount ?? 0;
      const infaq = p?.infaqAmount ?? 0;
      const thr = p?.thrAmount ?? 0;
      const total = p?.totalAmount ?? (iuran + kas + infaq + thr);

      return {
        blockId: b.id,
        blockName: b.blockName,
        ownerName: b.ownerName,
        phone: b.phone,
        paymentId: p?.id ?? null,
        isPaid: p?.isPaid ?? false,
        paidAt: p?.paidAt ?? null,
        iuranAmount: iuran,
        kasAmount: kas,
        infaqAmount: infaq,
        thrAmount: thr,
        totalAmount: total,
        notes: p?.notes ?? null,
      };
    });
  }
}
