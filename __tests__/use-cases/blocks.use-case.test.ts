import { GetBlocksUseCase } from "@/core/use-cases/block/get-blocks.use-case";
import { CreateBlockUseCase } from "@/core/use-cases/block/create-block.use-case";
import { UpdateBlockUseCase } from "@/core/use-cases/block/update-block.use-case";
import { DeleteBlockUseCase } from "@/core/use-cases/block/delete-block.use-case";
import { IBlockRepository } from "@/core/repositories/block.repository";
import { IAuthService } from "@/core/services/auth.service.interface";
import { UnauthorizedError, ConflictError } from "@/core/errors/domain.errors";

describe("Core Use Cases - Blocks", () => {
  let mockBlockRepo: jest.Mocked<IBlockRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    mockBlockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByBlockName: jest.fn(),
      findDuplicateName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAllWithPaymentsForPeriod: jest.fn(),
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

  describe("GetBlocksUseCase", () => {
    it("returns list of resident blocks", async () => {
      const mockList = [
        {
          id: "b1",
          blockName: "A1",
          ownerName: "Budi",
          phone: "08123",
          isOccupied: true,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockBlockRepo.findAll.mockResolvedValue(mockList);

      const useCase = new GetBlocksUseCase(mockBlockRepo);
      const result = await useCase.execute();
      expect(result).toEqual(mockList);
    });
  });

  describe("CreateBlockUseCase", () => {
    it("throws UnauthorizedError when session is missing", async () => {
      mockAuthService.getSession.mockResolvedValue(null);
      const useCase = new CreateBlockUseCase(mockBlockRepo, mockAuthService);

      await expect(useCase.execute({ blockName: "A1" })).rejects.toThrow(UnauthorizedError);
    });

    it("throws ConflictError when block name already exists", async () => {
      mockAuthService.getSession.mockResolvedValue({ userId: "u1", username: "admin", name: "Admin" });
      mockBlockRepo.findByBlockName.mockResolvedValue({
        id: "b1",
        blockName: "A1",
        ownerName: null,
        phone: null,
        isOccupied: true,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const useCase = new CreateBlockUseCase(mockBlockRepo, mockAuthService);
      await expect(useCase.execute({ blockName: "A1" })).rejects.toThrow(ConflictError);
    });

    it("creates block entity successfully", async () => {
      mockAuthService.getSession.mockResolvedValue({ userId: "u1", username: "admin", name: "Admin" });
      mockBlockRepo.findByBlockName.mockResolvedValue(null);
      mockBlockRepo.create.mockResolvedValue({
        id: "b1",
        blockName: "A1",
        ownerName: "Budi",
        phone: null,
        isOccupied: true,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const useCase = new CreateBlockUseCase(mockBlockRepo, mockAuthService);
      const res = await useCase.execute({ blockName: "a1", ownerName: "Budi" });

      expect(res.id).toBe("b1");
      expect(mockBlockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ blockName: "A1", ownerName: "Budi" })
      );
    });
  });

  describe("UpdateBlockUseCase", () => {
    it("throws ConflictError when updated name conflicts with another block", async () => {
      mockAuthService.getSession.mockResolvedValue({ userId: "u1", username: "admin", name: "Admin" });
      mockBlockRepo.findDuplicateName.mockResolvedValue({
        id: "b2",
        blockName: "A2",
        ownerName: null,
        phone: null,
        isOccupied: true,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const useCase = new UpdateBlockUseCase(mockBlockRepo, mockAuthService);
      await expect(useCase.execute("b1", { blockName: "A2" })).rejects.toThrow(ConflictError);
    });
  });

  describe("DeleteBlockUseCase", () => {
    it("deletes block successfully", async () => {
      mockAuthService.getSession.mockResolvedValue({ userId: "u1", username: "admin", name: "Admin" });
      mockBlockRepo.delete.mockResolvedValue({
        id: "b1",
        blockName: "A1",
        ownerName: null,
        phone: null,
        isOccupied: true,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const useCase = new DeleteBlockUseCase(mockBlockRepo, mockAuthService);
      const res = await useCase.execute("b1");
      expect(res.id).toBe("b1");
    });
  });
});
