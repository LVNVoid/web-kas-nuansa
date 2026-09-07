export interface ResidentBlock {
  id: string;
  blockName: string;
  ownerName: string | null;
  phone: string | null;
  isOccupied: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ResidentBlockEntity implements ResidentBlock {
  constructor(
    public readonly id: string,
    public readonly blockName: string,
    public readonly ownerName: string | null,
    public readonly phone: string | null,
    public readonly isOccupied: boolean,
    public readonly notes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

export interface CreateBlockDTO {
  blockName: string;
  ownerName?: string | null;
  phone?: string | null;
  isOccupied?: boolean;
  notes?: string | null;
}

export interface UpdateBlockDTO {
  blockName: string;
  ownerName?: string | null;
  phone?: string | null;
  isOccupied?: boolean;
  notes?: string | null;
}
