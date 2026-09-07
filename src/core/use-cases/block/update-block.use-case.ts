import { IBlockRepository } from "../../repositories/block.repository";
import { IAuthService } from "../../services/auth.service.interface";
import { ResidentBlock, UpdateBlockDTO } from "../../entities/block.entity";
import { UnauthorizedError, ValidationError, ConflictError } from "../../errors/domain.errors";

export class UpdateBlockUseCase {
  constructor(
    private readonly blockRepository: IBlockRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(id: string, input: UpdateBlockDTO): Promise<ResidentBlock> {
    const session = await this.authService.getSession();
    if (!session) throw new UnauthorizedError();

    const blockName = input.blockName?.trim().toUpperCase();
    if (!blockName) {
      throw new ValidationError("Nama blok wajib diisi.");
    }

    const duplicate = await this.blockRepository.findDuplicateName(blockName, id);
    if (duplicate) {
      throw new ConflictError(`Nama Blok ${blockName} sudah digunakan oleh data lain.`);
    }

    return await this.blockRepository.update(id, {
      ...input,
      blockName,
    });
  }
}
