import { AuthServiceImpl } from "@/infrastructure/services/auth.service.impl";

describe("Infrastructure - Auth Service", () => {
  const authService = new AuthServiceImpl();

  it("hashes password deterministically with prefix", () => {
    const hash1 = authService.hashPassword("secret123");
    const hash2 = authService.hashPassword("secret123");
    const hash3 = authService.hashPassword("different");

    expect(hash1).toEqual(hash2);
    expect(hash1).not.toEqual(hash3);
    expect(hash1.startsWith("pwd_h_")).toBe(true);
  });

  it("signs and verifies JWT tokens correctly", async () => {
    const payload = {
      userId: "u123",
      username: "admin_test",
      name: "Pengurus RT",
    };

    const token = await authService.signSessionToken(payload);
    expect(typeof token).toBe("string");

    const verified = await authService.verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe("u123");
    expect(verified?.username).toBe("admin_test");
    expect(verified?.name).toBe("Pengurus RT");
  });

  it("returns null for malformed or forged tokens", async () => {
    const invalid = await authService.verifySessionToken("invalid.token.structure");
    expect(invalid).toBeNull();
  });
});
