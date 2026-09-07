import { db } from "../database/db";
import { IPeriodRepository } from "@/core/repositories/period.repository";
import {
  CreatePeriodDTO,
  Period,
} from "@/core/entities/period.entity";

export class PeriodRepositoryImpl implements IPeriodRepository {
  async findAll(): Promise<Period[]> {
    const records = await db.period.findMany({
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
    return records.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Period | null> {
    const record = await db.period.findUnique({
      where: { id },
    });
    return record ? this.mapToEntity(record) : null;
  }

  async findByMonthYear(month: number, year: number): Promise<Period | null> {
    const record = await db.period.findUnique({
      where: {
        month_year: { month, year },
      },
    });
    return record ? this.mapToEntity(record) : null;
  }

  async findLatest(): Promise<Period | null> {
    const record = await db.period.findFirst({
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
    return record ? this.mapToEntity(record) : null;
  }

  async create(data: CreatePeriodDTO): Promise<Period> {
    const record = await db.period.create({
      data: {
        month: data.month,
        year: data.year,
        name: data.name,
        hasThr: data.hasThr ?? false,
      },
    });
    return this.mapToEntity(record);
  }

  private mapToEntity(record: {
    id: string;
    month: number;
    year: number;
    name: string;
    hasThr: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Period {
    return {
      id: record.id,
      month: record.month,
      year: record.year,
      name: record.name,
      hasThr: record.hasThr,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
