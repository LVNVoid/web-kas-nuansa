export interface ExpenseRecord {
  id: string;
  periodId: string | null;
  date: Date;
  category: string;
  title: string;
  amount: number;
  proofUrl?: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ExpenseRecordEntity implements ExpenseRecord {
  constructor(
    public readonly id: string,
    public readonly periodId: string | null,
    public readonly date: Date,
    public readonly category: string,
    public readonly title: string,
    public readonly amount: number,
    public readonly notes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly proofUrl?: string | null
  ) {}
}

export interface CreateExpenseDTO {
  periodId?: string | null;
  date?: Date;
  category: string;
  title: string;
  amount: number;
  notes?: string | null;
}

export interface UpdateExpenseDTO {
  periodId?: string | null;
  date?: Date;
  category: string;
  title: string;
  amount: number;
  notes?: string | null;
}

export interface ExpenseRecordData {
  id: string;
  periodId: string | null;
  date: Date;
  category: string;
  title: string;
  amount: number;
  notes: string | null;
}
