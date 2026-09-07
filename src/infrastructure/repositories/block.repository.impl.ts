import { db } from "../database/db";
import { IBlockRepository } from "@/core/repositories/block.repository";
import {
  CreateBlockDTO,
  ResidentBlock,
  UpdateBlockDTO,
} from "@/core/entities/block.entity";

export class BlockRepositoryImpl implements IBlockRepository {
  async findAll(): Promise<ResidentBlock[]> {
    const records = await db.residentBlock.findMany({
      orderBy: { blockName: "asc" },
    });
    return records.map(this.mapToEntity);
  }

  async findById(id: string): Promise<ResidentBlock | null> {
    const record = await db.residentBlock.findUnique({
      where: { id },
    });
    return record ? this.mapToEntity(record) : null;
  }

  async findByBlockName(blockName: string): Promise<ResidentBlock | null> {
    const record = await db.residentBlock.findUnique({
      where: { blockName },
    });
    return record ? this.mapToEntity(record) : null;
  }

  async findDuplicateName(blockName: string, excludeId: string): Promise<ResidentBlock | null> {
    const record = await db.residentBlock.findFirst({
      where: {
        blockName,
        NOT: { id: excludeId },
      },
    });
    return record ? this.mapToEntity(record) : null;
  }

  async create(data: CreateBlockDTO): Promise<ResidentBlock> {
    const record = await db.residentBlock.create({
      data: {
        blockName: data.blockName,
        ownerName: data.ownerName ?? null,
        phone: data.phone ?? null,
        isOccupied: data.isOccupied ?? true,
        notes: data.notes ?? null,
      },
    });
    return this.mapToEntity(record);
  }

  async update(id: string, data: UpdateBlockDTO): Promise<ResidentBlock> {
    const record = await db.residentBlock.update({
      where: { id },
      data: {
        blockName: data.blockName,
        ownerName: data.ownerName ?? null,
        phone: data.phone ?? null,
        isOccupied: data.isOccupied ?? true,
        notes: data.notes ?? null,
      },
    });
    return this.mapToEntity(record);
  }

  async delete(id: string): Promise<ResidentBlock> {
    const record = await db.residentBlock.delete({
      where: { id },
    });
    return this.mapToEntity(record);
  }

  async findAllWithPaymentsForPeriod(periodId?: string) {
    const records = await db.residentBlock.findMany({
      orderBy: { blockName: "asc" },
      include: {
        payments: periodId
          ? {
              where: { periodId },
            }
          : false,
      },
    });

    return records.map((r) => ({
      ...this.mapToEntity(r),
      payments: r.payments || [],
    }));
  }

  private mapToEntity(record: {
    id: string;
    blockName: string;
    ownerName: string | null;
    phone: string | null;
    isOccupied: boolean;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): ResidentBlock {
    return {
      id: record.id,
      blockName: record.blockName,
      ownerName: record.ownerName,
      phone: record.phone,
      isOccupied: record.isOccupied,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
