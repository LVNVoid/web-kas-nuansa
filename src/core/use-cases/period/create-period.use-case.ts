import { IPeriodRepository } from "../../repositories/period.repository";
import { IAuthService } from "../../services/auth.service.interface";
import { CreatePeriodDTO, Period } from "../../entities/period.entity";
import { UnauthorizedError, ValidationError, ConflictError } from "../../errors/domain.errors";

export class CreatePeriodUseCase {
  constructor(
    private readonly periodRepository: IPeriodRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(input: CreatePeriodDTO): Promise<Period> {
    const session = await this.authService.getSession();
    if (!session) throw new UnauthorizedError();

    const { month, year, name, hasThr = false } = input;
    if (!month || !year || !name?.trim()) {
      throw new ValidationError("Bulan, tahun, dan nama periode wajib diisi.");
    }

    const existing = await this.periodRepository.findByMonthYear(month, year);
    if (existing) {
      throw new ConflictError(`Periode ${name} sudah pernah dibuat.`);
    }

    return await this.periodRepository.create({
      month,
      year,
      name: name.trim(),
      hasThr,
    });
  }
}
