import { IAuthService } from "../../services/auth.service.interface";
import { SessionPayload } from "../../entities/user.entity";

export class GetSessionUseCase {
  constructor(private readonly authService: IAuthService) {}

  async execute(): Promise<SessionPayload | null> {
    return await this.authService.getSession();
  }
}
