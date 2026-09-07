import { IBlockRepository } from "../../repositories/block.repository";
import { ResidentBlock } from "../../entities/block.entity";

export class GetBlocksUseCase {
  constructor(private readonly blockRepository: IBlockRepository) {}

  async execute(): Promise<ResidentBlock[]> {
    return await this.blockRepository.findAll();
  }
}
