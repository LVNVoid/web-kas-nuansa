import { IAdminRepository } from "../../repositories/admin.repository";
import { IAuthService } from "../../services/auth.service.interface";
import { ValidationError, UnauthorizedError } from "../../errors/domain.errors";

export interface LoginInput {
  username?: string;
  password?: string;
}

export interface LoginOutput {
  success: boolean;
  userId: string;
}

export class LoginUseCase {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const { username, password } = input;
    if (!username || !password) {
      throw new ValidationError("Username dan password wajib diisi.");
    }

    const admin = await this.adminRepository.findByUsername(username);
    if (!admin) {
      throw new UnauthorizedError("Kredensial username atau password salah.");
    }

    const hashedPassword = this.authService.hashPassword(password);
    if (admin.passwordHash !== hashedPassword) {
      throw new UnauthorizedError("Kredensial username atau password salah.");
    }

    const token = await this.authService.signSessionToken({
      userId: admin.id,
      username: admin.username,
      name: admin.name,
    });

    await this.authService.setSessionCookie(token);

    return { success: true, userId: admin.id };
  }
}
