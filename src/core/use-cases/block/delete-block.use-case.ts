import { IBlockRepository } from "../../repositories/block.repository";
import { IAuthService } from "../../services/auth.service.interface";
import { ResidentBlock } from "../../entities/block.entity";
import { UnauthorizedError } from "../../errors/domain.errors";

export class DeleteBlockUseCase {
  constructor(
    private readonly blockRepository: IBlockRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(id: string): Promise<ResidentBlock> {
    const session = await this.authService.getSession();
    if (!session) throw new UnauthorizedError();

    return await this.blockRepository.delete(id);
  }
}
