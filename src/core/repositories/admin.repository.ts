import { AdminUser } from "../entities/user.entity";

export interface IAdminRepository {
  findByUsername(username: string): Promise<AdminUser | null>;
  findById(id: string): Promise<AdminUser | null>;
}
