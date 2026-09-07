import { IBlockRepository } from "../../repositories/block.repository";
import { IAuthService } from "../../services/auth.service.interface";
import { CreateBlockDTO, ResidentBlock } from "../../entities/block.entity";
import { UnauthorizedError, ValidationError, ConflictError } from "../../errors/domain.errors";

export class CreateBlockUseCase {
  constructor(
    private readonly blockRepository: IBlockRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(input: CreateBlockDTO): Promise<ResidentBlock> {
    const session = await this.authService.getSession();
    if (!session) throw new UnauthorizedError();

    const blockName = input.blockName?.trim().toUpperCase();
    if (!blockName) {
      throw new ValidationError("Nama blok wajib diisi.");
    }

    const existing = await this.blockRepository.findByBlockName(blockName);
    if (existing) {
      throw new ConflictError(`Blok ${blockName} sudah terdaftar.`);
    }

    return await this.blockRepository.create({
      ...input,
      blockName,
    });
  }
}
