import { db } from "../database/db";
import { IAdminRepository } from "@/core/repositories/admin.repository";
import { AdminUser } from "@/core/entities/user.entity";

export class AdminRepositoryImpl implements IAdminRepository {
  async findByUsername(username: string): Promise<AdminUser | null> {
    const record = await db.adminUser.findUnique({
      where: { username },
    });
    return record ? this.mapToEntity(record) : null;
  }

  async findById(id: string): Promise<AdminUser | null> {
    const record = await db.adminUser.findUnique({
      where: { id },
    });
    return record ? this.mapToEntity(record) : null;
  }

  private mapToEntity(record: {
    id: string;
    username: string;
    passwordHash: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }): AdminUser {
    return {
      id: record.id,
      username: record.username,
      passwordHash: record.passwordHash,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
