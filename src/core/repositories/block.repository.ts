import {
  CreateBlockDTO,
  ResidentBlock,
  UpdateBlockDTO,
} from "../entities/block.entity";

export interface IBlockRepository {
  findAll(): Promise<ResidentBlock[]>;
  findById(id: string): Promise<ResidentBlock | null>;
  findByBlockName(blockName: string): Promise<ResidentBlock | null>;
  findDuplicateName(blockName: string, excludeId: string): Promise<ResidentBlock | null>;
  create(data: CreateBlockDTO): Promise<ResidentBlock>;
  update(id: string, data: UpdateBlockDTO): Promise<ResidentBlock>;
  delete(id: string): Promise<ResidentBlock>;
  findAllWithPaymentsForPeriod(periodId?: string): Promise<
    Array<
      ResidentBlock & {
        payments: Array<{
          id: string;
          isPaid: boolean;
          paidAt: Date | null;
          iuranAmount: number;
          kasAmount: number;
          infaqAmount: number;
          thrAmount: number;
          totalAmount: number;
          notes: string | null;
        }>;
      }
    >
  >;
}
