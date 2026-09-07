import { LoginUseCase } from "@/core/use-cases/auth/login.use-case";
import { LogoutUseCase } from "@/core/use-cases/auth/logout.use-case";
import { GetSessionUseCase } from "@/core/use-cases/auth/get-session.use-case";
import { IAdminRepository } from "@/core/repositories/admin.repository";
import { IAuthService } from "@/core/services/auth.service.interface";
import { ValidationError, UnauthorizedError } from "@/core/errors/domain.errors";

describe("Core Use Cases - Auth", () => {
  let mockAdminRepo: jest.Mocked<IAdminRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    mockAdminRepo = {
      findByUsername: jest.fn(),
      findById: jest.fn(),
    };
    mockAuthService = {
      hashPassword: jest.fn(),
      signSessionToken: jest.fn(),
      verifySessionToken: jest.fn(),
      getSession: jest.fn(),
      setSessionCookie: jest.fn(),
      deleteSessionCookie: jest.fn(),
    };
  });

  describe("LoginUseCase", () => {
    it("throws ValidationError when username or password missing", async () => {
      const useCase = new LoginUseCase(mockAdminRepo, mockAuthService);
      await expect(useCase.execute({ username: "", password: "" })).rejects.toThrow(
        ValidationError
      );
    });

    it("throws UnauthorizedError when user is not found", async () => {
      mockAdminRepo.findByUsername.mockResolvedValue(null);
      const useCase = new LoginUseCase(mockAdminRepo, mockAuthService);
      await expect(useCase.execute({ username: "unknown", password: "pwd" })).rejects.toThrow(
        UnauthorizedError
      );
    });

    it("logs in successfully and sets session cookie", async () => {
      mockAdminRepo.findByUsername.mockResolvedValue({
        id: "admin_1",
        username: "admin",
        passwordHash: "hash_123",
        name: "Bendahara",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockAuthService.hashPassword.mockReturnValue("hash_123");
      mockAuthService.signSessionToken.mockResolvedValue("jwt_token");

      const useCase = new LoginUseCase(mockAdminRepo, mockAuthService);
      const res = await useCase.execute({ username: "admin", password: "pwd" });

      expect(res.success).toBe(true);
      expect(res.userId).toBe("admin_1");
      expect(mockAuthService.setSessionCookie).toHaveBeenCalledWith("jwt_token");
    });
  });

  describe("LogoutUseCase", () => {
    it("clears session cookie", async () => {
      const useCase = new LogoutUseCase(mockAuthService);
      await useCase.execute();
      expect(mockAuthService.deleteSessionCookie).toHaveBeenCalled();
    });
  });

  describe("GetSessionUseCase", () => {
    it("returns session payload", async () => {
      mockAuthService.getSession.mockResolvedValue({
        userId: "admin_1",
        username: "admin",
        name: "Bendahara",
      });

      const useCase = new GetSessionUseCase(mockAuthService);
      const session = await useCase.execute();
      expect(session?.username).toBe("admin");
    });
  });
});
