import { CreatePeriodDTO, Period } from "../entities/period.entity";

export interface IPeriodRepository {
  findAll(): Promise<Period[]>;
  findById(id: string): Promise<Period | null>;
  findByMonthYear(month: number, year: number): Promise<Period | null>;
  findLatest(): Promise<Period | null>;
  create(data: CreatePeriodDTO): Promise<Period>;
}
