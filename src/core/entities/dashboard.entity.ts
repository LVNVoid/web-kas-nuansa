export interface DashboardBlockItem {
  id: string;
  blockName: string;
  ownerName: string | null;
  isOccupied: boolean;
  isPaid: boolean;
  paidAt: Date | null;
  iuranAmount: number;
  kasAmount: number;
  infaqAmount: number;
  thrAmount: number;
  totalAmount: number;
}

export interface DashboardExpenseItem {
  id: string;
  date: Date;
  category: string;
  title: string;
  amount: number;
  notes: string | null;
}

export interface DashboardSummary {
  period: {
    id: string;
    month: number;
    year: number;
    name: string;
    hasThr: boolean;
  } | null;
  totalBalance: number;
  periodIncome: number;
  periodExpense: number;
  paidCount: number;
  unpaidCount: number;
  totalBlocks: number;
  blocks: DashboardBlockItem[];
  expenses: DashboardExpenseItem[];
}
