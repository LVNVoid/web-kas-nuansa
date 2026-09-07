import { IAuthService } from "../../services/auth.service.interface";

export class LogoutUseCase {
  constructor(private readonly authService: IAuthService) {}

  async execute(): Promise<void> {
    await this.authService.deleteSessionCookie();
  }
}
