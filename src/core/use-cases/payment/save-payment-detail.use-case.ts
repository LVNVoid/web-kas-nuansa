import { IPaymentRepository } from "../../repositories/payment.repository";
import { IAuthService } from "../../services/auth.service.interface";
import { PaymentDetailDTO, PaymentRecord } from "../../entities/payment.entity";
import { UnauthorizedError, ValidationError } from "../../errors/domain.errors";

export class SavePaymentDetailUseCase {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(input: PaymentDetailDTO): Promise<PaymentRecord> {
    const session = await this.authService.getSession();
    if (!session) throw new UnauthorizedError();

    if (!input.blockId || !input.periodId) {
      throw new ValidationError("Block ID dan Period ID wajib ada.");
    }

    return await this.paymentRepository.upsert(input);
  }
}
