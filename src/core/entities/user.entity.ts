export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AdminUserEntity implements AdminUser {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly passwordHash: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

export interface SessionPayload {
  userId: string;
  username: string;
  name: string;
  exp?: number;
}

export interface AuthState {
  error?: string;
  success?: boolean;
}
