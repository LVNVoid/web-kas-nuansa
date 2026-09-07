export interface Period {
  id: string;
  month: number;
  year: number;
  name: string;
  hasThr: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PeriodEntity implements Period {
  constructor(
    public readonly id: string,
    public readonly month: number,
    public readonly year: number,
    public readonly name: string,
    public readonly hasThr: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

export interface CreatePeriodDTO {
  month: number;
  year: number;
  name: string;
  hasThr?: boolean;
}

export interface PeriodData {
  id: string;
  month: number;
  year: number;
  name: string;
  hasThr: boolean;
}
