import { IPeriodRepository } from "../../repositories/period.repository";
import { Period } from "../../entities/period.entity";

export class GetPeriodsUseCase {
  constructor(private readonly periodRepository: IPeriodRepository) {}

  async execute(): Promise<Period[]> {
    return await this.periodRepository.findAll();
  }
}
