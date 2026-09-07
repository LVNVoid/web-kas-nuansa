export interface PaymentRecord {
  id: string;
  blockId: string;
  periodId: string;
  paidAt: Date | null;
  isPaid: boolean;
  iuranAmount: number;
  kasAmount: number;
  infaqAmount: number;
  thrAmount: number;
  totalAmount: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentRecordEntity implements PaymentRecord {
  constructor(
    public readonly id: string,
    public readonly blockId: string,
    public readonly periodId: string,
    public readonly paidAt: Date | null,
    public readonly isPaid: boolean,
    public readonly iuranAmount: number,
    public readonly kasAmount: number,
    public readonly infaqAmount: number,
    public readonly thrAmount: number,
    public readonly totalAmount: number,
    public readonly notes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

export interface PaymentDetailDTO {
  blockId: string;
  periodId: string;
  isPaid: boolean;
  iuranAmount: number;
  kasAmount: number;
  infaqAmount: number;
  thrAmount: number;
  notes?: string | null;
  paidAt?: Date | null;
}

export interface QuickTogglePaymentDTO {
  blockId: string;
  periodId: string;
  newPaidStatus: boolean;
}

export interface BlockPaymentRow {
  blockId: string;
  blockName: string;
  ownerName: string | null;
  phone: string | null;
  paymentId: string | null;
  isPaid: boolean;
  paidAt: Date | null;
  iuranAmount: number;
  kasAmount: number;
  infaqAmount: number;
  thrAmount: number;
  totalAmount: number;
  notes: string | null;
}
