import { IPaymentRepository } from "../../repositories/payment.repository";
import { IAuthService } from "../../services/auth.service.interface";
import { PaymentRecord, QuickTogglePaymentDTO } from "../../entities/payment.entity";
import { UnauthorizedError } from "../../errors/domain.errors";

export class QuickTogglePaymentUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(input: QuickTogglePaymentDTO): Promise<PaymentRecord> {
    const session = await this.authService.getSession();
    if (!session) throw new UnauthorizedError();

    const { blockId, periodId, newPaidStatus } = input;
    const existing = await this.paymentRepository.findByBlockAndPeriod(blockId, periodId);

    if (existing) {
      const iuran = newPaidStatus ? (existing.iuranAmount || 50000) : 0;
      const kas = newPaidStatus ? (existing.kasAmount || 25000) : 0;
      const infaq = newPaidStatus ? existing.infaqAmount : 0;
      const thr = newPaidStatus ? existing.thrAmount : 0;

      return await this.paymentRepository.upsert({
        blockId,
        periodId,
        isPaid: newPaidStatus,
        paidAt: newPaidStatus ? new Date() : null,
        iuranAmount: iuran,
        kasAmount: kas,
        infaqAmount: infaq,
        thrAmount: thr,
        notes: existing.notes,
      });
    } else {
      const iuran = newPaidStatus ? 50000 : 0;
      const kas = newPaidStatus ? 25000 : 0;

      return await this.paymentRepository.upsert({
        blockId,
        periodId,
        isPaid: newPaidStatus,
        paidAt: newPaidStatus ? new Date() : null,
        iuranAmount: iuran,
        kasAmount: kas,
        infaqAmount: 0,
        thrAmount: 0,
        notes: null,
      });
    }
  }
}
